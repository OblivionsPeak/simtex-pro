// Shared GLSL helper library. Each helper is injected into a pattern's
// fragment shader only when the pattern calls it without defining its own
// version — so patterns with custom noise variants are never overridden.
const GLSL_HELPERS = [
  {
    name: 'hash',
    defines: /float\s+hash\s*\(\s*vec2/,
    deps: [],
    proto: 'float hash(vec2 p);',
    src: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }`,
  },
  {
    name: 'noise',
    defines: /float\s+noise\s*\(\s*vec2/,
    deps: ['hash'],
    proto: 'float noise(vec2 p);',
    src: `
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }`,
  },
  {
    name: 'permute',
    defines: /vec3\s+permute\s*\(/,
    deps: [],
    proto: 'vec3 permute(vec3 x);',
    src: `
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }`,
  },
  {
    name: 'snoise',
    defines: /float\s+snoise\s*\(\s*vec2/,
    deps: ['permute'],
    proto: 'float snoise(vec2 v);',
    src: `
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m ; m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }`,
  },
  {
    name: 'fbm',
    defines: /float\s+fbm\s*\(/,
    deps: ['snoise'],
    proto: 'float fbm(vec2 x);',
    src: `
    float fbm(vec2 x) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }`,
  },
];

// Returns the GLSL to prepend to a pattern shader: canonical helpers the
// pattern calls but doesn't define, plus prototypes for helpers the pattern
// defines itself but that injected code needs declared first.
export function buildHelperPrelude(shaderSrc) {
  const needed = new Set();
  const mark = (helper) => {
    if (needed.has(helper.name) || helper.defines.test(shaderSrc)) return;
    needed.add(helper.name);
    helper.deps.forEach(dep => mark(GLSL_HELPERS.find(h => h.name === dep)));
  };
  GLSL_HELPERS.forEach(h => {
    const calls = new RegExp(`\\b${h.name}\\s*\\(`).test(shaderSrc);
    if (calls) mark(h);
  });

  let prelude = '';
  GLSL_HELPERS.forEach(h => {
    if (needed.has(h.name)) {
      prelude += h.src + '\n';
    } else if (h.defines.test(shaderSrc) &&
               GLSL_HELPERS.some(o => needed.has(o.name) && o.deps.includes(h.name))) {
      // An injected helper depends on a function the pattern defines later
      // in the source — declare the prototype so GLSL resolves the call.
      prelude += '\n    ' + h.proto + '\n';
    }
  });
  return prelude;
}

export class ShaderEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: true });
    if (!this.gl) throw new Error('WebGL not supported');

    this.program = null;
    this.uniforms = {};
    this.currentValues = {
      u_opacity: 1.0,
      u_uv_scale: [1.0, 1.0],
      u_uv_rotation: 0.0,
      u_uv_offset: [0.0, 0.0],
    };
    this.startTime = Date.now();
    
    this.initBuffers();
    this.startLoop();
  }

  initBuffers() {
    const gl = this.gl;
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    this.buffer = buffer;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  async setShader(pattern) {
    const vertexSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      uniform vec2 u_uv_scale;
      uniform float u_uv_rotation;
      uniform vec2 u_uv_offset;
      void main() {
        vec2 uv = position * 0.5 + 0.5;
        uv -= 0.5;
        float c = cos(u_uv_rotation);
        float s = sin(u_uv_rotation);
        uv = mat2(c, -s, s, c) * uv;
        uv /= u_uv_scale;
        uv += u_uv_offset;
        v_uv = uv + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    let fragmentSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_is_spec;
      uniform float u_opacity;
    `;

    pattern.uniforms.forEach(u => {
      if (u.type === 'color') fragmentSource += `uniform vec4 ${u.id};\n`; // RGBA
      else fragmentSource += `uniform float ${u.id};\n`;
    });

    fragmentSource += buildHelperPrelude(pattern.shader);
    fragmentSource += pattern.shader;

    if (pattern.shader.includes('u_is_spec')) {
      // Pattern implements its own spec-map output inside generate()
      fragmentSource += `\nvoid main() {
        vec4 res = generate();
        gl_FragColor = vec4(res.rgb, res.a * u_opacity);
      }`;
    } else {
      // Generic spec fallback: R = metallic (0, painted surface),
      // G = roughness derived from luminance (brighter = glossier)
      fragmentSource += `\nvoid main() {
        vec4 res = generate();
        if (u_is_spec > 0.5) {
          float lum = dot(res.rgb, vec3(0.299, 0.587, 0.114));
          res = vec4(0.0, clamp(1.0 - lum * 0.85, 0.05, 0.95), 0.0, res.a);
        }
        gl_FragColor = vec4(res.rgb, res.a * u_opacity);
      }`;
    }

    const newProgram = this.createProgram(vertexSource, fragmentSource);
    if (!newProgram) {
      console.error(`[ShaderEngine] Failed to build shader for pattern "${pattern.id}"`);
      return;
    }

    this.program = newProgram;
    this.mapUniforms();
    this.dirty = true;
  }

  mapUniforms() {
    const gl = this.gl;
    this.uniforms = {};
    const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < numUniforms; i++) {
        const info = gl.getActiveUniform(this.program, i);
        this.uniforms[info.name] = gl.getUniformLocation(this.program, info.name);
    }
  }

  startLoop() {
    // All patterns are static (no u_time), so only redraw when uniforms,
    // the shader, or the canvas size actually change.
    const frame = () => {
      if (this.dirty || this.canvas.width !== this._lastW || this.canvas.height !== this._lastH) {
        this._lastW = this.canvas.width;
        this._lastH = this.canvas.height;
        this.draw();
        this.dirty = false;
      }
      this.frameId = requestAnimationFrame(frame);
    };
    this.frameId = requestAnimationFrame(frame);
  }

  render(uniformValues = {}) {
    this.currentValues = { ...this.currentValues, ...uniformValues };
    this.dirty = true;
  }

  draw() {
    if (!this.program) return;
    const gl = this.gl;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    if (this.uniforms.u_resolution) gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    if (this.uniforms.u_time) gl.uniform1f(this.uniforms.u_time, (Date.now() - this.startTime) / 1000);
    if (this.uniforms.u_opacity) gl.uniform1f(this.uniforms.u_opacity, this.currentValues.u_opacity);

    Object.entries(this.currentValues).forEach(([name, value]) => {
      const loc = this.uniforms[name];
      if (!loc || name === 'u_opacity') return;
      if (Array.isArray(value)) {
        if (value.length === 4) gl.uniform4fv(loc, value);
        else if (value.length === 3) gl.uniform3fv(loc, value);
        else if (value.length === 2) gl.uniform2fv(loc, value);
      } else {
        gl.uniform1f(loc, value);
      }
    });

    const posAttrib = gl.getAttribLocation(this.program, 'position');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(posAttrib);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  stop() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
  }

  createProgram(vsSource, fsSource) {
    const gl = this.gl;
    const vs = this.loadShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[ShaderEngine] Program link error:', gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  loadShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[ShaderEngine] Shader compile error:', gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  }

  export(width, height, uniforms) {
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    const oldValues = this.currentValues;
    this.canvas.width = width;
    this.canvas.height = height;
    this.currentValues = { ...this.currentValues, ...uniforms };
    this.draw();
    const dataUrl = this.canvas.toDataURL('image/png');
    this.canvas.width = oldW;
    this.canvas.height = oldH;
    this.currentValues = oldValues;
    this.dirty = true; // resizing cleared the canvas — repaint the preview
    return dataUrl;
  }

  // Seamless-tile export: blends the rendered texture with a half-offset
  // wrapped copy of itself, feathered from the centre outward, so opposite
  // edges are guaranteed identical (GIMP "Make Seamless" technique).
  exportSeamless(width, height, uniforms, feather = 0.45) {
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    const oldValues = this.currentValues;
    this.canvas.width = width;
    this.canvas.height = height;
    this.currentValues = { ...this.currentValues, ...uniforms };
    this.draw();

    const src = document.createElement('canvas');
    src.width = width;
    src.height = height;
    const sctx = src.getContext('2d');
    sctx.drawImage(this.canvas, 0, 0);
    const inData = sctx.getImageData(0, 0, width, height).data;

    const out = document.createElement('canvas');
    out.width = width;
    out.height = height;
    const octx = out.getContext('2d');
    const outData = octx.createImageData(width, height);
    const od = outData.data;

    const halfW = width >> 1;
    const halfH = height >> 1;
    const inner = 1.0 - feather;

    for (let y = 0; y < height; y++) {
      const wy = (y + halfH) % height;
      const cy = Math.abs(y / height - 0.5) * 2.0;
      for (let x = 0; x < width; x++) {
        const wx = (x + halfW) % width;
        const c = Math.max(Math.abs(x / width - 0.5) * 2.0, cy);
        // 0 in the centre, 1 at the edges, smooth ramp across the feather band
        let m = (c - inner) / feather;
        m = m <= 0 ? 0 : m >= 1 ? 1 : m * m * (3 - 2 * m);
        const i = (y * width + x) * 4;
        const j = (wy * width + wx) * 4;
        od[i]     = inData[i]     + (inData[j]     - inData[i])     * m;
        od[i + 1] = inData[i + 1] + (inData[j + 1] - inData[i + 1]) * m;
        od[i + 2] = inData[i + 2] + (inData[j + 2] - inData[i + 2]) * m;
        od[i + 3] = inData[i + 3] + (inData[j + 3] - inData[i + 3]) * m;
      }
    }

    octx.putImageData(outData, 0, 0);

    this.canvas.width = oldW;
    this.canvas.height = oldH;
    this.currentValues = oldValues;
    this.dirty = true;

    return out.toDataURL('image/png');
  }

  exportNormalMap(width, height, uniforms, strength = 3.0) {
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    const oldValues = this.currentValues;
    this.canvas.width = width;
    this.canvas.height = height;
    this.currentValues = { ...this.currentValues, ...uniforms };
    this.draw();

    // Copy WebGL canvas to 2D canvas (handles Y-flip correctly)
    const src = document.createElement('canvas');
    src.width = width;
    src.height = height;
    const ctx = src.getContext('2d');
    ctx.drawImage(this.canvas, 0, 0);
    const imageData = ctx.getImageData(0, 0, width, height);
    const px = imageData.data;

    // Greyscale heightmap
    const grey = new Float32Array(width * height);
    for (let i = 0; i < width * height; i++) {
      grey[i] = 0.299 * px[i * 4] / 255
              + 0.587 * px[i * 4 + 1] / 255
              + 0.114 * px[i * 4 + 2] / 255;
    }

    // Sobel filter → normal map
    const out = document.createElement('canvas');
    out.width = width;
    out.height = height;
    const octx = out.getContext('2d');
    const outData = octx.createImageData(width, height);
    const od = outData.data;

    const s = (x, y) => grey[
      Math.max(0, Math.min(height - 1, y)) * width +
      Math.max(0, Math.min(width  - 1, x))
    ];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const gx = (
          -s(x-1,y-1) + s(x+1,y-1) +
          -2*s(x-1,y) + 2*s(x+1,y) +
          -s(x-1,y+1) + s(x+1,y+1)
        );
        const gy = (
          -s(x-1,y-1) + s(x-1,y+1) +
          -2*s(x,y-1) + 2*s(x,y+1) +
          -s(x+1,y-1) + s(x+1,y+1)
        );
        const nx = -gx * strength;
        const ny = -gy * strength;
        const nz = 1.0;
        const len = Math.sqrt(nx*nx + ny*ny + nz*nz);
        const i = (y * width + x) * 4;
        od[i]   = Math.round((nx/len * 0.5 + 0.5) * 255);
        od[i+1] = Math.round((ny/len * 0.5 + 0.5) * 255);
        od[i+2] = Math.round((nz/len * 0.5 + 0.5) * 255);
        od[i+3] = 255;
      }
    }

    octx.putImageData(outData, 0, 0);

    this.canvas.width = oldW;
    this.canvas.height = oldH;
    this.currentValues = oldValues;
    this.dirty = true; // resizing cleared the canvas — repaint the preview

    return out.toDataURL('image/png');
  }
}

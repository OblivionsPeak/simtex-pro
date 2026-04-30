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
    const gl = this.gl;
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

    fragmentSource += pattern.shader;
    fragmentSource += `\nvoid main() { 
      vec4 res = generate();
      gl_FragColor = vec4(res.rgb, res.a * u_opacity); 
    }`;

    const newProgram = this.createProgram(vertexSource, fragmentSource);
    if (!newProgram) return;

    this.program = newProgram;
    this.mapUniforms();
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
    const frame = () => {
      this.draw();
      this.frameId = requestAnimationFrame(frame);
    };
    this.frameId = requestAnimationFrame(frame);
  }

  render(uniformValues = {}) {
    this.currentValues = { ...this.currentValues, ...uniformValues };
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
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
    return program;
  }

  loadShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return null;
    return shader;
  }

  export(width, height, uniforms) {
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.currentValues = { ...this.currentValues, ...uniforms };
    this.draw();
    const dataUrl = this.canvas.toDataURL('image/png');
    this.canvas.width = oldW;
    this.canvas.height = oldH;
    return dataUrl;
  }

  exportNormalMap(width, height, uniforms, strength = 3.0) {
    const oldW = this.canvas.width;
    const oldH = this.canvas.height;
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

    return out.toDataURL('image/png');
  }
}

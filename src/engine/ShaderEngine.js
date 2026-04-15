export class ShaderEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (!this.gl) throw new Error('WebGL not supported');

    this.program = null;
    this.uniforms = {};
    this.currentValues = {};
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
  }

  async setShader(pattern) {
    const gl = this.gl;
    const vertexSource = `
      attribute vec2 position;
      varying vec2 v_uv;
      void main() {
        v_uv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    let fragmentSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_is_spec;
    `;

    pattern.uniforms.forEach(u => {
      if (u.type === 'color') fragmentSource += `uniform vec3 ${u.id};\n`;
      else fragmentSource += `uniform float ${u.id};\n`;
    });

    fragmentSource += pattern.shader;
    fragmentSource += `\nvoid main() { gl_FragColor = vec4(generate(), 1.0); }`;

    const newProgram = this.createProgram(vertexSource, fragmentSource);
    if (!newProgram) return;

    // Safely switch programs
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
    // Just update the values, the continuous loop will pick them up
    this.currentValues = { ...this.currentValues, ...uniformValues };
  }

  draw() {
    if (!this.program) return;
    const gl = this.gl;

    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(this.program);

    // Common uniforms
    if (this.uniforms.u_resolution) gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    if (this.uniforms.u_time) gl.uniform1f(this.uniforms.u_time, (Date.now() - this.startTime) / 1000);

    // Bound custom uniforms
    Object.entries(this.currentValues).forEach(([name, value]) => {
      const loc = this.uniforms[name];
      if (!loc) return;
      if (Array.isArray(value)) {
        if (value.length === 3) gl.uniform3fv(loc, value);
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
    this.canvas.width = width;
    this.canvas.height = height;
    this.currentValues = { ...this.currentValues, ...uniforms };
    this.draw(); // One manual draw at export res
    return this.canvas.toDataURL('image/png');
  }
}

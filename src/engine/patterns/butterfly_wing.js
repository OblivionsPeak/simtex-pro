export default {
  id: 'butterfly_wing_artisan',
  name: 'Chitin Scale',
  category: 'Nature',
  description: 'Microscopic chitinous scales mimicking the vibrant iridescent patterns of exotic lepidoptera.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.1, f_uv.x) * step(f_uv.x, 0.9) * step(0.1, f_uv.y) * step(f_uv.y, 0.9);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (v_uv.x + v_uv.y + vec3(0, 0.33, 0.67)));
      return vec4(col * mask, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Density', type: 'float', min: 20.0, max: 200.0, default: 80.0 }
  ]
};

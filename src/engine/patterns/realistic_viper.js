export default {
  id: 'realistic_viper_artisan',
  name: 'Realistic Viper',
  category: 'Natural',
  description: 'Small, diamond-shaped high-fidelity interlocking scales mimicking viper skin.',
  shader: `
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Density', type: 'float', min: 10.0, max: 80.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Scales', type: 'color', default: [0.1, 0.15, 0.05, 1.0] },
    { id: 'u_secondary_color', name: 'Skin Deep', type: 'color', default: [0.0, 0.05, 0.0, 1.0] }
  ]
};

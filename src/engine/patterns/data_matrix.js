export default {
  id: 'data_matrix_artisan',
  name: 'Data Matrix',
  category: 'Technology',
  added: '2026-04-16',
  description: 'Stacked digital data blocks mimicking high-density computer storage and visualization.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.5, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Data Density', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_primary_color', name: 'Active Bit', type: 'color', default: [0.0, 1.0, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Zero Bit', type: 'color', default: [0.0, 0.1, 0.05, 1.0] }
  ]
};

export default {
  id: 'star_field_artisan',
  name: 'Star Field Static',
  category: 'Natural',
  description: 'High-density thresholded noise clusters representing deep-space star fields.',
  shader: `
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      float mask = step(0.99, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cluster Density', type: 'float', min: 100.0, max: 2000.0, default: 800.0 },
    { id: 'u_primary_color', name: 'Star Alpha', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Space', type: 'color', default: [0.0, 0.0, 0.02, 1.0] }
  ]
};

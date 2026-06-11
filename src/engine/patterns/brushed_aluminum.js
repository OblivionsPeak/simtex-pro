export default {
  id: 'brushed_aluminum_artisan',
  name: 'Brushed Metal',
  category: 'Industrial',
  added: '2026-04-15',
  description: 'High-frequency linear streaks mimicking professional metal brushing and finishing.',
  shader: `
    vec4 generate() {
      float n = hash(vec2(v_uv.y * 1000.0, 0.0));
      vec4 col = mix(u_secondary_color, u_primary_color, n);
      if (u_is_spec > 0.5) {
        // Brushed metal: fully metallic, anisotropic-feel roughness following streak intensity
        return vec4(0.9, mix(0.3, 0.5, n), 0.0, col.a);
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Grain', type: 'color', default: [0.8, 0.8, 0.82, 1.0] },
    { id: 'u_secondary_color', name: 'Base Metal', type: 'color', default: [0.6, 0.6, 0.65, 1.0] }
  ]
};

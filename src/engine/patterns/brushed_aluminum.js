export default {
  id: 'brushed_aluminum_artisan',
  name: 'Brushed Metal',
  category: 'Industrial',
  description: 'High-frequency linear streaks mimicking professional metal brushing and finishing.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(vec2(v_uv.y * 1000.0, 0.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Grain', type: 'color', default: [0.8, 0.8, 0.82, 1.0] },
    { id: 'u_secondary_color', name: 'Base Metal', type: 'color', default: [0.6, 0.6, 0.65, 1.0] }
  ]
};

export default {
  id: 'river_cobble_artisan',
  name: 'River Cobble',
  category: 'Natural',
  added: '2026-04-15',
  description: 'Smooth, irregular organic stone clusters mimicking riverbed masonry.',
  shader: `
    vec2 random2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.45, 0.4, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Stone Grey', type: 'color', default: [0.6, 0.6, 0.65, 1.0] },
    { id: 'u_secondary_color', name: 'Joint', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

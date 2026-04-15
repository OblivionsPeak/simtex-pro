export default {
  id: 'glass_shards_artisan',
  name: 'Glass Shards',
  category: 'Abstract',
  description: 'Sharp, non-animated geometric fragmentation mimicking shattered glass.',
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
      return mix(u_secondary_color, u_primary_color, m_dist);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Shard Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Glass Highlight', type: 'color', default: [0.8, 0.9, 1.0, 0.5] },
    { id: 'u_secondary_color', name: 'Shard Depth', type: 'color', default: [0.1, 0.2, 0.4, 0.8] }
  ]
};

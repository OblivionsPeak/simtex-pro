export default {
  id: 'terrazzo_stone_artisan',
  name: 'Terrazzo Stone',
  category: 'Industrial',
  description: 'Multi-colored irregular stone chunks embedded in a polished composite base.',
  shader: `
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      float mask = step(0.1, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Chip Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Stone Chip', type: 'color', default: [0.6, 0.62, 0.65, 1.0] },
    { id: 'u_secondary_color', name: 'Base Mortar', type: 'color', default: [0.8, 0.8, 0.82, 1.0] }
  ]
};

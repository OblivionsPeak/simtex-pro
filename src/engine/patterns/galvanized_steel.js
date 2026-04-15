export default {
  id: 'galvanized_steel_artisan',
  name: 'Galvanized Steel',
  category: 'Industrial',
  description: 'Spangled crystalline industrial coating found in heavy-duty utility equipment.',
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
      return mix(u_secondary_color, u_primary_color, m_point.x);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Spangle Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Zinc High', type: 'color', default: [0.9, 0.9, 0.92, 1.0] },
    { id: 'u_secondary_color', name: 'Zinc Deep', type: 'color', default: [0.5, 0.5, 0.55, 1.0] }
  ]
};

export default {
  id: 'prism_shards_artisan',
  name: 'Prism Shards',
  category: 'Experimental',
  description: 'Sharp refracted geometric light cells with internal color shifts across the spectrum.',
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
      vec3 color = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + m_point.x * 6.28);
      return vec4(color, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Refraction Density', type: 'float', min: 2.0, max: 15.0, default: 8.0 }
  ]
};

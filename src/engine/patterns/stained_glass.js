export default {
  id: 'stained_glass_artisan',
  name: 'Stained Glass',
  category: 'Abstract',
  description: 'Lead-outlined colored polygons mimicking traditional stained glass craftsmanship.',
  shader: `
    vec2 rand(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) { m_dist = dist; m_point = neighbor + point; }
        }
      }
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (hash(i_uv + m_point) + vec3(0, 0.33, 0.67)));
      float edge = smoothstep(0.02, 0.05, m_dist);
      return vec4(col * edge, 1.0);
    }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Glass Sections', type: 'float', min: 2.0, max: 20.0, default: 8.0 }
  ]
};

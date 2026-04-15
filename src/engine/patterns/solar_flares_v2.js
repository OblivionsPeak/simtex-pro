export default {
  id: 'solar_flares_v2_artisan',
  name: 'Solar Corona',
  category: 'Natural',
  description: 'Abstract high-energy atmospheric flares and plasma smears from a stellar corona.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 10.0, 0.0));
      float mask = smoothstep(0.5, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Core', type: 'color', default: [1.0, 0.9, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Ejection', type: 'color', default: [0.8, 0.2, 0.0, 0.0] }
  ]
};

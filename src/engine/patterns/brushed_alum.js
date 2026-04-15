export default {
  id: 'brushed_alum',
  name: 'Brushed Alum',
  category: 'Industrial',
  description: 'Lightweight directional brushed alloy.',
  shader: `
    float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
    vec3 generate() {
      float n = rand(v_uv * vec2(0.1, u_grain));
      vec3 color = mix(u_secondary_color, u_primary_color, n);
      if (u_is_spec > 0.5) return vec3(0.9, 0.2, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_grain', name: 'Grain', type: 'float', min: 100.0, max: 2000.0, default: 800.0 },
    { id: 'u_primary_color', name: 'Chrome', type: 'color', default: [0.8, 0.8, 0.8] },
    { id: 'u_secondary_color', name: 'Shine', type: 'color', default: [0.6, 0.6, 0.6] }
  ]
};

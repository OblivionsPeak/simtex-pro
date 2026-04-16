export default {
  id: 'alcantara_suede_artisan',
  name: 'Alcantara Suede',
  category: 'Racing',
  description: 'Soft, directional fiber nap mimicking professional racing steering wheels and seats.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 0.5);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fiber Density', type: 'float', min: 100.0, max: 1000.0, default: 500.0 },
    { id: 'u_primary_color', name: 'Fiber Top', type: 'color', default: [0.2, 0.2, 0.22, 1.0] },
    { id: 'u_secondary_color', name: 'Fiber Base', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

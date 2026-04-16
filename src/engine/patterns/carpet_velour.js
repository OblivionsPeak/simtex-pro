export default {
  id: 'carpet_velour_artisan',
  name: 'Velour Carpet',
  category: 'Racing',
  description: 'Soft, deep pile industrial carpet found in premium grand touring interiors.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale) + hash(v_uv * u_scale * 0.5) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pile Density', type: 'float', min: 50.0, max: 500.0, default: 200.0 },
    { id: 'u_primary_color', name: '絨毯 (Carpet Top)', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Pile Base', type: 'color', default: [0.05, 0.05, 0.08, 1.0] }
  ]
};

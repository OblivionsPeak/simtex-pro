export default {
  id: 'petrified_wood_artisan',
  name: 'Petrified Wood',
  category: 'Geology',
  description: 'Fossilized wood grain with vibrant mineral staining and crystalized structures.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Chert High', type: 'color', default: [0.8, 0.4, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Silt Deep', type: 'color', default: [0.4, 0.2, 0.1, 1.0] }
  ]
};

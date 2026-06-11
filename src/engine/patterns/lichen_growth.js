export default {
  id: 'lichen_growth_artisan',
  name: 'Lichen Moss',
  category: 'Natural',
  description: 'Splotchy organic crust and symbiotic growths found on weathered rocks and trees.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, step(0.5, n));
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Lichen High', type: 'color', default: [0.7, 0.8, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Rock Base', type: 'color', default: [0.2, 0.2, 0.2, 1.0] }
  ]
};

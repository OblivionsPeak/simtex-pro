export default {
  id: 'shift_boot_leather_artisan',
  name: 'Shift Boot Leather',
  category: 'Racing',
  description: 'Organic crumpled leather folds and distressed textures found in shift boots and gaiters.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Leather High', type: 'color', default: [0.12, 0.1, 0.08, 1.0] },
    { id: 'u_secondary_color', name: 'Fold Shadow', type: 'color', default: [0.05, 0.04, 0.03, 1.0] }
  ]
};

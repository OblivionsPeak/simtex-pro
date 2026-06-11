export default {
  id: 'nappa_leather_artisan',
  name: 'Nappa Leather',
  category: 'Racing',
  description: 'Smooth premium leather grain with subtle organic pores found in high-end bucket seats.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Zoom', type: 'float', min: 50.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Leather Top', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Pore Deep', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

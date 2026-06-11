export default {
  id: 'watercolor_bleed_artisan',
  name: 'Watercolor Flow',
  category: 'Abstract',
  added: '2026-04-15',
  description: 'Soft organic color spreads and bleeding textures mimicking paint on high-fidelity wet paper.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * 5.0 + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Ink Bleed', type: 'color', default: [0.2, 0.4, 0.8, 0.8] },
    { id: 'u_secondary_color', name: 'Pulp Base', type: 'color', default: [0.95, 0.95, 0.9, 1.0] }
  ]
};

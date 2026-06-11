export default {
  id: 'digital_camo_v2_artisan',
  name: 'Ghost Camo',
  category: 'Racing',
  description: 'Advanced multi-scale digital camouflage with low-visibility spectral patterns.',
  shader: `
    vec4 generate() {
      float n = hash(floor(v_uv * 10.0)) + hash(floor(v_uv * 40.0)) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,
  variants: [
    {
      name: 'Ghost (Default)',
      uniforms: {
        u_primary_color: [0.3, 0.3, 0.35, 1.0],
        u_secondary_color: [0.1, 0.1, 0.12, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_primary_color: [0.08, 0.08, 0.09, 1.0],
        u_secondary_color: [0.0, 0.0, 0.0, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_primary_color', name: 'Camo High', type: 'color', default: [0.3, 0.3, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Camo Deep', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

export default {
  id: 'tiger_stripes_artisan',
  name: 'Predator Stripes',
  category: 'Organic',
  added: '2026-04-15',
  description: 'Organic predator-style tiger stripes with tapered edges.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(vec2(uv.x * 0.2 * u_breakup, uv.y * 2.0));
      float s = max(u_softness, 0.005);
      float mask = smoothstep(u_coverage - s, u_coverage + s, n + sin(uv.x * 2.0) * u_wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.05, 0.05, 0.05, 1.0],
        u_secondary_color: [1.0, 0.45, 0.05, 1.0],
        u_coverage: 0.5,
        u_softness: 0.1,
        u_wave: 0.2,
        u_breakup: 1.0
      }
    },
    {
      name: 'White Tiger',
      uniforms: {
        u_primary_color: [0.25, 0.28, 0.32, 1.0],
        u_secondary_color: [0.93, 0.94, 0.96, 1.0],
        u_coverage: 0.52,
        u_softness: 0.08,
        u_wave: 0.2,
        u_breakup: 1.2
      }
    },
    {
      name: 'Jungle Ghost',
      uniforms: {
        u_primary_color: [0.05, 0.09, 0.04, 1.0],
        u_secondary_color: [0.32, 0.42, 0.2, 1.0],
        u_coverage: 0.45,
        u_softness: 0.14,
        u_wave: 0.3,
        u_breakup: 1.6
      }
    },
    {
      name: 'Synthwave',
      uniforms: {
        u_primary_color: [0.95, 0.1, 0.6, 1.0],
        u_secondary_color: [0.08, 0.02, 0.15, 1.0],
        u_coverage: 0.5,
        u_softness: 0.04,
        u_wave: 0.35,
        u_breakup: 0.8
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Stripe Spacing', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_coverage', name: 'Stripe Coverage', type: 'float', min: 0.2, max: 0.8, default: 0.5 },
    { id: 'u_softness', name: 'Edge Taper', type: 'float', min: 0.005, max: 0.3, default: 0.1 },
    { id: 'u_wave', name: 'Stripe Waviness', type: 'float', min: 0.0, max: 0.6, default: 0.2 },
    { id: 'u_breakup', name: 'Stripe Break-up', type: 'float', min: 0.2, max: 4.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Stripe Color', type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_secondary_color', name: 'Base Color', type: 'color', default: [1.0, 0.45, 0.05, 1.0] }
  ]
};

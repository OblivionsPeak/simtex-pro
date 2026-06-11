export default {
  id: 'herringbone_weave_pro',
  name: 'Herringbone',
  category: 'Geometric',
  added: '2026-04-15',
  description: 'Pro-grade chevron-style herringbone weave pattern.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.x), 2.0) == 0.0) uv.y += 0.5;
      vec2 gv = fract(uv);

      float s = max(u_softness, 0.0005);
      float mask = smoothstep(u_balance - s, u_balance + s, abs(gv.x - gv.y));
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Optional fibrous grain along the weave
      float grain = (noise(uv * 14.0) - 0.5) * u_grain;
      color.rgb += grain;

      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.1, 0.1, 0.1, 1.0],
        u_secondary_color: [0.05, 0.05, 0.05, 1.0],
        u_balance: 0.5,
        u_grain: 0.0
      }
    },
    {
      name: 'Grey Tweed',
      uniforms: {
        u_primary_color: [0.55, 0.53, 0.5, 1.0],
        u_secondary_color: [0.32, 0.3, 0.28, 1.0],
        u_balance: 0.5,
        u_grain: 0.18
      }
    },
    {
      name: 'Oak Parquet',
      uniforms: {
        u_primary_color: [0.55, 0.38, 0.22, 1.0],
        u_secondary_color: [0.4, 0.26, 0.14, 1.0],
        u_scale: 12.0,
        u_balance: 0.5,
        u_grain: 0.22
      }
    },
    {
      name: 'Racing Green',
      uniforms: {
        u_primary_color: [0.04, 0.25, 0.14, 1.0],
        u_secondary_color: [0.02, 0.12, 0.07, 1.0],
        u_balance: 0.45,
        u_grain: 0.08
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Weave Size', type: 'float', min: 2.0, max: 100.0, default: 20.0 },
    { id: 'u_balance', name: 'Chevron Balance', type: 'float', min: 0.2, max: 0.8, default: 0.5 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.1, default: 0.005 },
    { id: 'u_grain', name: 'Fiber Grain', type: 'float', min: 0.0, max: 0.4, default: 0.0 },
    { id: 'u_primary_color', name: 'Primary Weave', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Secondary Weave', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

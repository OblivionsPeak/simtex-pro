export default {
  id: 'kevlar_grid_artisan',
  name: 'Kevlar Weave',
  category: 'Industrial',
  added: '2026-04-15',
  description: 'Heavy tactical weave used in protective armor and performance gear.',
  shader: `
    vec4 generate() {
      float lines = sin(v_uv.x * u_scale) * sin(v_uv.y * u_scale);
      float mask = smoothstep(-u_softness, u_softness, lines);
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Directional sheen along the raised tows
      float sheen = pow(max(lines, 0.0), 3.0) * u_sheen;
      color.rgb += sheen * 0.35;
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.8, 0.7, 0.2, 1.0],
        u_secondary_color: [0.1, 0.1, 0.1, 1.0],
        u_scale: 400.0,
        u_softness: 0.5,
        u_sheen: 0.0
      }
    },
    {
      name: 'Black Ops',
      uniforms: {
        u_primary_color: [0.16, 0.16, 0.17, 1.0],
        u_secondary_color: [0.04, 0.04, 0.05, 1.0],
        u_scale: 500.0,
        u_softness: 0.45,
        u_sheen: 0.3
      }
    },
    {
      name: 'Blue Aramid',
      uniforms: {
        u_primary_color: [0.15, 0.35, 0.75, 1.0],
        u_secondary_color: [0.03, 0.05, 0.1, 1.0],
        u_scale: 400.0,
        u_softness: 0.5,
        u_sheen: 0.35
      }
    },
    {
      name: 'Crimson Hybrid',
      uniforms: {
        u_primary_color: [0.7, 0.1, 0.12, 1.0],
        u_secondary_color: [0.06, 0.04, 0.04, 1.0],
        u_scale: 320.0,
        u_softness: 0.55,
        u_sheen: 0.4
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Weave Density', type: 'float', min: 100.0, max: 1000.0, default: 400.0 },
    { id: 'u_softness', name: 'Weave Softness', type: 'float', min: 0.05, max: 1.0, default: 0.5 },
    { id: 'u_sheen', name: 'Tow Sheen', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Kevlar Gold', type: 'color', default: [0.8, 0.7, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Outer Mesh', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

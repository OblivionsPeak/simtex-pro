export default {
  id: 'carbon_kevlar_weave',
  name: 'Carbon-Kevlar Weave',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Hybrid twill of black carbon and gold aramid yarns — the motorsport composite look.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      // 2x2 twill: diagonal decides warp-over vs weft-over
      float twill = mod(cell.x - cell.y, 4.0);
      float over = step(twill, 1.5); // warp yarn on top
      // alternate yarn material along each axis
      float warpKevlar = mod(cell.x, 2.0);
      float weftKevlar = mod(cell.y, 2.0);
      float isKevlar = mix(weftKevlar, warpKevlar, over);
      vec4 yarn = mix(u_primary_color, u_secondary_color, isKevlar);
      // cylindrical yarn shading across its width
      float across = mix(f.y, f.x, over);
      float along = mix(f.x, f.y, over);
      float shade = 0.55 + 0.45 * sin(across * 3.14159);
      // fibre striations along the yarn
      float fibre = 0.9 + 0.1 * sin(along * 40.0 + hash(cell) * 6.28);
      yarn.rgb *= shade * fibre;
      // glossy sheen band
      yarn.rgb += u_sheen * pow(max(sin(across * 3.14159), 0.0), 8.0) * 0.35;
      return yarn;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Density', type: 'float', min: 8.0, max: 120.0, default: 46.0 },
    { id: 'u_sheen', name: 'Sheen', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Carbon Yarn', type: 'color', default: [0.07, 0.07, 0.08, 1.0] },
    { id: 'u_secondary_color', name: 'Aramid Yarn', type: 'color', default: [0.72, 0.55, 0.12, 1.0] }
  ],
  variants: [
    { name: 'Gold Aramid', uniforms: { u_primary_color: [0.07, 0.07, 0.08, 1.0], u_secondary_color: [0.72, 0.55, 0.12, 1.0], u_sheen: 0.6 } },
    { name: 'Red Hybrid', uniforms: { u_primary_color: [0.07, 0.07, 0.08, 1.0], u_secondary_color: [0.6, 0.08, 0.1, 1.0], u_sheen: 0.7 } },
    { name: 'Blue Hybrid', uniforms: { u_primary_color: [0.06, 0.06, 0.08, 1.0], u_secondary_color: [0.1, 0.3, 0.65, 1.0], u_sheen: 0.7 } }
  ]
};

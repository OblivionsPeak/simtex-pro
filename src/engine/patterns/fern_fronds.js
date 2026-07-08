export default {
  id: 'fern_fronds',
  name: 'Fern Fronds',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Arched fern stems with combed leaflets tapering to the tip, layered over forest shade.',
  shader: `
    // distance shading for one frond within a cell, p in -0.5..0.5
    float frond(vec2 p, float seed) {
      // arch the stem: x follows a parabola of y
      float bend = (seed - 0.5) * 0.8;
      float t = p.y + 0.5;                 // 0 at base, 1 at tip
      float stemX = bend * t * t;
      float dx = p.x - stemX;
      // leaflets: comb teeth either side, shrinking toward the tip
      float reach = 0.34 * (1.0 - t * 0.85);
      float teeth = 0.5 + 0.5 * sin(t * 60.0 + seed * 6.28);
      float leaf = step(abs(dx), reach * (0.35 + 0.65 * teeth)) * step(0.02, t) * step(t, 0.98);
      // midrib
      float stem = smoothstep(0.015, 0.005, abs(dx)) * step(t, 0.98);
      return max(leaf * 0.8, stem);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      col.rgb *= 0.9 + 0.1 * fbm(uv * 0.8);
      // two staggered layers of fronds
      for (int layer = 0; layer < 2; layer++) {
        vec2 g = uv + vec2(float(layer) * 0.5, float(layer) * 0.37);
        vec2 cell = floor(g);
        vec2 p = fract(g) - 0.5;
        float seed = hash(cell + float(layer) * 11.0);
        float m = frond(p * (0.9 + seed * 0.3), seed);
        vec3 green = mix(u_primary_color.rgb, u_accent_color.rgb, hash(cell + 7.0));
        green *= 0.8 + 0.2 * (p.y + 0.5) + float(layer) * 0.15;
        col.rgb = mix(col.rgb, green, m * (0.75 + float(layer) * 0.25));
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Frond Density', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Frond Green', type: 'color', default: [0.2, 0.45, 0.22, 1.0] },
    { id: 'u_accent_color', name: 'New Growth', type: 'color', default: [0.45, 0.65, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Forest Shade', type: 'color', default: [0.06, 0.1, 0.07, 1.0] }
  ],
  variants: [
    { name: 'Understory', uniforms: { u_primary_color: [0.2, 0.45, 0.22, 1.0], u_accent_color: [0.45, 0.65, 0.3, 1.0], u_secondary_color: [0.06, 0.1, 0.07, 1.0] } },
    { name: 'Autumn Bracken', uniforms: { u_primary_color: [0.6, 0.4, 0.15, 1.0], u_accent_color: [0.75, 0.55, 0.25, 1.0], u_secondary_color: [0.14, 0.09, 0.05, 1.0] } },
    { name: 'Botanical Print', uniforms: { u_primary_color: [0.15, 0.25, 0.3, 1.0], u_accent_color: [0.3, 0.45, 0.5, 1.0], u_secondary_color: [0.93, 0.9, 0.84, 1.0] } }
  ]
};

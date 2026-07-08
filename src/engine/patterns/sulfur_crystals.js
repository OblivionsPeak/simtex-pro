export default {
  id: 'sulfur_crystals',
  name: 'Sulfur Crystals',
  category: 'Geology',
  added: '2026-07-07',
  description: 'Vivid yellow crystal shards erupting from a dark fumarole crust, each facet a flat flash.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // dark volcanic crust
      vec4 col = u_secondary_color;
      col.rgb *= 0.8 + 0.2 * fbm(uv * 3.0);
      // angular shards: layered rotated triangles per cell
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.8) < u_bare) continue;
          vec2 ctr = cell + vec2(hash(cell + 1.1), hash(cell + 2.2));
          float ang = hash(cell + 3.3) * 6.28318;
          vec2 rel = uv - ctr;
          vec2 lp = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * rel;
          float len = 0.35 + hash(cell + 4.4) * 0.4;
          float wid = 0.09 + hash(cell + 5.5) * 0.08;
          // elongated prism: tapered toward the tip
          float t = clamp(lp.y / len, -1.0, 1.0);
          float halfW = wid * (1.0 - abs(t) * 0.7);
          float shard = step(abs(lp.x), halfW) * step(abs(lp.y), len);
          if (shard > 0.5) {
            // two facets: left/right of the ridge line
            float facet = step(0.0, lp.x);
            float bright = mix(0.55, 1.0, facet) * (0.7 + 0.6 * hash(cell + 6.6));
            vec3 sc = u_primary_color.rgb * bright;
            // tip glint
            sc += vec3(0.3, 0.28, 0.1) * smoothstep(0.8, 1.0, t);
            // translucency gradient toward the base
            sc = mix(sc * 0.6, sc, abs(t));
            col.rgb = mix(col.rgb, sc, 1.0);
          }
        }
      }
      // sulfurous dust settling in the crevices
      float dust = smoothstep(0.5, 0.9, fbm(uv * 1.5 + 6.0));
      col.rgb = mix(col.rgb, u_primary_color.rgb * 0.45, dust * 0.3);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Crystal Density', type: 'float', min: 2.0, max: 14.0, default: 6.0 },
    { id: 'u_bare', name: 'Bare Crust', type: 'float', min: 0.0, max: 0.8, default: 0.25 },
    { id: 'u_primary_color', name: 'Sulfur', type: 'color', default: [0.95, 0.85, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Fumarole Crust', type: 'color', default: [0.13, 0.11, 0.1, 1.0] }
  ],
  variants: [
    { name: 'Fumarole', uniforms: { u_primary_color: [0.95, 0.85, 0.1, 1.0], u_secondary_color: [0.13, 0.11, 0.1, 1.0], u_bare: 0.25 } },
    { name: 'Emerald Spray', uniforms: { u_primary_color: [0.2, 0.8, 0.4, 1.0], u_secondary_color: [0.08, 0.1, 0.09, 1.0], u_bare: 0.35 } },
    { name: 'Amethyst Bed', uniforms: { u_primary_color: [0.65, 0.4, 0.85, 1.0], u_secondary_color: [0.12, 0.1, 0.15, 1.0], u_bare: 0.2 } }
  ]
};

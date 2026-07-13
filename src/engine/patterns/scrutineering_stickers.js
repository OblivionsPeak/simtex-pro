export default {
  id: 'scrutineering_stickers',
  name: 'Scrutineering Stickers',
  category: 'Racing',
  added: '2026-07-13',
  description: 'A patchwork of tech-inspection decals at odd angles — printed bars, serial ticks, and half-peeled corners over carbon-dark ground.',
  shader: `
    mat2 rotS(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
    float stickerSDF(vec2 p, vec2 b, float r) {
      vec2 d = abs(p) - b + r;
      return length(max(d, 0.0)) - r;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // carbon-dark ground: fine twill checker under a low sheen
      vec2 cg = uv * 22.0;
      float weave = mod(floor(cg.x) + floor(cg.y), 2.0);
      vec3 col = u_secondary_color.rgb * (0.75 + 0.20 * weave + 0.15 * (0.5 + 0.5 * snoise(uv * 1.3)));
      col *= 0.93 + 0.07 * hash(floor(cg));
      // two offset sticker layers so the patchwork overlaps
      for (int i = 0; i < 2; i++) {
        float fl = float(i);
        vec2 g = uv * (1.0 + fl * 0.37) + fl * vec2(5.17, 9.73);
        vec2 cell = floor(g);
        vec2 f = fract(g) - 0.5;
        if (hash(cell + fl * 17.0 + 0.7) < u_coverage) {
          vec2 jit = (vec2(hash(cell + 1.3), hash(cell + 2.6)) - 0.5) * 0.22;
          float ang = (hash(cell + 3.9) - 0.5) * 1.1;
          vec2 p = rotS(ang) * (f - jit);
          vec2 b = vec2(0.30 + 0.08 * hash(cell + 4.2), 0.20 + 0.05 * hash(cell + 5.5));
          float d = stickerSDF(p, b, 0.07);
          // drop shadow under the sticker edge
          float dsh = stickerSDF(p - vec2(-0.018, 0.026), b, 0.07);
          col = mix(col, col * 0.55, (1.0 - smoothstep(0.0, 0.05, dsh)) * smoothstep(0.0, 0.015, d));
          float m = 1.0 - smoothstep(-0.008, 0.008, d);
          if (m > 0.001) {
            // sticker base colour from the tech palette
            float pick = hash(cell + 6.8);
            vec3 sc = u_primary_color.rgb;
            if (pick > 0.62) sc = u_accent_color.rgb;
            if (pick > 0.86) sc = vec3(0.90, 0.89, 0.86);
            // printed header bar and fake serial ticks
            float bar = (1.0 - smoothstep(0.02, 0.045, abs(p.y - b.y * 0.55))) * step(abs(p.x), b.x * 0.8);
            float ticks = step(abs(p.y + b.y * 0.15), 0.045)
                        * step(fract((p.x / b.x + 1.0) * 3.5), 0.55)
                        * step(abs(p.x), b.x * 0.72);
            sc = mix(sc, sc * 0.22, max(bar * 0.9, ticks * 0.85));
            // laminate rim highlight + per-sticker fade
            sc *= 0.82 + 0.30 * hash(cell + 8.1);
            sc += vec3(0.9, 0.92, 1.0) * smoothstep(-0.045, -0.005, d) * 0.12;
            // half-peeled corner on some stickers
            if (hash(cell + 9.4) < u_peel) {
              float qd = length(p - vec2(b.x - 0.06, b.y - 0.06));
              float lift = 1.0 - smoothstep(0.02, 0.13, qd);
              sc = mix(sc, u_secondary_color.rgb * 0.8, lift * 0.75);
              float curlHL = smoothstep(0.10, 0.125, qd) * (1.0 - smoothstep(0.135, 0.165, qd));
              sc += vec3(1.0) * curlHL * 0.35;
            }
            col = mix(col, sc, m);
          }
        }
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Sticker Density', type: 'float', min: 2.0, max: 12.0, default: 4.5 },
    { id: 'u_coverage', name: 'Coverage', type: 'float', min: 0.3, max: 1.0, default: 0.8 },
    { id: 'u_peel', name: 'Peeled Corners', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_primary_color', name: 'Sticker A', type: 'color', default: [0.16, 0.45, 0.78, 1.0] },
    { id: 'u_accent_color', name: 'Sticker B', type: 'color', default: [0.85, 0.25, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Carbon Ground', type: 'color', default: [0.07, 0.07, 0.08, 1.0] }
  ],
  variants: [
    { name: 'Tech Shed', uniforms: { u_scale: 4.5, u_coverage: 0.8, u_peel: 0.35, u_primary_color: [0.16, 0.45, 0.78, 1.0], u_accent_color: [0.85, 0.25, 0.15, 1.0], u_secondary_color: [0.07, 0.07, 0.08, 1.0] } },
    { name: 'Passed Green', uniforms: { u_scale: 5.5, u_coverage: 0.92, u_peel: 0.2, u_primary_color: [0.15, 0.55, 0.25, 1.0], u_accent_color: [0.90, 0.85, 0.20, 1.0], u_secondary_color: [0.06, 0.07, 0.07, 1.0] } },
    { name: 'Vintage Paddock', uniforms: { u_scale: 3.5, u_coverage: 0.7, u_peel: 0.6, u_primary_color: [0.75, 0.65, 0.45, 1.0], u_accent_color: [0.55, 0.15, 0.12, 1.0], u_secondary_color: [0.12, 0.10, 0.08, 1.0] } }
  ]
};

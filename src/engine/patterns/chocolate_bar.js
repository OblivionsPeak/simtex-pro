export default {
  id: 'chocolate_bar',
  name: 'Chocolate Bar',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Molded chocolate tablets with beveled edges, an embossed stamped ridge, and matte cocoa grain in the deep grooves.',
  shader: `
    float tabletSDF(vec2 p, float hs, float rad) {
      vec2 q = abs(p) - vec2(hs - rad);
      return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - rad;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float hs = 0.5 - 0.05;   // tablet half-size (leaves the groove)
      float rad = 0.09;        // corner rounding
      float d = tabletSDF(f, hs, rad);
      float aa = 0.02;
      float top = smoothstep(aa, -aa, d);
      // groove: dark molded channel with ambient occlusion toward each tablet
      vec3 col = u_secondary_color.rgb * (0.72 + 0.28 * smoothstep(-0.01, 0.07, d));
      // bevel height: 0 at the tablet edge, 1 on the flat plateau
      float h = clamp(-d / max(u_bevel, 0.001), 0.0, 1.0);
      // directional emboss lighting from the upper-left
      vec2 dir = normalize(f + vec2(0.0001, 0.0001));
      float ndl = dot(dir, normalize(vec2(-0.65, 0.75)));
      vec3 choc = u_primary_color.rgb;
      // per-tablet tone shift, like uneven temper
      choc *= 0.95 + 0.1 * hash(cell + 4.2);
      // matte cocoa grain
      choc *= 0.93 + 0.14 * fbm(uv * 9.0 + cell);
      // bevel shading: lit slope on the light side, shadowed on the far side
      choc *= 1.0 + ndl * 0.5 * (1.0 - h);
      // embossed inner ridge stamped into the plateau
      float d2 = tabletSDF(f, hs - 0.14, rad * 0.7);
      float ridge = smoothstep(0.035, 0.0, abs(d2));
      choc *= 1.0 + ndl * ridge * 0.4;
      // soft factory sheen sweeping across the bar
      float sheen = pow(max(0.0, snoise(v_uv * 3.0 + 2.0)), 2.0);
      choc += u_accent_color.rgb * sheen * u_gloss * 0.14;
      // bright glint where the lit bevel corner catches the light
      choc += u_accent_color.rgb * max(0.0, ndl) * (1.0 - h) * top * 0.18;
      col = mix(col, choc, top);
      // faint dusty bloom speckle overall
      col *= 0.98 + 0.04 * hash(floor(v_uv * 420.0));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tablet Count', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_bevel', name: 'Bevel Width', type: 'float', min: 0.05, max: 0.3, default: 0.14 },
    { id: 'u_gloss', name: 'Temper Gloss', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Chocolate', type: 'color', default: [0.36, 0.2, 0.11, 1.0] },
    { id: 'u_secondary_color', name: 'Groove', type: 'color', default: [0.15, 0.08, 0.04, 1.0] },
    { id: 'u_accent_color', name: 'Shine Tint', type: 'color', default: [1.0, 0.9, 0.72, 1.0] }
  ],
  variants: [
    { name: 'Milk Chocolate', uniforms: { u_primary_color: [0.36, 0.2, 0.11, 1.0], u_secondary_color: [0.15, 0.08, 0.04, 1.0], u_accent_color: [1.0, 0.9, 0.72, 1.0], u_scale: 5.0, u_bevel: 0.14, u_gloss: 0.6 } },
    { name: 'Dark 85%', uniforms: { u_primary_color: [0.16, 0.09, 0.06, 1.0], u_secondary_color: [0.05, 0.03, 0.02, 1.0], u_accent_color: [0.85, 0.7, 0.55, 1.0], u_scale: 7.0, u_bevel: 0.1, u_gloss: 0.85 } },
    { name: 'White Chocolate', uniforms: { u_primary_color: [0.93, 0.86, 0.72, 1.0], u_secondary_color: [0.68, 0.58, 0.44, 1.0], u_accent_color: [1.0, 1.0, 0.95, 1.0], u_scale: 4.0, u_bevel: 0.18, u_gloss: 0.45 } }
  ]
};

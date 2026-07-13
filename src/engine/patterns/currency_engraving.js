export default {
  id: 'currency_engraving',
  name: 'Currency Engraving',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'Banknote guilloche line-work — fine wavy intaglio engraving whose line weight swells and thins with the tone beneath, like a portrait cut into a plate.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // tonal field the engraver is "shading" — the portrait behind the lines
      float tone = fbm(uv * 3.0);
      tone = smoothstep(0.22, 0.82, tone);
      // cream banknote paper with faint pulp mottle and fibre flecks
      vec3 paper = u_secondary_color.rgb;
      paper *= 0.965 + 0.035 * noise(uv * 340.0);
      paper *= 0.985 + 0.015 * fbm(uv * 8.0 + 21.0);
      // primary engraving set: horizontal lines that wave with the tone
      float wob = (fbm(uv * 4.0 + 7.0) - 0.5);
      float coord = uv.y * u_scale + sin(uv.x * 28.0 + wob * 7.0) * 0.35 * u_wave + wob * 2.2 * u_wave;
      float d1 = abs(fract(coord) - 0.5);
      // line thickness follows tone: dark areas -> fat ink, light areas -> hairline
      float th1 = mix(0.055, 0.44, tone);
      float aa = 0.10;
      float line1 = smoothstep(th1 + aa, th1 - aa, d1);
      // cross-hatch set: diagonal lines that only appear in the deepest tones
      float tone2 = fbm(uv * 3.0 + 17.3);
      float coord2 = (uv.x * 0.82 + uv.y * 0.42) * u_scale + sin(uv.y * 23.0 + tone2 * 6.0) * 0.3 * u_wave;
      float d2 = abs(fract(coord2) - 0.5);
      float deep = smoothstep(0.45, 0.85, tone * 0.6 + tone2 * 0.4);
      float th2 = mix(0.0, 0.34, deep);
      float line2 = smoothstep(th2 + aa, th2 - aa, d2) * step(0.02, th2);
      // plate wear: ink lifts slightly on random patches
      float wear = 0.82 + 0.18 * fbm(uv * 11.0 + 3.7);
      vec3 col = mix(paper, u_primary_color.rgb, line1 * 0.92 * wear);
      col = mix(col, u_accent_color.rgb, line2 * 0.6 * wear);
      // faint intaglio emboss shadow where ink is dense
      col *= 1.0 - (line1 * 0.5 + line2 * 0.3) * 0.06;
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Line Count', type: 'float', min: 24.0, max: 120.0, default: 48.0 },
    { id: 'u_wave', name: 'Wave Depth', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Intaglio Ink', type: 'color', default: [0.10, 0.26, 0.16, 1.0] },
    { id: 'u_secondary_color', name: 'Paper', type: 'color', default: [0.93, 0.90, 0.79, 1.0] },
    { id: 'u_accent_color', name: 'Cross-Hatch Ink', type: 'color', default: [0.08, 0.09, 0.08, 1.0] }
  ],
  variants: [
    { name: 'Greenback', uniforms: { u_scale: 48.0, u_wave: 0.6, u_primary_color: [0.10, 0.26, 0.16, 1.0], u_secondary_color: [0.93, 0.90, 0.79, 1.0], u_accent_color: [0.08, 0.09, 0.08, 1.0] } },
    { name: 'Bearer Bond', uniforms: { u_scale: 62.0, u_wave: 0.45, u_primary_color: [0.16, 0.18, 0.36, 1.0], u_secondary_color: [0.90, 0.87, 0.80, 1.0], u_accent_color: [0.42, 0.12, 0.14, 1.0] } },
    { name: 'Counterfeit Noir', uniforms: { u_scale: 40.0, u_wave: 0.85, u_primary_color: [0.85, 0.83, 0.78, 1.0], u_secondary_color: [0.10, 0.10, 0.11, 1.0], u_accent_color: [0.62, 0.52, 0.28, 1.0] } }
  ]
};

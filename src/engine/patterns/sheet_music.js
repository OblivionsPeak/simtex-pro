export default {
  id: 'sheet_music',
  name: 'Sheet Music',
  category: 'Retro',
  added: '2026-07-13',
  description: 'Cream manuscript paper ruled with staves, beamed eighth-note pairs scattered across the lines with a soft print-ink bleed.',
  shader: `
    vec4 generate() {
      vec2 suv = v_uv * u_scale;
      float staff = floor(suv.y);
      float sy = fract(suv.y);

      // cream paper with fibre grain and mottling
      vec3 paper = u_primary_color.rgb;
      paper *= 0.96 + 0.05 * noise(v_uv * 220.0);
      paper *= 0.96 + 0.06 * fbm(v_uv * 6.0);

      // five staff lines across sy = 0.30 .. 0.70, edges roughened by bleed
      float ink = 0.0;
      float band = (sy - 0.30) / 0.10;
      float lineIdx = floor(band + 0.5);
      float ld = abs(band - lineIdx) * 0.10;
      float bleed = 0.004 + 0.004 * noise(vec2(v_uv.x * 300.0, staff * 9.0 + lineIdx));
      if (lineIdx >= 0.0 && lineIdx <= 4.0) {
        ink = (1.0 - smoothstep(bleed, bleed + 0.006, ld))
            * (0.75 + 0.25 * noise(vec2(v_uv.x * 500.0, lineIdx + staff)));
      }

      // measure columns; bar line every fourth cell
      float pid = floor(suv.x);
      float pf = fract(suv.x);
      float seed = pid + staff * 57.0;
      float inStaff = step(0.295, sy) * step(sy, 0.705);
      float barMask = step(mod(pid, 4.0), 0.5) * (1.0 - smoothstep(0.012, 0.03, pf)) * inStaff;

      // beamed eighth-note pair built from distance fields
      float noteInk = 0.0;
      if (hash(vec2(seed, 1.0)) < u_density) {
        float p1 = 0.30 + 0.05 * floor(hash(vec2(seed, 2.0)) * 8.0);
        float p2 = 0.30 + 0.05 * floor(hash(vec2(seed, 3.0)) * 8.0);
        float hx1 = 0.28;
        float hx2 = 0.68;
        vec2 q = vec2(pf, sy);
        float c = cos(-0.5);
        float s = sin(-0.5);
        mat2 rot = mat2(c, -s, s, c);
        vec2 e1 = rot * (q - vec2(hx1, p1)); e1.y *= 1.55;
        vec2 e2 = rot * (q - vec2(hx2, p2)); e2.y *= 1.55;
        float dHead = min(length(e1), length(e2)) - 0.045;
        dHead += (noise(q * 240.0 + seed) - 0.5) * 0.012;   // ink bleed on the heads
        float head = 1.0 - smoothstep(-0.008, 0.010, dHead);

        // stems rise from the right of each head to a slanted beam
        float y1t = 0.78 + (p1 - 0.45) * 0.3;
        float y2t = 0.78 + (p2 - 0.45) * 0.3;
        float sx1 = hx1 + 0.042;
        float sx2 = hx2 + 0.042;
        float stem1 = (1.0 - smoothstep(0.006, 0.014, abs(pf - sx1))) * step(p1, sy) * step(sy, y1t);
        float stem2 = (1.0 - smoothstep(0.006, 0.014, abs(pf - sx2))) * step(p2, sy) * step(sy, y2t);
        float bt = clamp((pf - sx1) / (sx2 - sx1), 0.0, 1.0);
        float beamY = mix(y1t, y2t, bt);
        float beam = (1.0 - smoothstep(0.020, 0.032, abs(sy - beamY)))
                   * step(sx1 - 0.007, pf) * step(pf, sx2 + 0.007);
        noteInk = max(head, max(max(stem1, stem2), beam));
      }
      noteInk = max(noteInk, barMask);
      // print never lays down perfectly flat
      noteInk *= 0.85 + 0.15 * noise(v_uv * 350.0);

      vec3 col = mix(paper, u_secondary_color.rgb, ink * 0.85);
      col = mix(col, u_accent_color.rgb, noteInk * 0.95);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Staff Count', type: 'float', min: 2.0, max: 8.0, default: 4.0 },
    { id: 'u_density', name: 'Note Density', type: 'float', min: 0.0, max: 1.0, default: 0.8 },
    { id: 'u_primary_color', name: 'Paper', type: 'color', default: [0.93, 0.89, 0.79, 1.0] },
    { id: 'u_secondary_color', name: 'Staff Ink', type: 'color', default: [0.32, 0.29, 0.25, 1.0] },
    { id: 'u_accent_color', name: 'Note Ink', type: 'color', default: [0.12, 0.1, 0.09, 1.0] }
  ],
  variants: [
    { name: 'Aged Manuscript', uniforms: { u_scale: 4.0, u_density: 0.8, u_primary_color: [0.93, 0.89, 0.79, 1.0], u_secondary_color: [0.32, 0.29, 0.25, 1.0], u_accent_color: [0.12, 0.1, 0.09, 1.0] } },
    { name: 'Blueprint Score', uniforms: { u_scale: 5.0, u_density: 0.9, u_primary_color: [0.09, 0.18, 0.36, 1.0], u_secondary_color: [0.55, 0.68, 0.85, 1.0], u_accent_color: [0.92, 0.95, 1.0, 1.0] } },
    { name: 'Rock Opera', uniforms: { u_scale: 3.0, u_density: 0.65, u_primary_color: [0.07, 0.06, 0.08, 1.0], u_secondary_color: [0.4, 0.33, 0.2, 1.0], u_accent_color: [0.9, 0.72, 0.3, 1.0] } }
  ]
};

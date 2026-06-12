export default {
  id: 'cafe_racer_band',
  name: 'Cafe Racer Band',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'A single broad nose band flanked by twin painted keylines — matte band over gloss body, masked edges with the faintest tape wobble, and a lifetime of hand polishing.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: silver-grey tank, matte black band, gold keylines ---
      vec3 body = u_body_color.rgb;
      vec3 band = u_band_color.rgb;
      vec3 keyl = vec3(0.84, 0.66, 0.28);              // hand-pulled gold

      float bw = u_band_width * 0.5;                   // band half-width
      float kg = u_keyline_gap;                        // keyline distance from band
      float aa = 0.003;

      // gloss body: metallic flake, long polish strokes, panel reflection
      vec3 col = body;
      col *= 0.965 + noise(uv * 560.0) * 0.055;
      col *= 0.99 + 0.02 * noise(vec2(uv.x * 5.0, uv.y * 140.0));
      // soft horizon reflection rolling across the gloss
      col += smoothstep(0.30, 0.0, abs(uv.y - 0.78)) * 0.05;
      col += smoothstep(0.22, 0.0, abs(uv.y - 0.18)) * 0.02;

      // masking tape wobble — pulled by hand round a curved tank
      float wob = (noise(vec2(uv.y * 9.0, 1.3)) - 0.5) * 0.006
                + (noise(vec2(uv.y * 41.0, 5.1)) - 0.5) * 0.0018;
      float dx = abs(uv.x - 0.5 + wob);

      float d = dx - bw;                               // signed: inside band < 0

      // paint ridge shadow where the masked edge stands proud
      col *= 1.0 - smoothstep(0.010, 0.0, abs(d)) * step(0.0, d) * 0.10;

      // --- matte band ---
      float in_b = smoothstep(aa, -aa, d);
      vec3 b_col = band;
      b_col *= 0.96 + noise(uv * 330.0) * 0.07;        // matte tooth
      // matte paint scuffs lighter where knees and gloves rub (mid-height)
      float scuff = smoothstep(0.25, 0.0, abs(uv.y - 0.45)) *
                    (fbm(uv * vec2(4.0, 14.0)) * 0.5 + 0.5);
      b_col = mix(b_col, b_col * 1.35 + 0.04, scuff * 0.22);
      // no reflections on matte — but a hint of sheen at grazing angles
      b_col += smoothstep(0.5, 0.0, abs(uv.y - 0.78)) * 0.012;
      col = mix(col, b_col, in_b);

      // --- twin gold keylines, one each side of the band ---
      float key = smoothstep(aa * 1.6, 0.0, abs(d - kg) - 0.0035);
      vec3 k_col = keyl * (0.92 + 0.16 * noise(vec2(uv.y * 80.0, dx * 200.0)));
      col = mix(col, k_col, key * 0.94);
      // a second, finer companion line just outside each keyline
      float key2 = smoothstep(aa * 1.4, 0.0, abs(d - kg * 1.8) - 0.0018);
      col = mix(col, k_col * 0.9, key2 * 0.8);

      // brush start/stop marks: keyline density flickers along its run
      col = mix(col, body, key * step(0.93, noise(vec2(uv.y * 26.0, 8.0))) * 0.4);

      // stone-chips on the band's leading half
      float chip = step(0.975, hash(floor(uv * 240.0))) * smoothstep(0.5, 0.1, uv.y);
      col = mix(col, body * 0.95, chip * in_b * 0.8);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_band_width', name: 'Band Width', type: 'float', min: 0.12, max: 0.55, default: 0.30 },
    { id: 'u_keyline_gap', name: 'Keyline Offset', type: 'float', min: 0.012, max: 0.08, default: 0.03 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.74, 0.75, 0.77, 1.0] },
    { id: 'u_band_color', name: 'Band Colour', type: 'color', default: [0.12, 0.12, 0.13, 1.0] }
  ]
};

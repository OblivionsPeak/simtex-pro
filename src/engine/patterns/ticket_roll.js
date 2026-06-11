export default {
  id: 'ticket_roll',
  name: 'Ticket Roll',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Carnival admit-one tickets unspooled in brick-laid rows — perforated ends, punched side notches, inset keyline panels and serial-number blocks on sunfaded red stock.',
  shader: `
    vec4 generate() {
      float rows = u_rows;
      // tickets are roughly 2:1 — half as many columns as rows
      vec2 uv = vec2(v_uv.x * rows * 0.5, v_uv.y * rows);
      float row = floor(uv.y);
      uv.x += mod(row, 2.0) * 0.5;          // brick stagger
      vec2 cell = floor(uv);
      vec2 f = fract(uv);

      float seed = hash(cell);

      // --- ticket stock ---
      vec3 stock = u_ticket_color.rgb;
      stock *= 0.92 + noise(uv * 220.0) * 0.14;                       // pulp grain
      stock *= 1.0 - u_wear * smoothstep(0.45, 0.95, fbm(uv * 1.7 + seed * 9.0) * 0.5 + 0.5) * 0.35;
      stock *= 0.92 + seed * 0.14;                                    // roll-to-roll dye drift

      vec3 inkdark = stock * 0.30;
      vec3 panel   = mix(stock, vec3(0.96, 0.92, 0.80), 0.55);        // lighter print panel

      vec3 col = stock;

      // --- inset double keyline border ---
      float bx = min(f.x, 1.0 - f.x);
      float by = min(f.y, 1.0 - f.y);
      float inset = min(bx * 0.5, by);       // x distances scaled for the 2:1 aspect
      float line1 = step(0.060, inset) - step(0.075, inset);
      float line2 = step(0.090, inset) - step(0.115, inset);
      col = mix(col, inkdark, clamp(line1 + line2, 0.0, 1.0));

      // --- central panel with "ADMIT ONE" type bars ---
      bool inPanel = f.x > 0.30 && f.x < 0.70 && f.y > 0.26 && f.y < 0.74;
      if (inPanel) {
        col = panel;
        // panel keyline
        float pb = min(min(f.x - 0.30, 0.70 - f.x) * 0.5, min(f.y - 0.26, 0.74 - f.y));
        col = mix(col, inkdark, 1.0 - smoothstep(0.008, 0.018, pb));
        // two rows of blocky type dashes
        float trow = step(0.40, f.y) * step(f.y, 0.48) + step(0.55, f.y) * step(f.y, 0.66);
        float dash = step(0.30, fract(f.x * 22.0)) * step(f.x, 0.66) * step(0.34, f.x);
        col = mix(col, inkdark, trow * dash * 0.85);
      }

      // --- serial-number blocks near each perforated end ---
      float endzone = step(abs(f.x - 0.5), 0.46) * (step(f.x, 0.21) + step(0.79, f.x));
      float srow = step(0.34, f.y) * step(f.y, 0.66);
      vec2 sg = vec2(fract(f.x * 24.0), fract(f.y * 8.0));
      float digit = step(0.25, sg.x) * step(sg.x, 0.8) * step(0.25, sg.y) * step(sg.y, 0.8);
      digit *= step(0.45, hash(floor(vec2(f.x * 24.0, f.y * 8.0)) + cell * 17.0));
      col = mix(col, inkdark, endzone * srow * digit * 0.8);

      // --- perforation: punched dots along ticket ends ---
      float ex = min(f.x, 1.0 - f.x) * 2.0;            // distance to nearest end, aspect-corrected
      float perf = 1.0 - smoothstep(0.05, 0.09, length(vec2(ex, fract(f.y * 9.0) - 0.5) - vec2(0.0, 0.0)));
      vec3 behind = vec3(0.12, 0.10, 0.09);            // dark beneath the roll
      col = mix(col, behind, perf * 0.85);

      // --- side half-moon notch at each end's midpoint ---
      float notch = 1.0 - smoothstep(0.14, 0.18, length(vec2(ex, (f.y - 0.5) * 1.6)));
      col = mix(col, behind, notch);

      // row separation shadow
      col *= 0.90 + 0.10 * smoothstep(0.0, 0.05, by);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rows', name: 'Ticket Rows', type: 'float', min: 3.0, max: 10.0, default: 5.0 },
    { id: 'u_wear', name: 'Pocket Wear', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_ticket_color', name: 'Ticket Stock', type: 'color', default: [0.82, 0.18, 0.12, 1.0] }
  ]
};

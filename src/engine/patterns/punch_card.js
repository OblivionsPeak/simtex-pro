export default {
  id: 'punch_card',
  name: 'Punch Card',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Mainframe Hollerith card stock — manila fibre ruled into twelve punch rows, rectangular chads stamped clean through with bevelled lips and faint printed digit marks.',
  shader: `
    // rounded-rectangle signed distance
    float rrect_pc(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec4 generate() {
      float cols = u_columns;
      float rows = 12.0;
      vec2 guv = vec2(v_uv.x * cols, v_uv.y * rows);
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- manila card stock ---
      vec3 card = u_card_color.rgb;
      card *= 0.93 + noise(guv * vec2(3.0, 40.0)) * 0.12;       // long paper fibres
      card *= 0.97 + noise(v_uv * 600.0) * 0.05;                // pulp speckle
      // handling grime drifting in from card edges
      card *= 1.0 - smoothstep(0.55, 0.95, fbm(v_uv * 3.0) * 0.5 + 0.5) * 0.08;

      vec3 col = card;
      vec3 inkfaint = card * 0.55;

      // --- printed structure: row rules + column ticks ---
      float rowline = 1.0 - smoothstep(0.015, 0.035, abs(f.y + 0.5) );
      rowline = max(rowline, 1.0 - smoothstep(0.015, 0.035, abs(f.y - 0.5)));
      col = mix(col, inkfaint, rowline * 0.25);
      float coltick = 1.0 - smoothstep(0.02, 0.05, abs(f.x + 0.5));
      col = mix(col, inkfaint, coltick * 0.15);

      // printed digit mark at every position (small faint dash pair)
      float dgx = step(abs(f.x), 0.12);
      float dg1 = dgx * step(abs(f.y - 0.10), 0.035);
      float dg2 = dgx * step(abs(f.y + 0.10), 0.035);
      col = mix(col, inkfaint, (dg1 + dg2) * 0.5);

      // --- which positions are punched: one or two punches per column,
      //     like real encoded data ---
      float colseed = mod(cell.x, cols);   // stable per column, tiles with the sheet
      float r1 = floor(hash(vec2(colseed, 1.0)) * 12.0);
      float r2 = floor(hash(vec2(colseed, 2.0)) * 12.0);
      float want2 = step(0.45, hash(vec2(colseed, 3.0)));
      float punched = step(abs(cell.y - r1), 0.25)
                    + step(abs(cell.y - r2), 0.25) * want2 * u_punch_density * 2.0;
      punched = clamp(punched * step(0.05, u_punch_density), 0.0, 1.0);

      if (punched > 0.5) {
        float hd = rrect_pc(f, vec2(0.20, 0.32), 0.05);
        // dark void through the card
        vec3 through = vec3(0.10, 0.09, 0.08) * (0.8 + noise(guv * 13.0) * 0.3);
        col = mix(col, through, 1.0 - smoothstep(0.0, 0.03, hd));
        // torn-fibre bright lip around the punch
        float lip = (1.0 - smoothstep(0.03, 0.10, abs(hd))) * step(0.0, hd);
        col = mix(col, card * 1.18, lip * 0.8);
        // die-press shadow below the hole
        float press = (1.0 - smoothstep(0.0, 0.12, hd)) * step(hd, 0.0) * 0.0
                    + (1.0 - smoothstep(0.02, 0.14, abs(hd))) * max(-f.y, 0.0);
        col *= 1.0 - press * 0.25;
      }

      // --- every 10th column printed bolder (field separators) ---
      float sep = step(mod(cell.x, 10.0), 0.25);
      col = mix(col, inkfaint, sep * coltick * 0.6);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_columns', name: 'Card Columns', type: 'float', min: 10.0, max: 60.0, default: 26.0 },
    { id: 'u_punch_density', name: 'Data Density', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_card_color', name: 'Card Stock', type: 'color', default: [0.87, 0.80, 0.62, 1.0] }
  ]
};

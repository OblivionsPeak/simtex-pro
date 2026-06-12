export default {
  id: 'pit_board_letters',
  name: 'Pit Board Letters',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'A pit-board grid of blocky sign letterforms — chalk-white segment glyphs slotted into a matte black board with rail lines, finger smudges and rain-streaked paint.',
  shader: `
    // one blocky pseudo-glyph built from segment bars, picked by seed
    float glyph_hrt15(vec2 q, float seed) {
      // q in -1..1 within the glyph slot; seven-bar vocabulary
      float top = step(abs(q.y - 0.80), 0.14) * step(abs(q.x), 0.62);
      float mid = step(abs(q.y), 0.14)        * step(abs(q.x), 0.62);
      float bot = step(abs(q.y + 0.80), 0.14) * step(abs(q.x), 0.62);
      float lt  = step(abs(q.x + 0.62), 0.16) * step(abs(q.y - 0.42), 0.50);
      float lb  = step(abs(q.x + 0.62), 0.16) * step(abs(q.y + 0.42), 0.50);
      float rt  = step(abs(q.x - 0.62), 0.16) * step(abs(q.y - 0.42), 0.50);
      float rb  = step(abs(q.x - 0.62), 0.16) * step(abs(q.y + 0.42), 0.50);

      // segment mask from the seed: each bar on/off by its own hash slice
      float g = 0.0;
      g = max(g, top * step(0.30, fract(seed * 7.13)));
      g = max(g, mid * step(0.45, fract(seed * 11.71)));
      g = max(g, bot * step(0.30, fract(seed * 5.37)));
      g = max(g, lt  * step(0.35, fract(seed * 13.41)));
      g = max(g, lb  * step(0.35, fract(seed * 3.97)));
      g = max(g, rt  * step(0.35, fract(seed * 9.23)));
      g = max(g, rb  * step(0.35, fract(seed * 6.59)));
      // guarantee at least the left vertical so no slot reads empty
      g = max(g, lt + lb);
      return clamp(g, 0.0, 1.0);
    }

    vec4 generate() {
      float cols = u_columns;
      float rows = floor(u_columns * 0.75);
      vec2 guv = vec2(v_uv.x * cols, v_uv.y * rows);
      vec2 cell = floor(guv);
      vec2 f = (fract(guv) - 0.5) * 2.0;               // -1..1 in cell

      // --- palette: blackboard, chalk white, day-glo highlight row ---
      vec3 board = u_board_color.rgb;
      vec3 chalk = u_letter_color.rgb;
      vec3 dayglo = vec3(0.98, 0.45, 0.12);            // one row runs in orange
      vec3 rail  = vec3(0.32, 0.31, 0.30);             // alloy slot rails

      // matte board with rain streaks and finger smudges
      vec3 col = board;
      col *= 0.94 + noise(v_uv * 320.0) * 0.09;
      // vertical rain streaks
      col *= 0.97 + 0.05 * noise(vec2(v_uv.x * 180.0, v_uv.y * 6.0));
      // smudge clouds where hands grab the board edges
      float smudge = smoothstep(0.5, 0.9, fbm(v_uv * 4.0 + 9.0) * 0.5 + 0.5);
      col = mix(col, col * 1.5 + 0.02, smudge * 0.10);

      // --- slot rails: horizontal channels each row of plates slides in ---
      float railline = smoothstep(0.06, 0.0, abs(abs(f.y) - 0.97));
      col = mix(col, rail, railline * 0.55);
      // rail screws at every column boundary
      float screw = smoothstep(0.10, 0.02, length(vec2(abs(f.x) - 0.97, abs(f.y) - 0.97)));
      col = mix(col, rail * 1.3, screw * 0.6);

      // --- letter plates: most slots hold a glyph, some sit empty ---
      float seed = hash(cell + 41.0);
      float present = step(0.18, seed);
      // the plate itself: slightly lighter rectangle behind the glyph
      float plate = step(abs(f.x), 0.90) * step(abs(f.y), 0.86) * present;
      vec3 p_col = board * 1.25 + 0.015;
      p_col *= 0.96 + noise((cell + f) * 140.0) * 0.07;
      col = mix(col, p_col, plate * 0.8);

      // glyph within the plate
      vec2 q = f / vec2(0.72, 0.78);
      float g = glyph_hrt15(q, seed) * step(abs(q.x), 1.0) * step(abs(q.y), 1.0) * present;

      // one row per board cycle runs day-glo (the urgent message line)
      float hot_row = step(abs(mod(cell.y, rows) - floor(rows * 0.5)), 0.25);
      vec3 g_col = mix(chalk, dayglo, hot_row);
      // chalky coverage: paint thins unevenly across each bar
      g_col *= 0.88 + 0.18 * noise((cell * 3.0 + q) * 30.0);
      // worn glyph corners
      float worn = smoothstep(0.7, 1.0, max(abs(q.x), abs(q.y))) *
                   step(0.5, hash(cell + 77.0));
      g = g * (1.0 - worn * 0.5);

      col = mix(col, g_col, g);
      // glyph drop shadow onto the plate
      float gs = glyph_hrt15(q - vec2(0.06, 0.06), seed) * present;
      col *= 1.0 - gs * (1.0 - g) * plate * 0.18;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_columns', name: 'Board Columns', type: 'float', min: 3.0, max: 10.0, default: 5.0 },
    { id: 'u_board_color', name: 'Board Colour', type: 'color', default: [0.09, 0.09, 0.10, 1.0] },
    { id: 'u_letter_color', name: 'Letter Colour', type: 'color', default: [0.93, 0.92, 0.88, 1.0] }
  ]
};

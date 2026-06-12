export default {
  id: 'mud_cloth',
  name: 'Mud Cloth',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Malian bogolanfini: rows of hand-painted white symbols — zigzags, dots, combs and crosses — on fermented-mud-dyed cotton strips, every line wavering like a real brush.',
  shader: `
    float tri_mdc(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    // hand-drawn line: brightens within w of zero, with brush wobble baked into d
    float line_mdc(float d, float w) {
      return 1.0 - smoothstep(w * 0.5, w, abs(d));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Earthen ground: iron-rich mud over cotton ---
      vec3 mud_dark = u_ground_color.rgb;
      vec3 mud_warm = mud_dark * 1.5 + vec3(0.07, 0.04, 0.01);
      float earth = fbm(uv * 4.0) * 0.5 + 0.5;
      vec3 ground = mix(mud_dark, mud_warm, earth * 0.6);
      // mud dries unevenly in patches
      ground *= 0.9 + 0.18 * fbm(uv * 9.0 + 13.0);

      // --- Row structure: bands of symbols, like sewn strips ---
      float rows = u_rows;
      float ry = uv.y * rows;
      float row_id = floor(ry);
      float rv = fract(ry);
      float kind = mod(row_id + floor(hash(vec2(row_id, 2.3)) * 2.0), 5.0);

      // brush wobble: all symbols drawn by hand
      float wob = (noise(vec2(uv.x * 30.0, row_id * 7.0)) - 0.5) * 0.10;
      float wob2 = (noise(vec2(uv.x * 9.0, row_id * 3.0)) - 0.5) * 0.06;
      float y = rv + wob * 0.5 + wob2;

      float sym = 0.0;
      float cells = 9.0;
      float cx = fract(uv.x * cells + row_id * 0.37) - 0.5;
      float cid = floor(uv.x * cells + row_id * 0.37);

      if (kind < 1.0) {
        // zigzag row
        float zz = tri_mdc(uv.x * cells * 0.5);
        sym = line_mdc(y - mix(0.25, 0.75, zz), 0.10);
      } else if (kind < 2.0) {
        // dot-in-circle row
        float r = length(vec2(cx + wob * 0.3, y - 0.5) * vec2(1.0, 1.4));
        sym = line_mdc(r - 0.24, 0.09);                       // circle
        sym = max(sym, 1.0 - smoothstep(0.05, 0.10, r));      // centre dot
      } else if (kind < 3.0) {
        // comb / tally marks
        float t = fract(uv.x * cells * 3.0);
        float bar = line_mdc(t - 0.5, 0.30) * step(0.18, y) * step(y, 0.82);
        float rail = line_mdc(y - 0.18, 0.09) + line_mdc(y - 0.82, 0.09);
        sym = clamp(bar + rail, 0.0, 1.0);
      } else if (kind < 4.0) {
        // cross / X row
        float d1 = abs((y - 0.5) - (cx + wob * 0.2) * 1.3);
        float d2 = abs((y - 0.5) + (cx + wob * 0.2) * 1.3);
        sym = max(line_mdc(d1, 0.09), line_mdc(d2, 0.09)) * step(abs(cx), 0.34);
      } else {
        // chevron teeth pointing up
        float t = abs(fract(uv.x * cells) - 0.5);
        sym = line_mdc(y - (0.30 + t * 0.9), 0.10) * step(y, 0.85);
      }

      // skip an occasional cell — hand painting is irregular
      float skip = step(0.08, hash(vec2(cid, row_id * 1.7)));
      sym *= skip;

      // row divider lines
      float divider = line_mdc(rv + wob2, 0.05) + line_mdc(rv - 1.0 + wob2, 0.05);
      sym = clamp(sym + divider * 0.9, 0.0, 1.0);

      // --- Paint: bleached white-ochre pigment, slightly translucent ---
      vec3 pigment = vec3(0.90, 0.86, 0.76);
      // pigment thins where the cloth texture pokes through
      float thin = noise(uv * 90.0);
      vec3 col = mix(ground, pigment, sym * (0.72 + 0.28 * thin));

      // --- Coarse handwoven cotton strips ---
      float warp = sin(uv.x * 3.14159 * 150.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 130.0) * 0.5 + 0.5;
      col *= 0.88 + 0.07 * warp + 0.07 * weft;
      // strip seams every few rows
      float seam = tri_mdc(uv.y * rows / 3.0);
      col *= 0.94 + 0.06 * smoothstep(0.0, 0.1, seam);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rows',         name: 'Symbol Rows', type: 'float', min: 3.0, max: 14.0, default: 7.0 },
    { id: 'u_ground_color', name: 'Mud Color',   type: 'color', default: [0.16, 0.10, 0.07, 1.0] }
  ]
};

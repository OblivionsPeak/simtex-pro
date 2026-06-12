export default {
  id: 'brutalist_formwork',
  name: 'Brutalist Formwork',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Béton brut — raw concrete cast against timber boards, every plank leaving its grain and a slight step at the joint, with cone tie holes in a surveyed grid and rain streaks bleeding down from them.',
  shader: `
    float hash_bru(vec2 p) {
      return fract(sin(dot(p, vec2(419.2, 371.9))) * 39217.5371);
    }

    vec4 generate() {
      float boards = floor(u_board_count + 0.5);
      vec2 uv = v_uv;

      // --- horizontal board courses, each a slightly different height ---
      float yb = uv.y * boards;
      float board = floor(yb);
      float bId = mod(board, boards);
      float fy = fract(yb);

      // boards step in and out of plane a millimetre or two
      float plane = hash_bru(vec2(bId, 3.7)) * 2.0 - 1.0;

      // wood grain transferred into the cement: long streaks along the board
      float grainSeed = bId * 17.31;
      float grain = noise(vec2(uv.x * 60.0, yb * 6.0 + grainSeed));
      grain += noise(vec2(uv.x * 180.0, yb * 3.0 + grainSeed)) * 0.5;
      // occasional knot swirl
      float knotX = hash_bru(vec2(bId, 11.0));
      float knot = exp(-90.0 * (pow(fract(uv.x - knotX + 0.5) - 0.5, 2.0) * 4.0
                              + pow(fy - 0.5, 2.0)));
      grain += knot * sin(length(vec2(fract(uv.x - knotX + 0.5) - 0.5, (fy - 0.5) * 0.25)) * 160.0) * 0.5;

      // --- base concrete ---
      vec3 cem = u_concrete_color.rgb;
      float cure = fbm(uv * 4.0) * 0.5 + 0.5;            // broad curing blotches
      vec3 col = cem * (0.86 + cure * 0.18);
      col *= 0.96 + hash_bru(floor(uv * 700.0)) * 0.08;  // fine cement speckle
      col *= 0.93 + grain * 0.5 * 0.18;                  // imprinted grain

      // per-board tonal shift (different pours, different boards)
      col *= 0.93 + hash_bru(vec2(bId, 1.0)) * 0.12;
      col *= 1.0 + plane * 0.045;

      // board joint: sharp shadow line + squeeze-out fin of mortar
      float joint = min(fy, 1.0 - fy);
      col *= mix(0.62, 1.0, smoothstep(0.0, 0.030, joint));
      float fin = smoothstep(0.030, 0.012, joint) * smoothstep(0.0, 0.012, joint);
      col = mix(col, cem * 1.12, fin * 0.5);

      // vertical shutter-panel seams every quarter
      float px = fract(uv.x * 4.0);
      float pseam = min(px, 1.0 - px);
      col *= mix(0.70, 1.0, smoothstep(0.0, 0.012, pseam));

      // --- tie holes: cone recesses on a regular grid ---
      vec2 tg = uv * vec2(4.0, 2.0);                 // ties land mid-panel
      vec2 tcell = floor(tg);
      vec2 tf = fract(tg) - 0.5;
      float td = length(tf * vec2(1.0, 2.0));
      float hole = smoothstep(0.09, 0.045, td);
      float holeRim = smoothstep(0.10, 0.085, td) * smoothstep(0.05, 0.075, td);
      col = mix(col, cem * 0.30, hole);              // dark recess
      col = mix(col, cem * 1.10, holeRim * 0.6);     // bright compressed rim
      // shadow lobe under the hole (light from above)
      col *= 1.0 - smoothstep(0.13, 0.06, length((tf + vec2(0.0, 0.07)) * vec2(1.0, 2.0))) * 0.18 * (1.0 - hole);

      // --- rain streaks running down from each tie hole ---
      float below = -tf.y;                            // positive below the hole centre
      float streakCore = exp(-pow(tf.x * 22.0, 2.0)) * step(0.0, below);
      float streakFade = exp(-below * 3.0 / max(u_staining, 0.05));
      float wobble = noise(vec2(uv.x * 50.0, uv.y * 9.0 + tcell.x * 7.0)) * 0.6 + 0.4;
      float streak = streakCore * (1.0 - streakFade) * wobble;
      col = mix(col, cem * vec3(0.45, 0.44, 0.42), clamp(streak, 0.0, 1.0) * 0.6 * u_staining);

      // general top-down weather wash inside each board course
      col *= 1.0 - (1.0 - fy) * 0.06 * u_staining;

      // pinhole bug-holes in the face
      float pin = step(0.985, hash_bru(floor(uv * 260.0) + 5.0));
      col *= 1.0 - pin * 0.35;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_board_count',    name: 'Board Courses', type: 'float', min: 4.0, max: 24.0, default: 10.0 },
    { id: 'u_staining',       name: 'Rain Staining', type: 'float', min: 0.0, max: 1.0,  default: 0.55 },
    { id: 'u_concrete_color', name: 'Concrete',      type: 'color', default: [0.62, 0.61, 0.58, 1.0] }
  ]
};

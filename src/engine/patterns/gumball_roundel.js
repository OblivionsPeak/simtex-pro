export default {
  id: 'gumball_roundel',
  name: 'Gumball Roundel',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Big competition number circles on body colour — white gumballs with painted ring, blocky digit bars inside, decal silvering and curled-edge shadow.',
  shader: `
    vec4 generate() {
      // offset grid: every other row shifts half a cell so roundels stagger
      vec2 guv = v_uv * u_grid_scale;
      float row = floor(guv.y);
      guv.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- palette ---
      vec3 body   = u_body_color.rgb;
      vec3 ball   = vec3(0.97, 0.96, 0.92);          // aged white gumball
      vec3 ring   = u_ring_color.rgb;                // painted ring
      vec3 digit  = vec3(0.10, 0.10, 0.12);          // matte black digit bars

      // body paint: flake + faint orange-peel
      vec3 col = body;
      col *= 0.97 + noise(v_uv * 520.0) * 0.05;
      col *= 0.99 + snoise(v_uv * 60.0) * 0.012;

      float r = u_roundel_size * 0.5;
      float d = length(f) - r;
      float aa = 0.012;

      // decal drop-shadow (sticker sits slightly proud of the panel)
      float sh = smoothstep(0.035, 0.0, d - 0.02) * step(0.0, d);
      col *= 1.0 - sh * 0.12;

      // white gumball
      float in_ball = smoothstep(aa, -aa, d);
      // decal silvering: faint grey blotches where adhesive has lifted
      vec3 ball_c = ball * (0.985 + noise((cell + f) * 24.0) * 0.03);
      ball_c = mix(ball_c, ball_c * 0.93, smoothstep(0.6, 0.9, fbm(f * 7.0 + cell) * 0.5 + 0.5) * 0.5);
      col = mix(col, ball_c, in_ball);

      // painted ring just inside the rim
      float ringd = abs(d + r * 0.10) - r * 0.045;
      col = mix(col, ring, smoothstep(aa, -aa, ringd) * 0.95);

      // --- blocky digit bars: two abstract strokes per roundel,
      //     varied per cell like a sequence of race numbers ---
      float pick = hash(cell + 7.0);
      vec2 q = f / r;                              // normalised inside-roundel coords
      float bar_w = 0.16;
      // left stroke: vertical bar, sometimes with a top crossbar (1 vs 7 vs 4 feel)
      float b1 = step(abs(q.x + 0.28), bar_w) * step(abs(q.y), 0.46);
      float cross = step(abs(q.y - 0.34), 0.11) * step(abs(q.x + 0.12), 0.30) * step(0.4, pick);
      // right stroke: vertical bar or open square (0 / 8 feel)
      float b2 = step(abs(q.x - 0.28), bar_w) * step(abs(q.y), 0.46);
      float hollow = step(abs(q.x - 0.28), bar_w * 0.45) * step(abs(q.y), 0.24) * step(0.65, pick);
      float dig = clamp(b1 + b2 + cross - hollow, 0.0, 1.0) * step(length(q), 0.78);
      col = mix(col, digit, dig * in_ball * 0.96);

      // brush ridges through the digits (hand-lettered look)
      col = mix(col, col * 1.06, dig * in_ball * step(0.5, fract(q.y * 9.0)) * 0.25);

      // gumball gloss highlight, upper-left
      col += in_ball * exp(-dot(q + vec2(0.35, -0.35), q + vec2(0.35, -0.35)) * 3.0) * 0.05;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grid_scale', name: 'Roundels Per Tile', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_roundel_size', name: 'Roundel Size', type: 'float', min: 0.3, max: 0.9, default: 0.68 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.72, 0.11, 0.12, 1.0] },
    { id: 'u_ring_color', name: 'Ring Colour', type: 'color', default: [0.12, 0.14, 0.35, 1.0] }
  ]
};

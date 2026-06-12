export default {
  id: 'speed_blocks',
  name: 'Speed Blocks',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Sixties-style offset colour blocks with motion bias — sheared rectangles racing left to right in staggered rows, trailing echo bars and screen-print grain.',
  shader: `
    vec4 generate() {
      float rows = u_row_count;

      // motion shear: every coordinate leans with speed
      vec2 uv = v_uv;
      uv.x -= uv.y * u_motion_skew;

      vec2 guv = vec2(uv.x * rows * 1.6, uv.y * rows);
      float row = floor(guv.y);
      // rows stagger by a per-row golden-ratio offset — never columns
      guv.x += fract(row * 0.618) ;
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- palette: warm 60s print trio over cream stock ---
      vec3 stock = u_base_color.rgb;
      vec3 c0 = u_block_color.rgb;                     // hero block colour
      vec3 c1 = vec3(0.96, 0.62, 0.12);                // tangerine
      vec3 c2 = vec3(0.20, 0.20, 0.24);                // off-black
      vec3 c3 = mix(c0, vec3(1.0), 0.45);              // tint of hero

      // cream stock with screen-print grain
      vec3 col = stock;
      col *= 0.96 + noise(v_uv * 440.0) * 0.06;
      col *= 0.99 + 0.02 * (fbm(v_uv * 3.0) * 0.5 + 0.5);

      float h0 = hash(cell);
      float h1 = hash(cell + 13.0);

      // some cells are empty — rhythm needs rests
      float present = step(0.22, h0);

      // block dimensions vary; longer blocks read faster
      float half_w = 0.28 + h1 * 0.18;
      float half_h = 0.26 + hash(cell + 29.0) * 0.12;

      // leading edge is square, trailing edge tapers — motion bias
      float lead = f.x + half_w;                        // distance past left edge
      float trail_cut = smoothstep(half_w * 0.2, half_w, f.x) * 0.18;
      float in_x = step(-half_w, f.x) * step(f.x, half_w);
      float in_y = step(abs(f.y), half_h - trail_cut);
      float block = in_x * in_y * present;

      // pick a colour per block
      vec3 ink = (h1 < 0.30) ? c0 : (h1 < 0.55) ? c1 : (h1 < 0.78) ? c3 : c2;

      // --- trailing echo bars: two fading slivers behind each block ---
      float e1 = step(half_w + 0.08, f.x) * step(f.x, half_w + 0.16) *
                 step(abs(f.y), half_h * 0.85) * present;
      float e2 = step(half_w + 0.24, f.x) * step(f.x, half_w + 0.29) *
                 step(abs(f.y), half_h * 0.65) * present;

      // screen-print texture inside the ink: roller lines + dot starvation
      vec3 ink_t = ink;
      ink_t *= 0.95 + 0.08 * noise(vec2((cell.x + f.x) * 90.0, row * 7.0));
      ink_t = mix(ink_t, stock, smoothstep(0.7, 0.97, noise((cell + f) * 70.0)) * 0.35);
      // leading-edge ink pile-up (squeegee stops here)
      ink_t *= 1.0 + smoothstep(0.10, 0.0, lead) * -0.12;
      ink_t *= 1.0 + smoothstep(0.06, 0.0, half_w - f.x) * 0.0;

      col = mix(col, ink_t, block);
      col = mix(col, ink, e1 * 0.45);
      col = mix(col, ink, e2 * 0.22);

      // misregistration: hero-tint ghost peeking off the top-left of dark blocks
      float gh = step(-half_w - 0.025, f.x) * step(f.x, half_w - 0.025) *
                 step(abs(f.y - 0.03), half_h - trail_cut) * present;
      col = mix(col, c3, gh * (1.0 - block) * step(0.78, h1) * 0.5);

      // row separation hairline — the layout grid showing through
      float rule = smoothstep(0.025, 0.0, abs(fract(v_uv.y * rows) - 0.5) - 0.485);
      col = mix(col, c2, rule * 0.10);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_row_count', name: 'Block Rows', type: 'float', min: 2.0, max: 8.0, default: 4.0 },
    { id: 'u_motion_skew', name: 'Motion Skew', type: 'float', min: 0.0, max: 0.6, default: 0.22 },
    { id: 'u_base_color', name: 'Stock Colour', type: 'color', default: [0.93, 0.89, 0.80, 1.0] },
    { id: 'u_block_color', name: 'Hero Colour', type: 'color', default: [0.75, 0.15, 0.13, 1.0] }
  ]
};

export default {
  id: 'finish_line_fade',
  name: 'Finish Line Fade',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Chequered flag dissolving upward into a halftone scatter — solid squares break into shrinking print dots, with screen-angle rotation and ink bleed on the last survivors.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette ---
      vec3 ink   = u_ink_color.rgb;                     // chequer/dot ink
      vec3 paper = u_base_color.rgb;                    // body colour
      vec3 ink_w = mix(ink, paper, 0.35);               // starved-ink tone

      // base coat: flake + faint print-stock mottle
      vec3 col = paper;
      col *= 0.97 + noise(uv * 460.0) * 0.05;
      col *= 0.99 + 0.02 * (fbm(uv * 4.0) * 0.5 + 0.5);

      float n = u_checker_count;

      // dissolve driver: 0 at the bottom (solid chequer) -> 1 at the top (gone)
      // ragged by noise so the fade line isn't a ruler
      float fade = clamp((uv.y - (1.0 - u_fade_span)) / u_fade_span, 0.0, 1.0);
      fade = clamp(fade + (noise(uv * vec2(7.0, 3.0)) - 0.5) * 0.25, 0.0, 1.0);

      // --- zone A: solid chequerboard (low fade) ---
      vec2 g = uv * n;
      vec2 cidx = floor(g);
      float check = mod(cidx.x + cidx.y, 2.0);
      // hand-laid vinyl: each black square shrinks slightly and shifts a hair
      vec2 jit = (vec2(hash(cidx), hash(cidx + 31.0)) - 0.5) * 0.06;
      vec2 cf = abs(fract(g) - 0.5 - jit);

      // square half-size shrinks as the fade rises: chequer -> squares -> dots
      float sz = mix(0.5, 0.0, smoothstep(0.0, 0.75, fade));
      float sq = smoothstep(0.012, -0.012, max(cf.x, cf.y) - sz);

      // --- zone B: rotated halftone scatter taking over ---
      // classic 45-degree screen angle
      vec2 huv = mat2(0.7071, 0.7071, -0.7071, 0.7071) * uv * n * 1.4142;
      vec2 hidx = floor(huv);
      vec2 hf = fract(huv) - 0.5;
      // dot size: large near the fade line, scattering to nothing above
      float keep = hash(hidx * 1.7 + 5.0);
      float dotr = (1.0 - fade) * 0.62 * step(fade * 0.9, keep);
      float dots = smoothstep(0.04, -0.04, length(hf) - dotr * 0.5);

      // blend: chequer below, halftone above, crossfading through the band
      float zone = smoothstep(0.15, 0.55, fade);
      float mark = mix(sq * check, dots, zone);

      // ink bleed: the smallest surviving dots wick into the base coat
      float tiny = step(dotr, 0.22) * dots * zone;
      vec3 ink_c = mix(ink, ink_w, tiny * 0.8);
      // press gain: ink darkest at dot centres
      ink_c *= 0.92 + 0.10 * smoothstep(0.3, 0.0, length(hf));
      // chequer squares carry squeegee streaks
      ink_c *= mix(1.0, 0.94 + 0.10 * noise(vec2(uv.x * 8.0, uv.y * 160.0)), (1.0 - zone));

      col = mix(col, ink_c, clamp(mark, 0.0, 1.0));

      // ghost misregistration: faint second impression above the fade line
      vec2 g2 = (uv + vec2(0.006, 0.004)) * n;
      float check2 = mod(floor(g2.x) + floor(g2.y), 2.0);
      vec2 cf2 = abs(fract(g2) - 0.5);
      float sq2 = smoothstep(0.012, -0.012, max(cf2.x, cf2.y) - sz);
      col = mix(col, ink, sq2 * check2 * (1.0 - zone) * (1.0 - mark) * 0.12);

      // track grime settling along the bottom of the panel
      col *= 1.0 - smoothstep(0.18, 0.0, uv.y) * (fbm(uv * 9.0) * 0.5 + 0.5) * 0.10;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_checker_count', name: 'Chequer Count', type: 'float', min: 4.0, max: 20.0, default: 9.0 },
    { id: 'u_fade_span', name: 'Fade Span', type: 'float', min: 0.3, max: 1.0, default: 0.75 },
    { id: 'u_ink_color', name: 'Chequer Ink', type: 'color', default: [0.08, 0.08, 0.10, 1.0] },
    { id: 'u_base_color', name: 'Body Colour', type: 'color', default: [0.92, 0.90, 0.85, 1.0] }
  ]
};

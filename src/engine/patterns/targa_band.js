export default {
  id: 'targa_band',
  name: 'Targa Band',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'A full-wrap solid band across the panel with a flowing model-script underline beneath it — brushed-look band, chrome script swash, and gloss body colour.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: gulf-silver body, satin black band, chrome script ---
      vec3 body   = u_body_color.rgb;
      vec3 band   = u_band_color.rgb;
      vec3 chrome = vec3(0.88, 0.89, 0.92);
      vec3 chr_lo = vec3(0.42, 0.45, 0.52);

      float bw = u_band_width * 0.5;
      float yc = 0.62;                                  // band centreline height
      float aa = 0.003;

      // gloss body coat
      vec3 col = body;
      col *= 0.965 + noise(uv * 520.0) * 0.05;
      col += smoothstep(0.4, 0.0, abs(uv.y - 0.90)) * 0.04;     // top sheen
      col *= 0.99 + 0.02 * noise(vec2(uv.x * 130.0, uv.y * 5.0));

      // the band wraps the body horizontally — dead straight, machine-masked
      float d = abs(uv.y - yc) - bw;

      // masked-edge ridge shadow
      col *= 1.0 - smoothstep(0.008, 0.0, abs(d)) * step(0.0, d) * 0.10;

      // --- satin band with fine longitudinal brushing ---
      float in_b = smoothstep(aa, -aa, d);
      vec3 b_col = band;
      b_col *= 0.95 + 0.08 * noise(vec2(uv.x * 6.0, uv.y * 480.0));   // brushing
      b_col *= 0.97 + noise(uv * 300.0) * 0.045;
      // satin catches one soft lateral highlight
      b_col += smoothstep(bw, 0.0, abs(uv.y - yc - bw * 0.35)) * 0.035;
      col = mix(col, b_col, in_b);

      // thin body-colour pinline splitting the band low across its width
      float pin = smoothstep(aa, 0.0, abs(uv.y - (yc - bw * 0.55)) - 0.0022);
      col = mix(col, body, pin * in_b * 0.9);

      // --- model-script underline beneath the band ---
      // a flowing connected swash: baseline wave + loop bumps, like brushed script
      float sx = fract(uv.x * u_script_repeat);          // script repeats along the wrap
      float baseline = yc - bw - 0.075;
      // the stroke path: rolling loops with a tall ascender per repeat
      float path = baseline
                 + 0.020 * sin(sx * 25.13)               // letter rhythm (4 loops)
                 + 0.030 * sin(sx * 6.283 + 1.2)         // word-level swell
                 + 0.045 * exp(-pow((sx - 0.18) * 9.0, 2.0));  // ascender flick
      // stroke weight breathes like a pressure-varied brush
      float wgt = 0.0035 + 0.0030 * (0.5 + 0.5 * sin(sx * 25.13 + 1.6));
      float script = smoothstep(aa, -aa, abs(uv.y - path) - wgt);
      // entry/exit taper at the repeat seam so each script sits as a word
      script *= smoothstep(0.0, 0.06, sx) * smoothstep(1.0, 0.86, sx);

      // long underline swash trailing off the last letter
      float swash_y = baseline - 0.030 + (sx - 0.5) * 0.012;
      float swash = smoothstep(aa, -aa, abs(uv.y - swash_y) - 0.0024)
                  * smoothstep(0.25, 0.45, sx) * smoothstep(0.99, 0.80, sx);

      float mark = max(script, swash);
      // chrome script: bright top edge, dark under-edge
      vec3 s_col = mix(chr_lo, chrome, smoothstep(-0.004, 0.004, uv.y - path + 0.001));
      col = mix(col, s_col, mark);
      // chrome glints where the script crosses the panel highlight
      col += mark * smoothstep(0.15, 0.0, abs(uv.x - 0.35)) * 0.10;
      // script shadow on the paint
      col *= 1.0 - smoothstep(0.006, 0.0, abs(uv.y - path + 0.006) - wgt)
                 * (1.0 - mark) * 0.08;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_band_width', name: 'Band Width', type: 'float', min: 0.06, max: 0.30, default: 0.15 },
    { id: 'u_script_repeat', name: 'Script Repeats', type: 'float', min: 1.0, max: 4.0, default: 2.0 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.65, 0.79, 0.84, 1.0] },
    { id: 'u_band_color', name: 'Band Colour', type: 'color', default: [0.14, 0.14, 0.16, 1.0] }
  ]
};

export default {
  id: 'shoji_screen',
  name: 'Shoji Screen',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Backlit shoji — washi paper glowing with diffuse daylight, long paper fibres visible in the sheet, a hinoki kumiko lattice in front with a finer inner subdivision and soft light bleeding around every bar.',
  shader: `
    float hash_shj(vec2 p) {
      return fract(sin(dot(p, vec2(143.9, 289.3))) * 36911.4159);
    }

    vec4 generate() {
      float n = floor(u_panes + 0.5);
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv);

      // --- backlight through the paper ---
      // broad daylight gradient: a soft hotspot that wraps for tiling
      vec2 c = v_uv - 0.5;
      float glow = 0.85 + 0.15 * cos(c.x * 6.2831853) * cos(c.y * 6.2831853);
      // drifting cloud shadows behind the screen
      float clouds = fbm(v_uv * 3.0) * 0.5 + 0.5;
      glow *= 0.88 + clouds * 0.18;

      vec3 paper = u_paper_color.rgb * u_backlight * glow;

      // --- washi fibre structure ---
      // long fibres laid mostly horizontally with strays crossing
      float fibreH = noise(vec2(v_uv.x * 18.0, v_uv.y * 220.0));
      float fibreV = noise(vec2(v_uv.x * 200.0, v_uv.y * 16.0));
      paper *= 0.94 + fibreH * 0.08 + fibreV * 0.04;
      // bright translucent flecks where the sheet thins
      float fleck = smoothstep(0.86, 0.97, noise(v_uv * 90.0 + 7.0));
      paper += u_paper_color.rgb * fleck * 0.10 * u_backlight;
      // paper sags slightly within each pane — darker toward pane edges
      vec2 pd = min(f, 1.0 - f);
      float sag = smoothstep(0.0, 0.30, min(pd.x, pd.y));
      paper *= 0.92 + sag * 0.08;

      // an aged repair patch on the odd pane, slightly more opaque
      float patchy = step(0.92, hash_shj(cell + 31.0));
      float patch = patchy * smoothstep(0.30, 0.22, length(f - vec2(
        0.3 + hash_shj(cell) * 0.4, 0.3 + hash_shj(cell + 5.0) * 0.4)));
      paper *= 1.0 - patch * 0.13;

      // --- kumiko lattice ---
      float frameW = 0.045;   // main pane frame
      float kumiW  = 0.020;   // inner subdivision bars

      // main frame on pane borders
      float dFrame = min(pd.x, pd.y);

      // inner kumiko: 3x4 subdivision inside each pane
      vec2 k = f * vec2(3.0, 4.0);
      vec2 kf = fract(k);
      vec2 kd = min(kf, 1.0 - kf) / vec2(3.0, 4.0);
      float dKumi = min(kd.x, kd.y);

      float onFrame = smoothstep(frameW, frameW * 0.75, dFrame);
      float onKumi  = smoothstep(kumiW, kumiW * 0.70, dKumi) * (1.0 - onFrame);

      // --- wood, seen in silhouette against the light ---
      vec3 wood = u_wood_color.rgb;
      // backlit bars go dark but keep a whisper of grain
      float grainDir = (kd.x < kd.y) ? 1.0 : 0.0;
      vec2 gUV = mix(vec2(uv.x * 90.0, uv.y * 8.0), vec2(uv.x * 8.0, uv.y * 90.0), grainDir);
      float grain = noise(gUV);
      vec3 barCol = wood * (0.30 + grain * 0.18);
      // main frame is thicker so it reads darker still
      vec3 frameCol = wood * (0.22 + grain * 0.12);
      // a faint rim where light wraps the rounded bar edge
      float rimK = smoothstep(kumiW * 0.70, kumiW, dKumi) * onKumi;
      float rimF = smoothstep(frameW * 0.75, frameW, dFrame) * onFrame;
      barCol  += paper * rimK * 0.45;
      frameCol += paper * rimF * 0.35;

      // --- light bloom: paper glow bleeds around the bars ---
      float bloomK = smoothstep(kumiW * 3.5, kumiW, dKumi);
      float bloomF = smoothstep(frameW * 3.0, frameW, dFrame);
      vec3 lit = paper * (1.0 + (bloomK * 0.5 + bloomF * 0.4) * 0.18);

      vec3 col = lit;
      col = mix(col, barCol, onKumi);
      col = mix(col, frameCol, onFrame);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_panes',       name: 'Panes',     type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_backlight',   name: 'Backlight', type: 'float', min: 0.4, max: 1.6, default: 1.0 },
    { id: 'u_paper_color', name: 'Washi',     type: 'color', default: [0.96, 0.92, 0.82, 1.0] },
    { id: 'u_wood_color',  name: 'Kumiko',    type: 'color', default: [0.42, 0.30, 0.20, 1.0] }
  ]
};

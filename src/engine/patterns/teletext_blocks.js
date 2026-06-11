export default {
  id: 'teletext_blocks',
  name: 'Teletext Blocks',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Ceefax page 888 mosaic graphics — 2×3 sixel blocks clustering into saturated seven-colour shapes on broadcast black, with the faint shimmer of a tuned-in telly.',
  shader: `
    vec3 ttpal_tt(float k) {
      if (k < 1.0) return vec3(1.0, 1.0, 1.0);     // white
      if (k < 2.0) return vec3(1.0, 1.0, 0.0);     // yellow
      if (k < 3.0) return vec3(0.0, 1.0, 1.0);     // cyan
      if (k < 4.0) return vec3(0.0, 1.0, 0.0);     // green
      if (k < 5.0) return vec3(1.0, 0.0, 1.0);     // magenta
      if (k < 6.0) return vec3(1.0, 0.1, 0.1);     // red
      return vec3(0.25, 0.25, 1.0);                // blue
    }

    vec4 generate() {
      float cols = u_cols;
      float rows = floor(cols * 0.75);             // teletext chars are tall
      vec2 guv = vec2(v_uv.x * cols, v_uv.y * rows);
      vec2 cell = floor(guv);
      vec2 cf = fract(guv);

      // sixel sub-block inside the character cell: 2 wide x 3 tall
      vec2 sub = vec2(floor(cf.x * 2.0), floor(cf.y * 3.0));
      // centre of this sixel in page coordinates
      vec2 sixel = cell + (sub + 0.5) / vec2(2.0, 3.0);

      // mosaic artwork: smooth field decides which sixels are set,
      // per-sixel hash roughens the contour into chunky steps
      float field = snoise(sixel / vec2(cols, rows) * 4.5) * 0.5 + 0.5;
      field += snoise(sixel / vec2(cols, rows) * 11.0 + 31.0) * 0.18;
      float rough = (hash(sixel * 3.7) - 0.5) * 0.22;
      float on = step(1.0 - u_fill, field + rough);

      // colour runs in bands, the way control codes paint whole regions
      float cband = snoise(vec2(cell.x * 0.06, cell.y * 0.21) + 7.7) * 0.5 + 0.5;
      float k = floor(clamp(cband * 6.999, 0.0, 6.999));
      vec3 fg = ttpal_tt(k);

      // every few rows, a "double-height headline" stripe forces yellow
      float headline = step(0.92, hash(vec2(floor(cell.y / 2.0), 13.0)));
      fg = mix(fg, vec3(1.0, 1.0, 0.0), headline);

      // a sparse scatter of set sixels in empty space — background chatter
      float chatter = step(0.965, hash(sixel + 99.0)) * (1.0 - on);

      vec3 bg = u_bg_color.rgb;
      vec3 col = mix(bg, fg, on);
      col = mix(col, fg * 0.55, chatter);

      // 1-pixel-ish gap shading between character rows (raster structure)
      float rowedge = smoothstep(0.0, 0.06, cf.y) * smoothstep(1.0, 0.94, cf.y);
      col *= 0.82 + 0.18 * rowedge;

      // soft phosphor bleed: set blocks glow very slightly past their edge
      vec2 bf = fract(guv * vec2(2.0, 3.0));
      float inner = min(min(bf.x, 1.0 - bf.x), min(bf.y, 1.0 - bf.y));
      col += fg * on * (1.0 - smoothstep(0.0, 0.4, inner)) * 0.10;

      // tuned-in shimmer
      col *= 0.95 + 0.05 * hash(vec2(floor(v_uv.y * 600.0), 3.0));

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cols', name: 'Character Columns', type: 'float', min: 10.0, max: 60.0, default: 26.0 },
    { id: 'u_fill', name: 'Mosaic Fill', type: 'float', min: 0.15, max: 0.9, default: 0.55 },
    { id: 'u_bg_color', name: 'Broadcast Black', type: 'color', default: [0.02, 0.02, 0.03, 1.0] }
  ]
};

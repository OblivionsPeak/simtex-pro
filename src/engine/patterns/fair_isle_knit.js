export default {
  id: 'fair_isle_knit',
  name: 'Fair Isle Knit',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Stranded Fair Isle knitting: banded rows of diamond, cross and zigzag motifs built stitch-by-stitch from visible knit Vs in heathered Shetland wool.',
  shader: `
    float tri_fik(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    // 1 if the motif says "contrast colour" for stitch (sx, sy) in a band of height 7
    float motif_fik(float sx, float sy, float band) {
      float m = mod(band, 3.0);
      float x = mod(sx, 8.0);
      float y = sy; // 0..6 inside band
      if (m < 0.5) {
        // OXO diamond: |x-4| + |y-3| pattern
        float d = abs(x - 4.0) + abs(y - 3.0);
        return step(abs(d - 3.0), 0.4) + step(d, 0.4);
      } else if (m < 1.5) {
        // crosses on alternating stitches
        float cx = abs(x - 4.0);
        float cy = abs(y - 3.0);
        return step(cx + cy, 1.4) * step(abs(cx - cy), 1.4) * step(min(cx, cy), 0.4);
      }
      // zigzag band
      float zz = abs(y - (1.0 + 4.0 * tri_fik(sx / 8.0)));
      return step(zz, 0.6);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Stitch grid: knit stitches are wider than tall ---
      float sx_n = u_stitches;        // stitches across
      float sy_n = u_stitches * 1.35; // rows
      vec2 s = vec2(uv.x * sx_n, uv.y * sy_n);
      vec2 sid = floor(s);
      vec2 sf = fract(s);

      // Band structure: 7-row motif bands separated by 2-row plain stripes
      float row = sid.y;
      float band_period = 9.0;
      float band = floor(row / band_period);
      float band_row = mod(row, band_period);
      float in_motif = step(band_row, 6.5);

      // --- Wool palette ---
      vec3 ground_a = u_ground_color.rgb;
      vec3 contrast = u_motif_color.rgb;
      vec3 stripe   = mix(ground_a, contrast, 0.5) * vec3(1.05, 0.95, 0.85);

      float on = motif_fik(sid.x, band_row, band) * in_motif;
      vec3 yarn = mix(ground_a, contrast, clamp(on, 0.0, 1.0));
      yarn = mix(stripe, yarn, in_motif);

      // Heather: wool fibres of mixed colour within each yarn
      float heather = noise(uv * 220.0);
      yarn *= 0.88 + 0.22 * heather;
      yarn = mix(yarn, yarn.bgr, (noise(uv * 90.0 + 41.0) - 0.5) * 0.16);

      // --- Knit V structure: two legs per stitch ---
      // left leg runs from bottom-centre to top-left, right leg mirrors
      float lx = sf.x - 0.5;
      float leg_l = abs(lx + (1.0 - sf.y) * 0.42 + 0.21);
      float leg_r = abs(lx - (1.0 - sf.y) * 0.42 - 0.21);
      float leg = min(leg_l, leg_r);
      // rounded yarn profile
      float yarn_body = 1.0 - smoothstep(0.10, 0.30, leg);
      // shadow between stitches (column gutters and row gutters)
      float gutter = smoothstep(0.0, 0.12, sf.x) * smoothstep(1.0, 0.88, sf.x)
                   * smoothstep(0.0, 0.10, sf.y) * smoothstep(1.0, 0.90, sf.y);

      vec3 col = yarn * (0.55 + 0.45 * gutter);
      col = mix(col * 0.7, col * 1.12, yarn_body);
      // highlight along the top of each leg
      col += vec3(0.07) * (1.0 - smoothstep(0.0, 0.10, leg)) * sf.y;

      // Strand shadow: floats carried behind pull the fabric subtly per band
      col *= 0.96 + 0.04 * sin(band_row / band_period * 6.28318);

      // fuzz: stray fibres lighten random spots
      float fuzz = smoothstep(0.97, 1.0, noise(uv * 300.0 + 7.0));
      col = mix(col, col * 1.3 + 0.05, fuzz * 0.5);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_stitches',     name: 'Stitches Across', type: 'float', min: 12.0, max: 60.0, default: 28.0 },
    { id: 'u_ground_color', name: 'Ground Wool',     type: 'color', default: [0.85, 0.80, 0.70, 1.0] },
    { id: 'u_motif_color',  name: 'Motif Wool',      type: 'color', default: [0.45, 0.16, 0.14, 1.0] }
  ]
};

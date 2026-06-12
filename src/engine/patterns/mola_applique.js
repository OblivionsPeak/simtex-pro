export default {
  id: 'mola_applique',
  name: 'Mola Appliqué',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Guna mola reverse-appliqué: stacked cloth layers cut back into nested outline bands around a central motif, every band edge turned under and hemmed with tiny stitches.',
  shader: `
    // central motif distance field: rounded diamond with lobes (bird-belly blob)
    float motif_mla(vec2 p) {
      float a = atan(p.y, p.x);
      // lobed radius makes the organic mola silhouette
      float rr = 0.16 + 0.045 * cos(a * 3.0) + 0.025 * sin(a * 5.0 + 1.3);
      return length(p * vec2(1.0, 1.25)) - rr;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Cell grid of motifs, offset rows ---
      float reps = u_repeats;
      vec2 g = uv * reps;
      float row = floor(g.y);
      g.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;

      // hand-cut wobble: edges are scissor-cut, never perfect
      float wob = (noise(g * 9.0 + cell) - 0.5) * 0.035;
      float d = motif_mla(f) + wob;

      // --- Layer stack: nested outline bands from the cut-back layers ---
      // band index grows outward from the motif edge
      float bandw = 0.055;
      float bi = floor(max(d, 0.0) / bandw);
      float bf = fract(max(d, 0.0) / bandw);

      vec3 l_red    = u_top_color.rgb;            // top layer
      vec3 l_orange = vec3(0.90, 0.50, 0.08);
      vec3 l_black  = vec3(0.12, 0.08, 0.08);
      vec3 l_yellow = vec3(0.92, 0.78, 0.20);
      vec3 l_teal   = vec3(0.10, 0.42, 0.42);

      // inside the motif: solid accent with inner echo lines
      vec3 col;
      if (d < 0.0) {
        col = l_yellow;
        // inner echo slits follow the motif contour
        float echo = step(abs(fract(-d / 0.05) - 0.5), 0.16);
        col = mix(col, l_black, echo * step(0.04, -d));
        // centre eye
        col = mix(col, l_red, 1.0 - smoothstep(0.030, 0.05, length(f * vec2(1.0, 1.25))));
      } else {
        // cycle the cloth stack outward
        float which = mod(bi, 4.0);
        col = l_red;
        if (which < 1.0)      col = l_black;
        else if (which < 2.0) col = l_orange;
        else if (which < 3.0) col = l_teal;
        else                  col = l_red;
        // far field settles into the top cloth colour
        col = mix(col, l_red, smoothstep(5.5, 7.0, bi));
      }

      // --- Appliqué relief: each band edge is folded under and raised ---
      if (d >= 0.0) {
        // shadow tucked under the inner edge of each band
        float under = smoothstep(0.0, 0.18, bf);
        // highlight along the folded hem on the outer edge
        float hem = smoothstep(0.82, 0.97, bf) * (1.0 - smoothstep(0.97, 1.0, bf));
        col *= 0.74 + 0.26 * under;
        col += vec3(0.10) * hem;

        // --- Tiny hemming stitches along every band edge ---
        float along = atan(f.y, f.x) * 28.0 + bi * 1.7;
        float stitch = step(abs(fract(along) - 0.5), 0.13)
                     * (1.0 - smoothstep(0.02, 0.07, abs(bf - 0.92)));
        col = mix(col, col * 0.55, stitch * u_stitches);
      }

      // sawtooth filler strips between motifs (classic mola space-filler)
      float far = smoothstep(0.30, 0.40, d);
      float saw = step(abs(fract(f.x * 9.0) - 0.5) * 1.3 + abs(fract(f.y * 9.0 + 0.5) - 0.5), 0.30);
      col = mix(col, l_orange, far * saw * 0.85);

      // --- Cotton cloth texture ---
      float warp = sin(uv.x * 3.14159 * 260.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 260.0) * 0.5 + 0.5;
      col *= 0.94 + 0.03 * warp + 0.03 * weft;
      col *= 0.95 + 0.08 * fbm(uv * 4.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',   name: 'Motif Repeats',  type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_stitches',  name: 'Hem Stitches',   type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_top_color', name: 'Top Cloth',      type: 'color', default: [0.70, 0.12, 0.10, 1.0] }
  ]
};

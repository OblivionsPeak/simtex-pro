export default {
  id: 'southwest_blanket',
  name: 'Southwest Blanket',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Serape-style southwest blanket: stepped diamond bands in cream, red, black and turquoise wool, woven with coarse weft ribs, lanolin sheen and handspun slubs.',
  shader: `
    float tri_swb(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    // quantize a triangle wave into discrete weaving steps
    float steps_swb(float x, float n) {
      return floor(tri_swb(x) * n + 0.5) / n;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Palette ---
      vec3 cream = vec3(0.91, 0.86, 0.74);
      vec3 red   = u_main_color.rgb;
      vec3 black = vec3(0.12, 0.09, 0.08);
      vec3 turq  = vec3(0.16, 0.55, 0.55);

      // --- Band structure down the blanket ---
      float bands = u_bands;
      float by = uv.y * bands;
      float band_id = floor(by);
      float bv = fract(by);
      float kind = mod(band_id, 4.0);

      vec3 col = cream;

      if (kind < 1.0) {
        // stepped diamond band: big serape diamonds
        float dx = steps_swb(uv.x * 3.0, 6.0);          // stepped horizontal position
        float dia = abs(bv - 0.5) * 2.0 + abs(dx - 0.5) * 2.0;
        col = red;
        if (dia < 0.40) col = turq;
        else if (dia < 0.62) col = black;
        else if (dia < 0.85) col = cream;
      } else if (kind < 2.0) {
        // narrow stripe set
        float st = floor(bv * 7.0);
        col = (mod(st, 7.0) < 1.0 || mod(st, 7.0) > 5.0) ? black
            : (mod(st, 2.0) < 1.0 ? red : cream);
      } else if (kind < 3.0) {
        // zigzag lightning band
        float zz = steps_swb(uv.x * 6.0, 4.0);
        float line = abs(bv - mix(0.2, 0.8, zz));
        col = mix(cream, black, 1.0 - smoothstep(0.08, 0.14, line));
        col = mix(col, red, 1.0 - smoothstep(0.04, 0.08, line));
      } else {
        // solid ground with small stepped motifs
        col = red * 0.92;
        float mx = fract(uv.x * 8.0) - 0.5;
        float msk = step(abs(mx) * 2.0 + abs(bv - 0.5) * 2.0, 0.45);
        float stepped = step(abs(bv - 0.5), steps_swb(uv.x * 8.0, 3.0) * 0.4);
        col = mix(col, cream, msk * stepped);
      }

      // colour join ridge between bands (lazy lines)
      float join = smoothstep(0.0, 0.04, bv) * smoothstep(1.0, 0.96, bv);
      col *= 0.84 + 0.16 * join;

      // --- Coarse weft-faced weave ---
      float weft = sin(uv.y * 3.14159 * 170.0) * 0.5 + 0.5;
      float warp = sin(uv.x * 3.14159 * 60.0) * 0.5 + 0.5;
      col *= 0.85 + 0.13 * weft + 0.04 * warp;

      // handspun slubs: thick weft picks that read as bright streaks
      float slub_row = floor(uv.y * 170.0);
      float slub = smoothstep(0.93, 1.0, hash(vec2(slub_row, 5.7)))
                 * smoothstep(0.4, 0.9, noise(vec2(uv.x * 14.0, slub_row)));
      col = mix(col, col * 1.28 + 0.04, slub * 0.8);

      // wool heather + lanolin sheen
      col *= 0.92 + 0.12 * noise(uv * 150.0);
      col *= 0.95 + 0.09 * fbm(uv * 2.5);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_bands',      name: 'Band Count', type: 'float', min: 3.0, max: 12.0, default: 6.0 },
    { id: 'u_main_color', name: 'Main Wool',  type: 'color', default: [0.65, 0.16, 0.12, 1.0] }
  ]
};

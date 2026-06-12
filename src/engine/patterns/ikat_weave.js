export default {
  id: 'ikat_weave',
  name: 'Ikat Weave',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Resist-dyed ikat diamonds with the signature blurred, feathered edges — each warp thread carries its own slightly misaligned dye, over a visible warp-faced weave.',
  shader: `
    // Triangle wave 0..1, period 1 — keeps everything tileable
    float tri_ikw(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Warp threads: every vertical thread gets its own dye misregistration ---
      float warp_freq = 110.0;
      float col_id = floor(uv.x * warp_freq);
      float col_f  = fract(uv.x * warp_freq);

      // Per-thread vertical shift of the dye pattern = ikat feathering
      float jitter = (hash(vec2(col_id, 7.31)) - 0.5) * u_feather * 0.12;
      // Neighbouring threads bleed into each other a little
      float jitter_n = (hash(vec2(col_id + 1.0, 7.31)) - 0.5) * u_feather * 0.12;
      jitter = mix(jitter, jitter_n, smoothstep(0.7, 1.0, col_f) * 0.5);

      // --- Diamond resist-dye motif (periodic) ---
      vec2 p = vec2(uv.x, uv.y + jitter) * u_repeats;
      float dx = tri_ikw(p.x);
      float dy = tri_ikw(p.y);
      float dia = dx + dy; // 0 at cell centre, 2 at corners

      // Soft, bleeding band edges — wide smoothsteps emulate dye migration
      float bleed = 0.10 + u_feather * 0.18;
      float core   = 1.0 - smoothstep(0.45 - bleed, 0.45 + bleed, dia);
      float ring   = smoothstep(0.62 - bleed, 0.62 + bleed, dia)
                   - smoothstep(1.00 - bleed, 1.00 + bleed, dia);
      float outer  = smoothstep(1.35 - bleed, 1.35 + bleed, dia);

      // --- Cloth colors ---
      vec3 dye    = u_dye_color.rgb;
      vec3 ground = vec3(0.91, 0.86, 0.76);            // undyed cotton
      vec3 accent = dye * 0.35 + vec3(0.05, 0.03, 0.04); // deep over-dye

      vec3 col = ground;
      col = mix(col, dye, ring);
      col = mix(col, accent, outer);
      col = mix(col, dye * 1.15, core);

      // --- Weave structure: warp-faced ribs with weft shadow ---
      float warp_rib = sin(col_f * 3.14159);            // round thread profile
      float weft = tri_ikw(uv.y * 54.0);
      float weave_shade = 0.82 + 0.18 * warp_rib;
      weave_shade *= 0.93 + 0.07 * weft;
      col *= weave_shade;

      // Thread-level dye variation along each warp
      float thread_var = noise(vec2(col_id * 0.13, uv.y * 30.0));
      col *= 0.92 + 0.16 * thread_var;

      // Slubs: occasional thick spots in the handspun yarn
      float slub = smoothstep(0.965, 1.0, noise(vec2(uv.y * 90.0, col_id * 0.61)));
      col = mix(col, col * 1.22 + 0.04, slub * 0.7);

      // Gentle cloth-wide mottle
      col *= 0.96 + 0.08 * fbm(uv * 5.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',   name: 'Diamond Repeats', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_feather',   name: 'Edge Feathering', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_dye_color', name: 'Dye Color',       type: 'color', default: [0.55, 0.13, 0.18, 1.0] }
  ]
};

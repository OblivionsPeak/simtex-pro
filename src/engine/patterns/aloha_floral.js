export default {
  id: 'aloha_floral',
  name: 'Aloha Floral',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Vintage Hawaiian shirt print: faded hibiscus blooms and monstera leaves scattered over sun-washed rayon, with print misregistration and soft dye fade.',
  shader: `
    // 5-petal hibiscus mask in local cell space (p in roughly -0.5..0.5)
    float hibiscus_alh(vec2 p, float rot) {
      float c = cos(rot); float s = sin(rot);
      p = mat2(c, -s, s, c) * p;
      float a = atan(p.y, p.x);
      float r = length(p);
      float petal = 0.26 + 0.13 * cos(a * 5.0) + 0.02 * cos(a * 15.0);
      return 1.0 - smoothstep(petal - 0.04, petal + 0.02, r);
    }

    // monstera-ish leaf: ellipse with notched edge
    float leaf_alh(vec2 p, float rot) {
      float c = cos(rot); float s = sin(rot);
      p = mat2(c, -s, s, c) * p;
      float a = atan(p.y, p.x);
      float r = length(p * vec2(1.0, 1.9));
      float edge = 0.30 - 0.06 * abs(sin(a * 6.0));
      return 1.0 - smoothstep(edge - 0.03, edge + 0.02, r);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Sun-faded rayon ground ---
      vec3 ground = u_ground_color.rgb;
      float fade = fbm(uv * 2.0) * 0.5 + 0.5;
      vec3 col = ground * (0.88 + 0.16 * fade);
      // rayon drape sheen
      col *= 0.95 + 0.07 * sin((uv.x + uv.y * 0.3) * 6.28318 * 3.0 + fbm(uv * 4.0) * 3.0);

      // --- Scatter grid: flowers and leaves alternate, offset rows ---
      float reps = u_repeats;
      vec3 petal_col = u_flower_color.rgb;
      vec3 leaf_col  = vec3(0.18, 0.38, 0.26);
      vec3 cream     = vec3(0.94, 0.90, 0.80);

      // two layers for depth: big back leaves then front flowers
      for (int layer = 0; layer < 2; layer++) {
        float fl = float(layer);
        vec2 g = uv * reps * (1.0 + fl * 0.45) + vec2(fl * 0.33, fl * 0.61);
        float row = floor(g.y);
        g.x += mod(row, 2.0) * 0.5;
        vec2 cell = floor(g);
        vec2 f = fract(g) - 0.5;
        float h = hash(cell + fl * 17.0);
        // random per-cell rotation and slight position jitter
        float rot = h * 6.28318;
        f += (vec2(hash(cell + 3.1), hash(cell + 5.9)) - 0.5) * 0.18;

        if (fl < 0.5) {
          // back layer: leaves, slightly darker, like underprint
          float m = leaf_alh(f, rot);
          // central vein
          vec2 vp = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * f;
          float vein = (1.0 - smoothstep(0.008, 0.022, abs(vp.y))) * m;
          vec3 lc = leaf_col * (0.85 + 0.3 * h);
          col = mix(col, lc, m * 0.9);
          col = mix(col, lc * 1.35, vein);
        } else {
          // front layer: hibiscus with cream highlight and stamen
          float m = hibiscus_alh(f, rot);
          // vintage print misregistration: highlight plate is offset
          float hi = hibiscus_alh(f - vec2(0.025, 0.018), rot);
          vec3 pc = petal_col * (0.8 + 0.4 * h);
          col = mix(col, pc, m * 0.92);
          col = mix(col, mix(pc, cream, 0.55), clamp(hi - m, 0.0, 1.0) * 0.8);
          // petal shading toward centre + stamen dot
          float r = length(f);
          col = mix(col, pc * 0.6, m * (1.0 - smoothstep(0.0, 0.20, r)) * 0.7);
          col = mix(col, vec3(0.95, 0.85, 0.45), (1.0 - smoothstep(0.015, 0.045, r)) * m);
        }
      }

      // --- Rayon weave + wash wear ---
      float warp = sin(uv.x * 3.14159 * 300.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 300.0) * 0.5 + 0.5;
      col *= 0.95 + 0.025 * warp + 0.025 * weft;
      // sun-bleach blotches wash everything toward cream
      col = mix(col, cream, smoothstep(0.7, 1.0, fbm(uv * 1.7 + 23.0)) * 0.18);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',      name: 'Bloom Density', type: 'float', min: 2.0, max: 8.0, default: 3.0 },
    { id: 'u_flower_color', name: 'Flower Color',  type: 'color', default: [0.85, 0.30, 0.25, 1.0] },
    { id: 'u_ground_color', name: 'Shirt Color',   type: 'color', default: [0.16, 0.30, 0.42, 1.0] }
  ]
};

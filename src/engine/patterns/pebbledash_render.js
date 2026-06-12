export default {
  id: 'pebbledash_render',
  name: 'Pebbledash Render',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Pebbledashed facade — rounded beach pebbles thrown dense into wet render, each stone a lit dome with its own cast shadow, mortar showing in the gaps and bald patches where stones have shed.',
  shader: `
    float hash_pbd(vec2 p) {
      return fract(sin(dot(p, vec2(187.1, 297.7))) * 44087.5119);
    }
    vec2 hash2_pbd(vec2 p) {
      return vec2(hash_pbd(p), hash_pbd(p + 23.23));
    }

    // one jittered pebble layer: returns vec4(coverage, lightDot, colourSeed, shadow)
    vec4 layer_pbd(vec2 uv, float scale, float seed) {
      vec2 g = uv * scale;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;
      vec2 id = cell + seed;

      vec2 jit = (hash2_pbd(id) - 0.5) * 0.55;
      vec2 p = f - jit;
      // pebbles are slightly elliptical, randomly oriented
      float ea = hash_pbd(id + 7.0) * 3.14159265;
      float ce = cos(ea); float se = sin(ea);
      vec2 ep = mat2(ce, -se, se, ce) * p;
      ep.x *= 1.0 + hash_pbd(id + 13.0) * 0.5;

      float r = 0.26 + hash_pbd(id + 19.0) * 0.16;
      float d = length(ep);
      float cover = smoothstep(r, r * 0.86, d);

      // dome lighting: highlight offset toward the upper-left
      vec2 toLight = vec2(-0.45, 0.55);
      float lightDot = clamp(1.0 - length(ep - toLight * r * 0.7) / r, 0.0, 1.0);

      // cast shadow lobe to the lower-right of the stone
      float shadow = smoothstep(r * 1.45, r * 0.8, length(ep + toLight * -r * 0.45));

      return vec4(cover, lightDot, hash_pbd(id + 31.0), shadow);
    }

    vec4 generate() {
      vec2 uv = v_uv;
      float scale = floor(u_density + 0.5);

      // --- mortar bed underneath ---
      vec3 mortar = u_mortar_color.rgb;
      mortar *= 0.80 + noise(uv * scale * 7.0) * 0.30;       // sandy grain
      mortar *= 0.92 + (fbm(uv * 4.0) * 0.5 + 0.5) * 0.14;   // broad tonal drift
      // grime gathers in the deepest gaps
      mortar *= 0.88;

      vec3 col = mortar;

      // pebble palette: greys, tans, rust, the odd white quartz
      // three overlapping layers give the dense thrown packing
      for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float ls = scale * (1.0 + fi * 0.37);
        vec4 L = layer_pbd(uv, ls, fi * 91.7);

        float pick = L.z;
        vec3 stone = vec3(0.56, 0.54, 0.51);                  // grey
        if (pick < 0.22)      stone = vec3(0.64, 0.55, 0.42); // tan
        else if (pick < 0.38) stone = vec3(0.48, 0.34, 0.26); // rust-brown
        else if (pick < 0.50) stone = vec3(0.38, 0.39, 0.42); // blue-grey
        else if (pick < 0.58) stone = vec3(0.80, 0.78, 0.74); // white quartz

        // per-stone tonal spread and waterworn mottling
        stone *= 0.82 + fract(pick * 13.7) * 0.35;
        stone *= 0.93 + noise(uv * ls * 9.0 + fi * 7.0) * 0.13;

        // dome shading: dark rim rolling up to an offset highlight
        stone *= 0.55 + L.y * 0.75;
        stone += vec3(1.0) * smoothstep(0.72, 0.95, L.y) * 0.18; // waxy spec

        // stone's cast shadow darkens whatever is beneath it
        col *= 1.0 - L.w * (1.0 - L.x) * 0.16;
        // render lips up around each embedded stone — thin bright collar
        float collar = smoothstep(0.0, 0.5, L.x) * (1.0 - smoothstep(0.5, 1.0, L.x));
        col = mix(col, mortar * 1.18, collar * 0.35);

        col = mix(col, stone, L.x);
      }

      // --- bald patches: shed pebbles exposing smooth stained render ---
      float baldN = fbm(uv * 3.0 + 67.0) * 0.5 + 0.5;
      float bald = smoothstep(0.78, 0.92, baldN) * u_shedding;
      vec3 baldCol = u_mortar_color.rgb * (0.95 + noise(uv * 30.0) * 0.08);
      baldCol *= vec3(0.92, 0.90, 0.86);            // weather-stained smooth scar
      col = mix(col, baldCol, bald);

      // overall facade weathering: faint vertical rain tracks
      float track = noise(vec2(uv.x * 40.0, uv.y * 3.0));
      col *= 1.0 - smoothstep(0.6, 0.9, track) * 0.07;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density',      name: 'Pebble Density', type: 'float', min: 8.0, max: 36.0, default: 18.0 },
    { id: 'u_shedding',     name: 'Shed Patches',   type: 'float', min: 0.0, max: 1.0,  default: 0.3 },
    { id: 'u_mortar_color', name: 'Render',         type: 'color', default: [0.69, 0.65, 0.58, 1.0] }
  ]
};

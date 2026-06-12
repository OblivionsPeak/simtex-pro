export default {
  id: 'malachite_bands',
  name: 'Malachite Bands',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Polished malachite with concentric green botryoidal banding — nodule domes ringed by irregular light/dark bands with a silky polish sheen.',
  shader: `
    // --- helpers ---
    vec2 hash2_mb(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Nearest botryoidal nodule centre: returns (distance, cellHash)
    vec2 nodule_mb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float best = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_mb(i + g);
          vec2 r = g + o - f;
          float d = length(r);
          if (d < best) {
            best = d;
            id = fract(o.x * 17.31 + o.y * 7.77);
          }
        }
      }
      return vec2(best, id);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Botryoidal nodule field
      vec2 nd = nodule_mb(uv * u_nodule_scale);
      float d = nd.x;
      float id = nd.y;

      // Band irregularity: warp the radial distance with fbm so rings
      // wander and pinch like real malachite
      float warp = fbm(uv * u_nodule_scale * 1.7 + id * 13.0) * 0.22;
      float bd = d + warp;

      // Concentric bands, phase-shifted per nodule
      float band = fract(bd * u_band_density + id * 3.7);

      // Irregular band widths: two interleaved frequencies
      float fine = fract(bd * u_band_density * 3.0 + id * 9.1);
      float wide = smoothstep(0.08, 0.30, band) * smoothstep(0.92, 0.62, band);
      float thin = smoothstep(0.35, 0.5, fine) * smoothstep(0.75, 0.6, fine);

      // Malachite palette: near-black green -> mid emerald -> pale silk green
      vec3 deep = u_light_color.rgb * vec3(0.06, 0.26, 0.21);
      vec3 mid  = u_light_color.rgb * 0.55 + deep * 0.45;
      vec3 pale = u_light_color.rgb;

      vec3 col = mix(deep, mid, wide);
      col = mix(col, pale, thin * 0.65 * wide);

      // Per-nodule tonal variation
      col *= 0.85 + 0.3 * id;

      // Silky chatoyant polish sheen across each dome: highlight follows
      // the dome curvature (bright crescent offset toward the light)
      float dome = exp(-3.0 * d * d);
      float sheen = pow(clamp(1.0 - abs(d - 0.28), 0.0, 1.0), 6.0);
      col += vec3(0.55, 0.9, 0.7) * sheen * dome * u_polish * 0.35;

      // Fine fibrous radial silk inside bands
      float silk = noise(vec2(bd * 90.0, id * 40.0)) * 0.08 - 0.04;
      col += silk * wide;

      // Broad glossy reflection band across the whole slab
      float gloss = pow(clamp(1.0 - abs(uv.x + uv.y - 1.0) * 1.4, 0.0, 1.0), 3.0);
      col += gloss * 0.08 * u_polish;

      // Micro grain
      col += (hash(uv * 700.0) - 0.5) * 0.02;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_nodule_scale', name: 'Nodule Scale', type: 'float', min: 1.5, max: 12.0, default: 4.0 },
    { id: 'u_band_density', name: 'Band Density', type: 'float', min: 3.0, max: 30.0, default: 12.0 },
    { id: 'u_polish',       name: 'Polish Sheen', type: 'float', min: 0.0, max: 2.0,  default: 1.0 },
    { id: 'u_light_color',  name: 'Light Green',  type: 'color', default: [0.36, 0.78, 0.52, 1.0] }
  ]
};

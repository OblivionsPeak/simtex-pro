export default {
  id: 'geode_slice',
  name: 'Geode Slice',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Cross-section of a geode — wavy agate rim bands wrapping a sparkling crystal druzy cavity, set in dark host rock.',
  shader: `
    vec2 hash2_geo(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Druzy crystal field: faceted voronoi (F1 distance + cell hash)
    vec2 druzy_geo(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float best = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_geo(i + g);
          float d = length(g + o - f);
          if (d < best) { best = d; id = fract(o.x * 31.3 + o.y * 11.1); }
        }
      }
      return vec2(best, id);
    }

    vec4 generate() {
      vec2 uv = v_uv;
      vec2 c = uv - 0.5;
      float ang = atan(c.y, c.x);
      float r = length(c);

      // Irregular geode outline: radius warped by angular fbm so the rim
      // is lumpy like a real nodule (matched at the seam via cos/sin args)
      float lump = fbm(vec2(cos(ang), sin(ang)) * 2.2) * 0.09
                 + snoise(vec2(cos(ang * 3.0), sin(ang * 3.0)) * 1.5) * 0.03;
      float rr = r + lump;

      float cavity = u_cavity_size * 0.28;
      float rimOuter = 0.46;

      // --- Host rock (outside the geode) ---
      float rockN = fbm(uv * 8.0) * 0.5 + 0.5;
      vec3 rock = vec3(0.13, 0.11, 0.10) * (0.7 + rockN * 0.6);
      rock += (hash(uv * 500.0) - 0.5) * 0.04;

      // --- Agate rim bands ---
      float bandT = (rr - cavity) / max(rimOuter - cavity, 0.001);
      float wob = snoise(uv * 14.0) * 0.04;
      float band = fract((bandT + wob) * u_band_density);
      float bandId = floor((bandT + wob) * u_band_density);
      float bh = hash(vec2(bandId, 4.2));

      vec3 agateA = u_band_color.rgb;
      vec3 agateB = agateA * vec3(0.45, 0.42, 0.50);
      vec3 agateC = vec3(0.93, 0.90, 0.86); // chalcedony white

      float soft = smoothstep(0.0, 0.45, band) * smoothstep(1.0, 0.55, band);
      vec3 agate = mix(agateB, agateA, soft);
      // Occasional bright white band
      agate = mix(agate, agateC, step(0.72, bh) * soft);
      // Per-band tone + translucency depth
      agate *= 0.8 + bh * 0.35;
      agate += snoise(uv * 60.0) * 0.03;

      // --- Crystal druzy cavity ---
      vec2 dz = druzy_geo(uv * u_crystal_scale * 24.0);
      vec3 quartzBase = u_band_color.rgb * 0.35 + vec3(0.45, 0.45, 0.55);
      // Facet shading per crystal: each cell reflects at its own brightness
      float facet = 0.35 + 0.65 * fract(dz.y * 9.37);
      vec3 druzy = quartzBase * facet;
      // Sparkle: a few facets catch the light hard
      float sparkle = pow(fract(dz.y * 5.71), 24.0) * 2.0;
      druzy += vec3(1.0, 1.0, 0.95) * sparkle;
      // Crystal edges darken (facet junctions)
      druzy *= smoothstep(0.0, 0.12, dz.x) * 0.4 + 0.6;
      // Cavity deepens toward centre
      druzy *= 0.6 + 0.5 * smoothstep(0.0, cavity, rr);

      // --- Composite zones ---
      vec3 col = rock;
      float inGeode = smoothstep(rimOuter + 0.012, rimOuter - 0.012, rr);
      col = mix(col, agate, inGeode);
      float inCavity = smoothstep(cavity + 0.015, cavity - 0.015, rr);
      col = mix(col, druzy, inCavity);

      // Dark crust line at the geode skin
      float crust = exp(-pow((rr - rimOuter) * 60.0, 2.0));
      col = mix(col, vec3(0.06, 0.05, 0.05), crust * 0.8);

      // Polished-face gloss across the slice
      float gloss = pow(clamp(1.0 - abs(uv.x - uv.y) * 1.7, 0.0, 1.0), 4.0);
      col += gloss * 0.07 * inGeode;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cavity_size',   name: 'Cavity Size',    type: 'float', min: 0.2, max: 1.4,  default: 0.8 },
    { id: 'u_band_density',  name: 'Rim Bands',      type: 'float', min: 3.0, max: 24.0, default: 9.0 },
    { id: 'u_crystal_scale', name: 'Crystal Size',   type: 'float', min: 0.4, max: 3.0,  default: 1.0 },
    { id: 'u_band_color',    name: 'Agate Color',    type: 'color', default: [0.55, 0.35, 0.55, 1.0] }
  ]
};

export default {
  id: 'fluorite_zoning',
  name: 'Fluorite Zoning',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Translucent fluorite crystals with square growth zoning — nested purple and green color zones following cubic crystal faces.',
  shader: `
    vec2 hash2_flz(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Chebyshev voronoi: returns (F1, F2, cellHash) — square crystals
    vec3 cryst_flz(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float f1 = 8.0;
      float f2 = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_flz(i + g);
          vec2 r = g + o - f;
          float d = max(abs(r.x), abs(r.y));
          if (d < f1) { f2 = f1; f1 = d; id = fract(o.x * 43.1 + o.y * 19.7); }
          else if (d < f2) { f2 = d; }
        }
      }
      return vec3(f1, f2, id);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      vec3 v = cryst_flz(uv * u_crystal_scale);
      float d = v.x;       // chebyshev distance from crystal centre
      float edge = v.y - v.x;
      float id = v.z;

      // Growth zoning: concentric square bands tracking the crystal faces,
      // with slight growth-history jitter per zone
      float zone = d * u_zone_density + id * 6.0;
      float jitter = noise(vec2(floor(zone), id * 30.0)) * 0.4;
      float zt = fract(zone + jitter);
      float zoneId = floor(zone + jitter);
      float zh = hash(vec2(zoneId, id * 50.0));

      // Alternate purple / green zones; some zones nearly colorless
      vec3 purple = u_purple_color.rgb;
      vec3 green  = u_green_color.rgb;
      vec3 clear  = vec3(0.82, 0.86, 0.88);

      float pick = fract(zh * 3.0);
      vec3 zoneCol = pick < 0.45 ? purple : (pick < 0.85 ? green : clear);

      // Zone edges are sharp on one side, diffuse on the other
      float zoneEdge = smoothstep(0.0, 0.12, zt) * smoothstep(1.0, 0.75, zt);
      vec3 col = mix(zoneCol * 0.55, zoneCol, zoneEdge);

      // Translucency: light glows through the crystal, brighter mid-crystal
      float glow = 1.0 - smoothstep(0.0, 0.6, d);
      col *= 0.7 + glow * 0.55;

      // Internal cloudiness and color drift
      float cloud = fbm(uv * 10.0 + id * 8.0) * 0.5 + 0.5;
      col = mix(col, col.gbr * 0.9, cloud * 0.18);

      // Crystal boundaries: thin dark seams with a bright reflective lip
      float seam = smoothstep(0.05, 0.0, edge);
      col *= 1.0 - seam * 0.55;
      float lip = exp(-pow((edge - 0.05) * 60.0, 2.0));
      col += lip * 0.12;

      // Glassy sparkle: rare internal cleavage glints
      float glint = pow(hash(floor(uv * u_crystal_scale * 13.0) + id), 22.0);
      col += vec3(0.9, 0.95, 1.0) * glint * 0.7;

      // Vitreous polish sheen
      float gloss = pow(clamp(1.0 - abs(uv.x + uv.y - 0.9) * 1.5, 0.0, 1.0), 3.0);
      col += gloss * 0.09;

      col += (hash(uv * 700.0) - 0.5) * 0.015;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_crystal_scale', name: 'Crystal Scale', type: 'float', min: 1.5, max: 10.0, default: 3.5 },
    { id: 'u_zone_density',  name: 'Zone Density',  type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_purple_color',  name: 'Purple Zone',   type: 'color', default: [0.48, 0.22, 0.62, 1.0] },
    { id: 'u_green_color',   name: 'Green Zone',    type: 'color', default: [0.25, 0.65, 0.45, 1.0] }
  ]
};

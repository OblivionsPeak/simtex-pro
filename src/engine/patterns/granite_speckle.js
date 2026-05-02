export default {
  id: 'granite_speckle_natural',
  name: 'Granite Speckle',
  category: 'Natural',
  description: 'Classic grey granite with randomly scattered feldspar, quartz, biotite mica, and hornblende mineral grains.',
  shader: `
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash12(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Voronoi-style nearest-point distance + cell ID
    vec2 voronoi(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float minDist = 8.0;
      float cellID  = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2  neighbor = vec2(float(x), float(y));
          vec2  point    = vec2(hash21(i + neighbor), hash21(i + neighbor + vec2(53.1, 97.3)));
          float d        = length(f - neighbor - point);
          if (d < minDist) {
            minDist = d;
            cellID  = hash21(i + neighbor + vec2(7.3, 13.7));
          }
        }
      }
      return vec2(minDist, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 vor = voronoi(uv);
      float dist   = vor.x;
      float cellID = vor.y;

      // Assign mineral type by cell ID ranges
      // 0.00–0.45 → feldspar/quartz (light)
      // 0.45–0.75 → matrix grey
      // 0.75–0.88 → biotite mica (dark flake)
      // 0.88–1.00 → hornblende (black)

      float grainSize = 0.3 + hash12(cellID) * 0.25;  // vary grain radius
      float inGrain   = 1.0 - smoothstep(grainSize * 0.5, grainSize, dist);

      vec3 matrixCol = mix(u_light_mineral.rgb * 0.55, u_dark_mineral.rgb * 4.0, 0.35);

      vec3 mineralCol;
      if (cellID < 0.45) {
        // Feldspar / quartz — light, slight warm cream tint
        float warmShift = hash12(cellID + 0.1) * 0.08;
        mineralCol = u_light_mineral.rgb + vec3(warmShift, warmShift * 0.6, -warmShift * 0.3);
      } else if (cellID < 0.75) {
        // Mid-grey matrix quartz
        float g = 0.42 + hash12(cellID + 0.5) * 0.18;
        mineralCol = vec3(g);
      } else if (cellID < 0.88) {
        // Biotite mica — dark brownish black with slight sheen
        mineralCol = mix(u_dark_mineral.rgb, vec3(0.18, 0.14, 0.10), hash12(cellID + 0.9));
      } else {
        // Hornblende — near black
        mineralCol = u_dark_mineral.rgb;
      }

      vec3 col = mix(matrixCol, mineralCol, inGrain);

      // Fine background speckle noise for matrix texture
      float micro = hash21(v_uv * u_scale * 6.0) * 0.06 - 0.03;
      col += micro;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',         name: 'Grain Density',   type: 'float', min: 2.0,  max: 20.0, default: 8.0 },
    { id: 'u_light_mineral', name: 'Light Mineral',   type: 'color',                       default: [0.90, 0.88, 0.85, 1.0] },
    { id: 'u_dark_mineral',  name: 'Dark Mineral',    type: 'color',                       default: [0.08, 0.08, 0.09, 1.0] }
  ]
};

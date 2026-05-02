export default {
  id: 'amethyst_natural',
  name: 'Amethyst Crystal',
  category: 'Natural',
  description: 'Amethyst crystal cluster cross-section with elongated Voronoi cells, anisotropic face shading, and lavender-to-violet color range.',
  shader: `
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Elongated Voronoi — stretch UV in Y to make crystals columnar
    vec3 voronoiElong(vec2 uv) {
      // Stretch vertically: crystals are taller than wide
      vec2 suv = vec2(uv.x, uv.y * 0.45);
      vec2 i   = floor(suv);
      vec2 f   = fract(suv);
      float minD1 = 8.0; float minD2 = 8.0;
      float cellID = 0.0;
      vec2 minPt = vec2(0.0);
      for (int y = -1; y <= 2; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 n  = vec2(float(x), float(y));
          // Jitter point, tightly packed horizontally
          vec2 rnd = vec2(hash21(i + n), hash21(i + n + vec2(37.0, 71.0)));
          vec2 pt  = n + rnd * vec2(0.85, 0.92);
          float d  = length(f - pt);
          if (d < minD1) {
            minD2  = minD1;
            minD1  = d;
            cellID = hash21(i + n + 0.5);
            minPt  = pt;
          } else if (d < minD2) {
            minD2  = d;
          }
        }
      }
      return vec3(minD1, minD2, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec3 vor = voronoiElong(uv);

      float d1     = vor.x;
      float d2     = vor.y;
      float cellID = vor.z;

      // Crystal face: anisotropic shading — vary brightness with X position
      // within the cell (simulates light reflecting off a tilted face)
      float faceAngle = hash11(cellID) * 3.14159;
      // Directional light hitting at an angle across v_uv
      float lightDir  = cos(faceAngle) * v_uv.x + sin(faceAngle) * v_uv.y;
      float faceBright = 0.55 + 0.45 * (lightDir - floor(lightDir));

      // Depth-based color blend: deeper crystals are more saturated/dark
      float depth = hash11(cellID + 0.7);  // 0=shallow 1=deep
      vec3 crystalCol = mix(u_color_light.rgb, u_color_deep.rgb, depth);

      // Apply face brightness (anisotropic glint)
      crystalCol *= (0.7 + 0.3 * faceBright);

      // Internal facet line: second nearest distance creates face boundaries
      float facetEdge = d2 - d1;
      float edgeMask  = 1.0 - smoothstep(0.0, 0.04, facetEdge);
      crystalCol      = mix(crystalCol, u_color_deep.rgb * 0.3, edgeMask * 0.7);

      // Cell boundary — dark gap / matrix between crystals
      float boundary = 1.0 - smoothstep(0.02, 0.06, d1);
      vec3 matrixCol = u_color_deep.rgb * 0.15;
      vec3 col       = mix(crystalCol, matrixCol, boundary);

      // Top-end facet highlight: near v_uv.y == 0 the crystal tip catches light
      float tipGlow = (1.0 - v_uv.y) * hash11(cellID + 0.2) * 0.25;
      col += u_color_light.rgb * tipGlow * (1.0 - boundary);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',       name: 'Crystal Density',  type: 'float', min: 2.0, max: 12.0, default: 6.0 },
    { id: 'u_color_light', name: 'Pale Amethyst',    type: 'color',                      default: [0.78, 0.55, 0.90, 1.0] },
    { id: 'u_color_deep',  name: 'Deep Violet',      type: 'color',                      default: [0.32, 0.08, 0.55, 1.0] }
  ]
};

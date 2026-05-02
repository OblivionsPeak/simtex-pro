export default {
  id: 'bismuth_crystal_natural',
  name: 'Bismuth Crystal',
  category: 'Natural',
  description: 'Iridescent metallic bismuth hopper crystals with staircase terraced surfaces and rainbow oxide interference colors.',
  shader: `
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Hue to RGB
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    // Voronoi returning nearest distance and cell ID
    vec2 voronoi(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float minDist = 8.0;
      float cellID  = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 n  = vec2(float(x), float(y));
          vec2 pt = vec2(hash21(i + n), hash21(i + n + vec2(53.1, 97.3)));
          float d = length(f - n - pt);
          if (d < minDist) { minDist = d; cellID = hash21(i + n + 0.5); }
        }
      }
      return vec2(minDist, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Hopper staircase: quantise UV into stepped terraces
      // Each Voronoi cell is a crystal; within that cell use Manhattan-distance
      // concentric squares to create stair steps inward
      vec2 vor     = voronoi(uv);
      float cellID = vor.y;
      float dist   = vor.x;

      // Staircase terrace level — more steps toward cell interior
      float terraceFreq  = 6.0 + hash11(cellID) * 4.0;
      float terraceLevel = floor(dist * terraceFreq) / terraceFreq;

      // Tilt / rotation of the crystal (45-deg multiples for cubic bismuth)
      float crystalAngle = floor(hash11(cellID + 0.3) * 4.0) * 1.5708;
      // Rotate local UV for anisotropy
      vec2 localUV = uv - floor(uv + 0.5);  // approx cell-relative
      float cosA = cos(crystalAngle); float sinA = sin(crystalAngle);
      vec2 rotUV = vec2(localUV.x * cosA - localUV.y * sinA,
                        localUV.x * sinA + localUV.y * cosA);

      // Iridescence hue from terrace level + cell identity
      // Each terrace gets a different oxide hue: pink→gold→teal→violet
      float hueBase = cellID + terraceLevel * 1.3 * u_iridescence;
      vec3 iriCol   = hue2rgb(hueBase);

      // Metallic base mixed with iridescence (metallic base stronger in brighter terraces)
      float metalFactor = 0.35 + terraceLevel * 0.4;
      vec3  col         = mix(iriCol, u_metal_base.rgb, metalFactor);

      // Edge darkening between terraces (step shadow)
      float stepEdge = smoothstep(0.0, 0.06, fract(dist * terraceFreq));
      col *= (0.55 + 0.45 * stepEdge);

      // Cell boundary — dark gap between crystals
      float boundary = 1.0 - smoothstep(0.04, 0.10, dist);
      col = mix(col, u_metal_base.rgb * 0.08, boundary);

      // Anisotropic glint along rotated axis
      float glint = abs(sin(rotUV.x * 18.0)) * 0.12;
      col += glint * iriCol * (1.0 - metalFactor);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',        name: 'Crystal Scale',      type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_iridescence',  name: 'Iridescence',         type: 'float', min: 0.5, max: 2.0,  default: 1.4 },
    { id: 'u_metal_base',   name: 'Metal Base Color',    type: 'color',                      default: [0.68, 0.62, 0.58, 1.0] }
  ]
};

export default {
  id: 'neoprene',
  name: 'Neoprene',
  category: 'Industrial',
  description: 'Dense rubber neoprene with a characteristic small-cell foam surface texture and slightly glossy matte finish, as used in wetsuits and padding.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Worley nearest-cell distance for foam cells
    float worley(vec2 uv, float scale) {
      vec2 scaled = uv * scale;
      vec2 cell = floor(scaled);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 jitter = vec2(hash(nc + vec2(4.1, 2.7)), hash(nc + vec2(8.3, 5.1)));
          vec2 pt = nc + 0.5 + (jitter - 0.5) * 0.65;
          float d = length(scaled - pt);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Cell distance field — each cell is a foam bubble
      float cell = worley(uv, u_cell_size);

      // Cell walls are darker; cell centres are lighter (puffy/raised)
      // Invert: low distance = near wall = dark; high = centre = light
      float cellLight = smoothstep(0.0, 0.45, cell);

      // Subtle secondary micro-bump — smaller cells overlaid
      float micro = worley(uv, u_cell_size * 3.5) * 0.25;

      // Combined height map
      float height = cellLight * 0.75 + micro * 0.25;

      // Base colour modulated by height (puffy top catches more light)
      vec3 col = u_base_color.rgb * mix(0.55, 1.15, height);

      // Cell wall shadow — add slight blue-grey tint in valleys
      float wallShadow = (1.0 - cellLight) * 0.08;
      col -= vec3(wallShadow * 0.4, wallShadow * 0.4, wallShadow * 0.3);

      // Glossy sheen — specular highlight near the top of each bump
      // Approximate: bright where height is near peak
      float specMask = pow(max(0.0, cellLight - 0.6) / 0.4, 2.0);
      float sheen = specMask * u_sheen * 0.4;
      col += vec3(sheen * 0.9, sheen * 0.95, sheen);

      // Surface-level noise for slight material variation
      float surfVar = noise(uv * u_cell_size * 8.0) * 0.04 - 0.02;
      col += vec3(surfVar);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_cell_size',  name: 'Cell Size',   type: 'float', min: 5.0, max: 40.0, default: 18.0 },
    { id: 'u_base_color', name: 'Base Color',  type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_sheen',      name: 'Sheen',       type: 'float', min: 0.0, max: 1.0,  default: 0.3 }
  ]
};

export default {
  id: 'salt_crystal_natural',
  name: 'Salt Crystal',
  category: 'Natural',
  description: 'Cubic salt crystal formations of varying size seen from above, white and translucent on a dark substrate.',
  shader: `
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Rotate 2D point around origin by angle
    vec2 rot2(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Signed distance to axis-aligned square, centered at origin, half-size h
    float sdSquare(vec2 p, float h) {
      vec2 d = abs(p) - h;
      return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_density;
      vec2 cell = floor(uv);
      vec2 f    = fract(uv) - 0.5;

      // Check this cell and 8 neighbours so crystals from adjacent cells can overlap
      float minDist = 1e9;
      float crystalBright = 0.0;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc  = cell + vec2(float(dx), float(dy));
          vec2 rnd = vec2(hash21(nc), hash21(nc + vec2(37.3, 71.9)));

          // Crystal center jitter within cell (keep away from exact edge)
          vec2 center = vec2(float(dx), float(dy)) + rnd * 0.7 - 0.35;

          // Per-crystal random size (0.15–0.42 of cell)
          float sz = 0.15 + hash11(hash21(nc + 0.5)) * 0.27;

          // Slight random rotation (cubic symmetry — multiples of 15 deg)
          float angle = floor(rnd.y * 6.0) * 0.2618;   // 0..5 × 15°

          vec2 lp = rot2(f - center, angle);
          float d = sdSquare(lp, sz);

          if (d < minDist) {
            minDist = d;
            // Crystal face brightness — slight per-crystal variation
            crystalBright = 0.75 + hash21(nc + vec2(11.1, 23.3)) * 0.25;
          }
        }
      }

      // Inside crystal: minDist < 0
      float inside = 1.0 - smoothstep(-0.02, 0.01, minDist);

      // Edge highlight (raised rim light)
      float rim = smoothstep(0.05, 0.0, abs(minDist)) * 0.5;

      vec3 crystalCol = u_crystal_color.rgb * crystalBright + rim;

      // Dark gap between crystals
      vec3 col = mix(u_background.rgb, crystalCol, inside);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density',       name: 'Crystal Density',  type: 'float', min: 4.0,  max: 30.0, default: 14.0 },
    { id: 'u_crystal_color', name: 'Crystal Color',    type: 'color',                        default: [0.92, 0.93, 0.95, 1.0] },
    { id: 'u_background',    name: 'Background',       type: 'color',                        default: [0.08, 0.06, 0.08, 1.0] }
  ]
};

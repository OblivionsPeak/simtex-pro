export default {
  id: 'metal_flake',
  name: 'Metal Flake',
  category: 'Racing',
  description: 'Automotive metallic flake base coat with dense randomly oriented aluminium flakes sparkling in a tinted binder.',
  shader: `
    float hash1(float n) { return fract(sin(n) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv;

      // Scale UV for flake grid — u_flake_density maps to grid cells per unit
      vec2 flakeUV  = uv * u_flake_density * 0.04;
      vec2 flakeCell = floor(flakeUV);
      vec2 flakeLocal = fract(flakeUV);

      float flakeLight = 0.0;

      // Check 3x3 neighbourhood so flakes near cell borders are caught
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = flakeCell + vec2(float(dx), float(dy));
          // Pseudo-random position and orientation per flake
          float rx  = hash(nc + vec2(0.13, 0.45));
          float ry  = hash(nc + vec2(0.67, 0.23));
          float ang = hash(nc + vec2(0.91, 0.55)) * 6.28318;
          float sz  = 0.25 + hash(nc + vec2(0.22, 0.88)) * 0.3;

          // Flake is a small oriented rectangle — rotate local coord
          vec2 diff = flakeLocal - (vec2(float(dx), float(dy)) + vec2(rx, ry));
          float ca = cos(ang); float sa = sin(ang);
          vec2 rot = vec2(ca * diff.x - sa * diff.y,
                          sa * diff.x + ca * diff.y);
          // Rectangle SDF: flakes are thin slabs
          vec2 flakeHalf = vec2(sz, sz * 0.15);
          vec2 dBox = abs(rot) - flakeHalf;
          float boxDist = length(max(dBox, 0.0));
          // Bright if inside flake
          float inside = smoothstep(0.04, 0.0, boxDist);
          // Each flake has a unique reflectance based on random orientation vs. light
          float reflBias = hash(nc + vec2(1.3, 2.7));
          float brightness = pow(reflBias, 1.5) * u_flake_brightness;
          flakeLight = max(flakeLight, inside * brightness);
        }
      }

      // Binder base colour — u_base_color tinted slightly lighter for depth
      float bgVariation = noise(uv * 8.0) * 0.04;
      vec3 binder = u_base_color.rgb + vec3(bgVariation);

      // Flake colour: pure silver-white
      vec3 flakeColor = vec3(0.95, 0.95, 0.97);

      vec3 col = mix(binder, flakeColor, flakeLight * 0.9);

      // Subtle slow-varying shimmer across the whole surface (viewing angle variation)
      float shimmer = noise(uv * 2.5 + 1.5708) * 0.06;
      col += u_base_color.rgb * shimmer;

      col = clamp(col, 0.0, 1.0);
      if (u_is_spec > 0.5) {
        // Metallic binder with bright aluminium flake glints; flakes slightly varied via shimmer
        float metallic = mix(0.45, 1.0, flakeLight);
        float roughness = clamp(mix(0.25, 0.08, flakeLight) + shimmer, 0.05, 0.3);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_base_color',       name: 'Base Color',       type: 'color', default: [0.08, 0.15, 0.35, 1.0] },
    { id: 'u_flake_density',    name: 'Flake Density',    type: 'float', min: 200.0, max: 2000.0, default: 800.0 },
    { id: 'u_flake_brightness', name: 'Flake Brightness', type: 'float', min: 0.3,   max: 1.5,    default: 1.0   }
  ]
};

export default {
  id: 'cast_iron',
  name: 'Cast Iron',
  category: 'Industrial',
  description: 'Raw cast iron with a coarse sand-mold grain, dark matte grey surface, and occasional small porosity dimples from casting.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0; a *= 0.5;
      }
      return v;
    }

    // Porosity dimple field — Worley-based sparse pits
    float porosity(vec2 uv, float scale) {
      vec2 scaled = uv * scale * 0.4;
      vec2 cell = floor(scaled);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          // Sparse: only create a pit where hash is above threshold
          float exists = step(0.78, hash(nc + vec2(3.7, 8.2)));
          vec2 jitter = vec2(hash(nc + vec2(1.1, 6.3)), hash(nc + vec2(9.4, 2.1)));
          vec2 pt = nc + 0.5 + (jitter - 0.5) * 0.7;
          float d = length(scaled - pt);
          // Only count this cell's pit if it exists
          d = mix(1.0, d, exists);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Coarse sand-mold grain — multi-scale fbm
      float coarseGrain = fbm(uv * u_grain * 1.2);
      float fineGrain   = fbm(uv * u_grain * 4.5 + vec2(5.7, 2.3));
      float grain = coarseGrain * 0.65 + fineGrain * 0.35;

      // Surface roughness modulates lightness — cast iron is dark
      float roughMod = mix(1.0 - u_roughness * 0.25, 1.0 + u_roughness * 0.12, grain);
      vec3 col = u_base_color.rgb * roughMod;

      // Occasional graphite flakes — slight lighter flecks (cast iron microstructure)
      float flake = step(0.82, noise(uv * u_grain * 8.0)) * 0.06;
      col += vec3(flake);

      // Porosity dimples — small dark circular depressions
      float pit = porosity(uv, u_grain);
      float pitMask = smoothstep(0.12, 0.04, pit);
      // Inside a pit it's darker and slightly concave (shadow at bottom)
      col = mix(col, u_base_color.rgb * 0.45, pitMask * u_roughness * 0.8);

      // Very slight surface oxidation — faint reddish-grey on high points
      float oxideTint = max(0.0, grain - 0.55) * 0.08;
      col += vec3(oxideTint * 0.4, oxideTint * 0.2, oxideTint * 0.1);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_grain',      name: 'Grain',      type: 'float', min: 5.0,  max: 50.0, default: 22.0 },
    { id: 'u_base_color', name: 'Iron Color', type: 'color', default: [0.28, 0.27, 0.26, 1.0] },
    { id: 'u_roughness',  name: 'Roughness',  type: 'float', min: 0.3,  max: 2.0,  default: 1.0 }
  ]
};

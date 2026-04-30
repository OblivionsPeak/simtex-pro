export default {
  id: 'woven_fiberglass',
  name: 'Woven Fiberglass',
  category: 'Industrial',
  description: 'E-glass plain-weave fiberglass cloth with cream tow bundles, glass-sheen highlights, and amber resin pockets.',
  shader: `
    // Smooth Hermite profile for a tow cross-section.
    // Returns 1.0 at the crown (phase == 0) and 0.0 at the flanks.
    float towProfile(float phase) {
      float c = cos(phase * 3.14159265);
      return clamp(c * 0.5 + 0.5, 0.0, 1.0);
    }

    // High-freq hash for fine fiber surface noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_weave_scale;

      // ---- Warp tows (running along Y, repeat in X) ----
      float warpPhase = fract(uv.x);           // 0-1 across each warp tow column
      float warpHeight = towProfile(warpPhase * 2.0 - 1.0); // crown at x=0.5

      // Over-under interlace: warp tow rises and sinks based on weft grid cell parity
      float weftCell = floor(uv.y);
      float warpInterlace = mod(weftCell, 2.0) < 1.0 ? 1.0 : 0.0;
      // Height of warp tow above surface: high when warpInterlace=1
      float warpZ = warpHeight * mix(0.3, 1.0, warpInterlace);

      // ---- Weft tows (running along X, repeat in Y) ----
      float weftPhase = fract(uv.y);
      float weftHeight = towProfile(weftPhase * 2.0 - 1.0);

      float warpCell = floor(uv.x);
      float weftInterlace = mod(warpCell, 2.0) < 1.0 ? 0.0 : 1.0;
      float weftZ = weftHeight * mix(0.3, 1.0, weftInterlace);

      // ---- Determine which tow is on top ----
      // Whichever tow has higher Z wins the pixel; blend gently near crossover
      float zDiff = warpZ - weftZ;
      float blend = smoothstep(-0.15, 0.15, zDiff); // 1 = warp on top, 0 = weft on top
      float topZ   = mix(weftZ, warpZ, blend);

      // ---- Specular highlight on tow crown ----
      // Crown of the top tow catches light
      float spec = pow(clamp(topZ, 0.0, 1.0), 3.0) * u_sheen;

      // ---- Fine fiber surface noise ----
      float fiberNoise = noise(uv * 6.0) * 0.04 - 0.02;

      // ---- Resin pocket brightness ----
      // Where both tows are low (intersection valleys), resin is visible
      float resinMask = (1.0 - clamp(warpZ + weftZ, 0.0, 1.0));
      resinMask = pow(resinMask, 3.0);

      // ---- Compose colors ----
      vec3 fiberCol = u_fiber_color.rgb + fiberNoise;
      vec3 col = mix(fiberCol, u_resin_color.rgb, resinMask * 0.7);

      // Add glass-sheen specular highlight (white-ish)
      col += vec3(spec * 0.55, spec * 0.55, spec * 0.58);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_fiber_color.a * u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_weave_scale', name: 'Weave Scale',      type: 'float', min: 2.0, max: 30.0, default: 12.0 },
    { id: 'u_fiber_color', name: 'Fiber Color',      type: 'color', default: [0.88, 0.88, 0.84, 1.0] },
    { id: 'u_resin_color', name: 'Resin Color',      type: 'color', default: [0.55, 0.52, 0.47, 1.0] },
    { id: 'u_sheen',       name: 'Glass Specularity', type: 'float', min: 0.0, max: 2.0,  default: 1.0 }
  ]
};

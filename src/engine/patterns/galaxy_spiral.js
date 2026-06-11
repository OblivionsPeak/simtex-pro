export default {
  id: 'galaxy_spiral',
  name: 'Galaxy Spiral',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A grand-design spiral galaxy with logarithmic arms laced by dark dust lanes, a blazing golden core, and thousands of pinpoint stars.',
  shader: `
    // 2D rotation helper (unique suffix to avoid prelude collisions)
    vec2 rot_gsp(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    }

    // Star speckle layer: sparse bright points on a jittered grid
    float stars_gsp(vec2 uv, float density, float threshold) {
      vec2 g = floor(uv * density);
      vec2 f = fract(uv * density);
      float h = hash(g);
      vec2 starPos = vec2(hash(g + 17.3), hash(g + 41.7));
      float d = length(f - starPos);
      float bright = smoothstep(threshold, 1.0, h);
      return bright * smoothstep(0.12, 0.0, d);
    }

    vec4 generate() {
      // Centre the galaxy in each tile so the texture repeats gracefully
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      // --- Logarithmic spiral coordinate ---
      // phase winds with log(r): classic grand-design arm geometry
      float windTight = u_arm_wind;
      float spiralPhase = theta - log(max(r, 0.015)) * windTight;
      // u_arm_count arms around the circle
      float armWave = cos(spiralPhase * u_arm_count);

      // Arm intensity: sharpen the cosine into bright arms
      float arm = pow(max(armWave * 0.5 + 0.5, 0.0), 2.2);

      // --- Turbulent arm structure ---
      // Domain-warp the arms with fbm so they break into clumpy star clouds
      vec2 warpUv = rot_gsp(uv, log(max(r, 0.015)) * windTight);
      float cloud = fbm(warpUv * 9.0 + 31.0) * 0.5 + 0.5;
      float armClumps = arm * (0.55 + 0.45 * cloud);

      // --- Dust lanes ---
      // Narrow dark filaments riding the inner edge of each arm
      float dustWave = cos(spiralPhase * u_arm_count + 0.85);
      float dust = pow(max(dustWave * 0.5 + 0.5, 0.0), 6.0);
      float dustNoise = fbm(warpUv * 14.0 + 77.0) * 0.5 + 0.5;
      dust *= smoothstep(0.12, 0.35, r) * smoothstep(1.05, 0.55, r) * (0.4 + 0.6 * dustNoise);

      // --- Radial disc falloff ---
      float disc = exp(-r * r * 2.4);
      float halo = exp(-r * 1.6) * 0.25;

      // --- Core bulge ---
      float core = exp(-r * r * 55.0) * 2.2 + exp(-r * r * 9.0) * 0.7;

      // --- Palette ---
      vec3 deepSpace = vec3(0.012, 0.014, 0.030);
      vec3 armBlue   = vec3(0.42, 0.55, 0.95);   // young hot stars in arms
      vec3 discTint  = u_disc_color.rgb;          // mid-disc population
      vec3 coreGold  = u_core_color.rgb;          // old yellow core
      vec3 dustBrown = vec3(0.085, 0.055, 0.045);

      vec3 col = deepSpace;
      // Diffuse disc glow
      col += discTint * (disc * 0.55 + halo);
      // Spiral arms: blue-white star clouds weighted by disc falloff
      col += armBlue * armClumps * disc * 1.35;
      // HII region sparkle: pink knots along the arms
      float knots = smoothstep(0.78, 0.95, cloud) * arm * disc;
      col += vec3(0.95, 0.45, 0.55) * knots * 0.5;
      // Dust lanes absorb light
      col = mix(col, dustBrown, clamp(dust * 0.85, 0.0, 0.9));
      // Core blooms over everything, warming toward the centre
      col += coreGold * core;
      col = mix(col, vec3(1.0, 0.97, 0.88), clamp(core - 1.1, 0.0, 1.0));

      // --- Star speckle: two depths of field ---
      float sBack  = stars_gsp(v_uv + 3.7, 90.0, 0.94);
      float sFront = stars_gsp(v_uv + 9.1, 45.0, 0.965);
      col += vec3(0.85, 0.88, 1.0) * sBack * 0.7;
      col += vec3(1.0, 0.96, 0.90) * sFront;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_arm_count',  name: 'Spiral Arms',    type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_arm_wind',   name: 'Arm Tightness',  type: 'float', min: 1.5, max: 7.0, default: 3.6 },
    { id: 'u_core_color', name: 'Core Glow',      type: 'color', default: [1.0, 0.82, 0.55, 1.0] },
    { id: 'u_disc_color', name: 'Disc Tint',      type: 'color', default: [0.30, 0.34, 0.55, 1.0] }
  ]
};

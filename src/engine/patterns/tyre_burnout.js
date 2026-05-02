export default {
  id: 'tyre_burnout',
  name: 'Tyre Burnout',
  category: 'Racing',
  description: 'Dark rubber burnout and skid marks on asphalt with irregular fuzzy edges, lighter internal streaks, and visible tyre tread impressions.',
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
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.2; a *= 0.5;
      }
      return v;
    }

    // Tread imprint — parallel lateral bars (simulate tread blocks)
    float treadPattern(vec2 uv, float width) {
      // Tread bars run across the track width (X), repeat in Y
      float bar = fract(uv.y * 18.0);
      bar = step(0.3, bar) * step(bar, 0.7); // alternating blocks
      // Only show tread within the track band
      float xDist = abs(uv.x - 0.5) / (width * 0.5);
      float inTrack = smoothstep(1.0, 0.85, xDist);
      return bar * inTrack * 0.6;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Track envelope along X ---
      // Lateral distance from track centre, normalised
      float xDist = abs(uv.x - 0.5) / (u_width * 0.5);

      // Fuzzy track edge — warp xDist with low-freq noise
      float edgeWarp = fbm(vec2(uv.y * 3.0, uv.x * 1.5)) * 0.25 - 0.125;
      float warpedX = xDist + edgeWarp;

      // Core track mask — dark rubber is densest in the middle
      float trackCore = smoothstep(1.0, 0.4, warpedX);

      // Outer fringe — lighter smear at the edge
      float fringe = smoothstep(1.3, 0.9, warpedX) - trackCore;
      fringe = max(fringe, 0.0);

      // --- Longitudinal variation (acceleration / partial grip) ---
      float longVar = fbm(vec2(uv.x * 4.0, uv.y * 6.0));
      // Patches of lighter rubber (partial grip: partial deposit)
      float partialGrip = smoothstep(0.45, 0.65, longVar);

      // Tread imprint within track
      float tread = treadPattern(uv, u_width);
      // Only show where trackCore is present
      tread *= trackCore * 0.7;

      // --- Combine rubber deposit ---
      float rubberDeposit = trackCore * mix(0.5, 1.0, partialGrip) * u_intensity;
      rubberDeposit = clamp(rubberDeposit, 0.0, 1.0);

      // Asphalt base
      vec3 col = u_asphalt.rgb;
      // Add surface noise to asphalt
      float aspNoise = noise(uv * 120.0) * 0.05 - 0.025;
      col += vec3(aspNoise);

      // Fringe — partially deposited rubber, lighter mix
      vec3 fringeColor = mix(u_asphalt.rgb, u_rubber_color.rgb, 0.5);
      col = mix(col, fringeColor, fringe * u_intensity * 0.6);

      // Core rubber
      col = mix(col, u_rubber_color.rgb, rubberDeposit);

      // Partial grip lighter streaks (less rubber on lighter areas)
      float streakLight = (1.0 - partialGrip) * trackCore * 0.4 * u_intensity;
      col = mix(col, u_asphalt.rgb * 1.15, streakLight);

      // Tread imprint — very slightly lighter within deposit
      col += vec3(tread * 0.06);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_asphalt',      name: 'Asphalt',       type: 'color', default: [0.18, 0.17, 0.16, 1.0] },
    { id: 'u_rubber_color', name: 'Rubber',         type: 'color', default: [0.04, 0.03, 0.03, 1.0] },
    { id: 'u_intensity',    name: 'Intensity',      type: 'float', min: 0.2, max: 2.0, default: 1.0 },
    { id: 'u_width',        name: 'Track Width',    type: 'float', min: 0.05, max: 0.5, default: 0.25 }
  ]
};

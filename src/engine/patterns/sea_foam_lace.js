export default {
  id: 'sea_foam_lace',
  name: 'Sea Foam Lace',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Frothy white lacework left by a receding wave — bubble webs, pinholes and torn foam edges over wet green glass.',
  shader: `
    // Lace filament field: bright threads where noise crosses zero, two scales
    float lace_sfl(vec2 p, float seed) {
      float a = 1.0 - abs(snoise(p + seed));
      float b = 1.0 - abs(snoise(p * 2.13 + seed * 1.7 + 9.0));
      return max(pow(a, 6.0), pow(b, 8.0) * 0.8);
    }

    // Bubble-hole field: dark pinpricks punched out of the foam
    float holes_sfl(vec2 uv, float scale) {
      vec2 g = uv * scale;
      vec2 id = floor(g);
      vec2 f = fract(g) - 0.5;
      vec2 jit = vec2(hash(id + 4.4), hash(id + 8.8)) - 0.5;
      float r = 0.10 + 0.22 * hash(id);
      float d = length(f - jit * 0.6);
      return smoothstep(r, r * 0.55, d);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- wet sea surface beneath the foam ---
      vec3 sea = u_sea_color.rgb;
      float swell = fbm(uv * 3.5) * 0.5 + 0.5;
      vec3 col = mix(sea * 0.6, sea * 1.3, swell);
      // glassy highlight streaks on the wet surface
      float streak = pow(1.0 - abs(snoise(uv * vec2(4.0, 9.0) + 33.0)), 5.0);
      col += vec3(0.10, 0.16, 0.16) * streak;

      // --- foam coverage mask: torn patches, not uniform ---
      float patch = fbm(uv * 2.6 + 12.0) * 0.5 + 0.5;
      float coverage = smoothstep(1.0 - u_coverage, 1.0 - u_coverage + 0.35, patch);

      // --- lace network inside covered areas ---
      float web = lace_sfl(uv * u_scale, 3.0);
      web += lace_sfl(uv * u_scale * 2.4 + 7.0, 11.0) * 0.55;     // finer web
      // dense foam core where patches are thickest
      float core = smoothstep(0.75, 0.95, patch);
      float foam = clamp(web * coverage + core * 0.9, 0.0, 1.0);

      // punch bubble holes through the dense foam
      float hole = holes_sfl(uv, u_scale * 5.0) * core;
      hole = max(hole, holes_sfl(uv + 5.0, u_scale * 11.0) * core * 0.7);
      foam *= 1.0 - hole * 0.85;

      // --- composite: foam whites with cool shadowed underside ---
      vec3 foam_lo = u_foam_color.rgb * 0.62 + sea * 0.15;  // foam in shadow
      vec3 foam_hi = u_foam_color.rgb;
      vec3 foam_col = mix(foam_lo, foam_hi, web);
      col = mix(col, foam_col, foam);

      // bright sparkle where lace threads cross in sunlight
      col += vec3(1.0) * smoothstep(0.85, 1.0, web) * coverage * 0.35;

      // residual bubble scatter outside the patches
      float stray = holes_sfl(uv + 9.3, u_scale * 8.0) * (1.0 - coverage);
      col = mix(col, foam_hi * 0.9, stray * 0.30);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',      name: 'Lace Scale',    type: 'float', min: 2.0, max: 14.0, default: 6.0 },
    { id: 'u_coverage',   name: 'Foam Coverage', type: 'float', min: 0.1, max: 1.0,  default: 0.55 },
    { id: 'u_foam_color', name: 'Foam Color',    type: 'color', default: [0.96, 0.98, 0.97, 1.0] },
    { id: 'u_sea_color',  name: 'Sea Color',     type: 'color', default: [0.05, 0.30, 0.28, 1.0] }
  ]
};

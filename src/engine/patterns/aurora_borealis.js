export default {
  id: 'aurora_borealis',
  name: 'Aurora Borealis',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Shimmering polar light curtains rippling in folded ribbons of green and violet over a star-pricked arctic night.',
  shader: `
    // Single curtain ribbon: a folded vertical sheet of light
    float curtain_abr(vec2 uv, float seed, float foldFreq) {
      // Horizontal fold path of the curtain, warped by layered noise
      float fold = snoise(vec2(uv.x * foldFreq + seed, seed * 3.1)) * 0.22
                 + snoise(vec2(uv.x * foldFreq * 2.7 + seed * 1.7, seed)) * 0.09
                 + snoise(vec2(uv.x * foldFreq * 6.1, seed * 5.3)) * 0.035;
      float center = 0.5 + fold;
      float d = uv.y - center;
      // Curtains glow brightest at the lower edge and fade upward
      float lower = smoothstep(0.02, -0.015, d);
      float body  = exp(-max(d, 0.0) * 5.5) * step(0.0, d) * 0.0
                  + exp(-abs(d) * (d > 0.0 ? 3.2 : 18.0));
      return body * (0.55 + 0.45 * lower);
    }

    float stars_abr(vec2 uv) {
      vec2 g = floor(uv * 70.0);
      vec2 f = fract(uv * 70.0);
      vec2 p = vec2(hash(g + 5.1), hash(g + 23.7));
      float tw = smoothstep(0.955, 1.0, hash(g));
      return tw * smoothstep(0.10, 0.0, length(f - p));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Night sky gradient ---
      vec3 skyTop = vec3(0.010, 0.014, 0.045);
      vec3 skyBot = vec3(0.030, 0.045, 0.085);
      vec3 col = mix(skyBot, skyTop, uv.y);

      // --- Three overlapping curtains at different depths ---
      // fract on x keeps the fold path periodic-ish across tiles
      vec2 cuv = vec2(fract(uv.x), uv.y);
      float c1 = curtain_abr(vec2(cuv.x, cuv.y - 0.08), 2.3, u_ripple);
      float c2 = curtain_abr(cuv, 7.9, u_ripple * 1.6);
      float c3 = curtain_abr(vec2(cuv.x, cuv.y + 0.13), 13.4, u_ripple * 0.8);

      // --- Vertical ray striations inside the curtains ---
      float rays = 0.65 + 0.35 * snoise(vec2(uv.x * 60.0 + fbm(uv * 3.0) * 4.0, 0.5));
      float raysFine = 0.8 + 0.2 * snoise(vec2(uv.x * 140.0, 1.7));

      // --- Colour: green base shading to violet at the top edge ---
      vec3 green  = u_aurora_color.rgb;
      vec3 violet = u_fringe_color.rgb;
      float altitude = smoothstep(0.35, 0.85, uv.y);

      vec3 aurora = vec3(0.0);
      aurora += mix(green, violet, altitude) * c2 * 1.15;
      aurora += mix(green * 0.8, violet, altitude + 0.15) * c1 * 0.7;
      aurora += mix(green * 0.55, violet * 0.8, altitude) * c3 * 0.45;
      aurora *= rays * raysFine * u_intensity;

      // Faint red crown at very high altitude (oxygen line)
      float crown = c2 * smoothstep(0.6, 0.95, uv.y);
      aurora += vec3(0.55, 0.10, 0.18) * crown * 0.35 * u_intensity;

      col += aurora;

      // --- Stars showing through the dimmer sky ---
      float starMask = 1.0 - clamp((c1 + c2 + c3) * 0.8, 0.0, 1.0);
      col += vec3(0.85, 0.9, 1.0) * stars_abr(uv) * starMask;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_ripple',       name: 'Curtain Ripple', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_intensity',    name: 'Glow Intensity', type: 'float', min: 0.3, max: 2.5, default: 1.2 },
    { id: 'u_aurora_color', name: 'Aurora Green',   type: 'color', default: [0.10, 0.95, 0.45, 1.0] },
    { id: 'u_fringe_color', name: 'Upper Fringe',   type: 'color', default: [0.55, 0.20, 0.85, 1.0] }
  ]
};

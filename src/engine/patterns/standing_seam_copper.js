export default {
  id: 'standing_seam_copper',
  name: 'Standing Seam Copper',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Verdigris copper roof — vertical pans between raised double-lock seams, the patina mottled from mint-green bloom to surviving brown metal, runoff streaking down each pan and oil-canning waves in the sheet.',
  shader: `
    float hash_ssc(vec2 p) {
      return fract(sin(dot(p, vec2(311.3, 149.7))) * 42667.1937);
    }

    vec4 generate() {
      float pans = floor(u_pans + 0.5);
      vec2 uv = v_uv;

      float px = uv.x * pans;
      float pan = mod(floor(px), pans);
      float t = fract(px);                      // across one pan
      float seamD = min(t, 1.0 - t);            // distance to nearest seam

      float seamW = 0.045;

      // --- patina state ---
      vec3 verdigris = u_patina_color.rgb;
      vec3 copper    = vec3(0.36, 0.22, 0.15);  // weathered brown metal
      vec3 verdiLight = verdigris * vec3(1.20, 1.18, 1.10);
      vec3 verdiDeep  = verdigris * vec3(0.55, 0.70, 0.68);

      // mottle: where the green bloom has taken vs. bare brown
      float m1 = fbm(uv * vec2(4.0, 6.0) + pan * 0.7) * 0.5 + 0.5;
      float m2 = noise(uv * vec2(18.0, 30.0) + pan * 3.0);
      float bloom = smoothstep(0.5 - u_patina_age * 0.45, 0.7 - u_patina_age * 0.3, m1 + m2 * 0.25);

      vec3 green = mix(verdiDeep, verdigris, m2);
      green = mix(green, verdiLight, smoothstep(0.6, 0.9, m1) * 0.5);
      // chalky pale crust on the most exposed bloom
      green = mix(green, verdiLight * 1.12, smoothstep(0.82, 0.95, m2) * 0.4);

      vec3 col = mix(copper * (0.8 + m2 * 0.5), green, bloom);

      // --- runoff streaks down each pan ---
      float streak = noise(vec2(uv.x * pans * 22.0, uv.y * 2.5 + pan * 5.0));
      float streakMask = smoothstep(0.35, 0.75, streak);
      // streaks deepen toward the bottom of the texture (eave end)
      col = mix(col, verdiDeep * 0.85, streakMask * uv.y * 0.35);
      // bright wash lines where rain keeps the patina rinsed
      col = mix(col, verdiLight, smoothstep(0.8, 0.95, streak) * 0.18);

      // --- oil-canning: gentle waves across the sheet between seams ---
      float wave = sin(t * 9.42477) * snoise(vec2(pan * 3.1, uv.y * 5.0));
      col *= 1.0 + wave * 0.05;

      // pan centre slightly bowed: broad soft shading
      col *= 0.94 + sin(t * 3.14159265) * 0.07;

      // --- horizontal cross-seams: pans joined in staggered lengths ---
      float runs = 3.0;
      float ry = fract(uv.y * runs + hash_ssc(vec2(pan, 7.0)) * 0.5);
      float cseam = min(ry, 1.0 - ry);
      float cl = smoothstep(0.015, 0.004, cseam);
      col *= 1.0 - cl * 0.30;
      col += verdiLight * smoothstep(0.025, 0.015, cseam) * (1.0 - cl) * 0.10;

      // --- the standing seam itself ---
      // raised double-lock rib: shadow either side, lit crown, drip stain below
      float rib = smoothstep(seamW, seamW * 0.35, seamD);
      float ribCrown = smoothstep(seamW * 0.35, 0.0, seamD);
      // shadow trough where the pan turns up into the seam
      float trough = smoothstep(seamW * 2.2, seamW, seamD)
                   * smoothstep(seamW * 0.5, seamW, seamD);
      col *= 1.0 - trough * 0.28;
      // seam face: more weathered than the pan — water sits in the lock
      vec3 seamCol = mix(col, verdiDeep, 0.45);
      // crown catches the sky along its left edge
      seamCol = mix(seamCol, verdiLight * 1.15, ribCrown * smoothstep(0.5, 0.35, t) * 0.7);
      seamCol = mix(seamCol, seamCol * 0.6, ribCrown * smoothstep(0.5, 0.65, t) * 0.6);
      col = mix(col, seamCol, rib);

      // per-pan batch tone: sheets patinate unevenly
      col *= 0.95 + hash_ssc(vec2(pan, 1.0)) * 0.09;

      // fine mineral speckle over everything
      col *= 0.96 + hash_ssc(floor(uv * 320.0)) * 0.07;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_pans',         name: 'Pans',       type: 'float', min: 3.0, max: 16.0, default: 7.0 },
    { id: 'u_patina_age',   name: 'Patina Age', type: 'float', min: 0.0, max: 1.0,  default: 0.7 },
    { id: 'u_patina_color', name: 'Verdigris',  type: 'color', default: [0.42, 0.68, 0.58, 1.0] }
  ]
};

export default {
  id: 'salt_flat_patina',
  name: 'Salt Flat Patina',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Sun-bleached land-speed racer paint — chalky faded colour breaking into bare primer islands, white salt crust caked along every wear edge, rust freckles and dried mineral runs.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette ---
      vec3 paint  = u_paint_color.rgb;                  // original colour, pre-fade
      vec3 bleach = mix(paint, vec3(0.93, 0.91, 0.86), 0.55); // sun-eaten paint
      vec3 primer = vec3(0.55, 0.42, 0.34);             // red-oxide primer
      vec3 salt   = vec3(0.97, 0.96, 0.92);             // crystalline crust
      vec3 rust   = vec3(0.46, 0.24, 0.13);

      // --- wear field: where the paint has given up ---
      // big soft islands + medium blotching, ridge-folded for crisp shorelines
      float wf = fbm(uv * 3.0) * 0.6 + fbm(uv * 9.0 + 31.7) * 0.4;
      wf = wf * 0.5 + 0.5;
      float worn = smoothstep(u_wear_level + 0.10, u_wear_level - 0.10, wf);

      // --- paint zone: bleached colour, chalky and dead-flat ---
      // fade is uneven: panels facing the sun (top) bleach harder
      float sun = smoothstep(0.0, 1.0, uv.y) * 0.4 + 0.6;
      vec3 p_col = mix(paint, bleach, clamp(sun * (0.45 + fbm(uv * 5.0 + 7.0) * 0.3), 0.0, 1.0));
      p_col *= 0.94 + noise(uv * 350.0) * 0.09;                 // chalking
      p_col *= 0.98 + 0.04 * (snoise(uv * vec2(60.0, 4.0)) * 0.5 + 0.5); // wiped streaks

      // --- primer zone: oxide showing through, mottled ---
      vec3 g_col = primer * (0.88 + fbm(uv * 14.0 + 3.3) * 0.20);
      g_col *= 0.95 + noise(uv * 500.0) * 0.08;

      vec3 col = mix(p_col, g_col, worn);

      // --- salt crust: caked along the paint/primer shorelines ---
      float edge = smoothstep(0.14, 0.0, abs(wf - u_wear_level));   // band round the contour
      float crust = edge * u_salt_amount;
      // crystal granularity: salt is grainy, never smooth
      float grain = noise(uv * 240.0);
      crust *= 0.55 + 0.45 * step(0.35, grain);
      vec3 s_col = salt * (0.92 + grain * 0.12);
      col = mix(col, s_col, clamp(crust, 0.0, 1.0));

      // salt also pools in low spots of intact paint
      float pool = smoothstep(0.62, 0.85, fbm(uv * 7.0 - 11.0) * 0.5 + 0.5)
                 * (1.0 - worn) * u_salt_amount * 0.6;
      col = mix(col, s_col, pool * step(0.3, noise(uv * 180.0 + 5.0)));

      // --- rust freckles seeded in the worn zones ---
      float fr = step(0.965, hash(floor(uv * 190.0))) * max(worn, edge * 0.5);
      col = mix(col, rust * (0.8 + hash(floor(uv * 190.0) + 1.0) * 0.4), fr * 0.85);

      // --- dried mineral runs streaking downward from crust lines ---
      float run_x = noise(vec2(uv.x * 60.0, 2.0));
      float runs = step(0.78, run_x) * smoothstep(0.0, 0.35, fbm(vec2(uv.x * 50.0, uv.y * 3.0)))
                 * (1.0 - uv.y) * 0.5;
      col = mix(col, mix(s_col, rust, 0.25), clamp(runs, 0.0, 1.0) * 0.30);

      // overall dust film, heavier low on the panel
      col = mix(col, vec3(0.85, 0.82, 0.75),
                smoothstep(0.5, 0.0, uv.y) * (fbm(uv * 6.0) * 0.5 + 0.5) * 0.10);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_wear_level', name: 'Paint Wear', type: 'float', min: 0.15, max: 0.75, default: 0.42 },
    { id: 'u_salt_amount', name: 'Salt Crust', type: 'float', min: 0.0, max: 1.5, default: 0.9 },
    { id: 'u_paint_color', name: 'Original Paint', type: 'color', default: [0.78, 0.33, 0.12, 1.0] }
  ]
};

export default {
  id: 'hydrothermal_vent',
  name: 'Hydrothermal Vent',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Black smoker chimneys belching turbulent mineral plumes over fissured basalt veined with magma glow.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- basalt seafloor base: near-black, lumpy ---
      float rock = fbm(uv * 6.0) * 0.5 + 0.5;
      float rough = fbm(uv * 22.0) * 0.5 + 0.5;
      vec3 basalt = vec3(0.05, 0.05, 0.06);
      vec3 col = basalt * (0.5 + rock * 0.8) + rough * 0.04;
      // sulfide mineral crusting: dull yellow-grey patches
      float crust = smoothstep(0.62, 0.78, fbm(uv * 4.0 + 17.0) * 0.5 + 0.5);
      col = mix(col, vec3(0.22, 0.19, 0.12), crust * 0.55);

      // --- magma fissures: ridged cracks glowing from below ---
      float vein = 1.0 - abs(snoise(uv * 5.0 + vec2(43.0, 9.0)));
      vein = pow(vein, 8.0);
      float vein2 = 1.0 - abs(snoise(uv * 11.0 + vec2(3.0, 71.0)));
      vein += pow(vein2, 10.0) * 0.5;
      // glow strongest low on the texture, near the vent field
      float depth_gate = 1.0 - uv.y * 0.7;
      vec3 glow = u_glow_color.rgb;
      col += glow * vein * depth_gate * u_glow_amt;
      col += vec3(1.0, 0.85, 0.5) * smoothstep(0.7, 1.2, vein * depth_gate * u_glow_amt) * 0.6;

      // --- smoker plumes: turbulent columns rising from fixed x positions ---
      float smoke = 0.0;
      for (int k = 0; k < 3; k++) {
        float fk = float(k);
        float px = fract(0.18 + fk * 0.34 + hash(vec2(fk, 2.2)) * 0.08);
        // plume meanders and widens as it rises
        float wander = snoise(vec2(fk * 9.1, uv.y * 3.0)) * 0.06 * uv.y
                     + snoise(vec2(fk * 4.7, uv.y * 9.0)) * 0.02;
        float dx = uv.x - px - wander;
        // wrap horizontally so plumes tile
        dx = dx - floor(dx + 0.5);
        float width = (0.015 + uv.y * 0.10 * u_plume_width);
        float core = exp(-dx * dx / (width * width));
        // turbulent billow texture inside the column
        float bil = fbm(vec2(uv.x * 9.0 + fk * 31.0, uv.y * 5.0)) * 0.5 + 0.5;
        bil = mix(0.6, 1.2, bil * u_turbulence);
        // densest just above the chimney mouth, thinning upward
        float rise = smoothstep(0.0, 0.10, uv.y) * (1.0 - uv.y * 0.35);
        smoke += core * bil * rise;
      }
      smoke = clamp(smoke, 0.0, 1.4);
      vec3 smoke_col = vec3(0.16, 0.15, 0.16); // mineral-black smoker water
      col = mix(col, smoke_col, clamp(smoke, 0.0, 1.0) * 0.85);
      // shimmering superheated water at the plume cores
      col += vec3(0.10, 0.12, 0.14) * smoothstep(0.9, 1.4, smoke);

      // chimney silhouettes at the base of each plume
      for (int k = 0; k < 3; k++) {
        float fk = float(k);
        float px = fract(0.18 + fk * 0.34 + hash(vec2(fk, 2.2)) * 0.08);
        float dx = uv.x - px;
        dx = dx - floor(dx + 0.5);
        float chim_h = 0.12 + hash(vec2(fk, 8.8)) * 0.08;
        float chim_w = 0.030 * (1.0 - uv.y / chim_h) + 0.012;
        float chim = step(abs(dx), chim_w) * step(uv.y, chim_h);
        // gnarled chimney surface with glowing mouth rim
        vec3 chim_col = vec3(0.04, 0.035, 0.04) * (0.6 + rough);
        chim_col += glow * smoothstep(chim_h - 0.02, chim_h, uv.y) * 0.8;
        col = mix(col, chim_col, chim);
      }

      // drifting mineral snow
      col += vec3(0.35) * step(0.993, hash(floor(uv * 140.0))) * 0.4;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_plume_width', name: 'Plume Spread',   type: 'float', min: 0.2, max: 2.0, default: 1.0 },
    { id: 'u_turbulence',  name: 'Turbulence',     type: 'float', min: 0.2, max: 1.5, default: 0.9 },
    { id: 'u_glow_amt',    name: 'Magma Glow',     type: 'float', min: 0.0, max: 1.5, default: 0.7 },
    { id: 'u_glow_color',  name: 'Glow Color',     type: 'color', default: [1.0, 0.35, 0.05, 1.0] }
  ]
};

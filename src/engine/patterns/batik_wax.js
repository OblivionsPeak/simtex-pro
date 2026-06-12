export default {
  id: 'batik_wax',
  name: 'Batik Wax Resist',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Javanese batik: wax-resist florals in cream over deep dye, threaded with the fine crackle veins where dye crept into cracked wax, on soft cotton.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- Floral medallion field (periodic cell grid, offset rows) ---
      float reps = u_repeats;
      vec2 g = uv * reps;
      float row = floor(g.y);
      g.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;

      // hand-drawn wobble on the canting tool line
      float wob = (noise(g * 6.0) - 0.5) * 0.06;
      float r = length(f) + wob;
      float a = atan(f.y, f.x);

      // 8-petal flower: radius modulated by angle
      float petals = 0.30 + 0.10 * cos(a * 8.0);
      float flower = 1.0 - smoothstep(petals - 0.05, petals + 0.02, r);
      // flower centre dot ring
      float centre = 1.0 - smoothstep(0.06, 0.10, r);
      float c_ring = smoothstep(0.10, 0.13, r) - smoothstep(0.16, 0.19, r);
      // small filler dots between medallions (isen)
      vec2 df = fract(g * 3.0) - 0.5;
      float dots = 1.0 - smoothstep(0.07, 0.11, length(df) + wob);
      dots *= smoothstep(petals + 0.10, petals + 0.20, r); // only outside flowers

      // wax mask: where wax protected the cloth (stays cream)
      float wax = clamp(flower - c_ring + centre + dots * 0.9, 0.0, 1.0);

      // --- Crackle veins: dye seeped into cracked wax ---
      float v1 = abs(snoise(uv * 9.0));
      float v2 = abs(snoise(uv * 17.0 + 31.7));
      float crack = 1.0 - smoothstep(0.0, 0.045, v1);
      crack = max(crack, (1.0 - smoothstep(0.0, 0.035, v2)) * 0.8);
      crack *= u_crackle;

      // --- Colors ---
      vec3 dye_col  = u_dye_color.rgb;
      vec3 cream    = vec3(0.93, 0.88, 0.74);
      vec3 dye_deep = dye_col * 0.55;

      // dye bleed: edges of wax areas pick up a halo of colour
      float bleed = smoothstep(petals - 0.16, petals + 0.02, r) * flower;
      vec3 waxed = mix(cream, mix(cream, dye_col, 0.35), bleed * 0.8);

      // dyed ground with uneven dye take
      float take = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 ground = mix(dye_deep, dye_col, take);

      vec3 col = mix(ground, waxed, wax);

      // crackle: dye lines invade the waxed (cream) areas
      col = mix(col, dye_deep, crack * wax * 0.85);
      // and faint pale cracks in the dyed ground (second wax bath)
      col = mix(col, cream, crack * (1.0 - wax) * 0.15);

      // --- Cotton texture ---
      float warp = sin(uv.x * 3.14159 * 260.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 260.0) * 0.5 + 0.5;
      col *= 0.94 + 0.035 * warp + 0.035 * weft;
      col *= 0.95 + 0.09 * fbm(uv * 3.0 + 7.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',   name: 'Floral Repeats', type: 'float', min: 2.0, max: 9.0, default: 4.0 },
    { id: 'u_crackle',   name: 'Wax Crackle',    type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_dye_color', name: 'Dye Color',      type: 'color', default: [0.42, 0.22, 0.10, 1.0] }
  ]
};

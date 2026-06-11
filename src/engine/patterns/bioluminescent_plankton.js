export default {
  id: 'bioluminescent_plankton',
  name: 'Bioluminescent Plankton',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Glowing cyan plankton motes trailing comet wakes through deep blue-black night water stirred by faint currents.',
  shader: `
    // Cell-based glowing motes with directional wake trails
    float plankton_blp(vec2 uv, float scale, float density, float wake_len) {
      vec2 g = uv * scale;
      vec2 id = floor(g);
      vec2 f = fract(g);
      float glow = 0.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 cid = id + o;
          float h = hash(cid);
          if (h > density) continue;
          vec2 p = o + vec2(hash(cid + 1.37), hash(cid + 2.71)) - f;
          // each mote drifts on its own heading
          float ang = hash(cid + 4.13) * 6.28318;
          vec2 dir = vec2(cos(ang), sin(ang));
          float along  = dot(p, dir);
          float across = dot(p, vec2(-dir.y, dir.x));
          // hot core
          float size = 30.0 + 90.0 * hash(cid + 7.7);
          glow += exp(-dot(p, p) * size) * (0.5 + 0.9 * h);
          // fading wake streak trailing behind the mote
          float wk = exp(-across * across * 140.0)
                   * exp(-along * along * (9.0 / max(wake_len, 0.05)))
                   * step(0.0, along);
          glow += wk * 0.30 * h;
        }
      }
      return glow;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- deep water base: near-black blue with slow current swirls ---
      vec3 abyss   = u_water_color.rgb;
      vec3 current = abyss * 1.8 + vec3(0.00, 0.02, 0.05);
      float cur = fbm(uv * 3.0 + vec2(11.7, 4.3)) * 0.5 + 0.5;
      vec3 col = mix(abyss * 0.55, current, cur * 0.45);

      // suspended murk — barely-lit particulate haze
      float murk = fbm(uv * 9.0) * 0.5 + 0.5;
      col += vec3(0.005, 0.015, 0.030) * murk;

      // --- plankton field at three scales ---
      float dens = u_density;
      float g = 0.0;
      g += plankton_blp(uv, 7.0,  dens * 0.55, u_wake_length) * 1.00; // big foreground motes
      g += plankton_blp(uv + vec2(3.7, 9.1), 16.0, dens, u_wake_length * 0.6) * 0.65;
      g += plankton_blp(uv + vec2(8.2, 1.4), 34.0, dens, u_wake_length * 0.3) * 0.35;

      // dim background dust of unlit plankton
      float dust = step(0.985, hash(floor(uv * 220.0))) * 0.12;
      g += dust;

      // bioluminescence: hot core whitens, halo stays in glow color
      vec3 glow_col = u_glow_color.rgb;
      col += glow_col * g * 1.2;
      col += vec3(0.9, 1.0, 1.0) * smoothstep(0.8, 1.6, g) * 0.8;

      // gentle vignette of light scatter around dense patches
      float patch = fbm(uv * 2.2 + 50.0) * 0.5 + 0.5;
      col += glow_col * patch * patch * 0.05;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density',     name: 'Plankton Density', type: 'float', min: 0.1, max: 0.9, default: 0.45 },
    { id: 'u_wake_length', name: 'Wake Length',      type: 'float', min: 0.05, max: 1.0, default: 0.4 },
    { id: 'u_glow_color',  name: 'Glow Color',       type: 'color', default: [0.15, 0.95, 0.85, 1.0] },
    { id: 'u_water_color', name: 'Water Color',      type: 'color', default: [0.01, 0.03, 0.09, 1.0] }
  ]
};

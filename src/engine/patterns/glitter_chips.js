export default {
  id: 'glitter_chips',
  name: 'Glitter Chips',
  category: 'Abstract',
  added: '2026-07-08',
  description: 'Dense craft-glitter chips — tiny angular flakes with per-chip brightness and blown-white glints.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // ground peeks between chips
      vec3 col = u_secondary_color.rgb * (0.85 + 0.15 * hash(floor(uv) + 99.0));
      // two offset chip layers so the field reads deep, not gridded
      for (int layer_ = 0; layer_ < 2; layer_++) {
        float fl = float(layer_);
        vec2 g = uv * (1.0 + fl * 0.618) + fl * 7.31;
        vec2 cell = floor(g);
        vec2 f = fract(g) - 0.5;
        if (hash(cell + fl * 13.0) < u_coverage) {
          // jittered, rotated square chip
          vec2 jit = (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.3;
          float ang = hash(cell + 3.3) * 6.28318;
          vec2 lp = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * (f - jit);
          if (max(abs(lp.x), abs(lp.y)) < 0.34) {
            // per-chip brightness — every chip catches light differently
            float b = 0.5 + 0.8 * hash(cell + 4.4);
            vec3 c = mix(u_primary_color.rgb, u_accent_color.rgb,
                         step(1.0 - u_mix, hash(cell + 5.5)));
            c *= b;
            // occasional chip blown to a white glint
            c = mix(c, vec3(1.0), step(0.965, hash(cell + 6.6)));
            col = c;
          }
        }
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Chip Density', type: 'float', min: 30.0, max: 220.0, default: 100.0 },
    { id: 'u_coverage', name: 'Coverage', type: 'float', min: 0.3, max: 1.0, default: 0.85 },
    { id: 'u_mix', name: 'Accent Chips', type: 'float', min: 0.0, max: 1.0, default: 0.3 },
    { id: 'u_primary_color', name: 'Chips', type: 'color', default: [0.85, 0.68, 0.28, 1.0] },
    { id: 'u_accent_color', name: 'Accent Chips', type: 'color', default: [0.95, 0.85, 0.55, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.09, 0.07, 0.04, 1.0] }
  ],
  variants: [
    { name: 'Gold Rush', uniforms: { u_primary_color: [0.85, 0.68, 0.28, 1.0], u_accent_color: [0.95, 0.85, 0.55, 1.0], u_secondary_color: [0.09, 0.07, 0.04, 1.0], u_coverage: 0.85, u_mix: 0.3 } },
    { name: 'Midnight Teal', uniforms: { u_primary_color: [0.1, 0.55, 0.6, 1.0], u_accent_color: [0.4, 0.9, 0.85, 1.0], u_secondary_color: [0.03, 0.05, 0.07, 1.0], u_coverage: 0.75, u_mix: 0.4 } },
    { name: 'Unicorn Craft', uniforms: { u_primary_color: [0.9, 0.4, 0.75, 1.0], u_accent_color: [0.45, 0.75, 0.95, 1.0], u_secondary_color: [0.93, 0.9, 0.94, 1.0], u_coverage: 0.7, u_mix: 0.5 } }
  ]
};

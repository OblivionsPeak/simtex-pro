export default {
  id: 'nineties_splash',
  name: '90s Splash Graphics',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Torn neon splash shapes layered over each other — peak 1990s IndyCar and touring car energy.',
  shader: `
    float splash(vec2 uv, vec2 seed, float freq) {
      return step(u_cover, snoise(uv * freq + seed) * 0.5 + snoise(uv * freq * 2.3 + seed * 1.7) * 0.25 + 0.5);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      float s1 = splash(uv, vec2(3.1, 8.2), 0.9);
      float s2 = splash(uv, vec2(17.4, 2.6), 1.2);
      float s3 = splash(uv, vec2(9.7, 21.3), 1.6);
      col = mix(col, u_primary_color, s1);
      col = mix(col, u_accent_color, s2);
      col = mix(col, u_pop_color, s3);
      // hard black keyline where layers meet
      float edge = abs(s1 - splash(uv + vec2(0.06), vec2(3.1, 8.2), 0.9))
                 + abs(s2 - splash(uv + vec2(0.06), vec2(17.4, 2.6), 1.2))
                 + abs(s3 - splash(uv + vec2(0.06), vec2(9.7, 21.3), 1.6));
      col.rgb = mix(col.rgb, vec3(0.02), clamp(edge, 0.0, 1.0) * u_keyline);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Splash Scale', type: 'float', min: 1.0, max: 12.0, default: 4.0 },
    { id: 'u_cover', name: 'Coverage', type: 'float', min: 0.3, max: 0.8, default: 0.58 },
    { id: 'u_keyline', name: 'Keyline', type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.97, 0.96, 0.94, 1.0] },
    { id: 'u_primary_color', name: 'Splash 1', type: 'color', default: [0.9, 0.05, 0.45, 1.0] },
    { id: 'u_accent_color', name: 'Splash 2', type: 'color', default: [0.05, 0.65, 0.9, 1.0] },
    { id: 'u_pop_color', name: 'Splash 3', type: 'color', default: [1.0, 0.85, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Grand Prix 94', uniforms: { u_secondary_color: [0.97, 0.96, 0.94, 1.0], u_primary_color: [0.9, 0.05, 0.45, 1.0], u_accent_color: [0.05, 0.65, 0.9, 1.0], u_pop_color: [1.0, 0.85, 0.05, 1.0], u_keyline: 0.7 } },
    { name: 'Arcade Cab', uniforms: { u_secondary_color: [0.06, 0.04, 0.12, 1.0], u_primary_color: [0.0, 0.9, 0.7, 1.0], u_accent_color: [0.85, 0.2, 0.95, 1.0], u_pop_color: [1.0, 0.5, 0.0, 1.0], u_keyline: 0.3 } },
    { name: 'Ski Jacket', uniforms: { u_secondary_color: [0.16, 0.16, 0.55, 1.0], u_primary_color: [0.95, 0.3, 0.75, 1.0], u_accent_color: [0.3, 0.85, 0.85, 1.0], u_pop_color: [0.98, 0.95, 0.4, 1.0], u_keyline: 0.9 } }
  ]
};

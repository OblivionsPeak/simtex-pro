export default {
  id: 'victory_confetti',
  name: 'Victory Confetti',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Podium celebration — tumbling rectangular confetti pieces scattered mid-air.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          vec2 ctr = cell + vec2(hash(cell + 1.1), hash(cell + 2.2));
          float ang = hash(cell + 3.3) * 6.28318;
          vec2 rel = uv - ctr;
          vec2 lp = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * rel;
          // rectangle with a foreshortened width — mid-tumble
          float wobble = 0.35 + 0.65 * abs(sin(hash(cell + 4.4) * 6.28));
          float piece = step(abs(lp.x), 0.16) * step(abs(lp.y), 0.09 * wobble);
          if (piece > 0.5) {
            float pick = hash(cell + 5.5);
            vec4 c = u_primary_color;
            if (pick > 0.66) c = u_accent_color;
            else if (pick > 0.33) c = u_pop_color;
            // lighting flip as the piece tumbles
            c.rgb *= 0.75 + 0.35 * sin(hash(cell + 6.6) * 6.28);
            col = mix(col, c, 1.0);
          }
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Confetti Density', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_secondary_color', name: 'Sky', type: 'color', default: [0.07, 0.08, 0.12, 1.0] },
    { id: 'u_primary_color', name: 'Confetti 1', type: 'color', default: [0.95, 0.75, 0.1, 1.0] },
    { id: 'u_accent_color', name: 'Confetti 2', type: 'color', default: [0.9, 0.15, 0.35, 1.0] },
    { id: 'u_pop_color', name: 'Confetti 3', type: 'color', default: [0.15, 0.7, 0.9, 1.0] }
  ],
  variants: [
    { name: 'Champagne Night', uniforms: { u_secondary_color: [0.07, 0.08, 0.12, 1.0], u_primary_color: [0.95, 0.75, 0.1, 1.0], u_accent_color: [0.9, 0.15, 0.35, 1.0], u_pop_color: [0.15, 0.7, 0.9, 1.0] } },
    { name: 'Gold Shower', uniforms: { u_secondary_color: [0.1, 0.07, 0.03, 1.0], u_primary_color: [0.95, 0.78, 0.2, 1.0], u_accent_color: [0.85, 0.6, 0.1, 1.0], u_pop_color: [1.0, 0.9, 0.55, 1.0] } },
    { name: 'Ticker Parade', uniforms: { u_secondary_color: [0.9, 0.92, 0.95, 1.0], u_primary_color: [0.85, 0.12, 0.15, 1.0], u_accent_color: [0.1, 0.3, 0.7, 1.0], u_pop_color: [0.15, 0.15, 0.17, 1.0] } }
  ]
};

export default {
  id: 'phyllotaxis_spiral',
  name: 'Phyllotaxis Spiral',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Sunflower-seed dot spiral — golden-angle phyllotaxis radiating from the center.',
  shader: `
    vec4 generate() {
      vec2 p = (v_uv - 0.5) * u_scale;
      float c = 0.08; // vogel spacing constant
      float golden = 2.39996323;
      float r = length(p);
      // invert vogel: n ~ (r/c)^2, then test nearby candidates
      float nGuess = (r / c) * (r / c);
      float best = 10.0;
      float bestN = 0.0;
      for (int k = -4; k <= 4; k++) {
        float n = max(floor(nGuess) + float(k), 0.0);
        float rn = c * sqrt(n);
        float an = n * golden;
        vec2 pn = vec2(cos(an), sin(an)) * rn;
        float d = length(p - pn);
        if (d < best) { best = d; bestN = n; }
      }
      // seed size grows slightly with radius
      float size = u_dot * (0.5 + 0.5 * sqrt(bestN) * c);
      float m = smoothstep(size, size * 0.7, best);
      vec4 col = mix(u_secondary_color, u_primary_color, m);
      // seeds shade darker toward the center like a sunflower head
      col.rgb = mix(col.rgb, u_accent_color.rgb, m * smoothstep(1.4, 0.1, r));
      // soft head vignette
      col.rgb *= 0.92 + 0.08 * smoothstep(0.0, 1.8, r);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Zoom', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_dot', name: 'Seed Size', type: 'float', min: 0.01, max: 0.08, default: 0.035 },
    { id: 'u_primary_color', name: 'Seeds', type: 'color', default: [0.85, 0.7, 0.3, 1.0] },
    { id: 'u_accent_color', name: 'Center Seeds', type: 'color', default: [0.35, 0.22, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.12, 0.1, 0.08, 1.0] }
  ],
  variants: [
    { name: 'Sunflower Head', uniforms: { u_primary_color: [0.85, 0.7, 0.3, 1.0], u_accent_color: [0.35, 0.22, 0.1, 1.0], u_secondary_color: [0.12, 0.1, 0.08, 1.0] } },
    { name: 'Silver Bloom', uniforms: { u_primary_color: [0.8, 0.82, 0.86, 1.0], u_accent_color: [0.3, 0.32, 0.38, 1.0], u_secondary_color: [0.06, 0.06, 0.08, 1.0] } },
    { name: 'Coral Rosette', uniforms: { u_primary_color: [0.95, 0.5, 0.4, 1.0], u_accent_color: [0.6, 0.15, 0.25, 1.0], u_secondary_color: [0.98, 0.94, 0.88, 1.0] } }
  ]
};

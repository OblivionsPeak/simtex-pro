export default {
  id: 'memphis_squiggle',
  name: 'Memphis Squiggle',
  category: 'Retro',
  added: '2026-07-07',
  description: '1980s Memphis design chaos — squiggles, outlined circles, triangles, and confetti dots.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      // faint halftone texture patch in one diagonal band
      float band = step(0.7, fract((uv.x - uv.y) * 0.15));
      float dots = smoothstep(0.2, 0.12, length(fract(uv * 3.0) - 0.5));
      col.rgb = mix(col.rgb, col.rgb * 0.85, band * dots);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          float kind = hash(cell + 0.3);
          vec2 ctr = cell + vec2(hash(cell + 1.1), hash(cell + 2.2)) * 0.6 + 0.2;
          float rot = hash(cell + 3.3) * 6.28;
          vec2 p = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * (uv - ctr);
          float pick = hash(cell + 4.4);
          vec3 c = u_primary_color.rgb;
          if (pick > 0.66) c = u_accent_color.rgb;
          else if (pick > 0.33) c = u_pop_color.rgb;
          float m = 0.0;
          if (kind < 0.35) {
            // squiggle: sine wave stroke
            float wave = p.y - 0.08 * sin(p.x * 18.0);
            m = smoothstep(0.045, 0.025, abs(wave)) * step(abs(p.x), 0.3);
          } else if (kind < 0.6) {
            // outlined circle
            m = smoothstep(0.03, 0.015, abs(length(p) - 0.18));
          } else if (kind < 0.85) {
            // solid triangle
            vec2 q = p * 3.6;
            m = step(abs(q.x) * 0.866 + q.y * 0.5, 0.5) * step(-0.5, q.y);
          } else {
            // bold dot
            m = smoothstep(0.09, 0.07, length(p));
          }
          col.rgb = mix(col.rgb, c, m);
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Element Density', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_secondary_color', name: 'Field', type: 'color', default: [0.95, 0.94, 0.9, 1.0] },
    { id: 'u_primary_color', name: 'Shape 1', type: 'color', default: [0.95, 0.3, 0.55, 1.0] },
    { id: 'u_accent_color', name: 'Shape 2', type: 'color', default: [0.15, 0.7, 0.7, 1.0] },
    { id: 'u_pop_color', name: 'Shape 3', type: 'color', default: [0.15, 0.15, 0.18, 1.0] }
  ],
  variants: [
    { name: 'Milano 84', uniforms: { u_secondary_color: [0.95, 0.94, 0.9, 1.0], u_primary_color: [0.95, 0.3, 0.55, 1.0], u_accent_color: [0.15, 0.7, 0.7, 1.0], u_pop_color: [0.15, 0.15, 0.18, 1.0] } },
    { name: 'Saved by the Bell', uniforms: { u_secondary_color: [0.12, 0.08, 0.2, 1.0], u_primary_color: [0.95, 0.85, 0.1, 1.0], u_accent_color: [0.9, 0.25, 0.7, 1.0], u_pop_color: [0.2, 0.85, 0.6, 1.0] } },
    { name: 'Soft Sorbet', uniforms: { u_secondary_color: [0.97, 0.93, 0.88, 1.0], u_primary_color: [0.95, 0.65, 0.6, 1.0], u_accent_color: [0.65, 0.8, 0.75, 1.0], u_pop_color: [0.75, 0.7, 0.85, 1.0] } }
  ]
};

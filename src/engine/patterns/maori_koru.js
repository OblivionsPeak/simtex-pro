export default {
  id: 'maori_koru',
  name: 'Koru Spirals',
  category: 'Heritage',
  added: '2026-07-07',
  description: 'Unfurling fern spirals in bold contrast — the Maori koru, symbol of new life.',
  shader: `
    float koru(vec2 p, float dir) {
      float r = length(p);
      float ang = atan(p.y, p.x) * dir;
      // archimedean spiral band, tapering outward
      float turns = r * 3.2 - ang / 6.28318;
      float band = abs(fract(turns) - 0.5);
      float wid = 0.24 * (1.0 - r * 0.8) + 0.04;
      float m = smoothstep(wid, wid - 0.05, band) * smoothstep(0.62, 0.55, r);
      // bulb at the center
      m = max(m, smoothstep(0.11, 0.08, r));
      return m;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      // alternate spiral direction like paired fronds
      float dir = mix(1.0, -1.0, mod(cell.x + cell.y, 2.0));
      float m = koru(f * 1.15, dir);
      vec4 col = mix(u_secondary_color, u_primary_color, m);
      // connecting stem bands along cell edges
      float stem = smoothstep(0.055, 0.03, abs(abs(f.x) - 0.5)) + smoothstep(0.055, 0.03, abs(abs(f.y) - 0.5));
      col.rgb = mix(col.rgb, u_primary_color.rgb, clamp(stem, 0.0, 1.0) * u_link);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Koru Density', type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_link', name: 'Linking Stems', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Koru', type: 'color', default: [0.94, 0.93, 0.9, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.1, 0.1, 0.11, 1.0] }
  ],
  variants: [
    { name: 'Kowhaiwhai', uniforms: { u_primary_color: [0.94, 0.93, 0.9, 1.0], u_secondary_color: [0.1, 0.1, 0.11, 1.0], u_link: 0.6 } },
    { name: 'Red Ochre', uniforms: { u_primary_color: [0.75, 0.2, 0.12, 1.0], u_secondary_color: [0.95, 0.92, 0.85, 1.0], u_link: 0.8 } },
    { name: 'Pounamu', uniforms: { u_primary_color: [0.2, 0.5, 0.32, 1.0], u_secondary_color: [0.06, 0.12, 0.08, 1.0], u_link: 0.4 } }
  ]
};

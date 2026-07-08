export default {
  id: 'tourmaline_slice',
  name: 'Tourmaline Slice',
  category: 'Geology',
  added: '2026-07-07',
  description: 'Watermelon tourmaline cross-sections — pink cores ringed in white and rimmed green.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      col.rgb *= 0.9 + 0.1 * fbm(uv * 2.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.6) < 0.25) continue;
          vec2 ctr = cell + 0.5 + (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.4;
          float rot = hash(cell + 3.3) * 6.28;
          vec2 rel = uv - ctr;
          float ang = atan(rel.y, rel.x) + rot;
          // rounded-triangle crystal habit
          float shape = length(rel) * (1.0 + 0.18 * cos(ang * 3.0));
          float size = 0.3 + hash(cell + 4.4) * 0.18;
          float t = shape / size;             // 0 center -> 1 rim
          if (t < 1.0) {
            // zoning: core -> white band -> rim
            vec3 c;
            if (t < 0.55) c = mix(u_primary_color.rgb, u_primary_color.rgb * 1.15, t / 0.55);
            else if (t < 0.75) c = mix(u_primary_color.rgb * 1.15, vec3(0.95, 0.94, 0.9), (t - 0.55) / 0.2);
            else c = mix(vec3(0.95, 0.94, 0.9), u_accent_color.rgb, (t - 0.75) / 0.25);
            // internal fractures and silk
            c *= 0.9 + 0.1 * snoise(rel * 20.0 + cell);
            c *= 0.85 + 0.15 * abs(sin(ang * 3.0 + 1.0));
            // glassy rim line
            c += vec3(0.12) * smoothstep(0.05, 0.0, abs(t - 0.97));
            col.rgb = mix(col.rgb, c, smoothstep(1.0, 0.98, t));
          }
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Slice Density', type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Core', type: 'color', default: [0.9, 0.35, 0.55, 1.0] },
    { id: 'u_accent_color', name: 'Rim', type: 'color', default: [0.2, 0.55, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Matrix', type: 'color', default: [0.22, 0.2, 0.22, 1.0] }
  ],
  variants: [
    { name: 'Watermelon', uniforms: { u_primary_color: [0.9, 0.35, 0.55, 1.0], u_accent_color: [0.2, 0.55, 0.35, 1.0], u_secondary_color: [0.22, 0.2, 0.22, 1.0] } },
    { name: 'Indicolite', uniforms: { u_primary_color: [0.2, 0.45, 0.75, 1.0], u_accent_color: [0.1, 0.25, 0.4, 1.0], u_secondary_color: [0.15, 0.16, 0.2, 1.0] } },
    { name: 'Citrus Zone', uniforms: { u_primary_color: [0.95, 0.75, 0.2, 1.0], u_accent_color: [0.55, 0.65, 0.15, 1.0], u_secondary_color: [0.2, 0.18, 0.14, 1.0] } }
  ]
};

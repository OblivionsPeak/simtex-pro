export default {
  id: 'petri_dish_colonies',
  name: 'Petri Dish Colonies',
  category: 'Organic',
  added: '2026-07-07',
  description: 'Bacterial colonies blooming on agar — irregular discs with growth rings and satellite spots.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // agar: translucent amber with soft depth
      vec4 col = u_secondary_color;
      col.rgb *= 0.92 + 0.08 * fbm(uv * 1.5);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.8) < u_sparse) continue;
          vec2 ctr = cell + 0.5 + (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.6;
          vec2 rel = uv - ctr;
          float ang = atan(rel.y, rel.x);
          // lobed irregular edge
          float wob = 1.0 + 0.15 * sin(ang * 7.0 + hash(cell + 3.0) * 6.28)
                          + 0.08 * sin(ang * 13.0 + hash(cell + 4.0) * 6.28);
          float size = (0.16 + hash(cell + 5.0) * 0.22) * wob;
          float r = length(rel) / size;
          if (r < 1.0) {
            float pick = hash(cell + 6.0);
            vec3 c = mix(u_primary_color.rgb, u_accent_color.rgb, step(0.6, pick));
            // growth rings and a dense center
            c *= 0.8 + 0.2 * sin(r * 14.0);
            c = mix(c * 1.25, c, smoothstep(0.0, 0.4, r));
            // moist highlight
            c += vec3(0.1) * exp(-r * r * 8.0);
            // translucent margin
            float body = smoothstep(1.0, 0.85, r);
            col.rgb = mix(col.rgb, c, body * 0.95);
          }
          // satellite micro-colonies
          vec2 sg = fract(rel * 9.0) - 0.5;
          float sat = smoothstep(0.12, 0.06, length(sg)) * step(length(rel), size * 2.0) * step(size * 1.1, length(rel));
          col.rgb = mix(col.rgb, u_primary_color.rgb * 0.9, sat * step(0.5, hash(cell + 9.0)) * 0.8);
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Colony Density', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_sparse', name: 'Empty Agar', type: 'float', min: 0.0, max: 0.8, default: 0.3 },
    { id: 'u_secondary_color', name: 'Agar', type: 'color', default: [0.75, 0.62, 0.35, 1.0] },
    { id: 'u_primary_color', name: 'Colony A', type: 'color', default: [0.92, 0.88, 0.75, 1.0] },
    { id: 'u_accent_color', name: 'Colony B', type: 'color', default: [0.75, 0.35, 0.25, 1.0] }
  ],
  variants: [
    { name: 'Lab Bench', uniforms: { u_secondary_color: [0.75, 0.62, 0.35, 1.0], u_primary_color: [0.92, 0.88, 0.75, 1.0], u_accent_color: [0.75, 0.35, 0.25, 1.0], u_sparse: 0.3 } },
    { name: 'Blood Agar', uniforms: { u_secondary_color: [0.45, 0.12, 0.12, 1.0], u_primary_color: [0.85, 0.8, 0.7, 1.0], u_accent_color: [0.6, 0.55, 0.3, 1.0], u_sparse: 0.4 } },
    { name: 'Bioluminescent', uniforms: { u_secondary_color: [0.03, 0.05, 0.08, 1.0], u_primary_color: [0.2, 0.9, 0.7, 1.0], u_accent_color: [0.15, 0.5, 0.9, 1.0], u_sparse: 0.25 } }
  ]
};

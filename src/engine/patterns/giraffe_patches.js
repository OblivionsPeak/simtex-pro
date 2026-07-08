export default {
  id: 'giraffe_patches',
  name: 'Giraffe Patches',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Angular tan patches split by wide cream channels — reticulated giraffe hide.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // voronoi: distance to nearest and second-nearest feature point
      vec2 cell = floor(uv);
      float d1 = 8.0; float d2 = 8.0;
      vec2 id1 = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 c = cell + vec2(float(i), float(j));
          vec2 pt = c + vec2(hash(c + 1.1), hash(c + 2.2));
          float d = length(uv - pt);
          if (d < d1) { d2 = d1; d1 = d; id1 = c; }
          else if (d < d2) { d2 = d; }
        }
      }
      // channel between patches
      float border = d2 - d1;
      float patch = smoothstep(u_gap, u_gap + 0.08, border);
      vec4 col = mix(u_secondary_color, u_primary_color, patch);
      // per-patch tone variation and soft center darkening
      col.rgb *= mix(1.0, 0.82 + 0.3 * hash(id1 + 5.5), patch);
      col.rgb = mix(col.rgb, col.rgb * 0.88, patch * smoothstep(0.5, 1.2, border));
      // hide grain
      col.rgb *= 0.96 + 0.04 * snoise(uv * 12.0);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Patch Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_gap', name: 'Channel Width', type: 'float', min: 0.02, max: 0.4, default: 0.14 },
    { id: 'u_primary_color', name: 'Patch', type: 'color', default: [0.62, 0.4, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Channel', type: 'color', default: [0.92, 0.86, 0.72, 1.0] }
  ],
  variants: [
    { name: 'Reticulated', uniforms: { u_primary_color: [0.62, 0.4, 0.2, 1.0], u_secondary_color: [0.92, 0.86, 0.72, 1.0], u_gap: 0.14 } },
    { name: 'Masai Dark', uniforms: { u_primary_color: [0.4, 0.24, 0.12, 1.0], u_secondary_color: [0.85, 0.76, 0.6, 1.0], u_gap: 0.2 } },
    { name: 'Ghost Fashion', uniforms: { u_primary_color: [0.25, 0.25, 0.28, 1.0], u_secondary_color: [0.9, 0.9, 0.92, 1.0], u_gap: 0.1 } }
  ]
};

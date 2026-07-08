export default {
  id: 'quatrefoil',
  name: 'Quatrefoil Trellis',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Moroccan lattice of four-lobed clover outlines — the interior-design classic.',
  shader: `
    float quat(vec2 f, float lobe) {
      // union of four circles centered on the cell axes
      float d = min(
        min(length(f - vec2(lobe, 0.0)), length(f + vec2(lobe, 0.0))),
        min(length(f - vec2(0.0, lobe)), length(f + vec2(0.0, lobe)))
      );
      return d;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = fract(uv) - 0.5;
      // interlocking: offset copy fills the gaps
      vec2 cell2 = fract(uv + 0.5) - 0.5;
      float lobe = 0.21;
      float r = 0.29;
      float d1 = abs(quat(cell, lobe) - r);
      float d2 = abs(quat(cell2, lobe) - r);
      float d = min(d1, d2);
      float w = max(u_line, 0.008);
      float line = smoothstep(w, w * 0.5, d);
      vec4 col = mix(u_secondary_color, u_primary_color, line);
      // optional filled lobes behind the linework
      float fill = smoothstep(r, r - 0.03, quat(cell, lobe));
      col.rgb = mix(col.rgb, mix(u_secondary_color.rgb, u_accent_color.rgb, u_fill).rgb, fill * u_fill * (1.0 - line));
      col.rgb = mix(col.rgb, u_primary_color.rgb, line);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Trellis Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_line', name: 'Line Weight', type: 'float', min: 0.01, max: 0.08, default: 0.03 },
    { id: 'u_fill', name: 'Lobe Fill', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Lattice', type: 'color', default: [0.85, 0.72, 0.4, 1.0] },
    { id: 'u_accent_color', name: 'Lobe Fill', type: 'color', default: [0.18, 0.3, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.12, 0.2, 0.24, 1.0] }
  ],
  variants: [
    { name: 'Brass on Teal', uniforms: { u_primary_color: [0.85, 0.72, 0.4, 1.0], u_accent_color: [0.18, 0.3, 0.35, 1.0], u_secondary_color: [0.12, 0.2, 0.24, 1.0], u_fill: 0.0 } },
    { name: 'Porcelain', uniforms: { u_primary_color: [0.2, 0.35, 0.6, 1.0], u_accent_color: [0.85, 0.9, 0.95, 1.0], u_secondary_color: [0.94, 0.94, 0.92, 1.0], u_fill: 0.4 } },
    { name: 'Noir Foil', uniforms: { u_primary_color: [0.8, 0.8, 0.83, 1.0], u_accent_color: [0.2, 0.2, 0.24, 1.0], u_secondary_color: [0.08, 0.08, 0.1, 1.0], u_fill: 0.7 } }
  ]
};

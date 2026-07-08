export default {
  id: 'cnc_toolpath',
  name: 'CNC Toolpath',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Face-milled metal with overlapping circular cutter scallops marching in rows.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float row = floor(uv.y);
      // each pass offsets half a cutter width
      float phase = mod(row, 2.0) * 0.5;
      vec2 local = vec2(fract(uv.x + phase) - 0.5, fract(uv.y) - 0.5);
      // arc marks from the face mill: fine concentric rings around pass centers
      float best = 10.0;
      for (int i = -1; i <= 1; i++) {
        vec2 c = vec2(float(i), 0.35);
        best = min(best, length(local - c));
      }
      float rings = sin(best * u_rings * 6.28318);
      float mark = smoothstep(0.0, 0.9, rings) * 0.5 + 0.5;
      vec4 col = u_primary_color;
      col.rgb *= 0.88 + 0.12 * mark;
      // pass boundary line
      float seam = smoothstep(0.04, 0.0, abs(fract(uv.y) - 0.5) - 0.46);
      col.rgb = mix(col.rgb, u_secondary_color.rgb, seam * 0.6);
      // anisotropic sheen sweeping across the plate
      col.rgb += 0.08 * u_shine * sin((uv.x + uv.y) * 0.7);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pass Width', type: 'float', min: 3.0, max: 30.0, default: 9.0 },
    { id: 'u_rings', name: 'Scallop Fineness', type: 'float', min: 4.0, max: 40.0, default: 16.0 },
    { id: 'u_shine', name: 'Sheen', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Metal', type: 'color', default: [0.68, 0.69, 0.71, 1.0] },
    { id: 'u_secondary_color', name: 'Pass Seam', type: 'color', default: [0.4, 0.41, 0.43, 1.0] }
  ],
  variants: [
    { name: 'Milled Alloy', uniforms: { u_primary_color: [0.68, 0.69, 0.71, 1.0], u_secondary_color: [0.4, 0.41, 0.43, 1.0], u_rings: 16.0, u_shine: 0.5 } },
    { name: 'Billet Bronze', uniforms: { u_primary_color: [0.72, 0.52, 0.3, 1.0], u_secondary_color: [0.45, 0.3, 0.16, 1.0], u_rings: 20.0, u_shine: 0.7 } },
    { name: 'Dark Anodize', uniforms: { u_primary_color: [0.2, 0.21, 0.24, 1.0], u_secondary_color: [0.1, 0.1, 0.12, 1.0], u_rings: 12.0, u_shine: 0.8 } }
  ]
};

export default {
  id: 'fishing_net',
  name: 'Fishing Net',
  category: 'Ocean',
  added: '2026-07-07',
  description: 'Knotted rope netting sagging in diamond meshes, with corks bobbing on the top lines.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // sag the net: vertical droop between anchor points
      uv.y += 0.18 * sin(uv.x * 1.3) * u_sag;
      // diamond mesh: two diagonal rope families
      vec2 dg = vec2(uv.x + uv.y, uv.x - uv.y) * 0.7071;
      float r1 = abs(fract(dg.x) - 0.5);
      float r2 = abs(fract(dg.y) - 0.5);
      float w = u_rope;
      // rope with twist texture
      float rope1 = smoothstep(w, w * 0.5, r1);
      float rope2 = smoothstep(w, w * 0.5, r2);
      float twist1 = 0.8 + 0.2 * sin(dg.y * 60.0);
      float twist2 = 0.8 + 0.2 * sin(dg.x * 60.0);
      vec4 col = u_secondary_color;
      // knots at crossings
      vec2 knotCell = floor(dg + 0.5);
      vec2 knotRel = fract(dg + 0.5) - 0.5;
      float knot = smoothstep(w * 2.6, w * 1.6, length(knotRel));
      vec3 ropeC = u_primary_color.rgb;
      col.rgb = mix(col.rgb, ropeC * twist1, rope1);
      col.rgb = mix(col.rgb, ropeC * twist2, rope2);
      col.rgb = mix(col.rgb, ropeC * 0.7, knot);
      // cork floats along one horizontal line per tile
      float floatY = fract(uv.y * 0.25);
      vec2 fc = vec2(fract(uv.x * 0.5) - 0.5, (floatY - 0.08) * 2.0);
      float cork = smoothstep(0.16, 0.13, length(fc * vec2(1.0, 1.8)));
      col.rgb = mix(col.rgb, u_accent_color.rgb * (0.8 + 0.4 * fc.y), cork * u_corks);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Mesh Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_rope', name: 'Rope Weight', type: 'float', min: 0.02, max: 0.12, default: 0.05 },
    { id: 'u_sag', name: 'Sag', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_corks', name: 'Cork Floats', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Rope', type: 'color', default: [0.78, 0.68, 0.5, 1.0] },
    { id: 'u_accent_color', name: 'Corks', type: 'color', default: [0.8, 0.35, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Water', type: 'color', default: [0.06, 0.2, 0.28, 1.0] }
  ],
  variants: [
    { name: 'Harbor Net', uniforms: { u_primary_color: [0.78, 0.68, 0.5, 1.0], u_accent_color: [0.8, 0.35, 0.15, 1.0], u_secondary_color: [0.06, 0.2, 0.28, 1.0], u_corks: 0.6 } },
    { name: 'Deep Trawl', uniforms: { u_primary_color: [0.3, 0.5, 0.4, 1.0], u_accent_color: [0.9, 0.75, 0.2, 1.0], u_secondary_color: [0.02, 0.08, 0.14, 1.0], u_corks: 0.3 } },
    { name: 'Ghost Net', uniforms: { u_primary_color: [0.7, 0.75, 0.78, 1.0], u_accent_color: [0.5, 0.55, 0.6, 1.0], u_secondary_color: [0.1, 0.12, 0.16, 1.0], u_corks: 0.0 } }
  ]
};

export default {
  id: 'celtic_knotwork',
  name: 'Celtic Knotwork',
  category: 'Heritage',
  added: '2026-07-07',
  description: 'Interlaced plait bands weaving over and under on the diagonal — endless knot borders.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // diagonal coordinates
      float u = uv.x + uv.y;
      float v = uv.x - uv.y;
      float fu = abs(fract(u) - 0.5);
      float fv = abs(fract(v) - 0.5);
      float w = u_band;
      float outline = 0.05;
      // band masks
      float band1 = smoothstep(w, w - 0.02, fu); // NE-SW strand
      float band2 = smoothstep(w, w - 0.02, fv); // NW-SE strand
      // over/under: checker on the crossing lattice decides which is on top
      float over1 = mod(floor(u) + floor(v), 2.0);
      vec4 col = u_secondary_color;
      // strand shading: rounded profile + edge outline
      float sh1 = 0.7 + 0.3 * cos(fu / w * 1.5708);
      float sh2 = 0.7 + 0.3 * cos(fv / w * 1.5708);
      float ol1 = smoothstep(w - 0.02, w - 0.02 - outline, fu);
      float ol2 = smoothstep(w - 0.02, w - 0.02 - outline, fv);
      // draw the under strand first, then the over strand
      float underB = mix(band2, band1, over1);
      float underSh = mix(sh2, sh1, over1);
      float underOl = mix(ol2, ol1, over1);
      float overB = mix(band1, band2, over1);
      float overSh = mix(sh1, sh2, over1);
      float overOl = mix(ol1, ol2, over1);
      col.rgb = mix(col.rgb, mix(u_accent_color.rgb, u_primary_color.rgb * underSh, underOl), underB);
      // shadow where the over strand crosses
      float crossZone = band1 * band2;
      col.rgb *= 1.0 - underB * crossZone * 0.0;
      col.rgb = mix(col.rgb, mix(u_accent_color.rgb, u_primary_color.rgb * overSh, overOl), overB);
      // drop shadow beside the over strand at crossings
      float shadow = smoothstep(w + 0.06, w, mix(fu, fv, over1)) - overB;
      col.rgb *= 1.0 - clamp(shadow, 0.0, 1.0) * underB * 0.35;
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Knot Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_band', name: 'Band Width', type: 'float', min: 0.12, max: 0.4, default: 0.26 },
    { id: 'u_primary_color', name: 'Band', type: 'color', default: [0.82, 0.65, 0.25, 1.0] },
    { id: 'u_accent_color', name: 'Band Outline', type: 'color', default: [0.3, 0.2, 0.06, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.1, 0.22, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Book of Kells', uniforms: { u_primary_color: [0.82, 0.65, 0.25, 1.0], u_accent_color: [0.3, 0.2, 0.06, 1.0], u_secondary_color: [0.1, 0.22, 0.14, 1.0], u_band: 0.26 } },
    { name: 'Stone Carving', uniforms: { u_primary_color: [0.68, 0.66, 0.62, 1.0], u_accent_color: [0.3, 0.29, 0.27, 1.0], u_secondary_color: [0.45, 0.44, 0.41, 1.0], u_band: 0.3 } },
    { name: 'Silver Torc', uniforms: { u_primary_color: [0.8, 0.82, 0.86, 1.0], u_accent_color: [0.25, 0.27, 0.32, 1.0], u_secondary_color: [0.08, 0.09, 0.12, 1.0], u_band: 0.22 } }
  ]
};

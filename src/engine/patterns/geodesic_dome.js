export default {
  id: 'geodesic_dome',
  name: 'Geodesic Dome',
  category: 'Architecture',
  added: '2026-07-07',
  description: 'Triangulated strut lattice with hub nodes — Buckminster Fuller structure against the sky.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // three strut directions at 60 degrees
      float d1 = abs(fract(uv.y) - 0.5);
      vec2 r2 = vec2(uv.x * 0.866 - uv.y * 0.5, uv.x * 0.5 + uv.y * 0.866);
      float d2 = abs(fract(r2.y) - 0.5);
      vec2 r3 = vec2(uv.x * 0.866 + uv.y * 0.5, -uv.x * 0.5 + uv.y * 0.866);
      float d3 = abs(fract(r3.y) - 0.5);
      float dmin = min(d1, min(d2, d3));
      float w = u_strut;
      float strut = smoothstep(w, w * 0.5, dmin);
      // panel tint varies triangle to triangle
      vec2 panelId = floor(uv * 1.0) + floor(r2.y) * 3.1 + floor(r3.y) * 7.7;
      float tint = hash(panelId);
      vec4 col = mix(u_secondary_color, u_accent_color, tint * u_glass);
      // sky reflection gradient on the panels
      col.rgb *= 0.85 + 0.25 * v_uv.y;
      // struts with rounded shading
      float shade = 0.75 + 0.25 * cos(dmin / max(w, 0.001) * 1.5708);
      col.rgb = mix(col.rgb, u_primary_color.rgb * shade, strut);
      // hubs where struts meet: bright discs
      float hub = smoothstep(w * 2.6, w * 1.8, d1 + d2 + d3);
      col.rgb = mix(col.rgb, u_primary_color.rgb * 1.15, hub);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Strut Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_strut', name: 'Strut Weight', type: 'float', min: 0.02, max: 0.15, default: 0.055 },
    { id: 'u_glass', name: 'Panel Variation', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Struts', type: 'color', default: [0.85, 0.86, 0.88, 1.0] },
    { id: 'u_secondary_color', name: 'Panels', type: 'color', default: [0.25, 0.45, 0.65, 1.0] },
    { id: 'u_accent_color', name: 'Panel Tint', type: 'color', default: [0.5, 0.7, 0.85, 1.0] }
  ],
  variants: [
    { name: 'Expo 67', uniforms: { u_primary_color: [0.85, 0.86, 0.88, 1.0], u_secondary_color: [0.25, 0.45, 0.65, 1.0], u_accent_color: [0.5, 0.7, 0.85, 1.0], u_glass: 0.5 } },
    { name: 'Desert Dome', uniforms: { u_primary_color: [0.35, 0.3, 0.25, 1.0], u_secondary_color: [0.88, 0.78, 0.6, 1.0], u_accent_color: [0.95, 0.88, 0.72, 1.0], u_glass: 0.4 } },
    { name: 'Night Biosphere', uniforms: { u_primary_color: [0.2, 0.22, 0.26, 1.0], u_secondary_color: [0.05, 0.08, 0.14, 1.0], u_accent_color: [0.9, 0.7, 0.3, 1.0], u_glass: 0.8 } }
  ]
};

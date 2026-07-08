export default {
  id: 'girih_stars',
  name: 'Girih Stars',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Eight-pointed star and cross tessellation with strapwork outlines — Persian girih tiling.',
  shader: `
    // signed distance to an 8-pointed star (two rotated squares)
    float star8(vec2 p, float r) {
      vec2 a = abs(p);
      float sq1 = max(a.x, a.y);
      vec2 rot = mat2(0.7071, -0.7071, 0.7071, 0.7071) * p;
      vec2 b = abs(rot);
      float sq2 = max(b.x, b.y);
      return min(sq1, sq2) - r;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 f = fract(uv) - 0.5;
      vec2 f2 = fract(uv + 0.5) - 0.5;
      // stars on both interleaved grids; the space between forms the crosses
      float d1 = star8(f, 0.32);
      float d2 = star8(f2, 0.32);
      float star = min(d1, d2);
      float inStar = smoothstep(0.012, 0.0, star);
      // which grid claimed this pixel — alternate star tints
      float which = step(d1, d2);
      vec3 starC = mix(u_primary_color.rgb, u_accent_color.rgb, which);
      // subtle radial ornament inside the stars
      vec2 sp = mix(f2, f, which);
      starC *= 0.9 + 0.1 * cos(atan(sp.y, sp.x) * 8.0);
      vec3 crossC = u_secondary_color.rgb * (0.94 + 0.06 * sin((uv.x + uv.y) * 3.0));
      vec3 c = mix(crossC, starC, inStar);
      // strapwork outline along every edge
      float w = max(u_line, 0.006);
      float outline = smoothstep(w, w * 0.4, abs(star));
      c = mix(c, u_strap_color.rgb, outline);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tile Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_line', name: 'Strap Weight', type: 'float', min: 0.006, max: 0.05, default: 0.018 },
    { id: 'u_primary_color', name: 'Star A', type: 'color', default: [0.16, 0.4, 0.55, 1.0] },
    { id: 'u_accent_color', name: 'Star B', type: 'color', default: [0.5, 0.2, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Cross Field', type: 'color', default: [0.88, 0.82, 0.68, 1.0] },
    { id: 'u_strap_color', name: 'Strapwork', type: 'color', default: [0.3, 0.22, 0.1, 1.0] }
  ],
  variants: [
    { name: 'Isfahan', uniforms: { u_primary_color: [0.16, 0.4, 0.55, 1.0], u_accent_color: [0.5, 0.2, 0.3, 1.0], u_secondary_color: [0.88, 0.82, 0.68, 1.0], u_strap_color: [0.3, 0.22, 0.1, 1.0] } },
    { name: 'Lapis and Gold', uniforms: { u_primary_color: [0.12, 0.2, 0.5, 1.0], u_accent_color: [0.2, 0.32, 0.65, 1.0], u_secondary_color: [0.14, 0.14, 0.2, 1.0], u_strap_color: [0.85, 0.7, 0.35, 1.0] } },
    { name: 'Alabaster', uniforms: { u_primary_color: [0.9, 0.88, 0.84, 1.0], u_accent_color: [0.8, 0.78, 0.72, 1.0], u_secondary_color: [0.95, 0.94, 0.9, 1.0], u_strap_color: [0.55, 0.52, 0.46, 1.0] } }
  ]
};

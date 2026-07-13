export default {
  id: 'impossible_cubes',
  name: 'Impossible Cubes',
  category: 'Geometric',
  added: '2026-07-13',
  description: 'An isometric field of Penrose-style cubes — three-tone rhombus faces shuffled per cube so the shading paradoxes, bound by thin dark outlines.',
  shader: `
    vec4 generate() {
      vec2 p = v_uv * u_scale;
      // nearest hex centre on a pointy-top lattice
      vec2 s = vec2(1.0, 1.7320508);
      vec2 ga = mod(p, s) - s * 0.5;
      vec2 gb = mod(p - s * 0.5, s) - s * 0.5;
      vec2 gv = dot(ga, ga) < dot(gb, gb) ? ga : gb;
      vec2 id = p - gv;
      // split hexagon into three rhombi (cube faces) by angle from up
      float ang = atan(gv.x, gv.y);
      float face = 0.0;
      if (abs(ang) < 2.0944) { face = ang > 0.0 ? 1.0 : 2.0; }
      // shuffle which tone lands on which face per cube — the paradox engine
      float k = floor(hash(id * 0.37 + 11.3) * 3.0);
      float ci = mod(face + k, 3.0);
      vec3 col = u_primary_color.rgb;
      if (ci > 0.5) { col = u_secondary_color.rgb; }
      if (ci > 1.5) { col = u_accent_color.rgb; }
      // per-cube brightness so the field reads deep
      col *= 0.88 + 0.2 * hash(id + 5.1);
      // gentle light-from-upper-left gradient across each cube
      col *= 0.96 + 0.18 * dot(gv, vec2(-0.3, 0.45));
      // edge distance: hexagon border plus the three internal spokes
      float hd = max(abs(gv.x), max(abs(dot(gv, vec2(0.5, 0.8660254))), abs(dot(gv, vec2(-0.5, 0.8660254)))));
      float e = 0.5 - hd;
      if (gv.y > 0.0) { e = min(e, abs(gv.x)); }
      if (dot(gv, vec2(0.8660254, -0.5)) > 0.0) { e = min(e, abs(gv.x * -0.5 - gv.y * 0.8660254)); }
      if (dot(gv, vec2(-0.8660254, -0.5)) > 0.0) { e = min(e, abs(gv.x * -0.5 + gv.y * 0.8660254)); }
      float line = 1.0 - smoothstep(u_outline, u_outline + 0.02, e);
      col = mix(col, vec3(0.04, 0.04, 0.05), line * 0.92);
      // faint surface grime
      col *= 0.95 + 0.05 * fbm(v_uv * 9.0);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cube Density', type: 'float', min: 3.0, max: 16.0, default: 6.0 },
    { id: 'u_outline', name: 'Outline Width', type: 'float', min: 0.0, max: 0.08, default: 0.025 },
    { id: 'u_primary_color', name: 'Light Face', type: 'color', default: [0.9, 0.88, 0.82, 1.0] },
    { id: 'u_secondary_color', name: 'Mid Face', type: 'color', default: [0.55, 0.35, 0.18, 1.0] },
    { id: 'u_accent_color', name: 'Dark Face', type: 'color', default: [0.16, 0.1, 0.07, 1.0] }
  ],
  variants: [
    { name: 'Escher Umber', uniforms: { u_primary_color: [0.9, 0.88, 0.82, 1.0], u_secondary_color: [0.55, 0.35, 0.18, 1.0], u_accent_color: [0.16, 0.1, 0.07, 1.0], u_scale: 6.0, u_outline: 0.025 } },
    { name: 'Circuit Board', uniforms: { u_primary_color: [0.55, 0.95, 0.6, 1.0], u_secondary_color: [0.08, 0.42, 0.28, 1.0], u_accent_color: [0.02, 0.12, 0.09, 1.0], u_scale: 9.0, u_outline: 0.02 } },
    { name: 'Paradox Steel', uniforms: { u_primary_color: [0.85, 0.88, 0.92, 1.0], u_secondary_color: [0.42, 0.48, 0.58, 1.0], u_accent_color: [0.12, 0.14, 0.2, 1.0], u_scale: 4.5, u_outline: 0.035 } }
  ]
};

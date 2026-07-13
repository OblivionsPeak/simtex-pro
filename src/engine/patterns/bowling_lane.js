export default {
  id: 'bowling_lane',
  name: 'Bowling Lane',
  category: 'Sports',
  added: '2026-07-13',
  description: 'Lacquered maple lane boards with alternating plank tone, the seven-arrow targeting V, and a long oiled specular sheen.',
  shader: `
    vec4 generate() {
      float nb = floor(u_scale + 0.5);
      float bx = v_uv.x * nb;
      float board = floor(bx);
      float fb = fract(bx);
      // alternating maple/pine boards with per-board tone
      float alt = mod(board, 2.0);
      vec3 wood = mix(u_primary_color.rgb, u_secondary_color.rgb, alt * 0.75);
      wood *= 0.92 + 0.16 * hash(vec2(board, 3.7));
      // long straight grain running down-lane
      float grain = fbm(vec2(board * 7.3 + fb * 2.5, v_uv.y * 28.0));
      wood *= 0.90 + 0.18 * grain;
      // occasional darker figure streak within a board
      float streak = smoothstep(0.72, 0.95, noise(vec2(board * 11.0 + 2.0, v_uv.y * 7.0)));
      wood *= 1.0 - 0.14 * streak;
      // board seams
      float seam = 1.0 - smoothstep(0.0, 0.06, min(fb, 1.0 - fb));
      wood *= 1.0 - 0.35 * seam;
      // the seven targeting arrows in a down-lane V
      float arrow = 0.0;
      float e = 0.006;
      for (int i = 0; i < 7; i++) {
        float fi = float(i);
        vec2 p = v_uv - vec2(0.125 + fi * 0.125, 0.62 - 0.06 * abs(fi - 3.0));
        float fx = 0.017 * (1.0 - p.y / 0.10) - abs(p.x);
        arrow = max(arrow, smoothstep(0.0, e, min(fx, p.y)));
      }
      vec3 arrowCol = u_accent_color.rgb * (0.92 + 0.16 * grain);
      wood = mix(wood, arrowCol, arrow * 0.92);
      // long lacquer sheen streak drifting slightly with the lane
      float sp = v_uv.x - 0.5 + 0.15 * (v_uv.y - 0.5);
      float sheen = exp(-sp * sp * 55.0);
      wood += vec3(1.0, 0.98, 0.90) * sheen * u_gloss * (0.45 + 0.55 * grain);
      // faint oil-pattern darkening toward the outside boards
      float edgeOil = smoothstep(0.32, 0.5, abs(v_uv.x - 0.5));
      wood *= 1.0 - 0.08 * edgeOil;
      return vec4(wood, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Board Count', type: 'float', min: 10.0, max: 60.0, default: 24.0 },
    { id: 'u_gloss', name: 'Lacquer Sheen', type: 'float', min: 0.0, max: 0.7, default: 0.3 },
    { id: 'u_primary_color', name: 'Maple', type: 'color', default: [0.82, 0.62, 0.38, 1.0] },
    { id: 'u_secondary_color', name: 'Pine', type: 'color', default: [0.68, 0.48, 0.28, 1.0] },
    { id: 'u_accent_color', name: 'Arrows', type: 'color', default: [0.42, 0.10, 0.10, 1.0] }
  ],
  variants: [
    { name: 'House Lane', uniforms: { u_scale: 24.0, u_gloss: 0.3, u_primary_color: [0.82, 0.62, 0.38, 1.0], u_secondary_color: [0.68, 0.48, 0.28, 1.0], u_accent_color: [0.42, 0.10, 0.10, 1.0] } },
    { name: 'Cosmic Bowl', uniforms: { u_scale: 20.0, u_gloss: 0.55, u_primary_color: [0.16, 0.12, 0.28, 1.0], u_secondary_color: [0.10, 0.07, 0.20, 1.0], u_accent_color: [0.15, 0.9, 0.85, 1.0] } },
    { name: 'Vintage Alley', uniforms: { u_scale: 32.0, u_gloss: 0.18, u_primary_color: [0.62, 0.44, 0.26, 1.0], u_secondary_color: [0.48, 0.33, 0.19, 1.0], u_accent_color: [0.12, 0.10, 0.09, 1.0] } }
  ]
};

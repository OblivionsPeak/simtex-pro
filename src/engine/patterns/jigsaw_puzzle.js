export default {
  id: 'jigsaw_puzzle',
  name: 'Jigsaw Puzzle',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'An assembled jigsaw of interlocking tabs and blanks, every piece its own tint with cardboard grain and a thin dark seam.',
  shader: `
    float tabAmt(float t, float s) {
      float b = sin(3.14159265 * t);
      float b2 = b * b;
      return s * u_tab_size * (0.26 * b2 * b2 * b2 * b2 - 0.07 * b2);
    }
    float edgeSign(vec2 id) {
      return step(0.5, hash(id)) * 2.0 - 1.0;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float ix = floor(uv.x);
      float iy = floor(uv.y);
      float fx = fract(uv.x);
      float fy = fract(uv.y);
      // vertical seams for this row, displaced by tab/blank knobs
      float eL = ix + tabAmt(fy, edgeSign(vec2(ix, iy) + 11.1));
      float eR = ix + 1.0 + tabAmt(fy, edgeSign(vec2(ix + 1.0, iy) + 11.1));
      float cx = ix;
      if (uv.x < eL) cx = ix - 1.0;
      if (uv.x > eR) cx = ix + 1.0;
      float aL = cx + tabAmt(fy, edgeSign(vec2(cx, iy) + 11.1));
      float aR = cx + 1.0 + tabAmt(fy, edgeSign(vec2(cx + 1.0, iy) + 11.1));
      float dx = min(uv.x - aL, aR - uv.x);
      // horizontal seams for this column
      float eB = iy + tabAmt(fx, edgeSign(vec2(ix, iy) + 47.7));
      float eT = iy + 1.0 + tabAmt(fx, edgeSign(vec2(ix, iy + 1.0) + 47.7));
      float cy = iy;
      if (uv.y < eB) cy = iy - 1.0;
      if (uv.y > eT) cy = iy + 1.0;
      float aB = cy + tabAmt(fx, edgeSign(vec2(ix, cy) + 47.7));
      float aT = cy + 1.0 + tabAmt(fx, edgeSign(vec2(ix, cy + 1.0) + 47.7));
      float dy = min(uv.y - aB, aT - uv.y);
      float d = min(dx, dy);
      vec2 id = vec2(cx, cy);
      // per-piece tint pulled from the three-colour set
      float h = hash(id + 3.3);
      vec3 base = u_primary_color.rgb;
      if (h < 0.33) {
        base = u_accent_color.rgb;
      } else if (h < 0.66) {
        base = u_secondary_color.rgb;
      }
      base *= 0.86 + 0.24 * hash(id + 7.0);
      // cardboard print grain
      base *= 0.93 + 0.12 * fbm(uv * 4.0);
      base *= 0.985 + 0.03 * noise(v_uv * 380.0);
      // rounded shading toward each seam, thin dark cut, glossy sliver
      base *= 0.80 + 0.20 * smoothstep(0.02, 0.17, d);
      vec3 col = mix(base, base * 0.15, 1.0 - smoothstep(0.012, 0.034, d));
      float sliver = smoothstep(0.034, 0.052, d) * (1.0 - smoothstep(0.052, 0.095, d));
      col += sliver * 0.07;
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Piece Count', type: 'float', min: 3.0, max: 20.0, default: 8.0 },
    { id: 'u_tab_size', name: 'Tab Size', type: 'float', min: 0.4, max: 1.5, default: 1.0 },
    { id: 'u_primary_color', name: 'Piece A', type: 'color', default: [0.20, 0.42, 0.62, 1.0] },
    { id: 'u_secondary_color', name: 'Piece B', type: 'color', default: [0.16, 0.30, 0.45, 1.0] },
    { id: 'u_accent_color', name: 'Piece C', type: 'color', default: [0.85, 0.60, 0.22, 1.0] }
  ],
  variants: [
    { name: 'Harbor Sky', uniforms: { u_scale: 8.0, u_tab_size: 1.0, u_primary_color: [0.20, 0.42, 0.62, 1.0], u_secondary_color: [0.16, 0.30, 0.45, 1.0], u_accent_color: [0.85, 0.60, 0.22, 1.0] } },
    { name: 'Candy Box', uniforms: { u_scale: 12.0, u_tab_size: 1.2, u_primary_color: [0.90, 0.45, 0.65, 1.0], u_secondary_color: [0.55, 0.80, 0.90, 1.0], u_accent_color: [0.98, 0.85, 0.45, 1.0] } },
    { name: 'Slate Mono', uniforms: { u_scale: 6.0, u_tab_size: 0.8, u_primary_color: [0.28, 0.30, 0.34, 1.0], u_secondary_color: [0.18, 0.20, 0.24, 1.0], u_accent_color: [0.42, 0.45, 0.50, 1.0] } }
  ]
};

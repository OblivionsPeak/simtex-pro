export default {
  id: 'playing_card_suits',
  name: 'Playing Card Suits',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Staggered rows of heart, diamond, club and spade pips inked in casino red and black over grained card stock.',
  shader: `
    float triDown(vec2 p, float w, float h) {
      p.x = abs(p.x);
      vec2 q = p - vec2(w, 0.0);
      float d1 = dot(q, normalize(vec2(h, -w)));
      return max(d1, p.y);
    }
    float suitD(vec2 p, float suit) {
      float d = 1.0;
      if (suit < 0.5) {
        // heart: twin lobes + tapering point
        d = length(vec2(abs(p.x) - 0.20, p.y - 0.16)) - 0.22;
        d = min(d, triDown(p - vec2(0.0, 0.14), 0.405, 0.60));
      } else if (suit < 1.5) {
        // diamond
        d = (abs(p.x) * 1.55 + abs(p.y)) - 0.46;
      } else if (suit < 2.5) {
        // club: three lobes + flared stem
        d = length(p - vec2(0.0, 0.22)) - 0.17;
        d = min(d, length(p - vec2(-0.17, -0.02)) - 0.17);
        d = min(d, length(p - vec2(0.17, -0.02)) - 0.17);
        d = min(d, triDown(vec2(p.x, -p.y - 0.44), 0.16, 0.40));
      } else {
        // spade: inverted heart + flared stem
        d = length(vec2(abs(p.x) - 0.19, -p.y - 0.04)) - 0.21;
        d = min(d, triDown(vec2(p.x, -p.y - 0.34), 0.395, 0.58));
        d = min(d, triDown(vec2(p.x, -p.y - 0.46), 0.155, 0.38));
      }
      return d;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float row = floor(uv.y);
      uv.x += 0.5 * mod(row, 2.0);
      vec2 cell = floor(uv);
      vec2 p = (fract(uv) - 0.5) * 2.4 / u_pip_size;
      float suit = mod(cell.x + cell.y * 2.0, 4.0);
      float isRed = 1.0 - step(1.5, suit);
      float d = suitD(p, suit);
      float aa = 0.05;
      // card-stock ground with paper grain and faint mottle
      vec3 ground = u_primary_color.rgb;
      ground *= 0.955 + 0.045 * noise(v_uv * 420.0);
      ground *= 0.965 + 0.07 * fbm(uv * 1.7);
      ground *= 0.985 + 0.03 * hash(cell + 5.5);
      // ink with slight per-pip press variation
      vec3 ink = mix(u_secondary_color.rgb, u_accent_color.rgb, isRed);
      ink *= 0.88 + 0.18 * hash(cell + 2.2);
      vec3 col = mix(ink, ground, smoothstep(-aa, aa, d));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pip Rows', type: 'float', min: 3.0, max: 24.0, default: 8.0 },
    { id: 'u_pip_size', name: 'Pip Size', type: 'float', min: 0.5, max: 1.5, default: 1.0 },
    { id: 'u_primary_color', name: 'Card Stock', type: 'color', default: [0.93, 0.90, 0.83, 1.0] },
    { id: 'u_secondary_color', name: 'Black Ink', type: 'color', default: [0.09, 0.09, 0.11, 1.0] },
    { id: 'u_accent_color', name: 'Red Ink', type: 'color', default: [0.72, 0.10, 0.13, 1.0] }
  ],
  variants: [
    { name: 'Riverboat', uniforms: { u_scale: 8.0, u_pip_size: 1.0, u_primary_color: [0.93, 0.90, 0.83, 1.0], u_secondary_color: [0.09, 0.09, 0.11, 1.0], u_accent_color: [0.72, 0.10, 0.13, 1.0] } },
    { name: 'Midnight Table', uniforms: { u_scale: 12.0, u_pip_size: 0.85, u_primary_color: [0.10, 0.12, 0.16, 1.0], u_secondary_color: [0.85, 0.87, 0.90, 1.0], u_accent_color: [0.95, 0.30, 0.25, 1.0] } },
    { name: 'Royal Gilt', uniforms: { u_scale: 6.0, u_pip_size: 1.15, u_primary_color: [0.16, 0.08, 0.10, 1.0], u_secondary_color: [0.85, 0.68, 0.30, 1.0], u_accent_color: [0.60, 0.15, 0.45, 1.0] } }
  ]
};

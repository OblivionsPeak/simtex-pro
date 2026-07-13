export default {
  id: 'postage_stamp',
  name: 'Postage Stamp',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'A collector\'s sheet of stamps — perforation dot rows between each pane, inner frame lines, and a soft tonal vignette printed on aging gummed paper.',
  shader: `
    vec4 generate() {
      vec2 g = v_uv * u_scale;
      vec2 cell = floor(g);
      vec2 f = fract(g);
      // album backing visible through the perforation holes
      vec3 backing = u_accent_color.rgb * (0.85 + 0.15 * noise(v_uv * 70.0));
      // perforation holes riding the grid lines
      float s = 1.0 / u_perfs;
      float dv = length(vec2(min(f.x, 1.0 - f.x), (fract(g.y * u_perfs) - 0.5) * s));
      float dh = length(vec2(min(f.y, 1.0 - f.y), (fract(g.x * u_perfs) - 0.5) * s));
      float dperf = min(dv, dh);
      float holeR = s * 0.30;
      // stamp paper: fibre grain plus per-stamp aging so the sheet isn't uniform
      vec3 paper = u_secondary_color.rgb;
      paper *= 0.955 + 0.045 * noise(g * 95.0);
      paper *= 0.93 + 0.09 * hash(cell + 5.0);
      // slight foxing spots on old gum
      paper *= 1.0 - smoothstep(0.72, 0.95, fbm(g * 2.5 + hash(cell) * 31.0)) * 0.12;
      // inner frame line
      vec2 e = abs(f - 0.5);
      float inset = max(e.x, e.y);
      float aa = 0.012;
      float frame = 1.0 - smoothstep(0.010, 0.022, abs(inset - 0.355));
      float interior = smoothstep(0.335 + aa, 0.335 - aa, inset);
      // printed design: tonal vignette, unique per stamp
      vec2 fp = f + vec2(hash(cell + 1.7), hash(cell + 3.1)) * 9.0;
      float tone = fbm(fp * 4.0);
      float vign = 1.0 - smoothstep(0.10, 0.46, length(f - 0.5) * 1.1);
      float inkAmt = clamp(tone * 0.55 + vign * 0.6, 0.0, 1.0);
      vec3 ink = u_primary_color.rgb * (0.82 + 0.32 * hash(cell + 8.8));
      vec3 stamp = mix(paper, ink, interior * inkAmt * 0.85);
      stamp = mix(stamp, ink * 0.68, frame * 0.9);
      // soft cast shadow around each perforation hole, then the hole itself
      float rim = smoothstep(holeR + 0.028, holeR, dperf);
      stamp *= 1.0 - rim * 0.18;
      float hole = smoothstep(holeR + 0.008, holeR - 0.008, dperf);
      vec3 col = mix(stamp, backing * 0.72, hole);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stamps Across', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_perfs', name: 'Perforation Density', type: 'float', min: 6.0, max: 16.0, default: 9.0 },
    { id: 'u_primary_color', name: 'Stamp Ink', type: 'color', default: [0.55, 0.16, 0.18, 1.0] },
    { id: 'u_secondary_color', name: 'Stamp Paper', type: 'color', default: [0.92, 0.88, 0.78, 1.0] },
    { id: 'u_accent_color', name: 'Album Backing', type: 'color', default: [0.16, 0.13, 0.11, 1.0] }
  ],
  variants: [
    { name: 'Penny Red', uniforms: { u_scale: 4.0, u_perfs: 9.0, u_primary_color: [0.55, 0.16, 0.18, 1.0], u_secondary_color: [0.92, 0.88, 0.78, 1.0], u_accent_color: [0.16, 0.13, 0.11, 1.0] } },
    { name: 'Airmail Blue', uniforms: { u_scale: 3.0, u_perfs: 11.0, u_primary_color: [0.15, 0.28, 0.52, 1.0], u_secondary_color: [0.94, 0.93, 0.88, 1.0], u_accent_color: [0.55, 0.50, 0.42, 1.0] } },
    { name: 'Jubilee Sheet', uniforms: { u_scale: 6.0, u_perfs: 8.0, u_primary_color: [0.42, 0.30, 0.10, 1.0], u_secondary_color: [0.90, 0.84, 0.66, 1.0], u_accent_color: [0.24, 0.10, 0.12, 1.0] } }
  ]
};

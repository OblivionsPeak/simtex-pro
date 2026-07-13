export default {
  id: 'dartboard_sectors',
  name: 'Dartboard Sectors',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Repeating pub dartboards — 20 alternating black-and-cream wedges ringed by red and green doubles and trebles behind fine spider wire.',
  shader: `
    float ringBand(float r, float a, float b, float w) {
      return smoothstep(a - w, a + w, r) * (1.0 - smoothstep(b - w, b + w, r));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 p = (fract(uv) - 0.5) * 2.0;
      // each board spun to a random sector orientation
      float spin = (hash(cell + 31.7) - 0.5) * 6.2831853;
      float cs = cos(spin);
      float sn = sin(spin);
      p = mat2(cs, -sn, sn, cs) * p;
      float r = length(p);
      float aa = 0.02;
      float a01 = (atan(p.y, p.x) + 3.14159265) / 6.2831853;
      float secPos = a01 * 20.0;
      float sec = mod(floor(secPos), 20.0);
      float alt = mod(sec, 2.0);
      vec3 cream = u_primary_color.rgb;
      vec3 dark = u_secondary_color.rgb;
      vec3 red = u_accent_color.rgb;
      vec3 green = u_accent_color.brg;
      // wedge base + matched double/treble ring colour
      vec3 col = mix(cream, dark, alt);
      vec3 ring = mix(green, red, alt);
      float dbl = ringBand(r, 0.86, 0.94, aa);
      float trb = ringBand(r, 0.52, 0.60, aa);
      col = mix(col, ring, max(dbl, trb));
      // outer bull then inner bull
      col = mix(col, green, 1.0 - smoothstep(0.13 - aa, 0.13 + aa, r));
      col = mix(col, red, 1.0 - smoothstep(0.055 - aa, 0.055 + aa, r));
      // spider wire: radial spokes (outside the bull) + ring boundaries
      float fs = fract(secPos);
      float dAng = min(fs, 1.0 - fs) * 0.31415926 * r;
      dAng = mix(1.0, dAng, step(0.14, r));
      float we = abs(r - 0.055);
      we = min(we, abs(r - 0.13));
      we = min(we, abs(r - 0.52));
      we = min(we, abs(r - 0.60));
      we = min(we, abs(r - 0.86));
      we = min(we, abs(r - 0.94));
      float wires = 1.0 - smoothstep(0.006, 0.020, min(we, dAng));
      vec3 wireCol = mix(vec3(0.08, 0.08, 0.09), vec3(0.82, 0.85, 0.88), u_wire);
      col = mix(col, wireCol, wires * (1.0 - smoothstep(0.95, 0.97, r)));
      // sisal grime + per-board tone shift
      col *= 0.90 + 0.20 * hash(cell + 3.0);
      col *= 0.92 + 0.12 * fbm(uv * 3.0);
      // dark surround between boards
      vec3 ground = dark * 0.40 * (0.75 + 0.50 * fbm(uv * 5.0));
      float board = 1.0 - smoothstep(0.94 - aa, 0.94 + aa, r);
      col = mix(ground, col, board);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Board Count', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_wire', name: 'Wire Shine', type: 'float', min: 0.0, max: 1.0, default: 0.75 },
    { id: 'u_primary_color', name: 'Cream Wedge', type: 'color', default: [0.87, 0.82, 0.68, 1.0] },
    { id: 'u_secondary_color', name: 'Dark Wedge', type: 'color', default: [0.10, 0.09, 0.09, 1.0] },
    { id: 'u_accent_color', name: 'Ring Red', type: 'color', default: [0.72, 0.10, 0.13, 1.0] }
  ],
  variants: [
    { name: 'Pub Classic', uniforms: { u_scale: 3.0, u_wire: 0.75, u_primary_color: [0.87, 0.82, 0.68, 1.0], u_secondary_color: [0.10, 0.09, 0.09, 1.0], u_accent_color: [0.72, 0.10, 0.13, 1.0] } },
    { name: 'Neon Oche', uniforms: { u_scale: 4.0, u_wire: 1.0, u_primary_color: [0.15, 0.85, 0.85, 1.0], u_secondary_color: [0.05, 0.04, 0.10, 1.0], u_accent_color: [0.95, 0.15, 0.55, 1.0] } },
    { name: 'Vintage Oak', uniforms: { u_scale: 2.0, u_wire: 0.4, u_primary_color: [0.78, 0.68, 0.50, 1.0], u_secondary_color: [0.20, 0.13, 0.08, 1.0], u_accent_color: [0.55, 0.12, 0.10, 1.0] } }
  ]
};

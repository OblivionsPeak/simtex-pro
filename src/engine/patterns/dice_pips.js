export default {
  id: 'dice_pips',
  name: 'Dice Pips',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'A tumbled grid of rounded dice at casual angles, each face rolling a random one-to-six with softly recessed pips on dark felt.',
  shader: `
    float rrect(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0) - r;
    }
    float pipDist(vec2 p, float n, float o, float r) {
      float d = 1000.0;
      if (mod(n, 2.0) > 0.5) d = min(d, length(p) - r);
      if (n > 1.5) {
        d = min(d, length(p - vec2(-o, o)) - r);
        d = min(d, length(p - vec2(o, -o)) - r);
      }
      if (n > 3.5) {
        d = min(d, length(p - vec2(o, o)) - r);
        d = min(d, length(p - vec2(-o, -o)) - r);
      }
      if (n > 5.5) {
        d = min(d, length(p - vec2(-o, 0.0)) - r);
        d = min(d, length(p - vec2(o, 0.0)) - r);
      }
      return d;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float ang = (hash(cell + 7.7) - 0.5) * 0.55 * u_tilt;
      float cs = cos(ang);
      float sn = sin(ang);
      vec2 p = mat2(cs, -sn, sn, cs) * f;
      float aa = 0.02;
      float dDie = rrect(p, vec2(0.40), 0.10);
      // felt ground with drop shadow cast low-right
      vec3 felt = u_secondary_color.rgb * (0.72 + 0.50 * fbm(uv * 2.5));
      float dSh = rrect(p - vec2(0.045, -0.045), vec2(0.40), 0.10);
      felt = mix(felt, felt * 0.50, (1.0 - smoothstep(0.0, 0.10, dSh)) * step(0.0, dDie));
      // die face: per-die tone, top-left key light, bevelled border
      vec3 face = u_primary_color.rgb * (0.88 + 0.24 * hash(cell + 3.1));
      face *= 1.0 + 0.10 * (p.y - p.x);
      face *= 1.0 - 0.22 * smoothstep(-0.09, 0.0, dDie);
      // random 1..6 pip layout, recessed shading via offset resample
      float n = 1.0 + floor(hash(cell + 9.3) * 5.999);
      float d0 = pipDist(p, n, 0.21, 0.085);
      float d1 = pipDist(p + vec2(0.03, -0.03), n, 0.21, 0.085);
      float m0 = 1.0 - smoothstep(-aa, aa, d0);
      float m1 = 1.0 - smoothstep(-aa, aa, d1);
      vec3 pipCol = u_accent_color.rgb;
      vec3 col = mix(face, pipCol * 0.55, m0);
      // catch-light crescent on the low-right pip wall
      col = mix(col, pipCol + 0.32, m0 * (1.0 - m1) * 0.65);
      col = mix(felt, col, 1.0 - smoothstep(-aa, aa, dDie));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Die Count', type: 'float', min: 3.0, max: 24.0, default: 8.0 },
    { id: 'u_tilt', name: 'Tumble', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Die Body', type: 'color', default: [0.92, 0.90, 0.86, 1.0] },
    { id: 'u_secondary_color', name: 'Felt', type: 'color', default: [0.05, 0.16, 0.10, 1.0] },
    { id: 'u_accent_color', name: 'Pips', type: 'color', default: [0.10, 0.10, 0.12, 1.0] }
  ],
  variants: [
    { name: 'Casino Ivory', uniforms: { u_scale: 8.0, u_tilt: 0.6, u_primary_color: [0.92, 0.90, 0.86, 1.0], u_secondary_color: [0.05, 0.16, 0.10, 1.0], u_accent_color: [0.10, 0.10, 0.12, 1.0] } },
    { name: 'Lucky Reds', uniforms: { u_scale: 10.0, u_tilt: 1.0, u_primary_color: [0.70, 0.10, 0.12, 1.0], u_secondary_color: [0.08, 0.07, 0.09, 1.0], u_accent_color: [0.95, 0.92, 0.85, 1.0] } },
    { name: 'Arcade Glow', uniforms: { u_scale: 6.0, u_tilt: 0.3, u_primary_color: [0.12, 0.10, 0.22, 1.0], u_secondary_color: [0.03, 0.03, 0.06, 1.0], u_accent_color: [0.25, 0.90, 0.85, 1.0] } }
  ]
};

export default {
  id: 'dominoes',
  name: 'Dominoes',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Ivory domino tiles scattered across dark felt, each bevelled bone split by a spinner line with its own pip count per half.',
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
    float halfPips(vec2 p, vec2 c, float n) {
      return pipDist((p - c) / 0.19, n, 0.52, 0.21) * 0.19;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      f -= (vec2(hash(cell + 4.2), hash(cell + 5.6)) - 0.5) * 0.06;
      float orient = step(0.5, hash(cell + 1.3));
      float ang = orient * 1.5707963 + (hash(cell + 2.4) - 0.5) * 0.5 * u_jumble;
      float cs = cos(ang);
      float sn = sin(ang);
      vec2 p = mat2(cs, -sn, sn, cs) * f;
      float aa = 0.015;
      float dT = rrect(p, vec2(0.44, 0.225), 0.05);
      // felt ground + cast shadow
      vec3 felt = u_secondary_color.rgb * (0.68 + 0.55 * fbm(uv * 2.2));
      float dSh = rrect(p - vec2(0.035, -0.035), vec2(0.44, 0.225), 0.05);
      felt = mix(felt, felt * 0.5, (1.0 - smoothstep(0.0, 0.08, dSh)) * step(0.0, dT));
      // ivory bone with aging and a directional edge bevel
      vec3 tile = u_primary_color.rgb * (0.93 + 0.12 * hash(cell + 8.8));
      tile *= 0.955 + 0.075 * fbm(uv * 6.0);
      float band = smoothstep(-0.07, -0.005, dT);
      float lit = dot(normalize(p + vec2(0.0001, 0.0)), normalize(vec2(-0.6, 0.75)));
      tile *= 1.0 + band * lit * 0.30;
      // divider groove + brass spinner
      float groove = 1.0 - smoothstep(0.010, 0.024, abs(p.x));
      tile = mix(tile, tile * 0.5, groove);
      float ds = length(p) - 0.032;
      tile = mix(tile, vec3(0.72, 0.64, 0.42), 1.0 - smoothstep(-aa, aa, ds));
      // pips per half (0..6), recessed via offset resample
      float nL = floor(hash(cell + 6.1) * 6.999);
      float nR = floor(hash(cell + 7.9) * 6.999);
      float d0 = min(halfPips(p, vec2(-0.22, 0.0), nL), halfPips(p, vec2(0.22, 0.0), nR));
      vec2 po = p + vec2(0.02, -0.02);
      float d1 = min(halfPips(po, vec2(-0.22, 0.0), nL), halfPips(po, vec2(0.22, 0.0), nR));
      float m0 = 1.0 - smoothstep(-aa, aa, d0);
      float m1 = 1.0 - smoothstep(-aa, aa, d1);
      vec3 pipCol = u_accent_color.rgb;
      vec3 col = mix(tile, pipCol * 0.7, m0);
      col = mix(col, pipCol + 0.30, m0 * (1.0 - m1) * 0.6);
      col = mix(felt, col, 1.0 - smoothstep(-aa, aa, dT));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tile Count', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_jumble', name: 'Scatter', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Bone', type: 'color', default: [0.91, 0.88, 0.79, 1.0] },
    { id: 'u_secondary_color', name: 'Felt', type: 'color', default: [0.06, 0.13, 0.09, 1.0] },
    { id: 'u_accent_color', name: 'Pips', type: 'color', default: [0.10, 0.10, 0.13, 1.0] }
  ],
  variants: [
    { name: 'Parlor Ivory', uniforms: { u_scale: 6.0, u_jumble: 0.5, u_primary_color: [0.91, 0.88, 0.79, 1.0], u_secondary_color: [0.06, 0.13, 0.09, 1.0], u_accent_color: [0.10, 0.10, 0.13, 1.0] } },
    { name: 'Ebony Set', uniforms: { u_scale: 8.0, u_jumble: 0.8, u_primary_color: [0.11, 0.11, 0.13, 1.0], u_secondary_color: [0.30, 0.06, 0.08, 1.0], u_accent_color: [0.92, 0.90, 0.84, 1.0] } },
    { name: 'Havana Club', uniforms: { u_scale: 4.0, u_jumble: 0.3, u_primary_color: [0.85, 0.74, 0.52, 1.0], u_secondary_color: [0.13, 0.09, 0.06, 1.0], u_accent_color: [0.45, 0.12, 0.10, 1.0] } }
  ]
};

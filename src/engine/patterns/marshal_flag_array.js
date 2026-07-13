export default {
  id: 'marshal_flag_array',
  name: 'Marshal Flag Array',
  category: 'Racing',
  added: '2026-07-13',
  description: 'A wall of marshal flag panels — solid yellows, blues, and striped debris flags rippling on their poles.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      float rc = hash(cell);
      // paddock wall behind the flag rows
      vec3 col = vec3(0.10, 0.10, 0.115) * (0.80 + 0.22 * noise(uv * 3.0) + 0.10 * hash(floor(uv * 40.0)));
      // shadow the pole casts on the wall before the cloth is drawn
      col *= 1.0 - 0.20 * (1.0 - smoothstep(0.16, 0.32, f.x)) * smoothstep(0.095, 0.14, f.x);
      // cloth ripple field, phase-shifted per flag
      float ph = rc * 41.0;
      float sway = clamp((f.x - 0.17) / 0.70, 0.0, 1.0);
      float rip = snoise(vec2(f.x * 5.0 + ph, f.y * 3.5 + ph * 0.7));
      // trailing edge waves; top/bottom edges lift with the ripple
      float ex = 0.90 + 0.035 * snoise(vec2(f.y * 4.0 + ph, ph)) * u_ripple;
      float fy = f.y + 0.05 * rip * sway * u_ripple;
      float flagm = smoothstep(0.145, 0.175, f.x) * (1.0 - smoothstep(ex - 0.02, ex + 0.01, f.x))
                  * smoothstep(0.13, 0.16, fy) * (1.0 - smoothstep(0.84, 0.87, fy));
      // flag type per cell: solid yellow, solid blue, red/yellow debris stripes
      float t = hash(cell + 5.0);
      vec3 fcol;
      if (t < 0.42) {
        fcol = u_primary_color.rgb;
      } else if (t < 0.72) {
        fcol = u_secondary_color.rgb;
      } else {
        float tw = abs(fract((f.x + fy) * 2.6) - 0.5) * 2.0;
        fcol = mix(u_accent_color.rgb, u_primary_color.rgb, smoothstep(0.46, 0.56, tw));
      }
      // cloth shading: ripple light, soft vertical folds, per-flag grime
      fcol *= 0.80 + 0.20 * (0.5 + 0.5 * rip);
      fcol *= 0.93 + 0.07 * sin(f.x * 17.0 + ph);
      fcol *= 0.88 + 0.12 * hash(cell + 9.0);
      // hoist-side shadow where the cloth wraps the pole
      fcol *= 1.0 - 0.28 * (1.0 - smoothstep(0.175, 0.34, f.x));
      col = mix(col, fcol, flagm);
      // the pole itself, with a cylindrical highlight
      float pole = smoothstep(0.095, 0.115, f.x) * (1.0 - smoothstep(0.14, 0.16, f.x))
                 * smoothstep(0.04, 0.07, f.y) * (1.0 - smoothstep(0.96, 0.99, f.y));
      float sheen = smoothstep(0.095, 0.125, f.x) * (1.0 - smoothstep(0.125, 0.16, f.x));
      vec3 pcol = vec3(0.58, 0.60, 0.63) * (0.70 + 0.45 * sheen + 0.10 * f.y);
      col = mix(col, pcol, pole);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flag Grid', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_ripple', name: 'Cloth Ripple', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Yellow Flag', type: 'color', default: [0.95, 0.78, 0.08, 1.0] },
    { id: 'u_secondary_color', name: 'Blue Flag', type: 'color', default: [0.12, 0.30, 0.85, 1.0] },
    { id: 'u_accent_color', name: 'Stripe Red', type: 'color', default: [0.82, 0.10, 0.10, 1.0] }
  ],
  variants: [
    { name: 'Race Control', uniforms: { u_scale: 5.0, u_ripple: 0.6, u_primary_color: [0.95, 0.78, 0.08, 1.0], u_secondary_color: [0.12, 0.30, 0.85, 1.0], u_accent_color: [0.82, 0.10, 0.10, 1.0] } },
    { name: 'Full Course Yellow', uniforms: { u_scale: 7.0, u_ripple: 0.8, u_primary_color: [0.98, 0.82, 0.05, 1.0], u_secondary_color: [0.95, 0.55, 0.05, 1.0], u_accent_color: [0.75, 0.12, 0.05, 1.0] } },
    { name: 'Night Session', uniforms: { u_scale: 4.0, u_ripple: 0.4, u_primary_color: [0.80, 0.66, 0.14, 1.0], u_secondary_color: [0.10, 0.20, 0.55, 1.0], u_accent_color: [0.55, 0.07, 0.10, 1.0] } }
  ]
};

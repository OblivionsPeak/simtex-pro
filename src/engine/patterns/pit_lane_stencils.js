export default {
  id: 'pit_lane_stencils',
  name: 'Pit Lane Stencils',
  category: 'Racing',
  added: '2026-07-13',
  description: 'Worn mid-gray pit-lane asphalt stenciled with big chipped speed-limit 60s, grid-box corner brackets, and hatched no-stop zones.',
  shader: `
    float sbar(vec2 p, vec2 c, vec2 b) {
      vec2 d = abs(p - c) - b;
      return 1.0 - smoothstep(-0.02, 0.02, max(d.x, d.y));
    }
    float digitSix(vec2 p) {
      float m = sbar(p, vec2(0.5, 0.91), vec2(0.42, 0.09));
      m = max(m, sbar(p, vec2(0.5, 0.50), vec2(0.42, 0.085)));
      m = max(m, sbar(p, vec2(0.5, 0.09), vec2(0.42, 0.09)));
      m = max(m, sbar(p, vec2(0.11, 0.50), vec2(0.11, 0.44)));
      m = max(m, sbar(p, vec2(0.89, 0.27), vec2(0.11, 0.24)));
      return m;
    }
    float digitZero(vec2 p) {
      float m = sbar(p, vec2(0.5, 0.91), vec2(0.42, 0.09));
      m = max(m, sbar(p, vec2(0.5, 0.09), vec2(0.42, 0.09)));
      m = max(m, sbar(p, vec2(0.11, 0.50), vec2(0.11, 0.44)));
      m = max(m, sbar(p, vec2(0.89, 0.50), vec2(0.11, 0.44)));
      return m;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      // worn mid-gray asphalt: broad fbm patchiness plus fine aggregate grain
      float patch = fbm(uv * 2.2);
      float grain = hash(floor(uv * 110.0));
      vec3 col = u_secondary_color.rgb * (0.88 + 0.28 * (patch - 0.5));
      col *= 0.93 + 0.07 * grain;
      col += vec3(0.05) * step(0.97, hash(floor(uv * 70.0) + 4.1));
      // pick this cell's stencil
      float t = hash(cell + 7.7);
      float paint = 0.0;
      vec3 pcol = u_primary_color.rgb;
      if (t < 0.5) {
        // big speed-limit 60 numerals filling the cell
        paint = max(digitSix((f - vec2(0.05, 0.18)) / vec2(0.42, 0.64)),
                    digitZero((f - vec2(0.53, 0.18)) / vec2(0.42, 0.64)));
      } else if (t < 0.78) {
        // grid-box corner brackets, mirrored to all four corners
        vec2 q = abs(f - 0.5);
        float armH = (1.0 - smoothstep(0.045, 0.075, abs(q.y - 0.36)))
                   * step(0.16, q.x) * (1.0 - step(0.43, q.x));
        float armV = (1.0 - smoothstep(0.045, 0.075, abs(q.x - 0.36)))
                   * step(0.16, q.y) * (1.0 - step(0.43, q.y));
        paint = max(armH, armV);
      } else {
        // hatched no-stop zone with a thick square border
        float inX = step(0.10, f.x) * (1.0 - step(0.90, f.x));
        float inY = step(0.10, f.y) * (1.0 - step(0.90, f.y));
        float tw = abs(fract((f.x + f.y) * 3.0) - 0.5) * 2.0;
        vec2 q = abs(f - 0.5);
        float border = 1.0 - smoothstep(0.035, 0.06, abs(max(q.x, q.y) - 0.40));
        paint = max(smoothstep(0.32, 0.42, tw) * inX * inY, border);
        pcol = u_accent_color.rgb;
      }
      // chipping: a noise mask nibbles the paint edges as wear rises
      float chip = 0.5 + 0.5 * snoise(uv * 9.0);
      float keep = smoothstep(u_wear - 0.14, u_wear + 0.14, chip);
      keep = max(keep, 1.0 - smoothstep(0.15, 0.55, u_wear));
      paint *= clamp(keep + 0.15 * noise(uv * 30.0) * (1.0 - u_wear), 0.0, 1.0);
      // bright, opaque paint that still shows a hint of asphalt texture
      vec3 painted = pcol * (0.94 + 0.10 * (patch - 0.5));
      col = mix(col, painted, clamp(paint, 0.0, 1.0) * 0.97);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stencil Tiles', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_wear', name: 'Paint Wear', type: 'float', min: 0.0, max: 0.8, default: 0.25 },
    { id: 'u_primary_color', name: 'Stencil Paint', type: 'color', default: [0.97, 0.97, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Asphalt', type: 'color', default: [0.47, 0.47, 0.49, 1.0] },
    { id: 'u_accent_color', name: 'Hatch Paint', type: 'color', default: [1.0, 0.82, 0.12, 1.0] }
  ],
  variants: [
    { name: 'Pit Entry', uniforms: { u_scale: 2.0, u_wear: 0.25, u_primary_color: [0.97, 0.97, 0.95, 1.0], u_secondary_color: [0.47, 0.47, 0.49, 1.0], u_accent_color: [1.0, 0.82, 0.12, 1.0] } },
    { name: 'Sun-Bleached', uniforms: { u_scale: 3.0, u_wear: 0.5, u_primary_color: [0.85, 0.84, 0.79, 1.0], u_secondary_color: [0.56, 0.55, 0.53, 1.0], u_accent_color: [0.80, 0.68, 0.28, 1.0] } },
    { name: 'Fresh Repaint', uniforms: { u_scale: 1.5, u_wear: 0.05, u_primary_color: [1.0, 1.0, 0.99, 1.0], u_secondary_color: [0.38, 0.38, 0.41, 1.0], u_accent_color: [0.95, 0.35, 0.12, 1.0] } }
  ]
};

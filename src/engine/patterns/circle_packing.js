export default {
  id: 'circle_packing',
  name: 'Circle Packing',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Generative circle packing — big rounds with ever-smaller circles crowding the gaps.',
  shader: `
    float circles(vec2 uv, float gridScale, float seed, float coverage, out float tone) {
      vec2 cell = floor(uv * gridScale);
      vec2 f = fract(uv * gridScale) - 0.5;
      vec2 jit = (vec2(hash(cell + seed), hash(cell + seed + 4.0)) - 0.5) * 0.25;
      float rad = (0.24 + hash(cell + seed + 8.0) * 0.2);
      float present = step(1.0 - coverage, hash(cell + seed + 12.0));
      tone = hash(cell + seed + 16.0);
      return smoothstep(rad, rad - 0.03, length(f - jit)) * present;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      float tone;
      // three scales, small drawn last to fill leftover gaps
      float m1 = circles(uv, 1.0, 0.0, 0.85, tone);
      if (m1 > 0.0) {
        vec3 c = mix(u_primary_color.rgb, u_accent_color.rgb, step(0.55, tone));
        col.rgb = mix(col.rgb, c * (0.85 + 0.3 * tone), m1);
      }
      float m2 = circles(uv, 2.3, 30.0, 0.7, tone) * (1.0 - m1);
      if (m2 > 0.0) {
        vec3 c = mix(u_accent_color.rgb, u_pop_color.rgb, step(0.5, tone));
        col.rgb = mix(col.rgb, c * (0.85 + 0.3 * tone), m2);
      }
      float m3 = circles(uv, 5.1, 60.0, 0.6, tone) * (1.0 - max(m1, m2));
      if (m3 > 0.0) {
        vec3 c = mix(u_pop_color.rgb, u_primary_color.rgb, step(0.5, tone));
        col.rgb = mix(col.rgb, c * (0.85 + 0.3 * tone), m3);
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Packing Scale', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_primary_color', name: 'Circles 1', type: 'color', default: [0.9, 0.55, 0.15, 1.0] },
    { id: 'u_accent_color', name: 'Circles 2', type: 'color', default: [0.85, 0.85, 0.82, 1.0] },
    { id: 'u_pop_color', name: 'Circles 3', type: 'color', default: [0.25, 0.55, 0.6, 1.0] }
  ],
  variants: [
    { name: 'Poster Print', uniforms: { u_secondary_color: [0.1, 0.1, 0.12, 1.0], u_primary_color: [0.9, 0.55, 0.15, 1.0], u_accent_color: [0.85, 0.85, 0.82, 1.0], u_pop_color: [0.25, 0.55, 0.6, 1.0] } },
    { name: 'Candy Shop', uniforms: { u_secondary_color: [0.96, 0.93, 0.9, 1.0], u_primary_color: [0.95, 0.45, 0.6, 1.0], u_accent_color: [0.45, 0.75, 0.9, 1.0], u_pop_color: [0.98, 0.8, 0.3, 1.0] } },
    { name: 'Ball Pit Night', uniforms: { u_secondary_color: [0.05, 0.05, 0.08, 1.0], u_primary_color: [0.7, 0.2, 0.75, 1.0], u_accent_color: [0.15, 0.65, 0.85, 1.0], u_pop_color: [0.9, 0.85, 0.2, 1.0] } }
  ]
};

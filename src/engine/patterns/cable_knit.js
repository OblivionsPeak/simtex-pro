export default {
  id: 'cable_knit',
  name: 'Cable Knit',
  category: 'Textile',
  added: '2026-07-07',
  description: 'Chunky sweater cables — twisted braid columns over a purled background.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float col_ = floor(uv.x);
      float fx = fract(uv.x);
      // purl background: little V bumps
      vec2 pg = vec2(uv.x * 6.0, uv.y * 6.0);
      float purl = 0.8 + 0.2 * sin(pg.x * 3.14159) * sin(pg.y * 3.14159 + floor(pg.x) * 1.57);
      vec3 c = u_secondary_color.rgb * purl;
      // cable column occupies center of every other column
      float isCable = mod(col_, 2.0);
      if (isCable > 0.5) {
        // two strands crossing: each strand is a sine-offset vertical band
        float y = uv.y * u_twist;
        float s1x = 0.5 + 0.2 * sin(y * 3.14159);
        float s2x = 0.5 - 0.2 * sin(y * 3.14159);
        float w = 0.16;
        float d1 = abs(fx - s1x);
        float d2 = abs(fx - s2x);
        // over/under alternates each half-twist
        float phase = mod(floor(y + 0.5), 2.0);
        float front = mix(d1, d2, phase);
        float back = mix(d2, d1, phase);
        // back strand first
        if (back < w) {
          float sh = sin((back / w) * 1.5708);
          c = u_primary_color.rgb * (0.55 + 0.3 * (1.0 - sh));
        }
        if (front < w) {
          float sh = sin((front / w) * 1.5708);
          c = u_primary_color.rgb * (0.75 + 0.35 * (1.0 - sh));
          // yarn ply lines along the strand
          c *= 0.92 + 0.08 * sin(uv.y * 60.0 + fx * 20.0);
        }
      }
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cable Density', type: 'float', min: 3.0, max: 20.0, default: 8.0 },
    { id: 'u_twist', name: 'Twist Rate', type: 'float', min: 0.4, max: 3.0, default: 1.2 },
    { id: 'u_primary_color', name: 'Cable Yarn', type: 'color', default: [0.9, 0.87, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Purl Ground', type: 'color', default: [0.75, 0.7, 0.62, 1.0] }
  ],
  variants: [
    { name: 'Aran Cream', uniforms: { u_primary_color: [0.9, 0.87, 0.8, 1.0], u_secondary_color: [0.75, 0.7, 0.62, 1.0], u_twist: 1.2 } },
    { name: 'Fisherman Navy', uniforms: { u_primary_color: [0.18, 0.24, 0.4, 1.0], u_secondary_color: [0.12, 0.16, 0.28, 1.0], u_twist: 1.0 } },
    { name: 'Forest Lodge', uniforms: { u_primary_color: [0.3, 0.42, 0.28, 1.0], u_secondary_color: [0.2, 0.28, 0.18, 1.0], u_twist: 1.6 } }
  ]
};

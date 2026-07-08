export default {
  id: 'seven_segment',
  name: 'Seven Segment',
  category: 'Technology',
  added: '2026-07-07',
  description: 'A wall of LED digit displays — glowing segments with faint unlit ghosts behind.',
  shader: `
    float seg(vec2 p, vec2 c, vec2 halfSize) {
      vec2 d = abs(p - c) - halfSize;
      return smoothstep(0.015, 0.0, max(d.x, d.y));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 p = fract(uv);
      p = (p - 0.5) * vec2(1.4, 1.1) + 0.5; // digit margin
      float h = hash(cell);
      vec4 col = u_secondary_color;
      // seven segments: on/off by per-cell hash bits
      float m = 0.0; float lit = 0.0;
      // horizontal bars: top, middle, bottom
      m = seg(p, vec2(0.5, 0.9), vec2(0.18, 0.045));
      lit = max(lit, m * step(hash(cell + 1.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      m = seg(p, vec2(0.5, 0.5), vec2(0.18, 0.045));
      lit = max(lit, m * step(hash(cell + 2.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      m = seg(p, vec2(0.5, 0.1), vec2(0.18, 0.045));
      lit = max(lit, m * step(hash(cell + 3.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      // vertical bars: four corners
      m = seg(p, vec2(0.26, 0.7), vec2(0.045, 0.16));
      lit = max(lit, m * step(hash(cell + 4.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      m = seg(p, vec2(0.74, 0.7), vec2(0.045, 0.16));
      lit = max(lit, m * step(hash(cell + 5.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      m = seg(p, vec2(0.26, 0.3), vec2(0.045, 0.16));
      lit = max(lit, m * step(hash(cell + 6.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      m = seg(p, vec2(0.74, 0.3), vec2(0.045, 0.16));
      lit = max(lit, m * step(hash(cell + 7.0), u_duty));
      col.rgb += m * u_primary_color.rgb * 0.06;
      col.rgb = mix(col.rgb, u_primary_color.rgb, lit);
      col.rgb += u_primary_color.rgb * lit * 0.5; // bloom
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Digit Density', type: 'float', min: 3.0, max: 24.0, default: 9.0 },
    { id: 'u_duty', name: 'Segments Lit', type: 'float', min: 0.1, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'LED', type: 'color', default: [1.0, 0.25, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Panel', type: 'color', default: [0.05, 0.03, 0.03, 1.0] }
  ],
  variants: [
    { name: 'Red LED', uniforms: { u_primary_color: [1.0, 0.25, 0.1, 1.0], u_secondary_color: [0.05, 0.03, 0.03, 1.0], u_duty: 0.6 } },
    { name: 'Pit Board Green', uniforms: { u_primary_color: [0.3, 1.0, 0.3, 1.0], u_secondary_color: [0.02, 0.05, 0.02, 1.0], u_duty: 0.55 } },
    { name: 'Ice Blue', uniforms: { u_primary_color: [0.4, 0.8, 1.0, 1.0], u_secondary_color: [0.02, 0.03, 0.06, 1.0], u_duty: 0.75 } }
  ]
};

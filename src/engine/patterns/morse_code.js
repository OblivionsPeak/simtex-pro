export default {
  id: 'morse_code',
  name: 'Morse Code',
  category: 'Technology',
  added: '2026-07-07',
  description: 'Rows of dots and dashes ticking across the surface — a hidden transmission.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float row = floor(uv.y);
      // stagger rows so columns never align
      float x = uv.x * 2.0 + hash(vec2(row, 5.5)) * 7.0;
      float cell = floor(x);
      float f = fract(x);
      float h = hash(vec2(cell, row * 1.7));
      // symbol: 45% dot, 35% dash, 20% gap
      float isDash = step(0.45, h) * step(h, 0.8);
      float isDot = step(h, 0.45);
      float fy = fract(uv.y) - 0.5;
      float m = 0.0;
      // dash: rounded bar
      float dashM = smoothstep(0.34, 0.3, abs(f - 0.5)) * smoothstep(u_weight, u_weight * 0.6, abs(fy));
      // dot: small disc
      float dotM = smoothstep(u_weight * 1.3, u_weight * 0.7, length(vec2((f - 0.5) * 0.9, fy)));
      m = max(dashM * isDash, dotM * isDot);
      vec4 col = mix(u_secondary_color, u_primary_color, m);
      // faint phosphor row glow
      col.rgb += u_primary_color.rgb * m * u_glow * 0.5;
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Signal Density', type: 'float', min: 4.0, max: 40.0, default: 14.0 },
    { id: 'u_weight', name: 'Mark Weight', type: 'float', min: 0.06, max: 0.3, default: 0.14 },
    { id: 'u_glow', name: 'Glow', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_primary_color', name: 'Signal', type: 'color', default: [0.3, 0.95, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.03, 0.06, 0.04, 1.0] }
  ],
  variants: [
    { name: 'Radio Room', uniforms: { u_primary_color: [0.3, 0.95, 0.5, 1.0], u_secondary_color: [0.03, 0.06, 0.04, 1.0], u_glow: 0.4 } },
    { name: 'Ink on Tape', uniforms: { u_primary_color: [0.15, 0.15, 0.17, 1.0], u_secondary_color: [0.93, 0.9, 0.82, 1.0], u_glow: 0.0 } },
    { name: 'Distress Amber', uniforms: { u_primary_color: [1.0, 0.65, 0.1, 1.0], u_secondary_color: [0.08, 0.05, 0.02, 1.0], u_glow: 0.7 } }
  ]
};

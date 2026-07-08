export default {
  id: 'barcode_livery',
  name: 'Barcode Livery',
  category: 'Racing',
  added: '2026-07-07',
  description: 'F1-era barcode stripes — vertical bars of random widths, the iconic subliminal livery.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5) + 0.5;
      float x = p.x * u_scale;
      float cell = floor(x);
      float h = hash(vec2(cell, 7.31));
      // random duty cycle per column; some columns fully blank
      float duty = 0.15 + h * 0.75;
      float edge = max(u_softness, 0.001);
      float bar = smoothstep(duty + edge, duty - edge, fract(x)) * step(0.12, hash(vec2(cell, 2.17)));
      vec4 col = mix(u_secondary_color, u_primary_color, bar);
      // subtle vertical print fade
      col.rgb *= 1.0 - u_fade * (0.5 - 0.5 * cos(p.y * 6.2831853));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Bar Density', type: 'float', min: 6.0, max: 80.0, default: 28.0 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.05, default: 0.003 },
    { id: 'u_fade', name: 'Print Fade', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Bar Color', type: 'color', default: [0.78, 0.04, 0.06, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.96, 0.96, 0.94, 1.0] }
  ],
  variants: [
    { name: 'Scuderia', uniforms: { u_primary_color: [0.78, 0.04, 0.06, 1.0], u_secondary_color: [0.96, 0.96, 0.94, 1.0], u_rotate: 0.0, u_fade: 0.0 } },
    { name: 'Monochrome', uniforms: { u_primary_color: [0.08, 0.08, 0.09, 1.0], u_secondary_color: [0.9, 0.9, 0.92, 1.0], u_rotate: 0.0, u_fade: 0.2 } },
    { name: 'Night Neon', uniforms: { u_primary_color: [0.1, 0.95, 0.85, 1.0], u_secondary_color: [0.04, 0.04, 0.08, 1.0], u_rotate: 90.0, u_fade: 0.35 } }
  ]
};

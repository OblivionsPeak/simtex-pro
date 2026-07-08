export default {
  id: 'op_art_waves',
  name: 'Op Art Waves',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Bridget Riley-style line field — parallel stripes bulging through invisible hills.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      // displacement field: smooth bumps warp the stripe phase
      float bump = snoise(uv * 0.35) * u_warp;
      // stripe thickness also swells over the bumps
      float thick = 0.5 + 0.3 * snoise(uv * 0.35 + vec2(4.0, 9.0)) * u_swell;
      float stripe = fract(uv.y * 2.0 + bump);
      float s = max(u_softness, 0.002);
      float m = smoothstep(thick + s, thick - s, stripe);
      vec4 col = mix(u_secondary_color, u_primary_color, m);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Line Density', type: 'float', min: 4.0, max: 40.0, default: 14.0 },
    { id: 'u_warp', name: 'Bulge', type: 'float', min: 0.0, max: 3.0, default: 1.2 },
    { id: 'u_swell', name: 'Thickness Swell', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.05, default: 0.004 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Line', type: 'color', default: [0.06, 0.06, 0.07, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.96, 0.95, 0.93, 1.0] }
  ],
  variants: [
    { name: 'Gallery Black', uniforms: { u_primary_color: [0.06, 0.06, 0.07, 1.0], u_secondary_color: [0.96, 0.95, 0.93, 1.0], u_warp: 1.2, u_swell: 0.5 } },
    { name: 'Cobalt Current', uniforms: { u_primary_color: [0.1, 0.2, 0.6, 1.0], u_secondary_color: [0.9, 0.93, 0.97, 1.0], u_warp: 2.0, u_swell: 0.7 } },
    { name: 'Heat Shimmer', uniforms: { u_primary_color: [0.8, 0.25, 0.1, 1.0], u_secondary_color: [0.1, 0.08, 0.07, 1.0], u_warp: 2.6, u_swell: 0.3 } }
  ]
};

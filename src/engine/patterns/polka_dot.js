export default {
  id: 'polka_dot_artisan',
  name: 'Pro Polka Dots',
  category: 'Organic',
  description: 'Precision uniform polka dots with adjustable spacing and edge softness.',
  shader: `
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      float mask = smoothstep(u_radius, u_radius - 0.02, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Dot Count', type: 'float', min: 2.0, max: 50.0, default: 10.0 },
    { id: 'u_radius', name: 'Dot Size', type: 'float', min: 0.1, max: 0.5, default: 0.3 },
    { id: 'u_primary_color', name: 'Dot Color', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Base Color', type: 'color', default: [0.05, 0.05, 0.1, 1.0] }
  ]
};

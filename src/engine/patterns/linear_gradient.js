export default {
  id: 'linear_gradient_artisan',
  name: 'Master Linear',
  category: 'Utility',
  description: 'High-precision linear gradient for base transitions.',
  shader: `
    vec4 generate() {
      float mask = v_uv.x;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Start Color', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'End Color', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

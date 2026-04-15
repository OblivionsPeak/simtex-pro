export default {
  id: 'zebra_camo_v2_artisan',
  name: 'Zebra Camo v2',
  category: 'Abstract',
  description: 'High-contrast geometric distortion variant of precision camouflages.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x + sin(uv.y * 2.0)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pattern Density', type: 'float', min: 1.0, max: 10.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Stripe A', type: 'color', default: [0.0, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Stripe B', type: 'color', default: [1.0, 1.0, 1.0, 1.0] }
  ]
};

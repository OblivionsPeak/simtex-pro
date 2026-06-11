export default {
  id: 'chopped_carbon_artisan',
  name: 'Chopped Carbon',
  category: 'Industrial',
  added: '2026-04-15',
  description: 'Randomly oriented forged carbon fragments mimicking premium high-performance composites.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fragment Size', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Resin Deep', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Fiber Flake', type: 'color', default: [0.2, 0.2, 0.25, 1.0] }
  ]
};

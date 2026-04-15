export default {
  id: 'corrugated_steel_artisan',
  name: 'Corrugated Steel',
  category: 'Industrial',
  description: 'Wavy metal sheet textures used in industrial construction and containers.',
  shader: `
    vec4 generate() {
      float wave = sin(v_uv.x * 30.0 * (1.0 + u_scale));
      float mask = smoothstep(-0.8, 0.8, wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wave Frequency', type: 'float', min: 0.1, max: 2.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Highlight', type: 'color', default: [0.7, 0.75, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Recess', type: 'color', default: [0.15, 0.15, 0.2, 1.0] }
  ]
};

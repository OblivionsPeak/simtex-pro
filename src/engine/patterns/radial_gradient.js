export default {
  id: 'radial_gradient_artisan',
  name: 'Master Radial',
  category: 'Utility',
  description: 'Focus-aligned radial gradient transition.',
  shader: `
    vec4 generate() {
      float d = length(v_uv - 0.5) * 2.0;
      float mask = smoothstep(0.0, 1.0, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Center Color', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Outer Color', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

export default {
  id: 'desert_dunes_artisan',
  name: 'Sand Dunes',
  category: 'Nature',
  description: 'Wavy ripple-sand patterns mimicking windswept desert landscapes.',
  shader: `
    vec4 generate() {
      float ripple = sin(v_uv.x * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Dune Frequency', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Sunlit Sand', type: 'color', default: [0.9, 0.7, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Dune Shadow', type: 'color', default: [0.7, 0.5, 0.3, 1.0] }
  ]
};

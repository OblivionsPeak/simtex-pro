export default {
  id: 'kevlar_grid_artisan',
  name: 'Kevlar Weave',
  category: 'Industrial',
  description: 'Heavy tactical weave used in protective armor and performance gear.',
  shader: `
    vec4 generate() {
      float lines = sin(v_uv.x * 400.0) * sin(v_uv.y * 400.0);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Kevlar Gold', type: 'color', default: [0.8, 0.7, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Outer Mesh', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

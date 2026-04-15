export default {
  id: 'rivet_lines_pro',
  name: 'Panel Rivets',
  category: 'Industrial',
  description: 'Structural rivet seams for automotive panels.',
  shader: `
    vec3 generate() {
      vec2 g = fract(v_uv * u_scale) - 0.5;
      float d = length(g);
      float mask = step(0.3, d) * step(d, 0.35);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rivet Spacing', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Rivet', type: 'color', default: [0.6, 0.6, 0.6] },
    { id: 'u_secondary_color', name: 'Panel', type: 'color', default: [0.35, 0.35, 0.35] }
  ]
};

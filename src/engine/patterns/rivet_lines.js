export default {
  id: 'rivet_lines',
  name: 'Rivet Lines',
  category: 'Industrial',
  description: 'Structural rivet seams for metal panels.',
  shader: `
    vec3 generate() {
      vec2 g = fract(v_uv * u_scale) - 0.5;
      float d = length(g);
      float rivet = step(0.3, d) * step(d, 0.35);
      return mix(u_secondary_color, u_primary_color, rivet);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Spacing', type: 'float', min: 5.0, max: 50.0, default: 15.0 },
    { id: 'u_primary_color', name: 'Rivet', type: 'color', default: [0.6, 0.6, 0.6] },
    { id: 'u_secondary_color', name: 'Panel', type: 'color', default: [0.4, 0.4, 0.4] }
  ]
};

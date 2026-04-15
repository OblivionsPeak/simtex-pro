export default {
  id: 'lichtenberg_trees_artisan',
  name: 'Lichtenberg Trees',
  category: 'Experimental',
  description: 'Fractal electrical discharge patterns found in high-voltage dielectric breakdown.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 100.0);
      float branch = step(0.98, n * hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, branch);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Discharge', type: 'color', default: [0.4, 0.8, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Insulator', type: 'color', default: [0.05, 0.05, 0.08, 1.0] }
  ]
};

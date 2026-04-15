export default {
  id: 'blueprint_grid_tech',
  name: 'Blueprint Grid',
  category: 'Utility',
  description: 'Technical structural alignment grid.',
  shader: `
    vec3 generate() {
      vec2 g = fract(v_uv * u_scale);
      float mask = step(0.98, max(g.x, g.y));
      return mix(vec3(0.02, 0.05, 0.15), vec3(0.0, 0.8, 1.0), mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grid Count', type: 'float', min: 5.0, max: 100.0, default: 20.0 }
  ]
};

export default {
  id: 'micro_logic_grid_artisan',
  name: 'Logic Array',
  category: 'Technology',
  description: 'Microscopic grid of semiconductor logic gates and data-bus structures.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Gate Matrix', type: 'float', min: 10.0, max: 200.0, default: 80.0 },
    { id: 'u_primary_color', name: 'Bus Copper', type: 'color', default: [0.8, 1.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Silicon Base', type: 'color', default: [0.05, 0.05, 0.1, 1.0] }
  ]
};

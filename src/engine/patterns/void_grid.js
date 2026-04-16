export default {
  id: 'void_grid_artisan',
  name: 'Void Grid',
  category: 'Abstract',
  description: 'Infinite perspective grid reminiscent of 1980s retro-futuristic digital visualization.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grid Density', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Grid Glow', type: 'color', default: [1.0, 0.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Void Base', type: 'color', default: [0.0, 0.0, 0.05, 1.0] }
  ]
};

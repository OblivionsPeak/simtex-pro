export default {
  id: 'geo_grid_28',
  name: 'Grid Pattern 28',
  category: 'Geometric',
  description: 'Procedural generation 28 of grid pattern 28.',
  shader: \vec3 generate() { vec2 g = fract(v_uv * u_scale); float d = step(0.95, max(g.x, g.y)); return mix(u_secondary_color, u_primary_color, d); }\,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 500.0, default: 24.0 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};

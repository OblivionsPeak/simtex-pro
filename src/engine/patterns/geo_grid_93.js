export default {
  id: 'geo_grid_93',
  name: 'Grid Pattern 93',
  category: 'Geometric',
  description: 'Procedural generation 93 of grid pattern 93.',
  shader: \vec3 generate() { vec2 g = fract(v_uv * u_scale); float d = step(0.95, max(g.x, g.y)); return mix(u_secondary_color, u_primary_color, d); }\,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 500.0, default: 56.5 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};

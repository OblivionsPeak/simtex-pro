export default {
  id: 'geo_grid_113',
  name: 'Lattice Grid 113',
  category: 'Geometric',
  description: 'High-quality procedural lattice grid variation 113.',
  shader: `vec3 generate() { vec2 g = fract(v_uv * u_scale); float d = step(0.95, max(g.x, g.y)); return mix(u_secondary_color, u_primary_color, d); }`,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 1000.0, default: 66.5 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};
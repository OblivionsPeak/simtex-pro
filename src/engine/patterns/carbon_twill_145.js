export default {
  id: 'carbon_twill_145',
  name: 'Twill Pattern 145',
  category: 'Racing',
  description: 'Procedural generation 145 of twill pattern 145.',
  shader: \vec3 generate() { float d = step(0.5, fract(v_uv.x * u_scale + v_uv.y * 0.5)); return mix(u_secondary_color, u_primary_color, d); }\,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 500.0, default: 82.5 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};

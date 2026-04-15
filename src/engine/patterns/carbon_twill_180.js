export default {
  id: 'carbon_twill_180',
  name: 'Twill Pattern 180',
  category: 'Racing',
  description: 'Procedural generation 180 of twill pattern 180.',
  shader: \vec3 generate() { float d = step(0.5, fract(v_uv.x * u_scale + v_uv.y * 0.5)); return mix(u_secondary_color, u_primary_color, d); }\,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 500.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};

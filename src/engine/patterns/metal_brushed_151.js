export default {
  id: 'metal_brushed_151',
  name: 'Brushed Pattern 151',
  category: 'Industrial',
  description: 'Procedural generation 151 of brushed pattern 151.',
  shader: \vec3 generate() { float d = fract(sin(v_uv.x * 0.1) * u_scale); return mix(u_secondary_color, u_primary_color, d); }\,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 500.0, default: 85.5 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};

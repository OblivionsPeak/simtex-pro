export default {
  id: 'metal_brushed_6',
  name: 'Metal Brushed 6',
  category: 'Industrial',
  description: 'High-quality procedural metal brushed variation 6.',
  shader: `vec3 generate() { float d = fract(sin(v_uv.x * 0.1) * u_scale); return mix(u_secondary_color, u_primary_color, d); }`,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 1000.0, default: 13.0 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};
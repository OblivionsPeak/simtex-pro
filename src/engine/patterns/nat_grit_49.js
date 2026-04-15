export default {
  id: 'nat_grit_49',
  name: 'Stone Grit 49',
  category: 'Natural',
  description: 'High-quality procedural stone grit variation 49.',
  shader: `vec3 generate() { float d = fract(sin(dot(floor(v_uv * u_scale), vec2(12.9, 78.2))) * 43758.5); return mix(u_secondary_color, u_primary_color, d); }`,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 1000.0, default: 34.5 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};
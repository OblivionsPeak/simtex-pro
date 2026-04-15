export default {
  id: 'nat_grit_24',
  name: 'Grit Pattern 24',
  category: 'Natural',
  description: 'Procedural generation 24 of grit pattern 24.',
  shader: \vec3 generate() { float d = fract(sin(dot(floor(v_uv * u_scale), vec2(12.9, 78.2))) * 43758.5); return mix(u_secondary_color, u_primary_color, d); }\,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 500.0, default: 22.0 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};

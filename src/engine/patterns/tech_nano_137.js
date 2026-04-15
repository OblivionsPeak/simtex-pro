export default {
  id: 'tech_nano_137',
  name: 'Nano Weave 137',
  category: 'Technology',
  description: 'High-quality procedural nano weave variation 137.',
  shader: `vec3 generate() { float d = step(0.9, sin(v_uv.x * u_scale) * cos(v_uv.y * u_scale)); return mix(u_secondary_color, u_primary_color, d); }`,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 1000.0, default: 78.5 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.35, 0.35, 0.4] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.1, 0.1, 0.12] }
  ]
};
export default {
  id: 'skeletal_mesh_artisan',
  name: 'Skeletal Mesh',
  category: 'Abstract',
  description: 'Periodic rib-like line patterns with organic jitter found in anatomical structures.',
  shader: `
    vec4 generate() {
      float ribs = sin(v_uv.y * 50.0 * u_scale + sin(v_uv.x * 20.0));
      float mask = smoothstep(0.0, 0.1, ribs);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rib Frequency', type: 'float', min: 0.1, max: 2.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Bone', type: 'color', default: [0.9, 0.9, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Marrow', type: 'color', default: [0.1, 0.05, 0.05, 1.0] }
  ]
};

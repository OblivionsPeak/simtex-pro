export default {
  id: 'steel_wool_artisan',
  name: 'Steel Wool',
  category: 'Industrial',
  added: '2026-04-15',
  description: 'Chaos-line noise mimicking tangled metal strands found in industrial abrasives.',
  shader: `
    vec4 generate() {
      float n = hash(v_uv * 1000.0) * hash(v_uv * 100.0);
      float mask = smoothstep(0.0, 0.2, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Steel Strand', type: 'color', default: [0.7, 0.7, 0.75, 1.0] },
    { id: 'u_secondary_color', name: 'Internal Shadow', type: 'color', default: [0.1, 0.1, 0.15, 1.0] }
  ]
};

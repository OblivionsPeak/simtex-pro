export default {
  id: 'neon_tubes_artisan',
  name: 'Neon Path',
  category: 'Abstract',
  description: 'Glowing tubular neon paths mimicking high-fidelity urban lighting rigs.',
  shader: `
    vec4 generate() {
      float y = fract(v_uv.y * u_scale);
      float mask = smoothstep(0.1, 0.2, y) * smoothstep(0.9, 0.8, y);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tube Count', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Neon Glow', type: 'color', default: [1.0, 0.0, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Vacuum Background', type: 'color', default: [0.05, 0.0, 0.05, 1.0] }
  ]
};

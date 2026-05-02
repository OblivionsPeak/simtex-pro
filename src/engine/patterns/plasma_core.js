export default {
  id: 'plasma_core_artisan',
  name: 'Plasma Core',
  category: 'Abstract',
  description: 'Pulsing radial energy patterns mimicking high-energy physics experiment cores.',
  shader: `
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale - 1.5708);
      float mask = smoothstep(0.2, 0.5, pulse * (1.0 - d));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pulse Speed', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Plasma Glow', type: 'color', default: [1.0, 0.4, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Plasma Void', type: 'color', default: [0.1, 0.0, 0.1, 1.0] }
  ]
};

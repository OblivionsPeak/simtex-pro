export default {
  id: 'pulsar_radial_artisan',
  name: 'Pulsar Radial',
  category: 'Abstract',
  description: 'High-frequency radial pulses mimicking deep-space electromagnetic emissions.',
  shader: `
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale);
      float mask = step(0.5, pulse);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pulse Freq', type: 'float', min: 50.0, max: 500.0, default: 200.0 },
    { id: 'u_primary_color', name: 'Pulsar Beam', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Space Void', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

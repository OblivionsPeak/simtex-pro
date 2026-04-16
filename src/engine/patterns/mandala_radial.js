export default {
  id: 'mandala_radial_artisan',
  name: 'Mandala Radial',
  category: 'Abstract',
  description: 'Harmonic geometric recurrence and radial symmetry patterns.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float d = length(uv);
      float pulses = sin(d * 40.0) * sin(angle * 8.0);
      float mask = step(0.0, pulses);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Geometry Glow', type: 'color', default: [1.0, 0.8, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Mental Void', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

export default {
  id: 'tire_marbles_artisan',
  name: 'Tire Marbles',
  category: 'Racing',
  added: '2026-04-16',
  description: 'Clumpy rubber debris and "offline" track grit formed during high-heat racing conditions.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.8, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grit Size', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_primary_color', name: 'Rubber Clump', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Track Surface', type: 'color', default: [0.2, 0.2, 0.2, 1.0] }
  ]
};

export default {
  id: 'ink_blot_test_artisan',
  name: 'Ink Blot',
  category: 'Abstract',
  description: 'Symmetrical organic Rorschach blobs mimicking organic ink flow on folded paper.',
  shader: `
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float n = noise(uv * 5.0 + noise(uv * 10.0));
      float mask = step(0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Ink Body', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Paper White', type: 'color', default: [0.95, 0.95, 0.9, 1.0] }
  ]
};

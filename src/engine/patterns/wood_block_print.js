export default {
  id: 'wood_block_print_artisan',
  name: 'Wood Print',
  category: 'Abstract',
  description: 'Coarse carved relief texture mimicking traditional wood block printing techniques.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 80.0);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 5.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Relief High', type: 'color', default: [0.2, 0.2, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Carved Wood', type: 'color', default: [0.1, 0.05, 0.0, 1.0] }
  ]
};

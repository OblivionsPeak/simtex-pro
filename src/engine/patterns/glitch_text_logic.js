export default {
  id: 'glitch_text_logic_artisan',
  name: 'Logic Glitch',
  category: 'Abstract',
  description: 'Abstract blocks of logic-like symbols and corrupted data stream visualizations.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = floor(v_uv * 40.0);
      float n = hash(uv);
      float mask = step(0.7, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Bit Glow', type: 'color', default: [0.0, 1.0, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Buffer Black', type: 'color', default: [0.0, 0.01, 0.0, 1.0] }
  ]
};

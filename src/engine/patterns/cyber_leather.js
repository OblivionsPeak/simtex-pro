export default {
  id: 'cyber_leather_artisan',
  name: 'Cyber Leather',
  category: 'Technology',
  description: 'Synthetic high-performance leather with integrated glowing micro-circuitry pores.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * 100.0;
      float mask = step(0.9, hash(floor(uv)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Circuit Glow', type: 'color', default: [1.0, 0.0, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Synthetic Skin', type: 'color', default: [0.05, 0.05, 0.06, 1.0] }
  ]
};

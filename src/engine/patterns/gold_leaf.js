export default {
  id: 'gold_leaf_artisan',
  name: 'Gold Leaf',
  category: 'Abstract',
  description: 'Irregular metallic foil noise and gold leaf textures for premium accents.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 100.0) * hash(v_uv * 10.0);
      float mask = smoothstep(0.1, 0.3, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Gilded', type: 'color', default: [1.0, 0.8, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Underneath', type: 'color', default: [0.2, 0.1, 0.0, 1.0] }
  ]
};

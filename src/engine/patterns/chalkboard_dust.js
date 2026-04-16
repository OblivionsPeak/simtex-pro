export default {
  id: 'chalkboard_dust_artisan',
  name: 'Chalk Dust',
  category: 'Abstract',
  description: 'Smudged powdery residue and chalk markings found on weathered racing boards.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n * 0.5);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Chalk Mark', type: 'color', default: [0.9, 0.9, 0.9, 1.0] },
    { id: 'u_secondary_color', name: 'Slate Base', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

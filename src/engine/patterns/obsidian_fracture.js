export default {
  id: 'obsidian_fracture_artisan',
  name: 'Obsidian Flow',
  category: 'Geology',
  description: 'Sharp, mirror-like volcanic glass fractures found in fresh obsidian flows.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(floor(v_uv * u_scale));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fracture Density', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Glass High', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Glass Shore', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

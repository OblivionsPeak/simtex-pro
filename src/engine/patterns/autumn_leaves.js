export default {
  id: 'autumn_leaves_artisan',
  name: 'Fallen Leaves',
  category: 'Nature',
  description: 'Clumped organic leaf-like shapes mimicking a forest floor in autumn.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Leaf Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Maple Red', type: 'color', default: [0.8, 0.2, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Damp Soil', type: 'color', default: [0.2, 0.1, 0.05, 1.0] }
  ]
};

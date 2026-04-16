export default {
  id: 'terrazzo_chip_artisan',
  name: 'Terrazzo Chip',
  category: 'Industrial',
  description: 'Scattered irregular stone flakes and marble chips mimicking professional terrazzo flooring.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float n = hash(i_uv);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      float mask = step(0.6, hash(i_uv * 1.5));
      return mix(u_secondary_color, vec4(col, 1.0), mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Chip Density', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_secondary_color', name: 'Binding Resin', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

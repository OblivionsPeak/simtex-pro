export default {
  id: 'gold_leaf_flake_artisan',
  name: 'Gold Flake',
  category: 'Abstract',
  description: 'Thin, irregular metallic foil fragments and gold leaf flakes mimicking luxurious textured finishes.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.95, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flake Density', type: 'float', min: 20.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Gold Leaf', type: 'color', default: [1.0, 0.8, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Base Resin', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

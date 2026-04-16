export default {
  id: 'pine_bark_artisan',
  name: 'Pine Bark',
  category: 'Nature',
  description: 'Rough, vertical flaky ridges found on mature pine trees.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Bark Detail', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Bark High', type: 'color', default: [0.3, 0.2, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Bark Crevice', type: 'color', default: [0.15, 0.1, 0.08, 1.0] }
  ]
};

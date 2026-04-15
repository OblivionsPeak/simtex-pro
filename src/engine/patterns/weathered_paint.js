export default {
  id: 'weathered_paint_artisan',
  name: 'Weathered Paint',
  category: 'Industrial',
  description: 'Chipped and peeling paint flakes mimicking aged industrial surfaces.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = step(0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Chip Detail', type: 'float', min: 5.0, max: 50.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Paint', type: 'color', default: [0.8, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Exposed Metal', type: 'color', default: [0.3, 0.3, 0.35, 1.0] }
  ]
};

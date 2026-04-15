export default {
  id: 'acid_etch_artisan',
  name: 'Acid Etch',
  category: 'Industrial',
  description: 'High-contrast stylized chemical erosion patterns found in weathered metals.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Acid Detail', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Etch Deep', type: 'color', default: [0.15, 0.12, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Original Plane', type: 'color', default: [0.4, 0.4, 0.45, 1.0] }
  ]
};

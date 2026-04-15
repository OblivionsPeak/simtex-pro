export default {
  id: 'asphalt_pro_artisan',
  name: 'Asphalt Pro',
  category: 'Racing',
  description: 'High-detail granular road surface noise found on professional track layouts.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Detail', type: 'float', min: 100.0, max: 1000.0, default: 400.0 },
    { id: 'u_primary_color', name: 'Stone Grey', type: 'color', default: [0.3, 0.3, 0.32, 1.0] },
    { id: 'u_secondary_color', name: 'Tar Base', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

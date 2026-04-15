export default {
  id: 'glacier_ice_artisan',
  name: 'Glacier Ice',
  category: 'Natural',
  description: 'Crackled crystalline planes with directional depth found in Arctic ice formations.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float crack = step(0.9, hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, (n + crack) * 0.5);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Shelf Scale', type: 'float', min: 1.0, max: 20.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Clean Ice', type: 'color', default: [0.9, 0.95, 1.0, 0.8] },
    { id: 'u_secondary_color', name: 'Deep Freeze', type: 'color', default: [0.1, 0.3, 0.5, 1.0] }
  ]
};

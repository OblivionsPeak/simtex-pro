export default {
  id: 'brake_dust_artisan',
  name: 'Brake Dust',
  category: 'Racing',
  description: 'Fine anisotropic dark grit and metallic shavings found on race-worn wheel rims.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Dust Fleck', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Base Rim', type: 'color', default: [0.3, 0.3, 0.32, 1.0] }
  ]
};

export default {
  id: 'brake_rotor_wear_artisan',
  name: 'Brake Rotor Wear',
  category: 'Racing',
  description: 'Circular friction streaks and heat scarring found on high-performance ceramic and steel rotors.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float streaks = hash(floor(d * u_scale));
      return mix(u_secondary_color, u_primary_color, streaks);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wear Density', type: 'float', min: 200.0, max: 2000.0, default: 1000.0 },
    { id: 'u_primary_color', name: 'Metal Body', type: 'color', default: [0.7, 0.7, 0.75, 1.0] },
    { id: 'u_secondary_color', name: 'Scuff Mark', type: 'color', default: [0.5, 0.5, 0.55, 1.0] }
  ]
};

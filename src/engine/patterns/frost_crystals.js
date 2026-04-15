export default {
  id: 'frost_crystals_artisan',
  name: 'Frost Crystals',
  category: 'Natural',
  description: 'Crystalline window-ice patterns and frost blooms found in extreme cold.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * 10.0);
      float crystal = step(0.9, hash(v_uv * 20.0 + n));
      return mix(u_secondary_color, u_primary_color, crystal);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Frost', type: 'color', default: [0.9, 0.95, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Glass', type: 'color', default: [0.1, 0.2, 0.3, 1.0] }
  ]
};

export default {
  id: 'brake_rotors_artisan',
  name: 'Brake Rotors',
  category: 'Industrial',
  description: 'Concentric heat-etched metal grooves found on high-performance brake discs.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float r = length(uv);
      float mask = sin(r * 100.0 * (1.0 + u_intensity)) * 0.5 + 0.5;
      mask *= step(0.1, r) * step(r, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_intensity', name: 'Groove Density', type: 'float', min: 0.1, max: 2.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Etched Steel', type: 'color', default: [0.8, 0.8, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Burnish', type: 'color', default: [0.2, 0.2, 0.25, 1.0] }
  ]
};

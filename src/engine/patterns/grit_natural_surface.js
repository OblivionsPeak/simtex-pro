export default {
  id: 'grit_natural_surface',
  name: 'Natural Grit',
  category: 'Natural',
  description: 'Rough organic stone/sand surface.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9, 78.2))) * 43758.5); }
    vec3 generate() {
      float n = hash(floor(v_uv * u_scale));
      vec3 color = mix(u_secondary_color, u_primary_color, n);
      if (u_is_spec > 0.5) return vec3(0.0, 0.85, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Scale', type: 'float', min: 100.0, max: 1000.0, default: 500.0 },
    { id: 'u_primary_color', name: 'Grit', type: 'color', default: [0.4, 0.35, 0.3] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.2, 0.18, 0.15] }
  ]
};

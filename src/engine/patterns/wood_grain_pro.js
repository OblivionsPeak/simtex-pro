export default {
  id: 'wood_grain_artisan',
  name: 'Wood Grain Pro',
  category: 'Natural',
  description: 'High-detail procedural timber with concentric growth rings and knots.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv * 0.1);
      float ring = fract(length(uv - n * 2.0) * 5.0);
      float mask = smoothstep(0.4, 0.6, ring);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wood density', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Grain Color', type: 'color', default: [0.3, 0.15, 0.05, 1.0] },
    { id: 'u_secondary_color', name: 'Base Timber', type: 'color', default: [0.45, 0.25, 0.1, 1.0] }
  ]
};

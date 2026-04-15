export default {
  id: 'water_ripples_artisan',
  name: 'Water Ripples',
  category: 'Natural',
  description: 'Static concentric liquid wave interference patterns.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      // Removed time from ripple function
      float ripple = sin(d * 20.0);
      float mask = smoothstep(-0.1, 0.1, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wave Scale', type: 'float', min: 1.0, max: 10.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Peak Color', type: 'color', default: [0.1, 0.6, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Water', type: 'color', default: [0.0, 0.2, 0.4, 1.0] }
  ]
};

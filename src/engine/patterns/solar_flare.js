export default {
  id: 'solar_flare_pro',
  name: 'Solar Flare',
  category: 'Abstract',
  description: 'Static plasma energy flux with high-intensity radiation centers.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time dependency
      float n = noise(uv);
      float flare = pow(n, 3.0) * 2.0;
      return mix(u_secondary_color, u_primary_color, flare);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flare Scale', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Plasma Heat', type: 'color', default: [1.0, 0.8, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Corona', type: 'color', default: [0.5, 0.1, 0.0, 1.0] }
  ]
};

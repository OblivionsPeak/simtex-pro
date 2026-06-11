export default {
  id: 'fingerprint_swirls_artisan',
  name: 'Fingerprint Swirls',
  category: 'Natural',
  description: 'Swirling organic ridge patterns mimicking human dermatoglyphics.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 5.0) * 2.0);
      float mask = sin(n * 20.0);
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Ridge Detail', type: 'float', min: 2.0, max: 15.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Ridge', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Valley', type: 'color', default: [0.95, 0.9, 0.85, 1.0] }
  ]
};

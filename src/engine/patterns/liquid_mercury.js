export default {
  id: 'liquid_mercury_artisan',
  name: 'Liquid Mercury',
  category: 'Abstract',
  description: 'Smooth, blobby metallic shapes with high specularity mimicking liquid metal.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.45, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Blob Size', type: 'float', min: 1.0, max: 10.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Mercury', type: 'color', default: [0.8, 0.8, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

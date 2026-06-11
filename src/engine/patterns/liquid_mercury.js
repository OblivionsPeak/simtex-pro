export default {
  id: 'liquid_mercury_artisan',
  name: 'Liquid Mercury',
  category: 'Abstract',
  added: '2026-04-15',
  description: 'Smooth, blobby metallic shapes with high specularity mimicking liquid metal.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.45, n);
      vec4 col = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) {
        // Liquid metal: full metallic on blobs, near-zero roughness; voids slightly duller
        return vec4(mix(0.85, 1.0, mask), mix(0.06, 0.02, mask), 0.0, col.a);
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Blob Size', type: 'float', min: 1.0, max: 10.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Mercury', type: 'color', default: [0.8, 0.8, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

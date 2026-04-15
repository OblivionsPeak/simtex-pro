export default {
  id: 'peacock_eyes_artisan',
  name: 'Peacock Eyes',
  category: 'Natural',
  description: 'Ornate organic pattern mimicking the "eyes" found in peacock feathers.',
  shader: `
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      vec4 col = u_secondary_color;
      col = mix(col, u_primary_color, smoothstep(0.4, 0.35, d));
      col = mix(col, vec4(0.0, 0.0, 0.5, 1.0), smoothstep(0.25, 0.2, d));
      col = mix(col, vec4(0.0, 1.0, 1.0, 1.0), smoothstep(0.1, 0.05, d));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Eye Count', type: 'float', min: 2.0, max: 20.0, default: 6.0 },
    { id: 'u_primary_color', name: 'Eye Border', type: 'color', default: [0.1, 0.8, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Feather Base', type: 'color', default: [0.05, 0.2, 0.05, 1.0] }
  ]
};

export default {
  id: 'sand_dunes_artisan',
  name: 'Sand Dunes',
  category: 'Natural',
  description: 'Rippling wave-like ridges found in vast desert wastelands and oceanic floors.',
  shader: `
    vec4 generate() {
      float waves = sin(v_uv.x * 20.0 * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, waves);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Dune Frequency', type: 'float', min: 0.5, max: 3.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Sunlight', type: 'color', default: [0.9, 0.7, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Shadow', type: 'color', default: [0.4, 0.3, 0.15, 1.0] }
  ]
};

export default {
  id: 'sandstone_layers_artisan',
  name: 'Sandstone Strata',
  category: 'Geology',
  description: 'Fine horizontal layers and sediments found in weathered sandstone walls.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = v_uv.y * u_scale;
      float strata = hash(floor(y));
      return mix(u_secondary_color, u_primary_color, strata);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Strata Density', type: 'float', min: 20.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Sediment High', type: 'color', default: [0.8, 0.6, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Sediment Deep', type: 'color', default: [0.6, 0.4, 0.3, 1.0] }
  ]
};

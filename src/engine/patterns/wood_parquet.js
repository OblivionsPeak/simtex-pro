export default {
  id: 'wood_parquet_artisan',
  name: 'Wood Parquet',
  category: 'Industrial',
  description: 'Complex interlocking geometric floor planks for premium interior design.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Mosaic Size', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Plank A', type: 'color', default: [0.5, 0.3, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Plank B', type: 'color', default: [0.4, 0.25, 0.08, 1.0] }
  ]
};

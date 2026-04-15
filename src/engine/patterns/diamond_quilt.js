export default {
  id: 'diamond_quilt_artisan',
  name: 'Diamond Quilt',
  category: 'Abstract',
  description: 'Stitched padded fabric effect with soft surface shading for luxury upholstery.',
  shader: `
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = fract(uv);
      float d = length(gv - 0.5);
      float mask = smoothstep(0.5, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stitch Size', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Padding', type: 'color', default: [0.9, 0.9, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Stitch Deep', type: 'color', default: [0.5, 0.5, 0.6, 1.0] }
  ]
};

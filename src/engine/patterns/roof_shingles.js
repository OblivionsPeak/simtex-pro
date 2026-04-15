export default {
  id: 'roof_shingles_artisan',
  name: 'Scalloped Shingles',
  category: 'Industrial',
  description: 'Overlapping curved roofing tiles used in architectural design.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = step(d, 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tile Rows', type: 'float', min: 5.0, max: 30.0, default: 15.0 },
    { id: 'u_primary_color', name: 'Shingle', type: 'color', default: [0.2, 0.2, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Rim', type: 'color', default: [0.4, 0.4, 0.45, 1.0] }
  ]
};

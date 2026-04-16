export default {
  id: 'diamond_stitch_v2_artisan',
  name: 'Pro Diamond Stitch',
  category: 'Racing',
  description: 'Advanced padded upholstery with individual cross-stitching detail found in luxury GT cockpits.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Diamond Size', type: 'float', min: 2.0, max: 15.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Padding', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Stitch Line', type: 'color', default: [0.4, 0.0, 0.0, 1.0] }
  ]
};

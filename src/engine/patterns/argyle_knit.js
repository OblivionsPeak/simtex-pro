export default {
  id: 'argyle_knit_artisan',
  name: 'Argyle Knit',
  category: 'Abstract',
  description: 'Classic diamond-checkered textile pattern with structural crossing threads.',
  shader: `
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Diamond Zoom', type: 'float', min: 2.0, max: 20.0, default: 6.0 },
    { id: 'u_primary_color', name: 'Primary Knit', type: 'color', default: [0.1, 0.2, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Secondary Knit', type: 'color', default: [0.15, 0.25, 0.5, 1.0] }
  ]
};

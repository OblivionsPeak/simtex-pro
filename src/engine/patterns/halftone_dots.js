export default {
  id: 'halftone_dots_artisan',
  name: 'CMYK Halftone',
  category: 'Abstract',
  description: 'Professional offset color dots and halftone patterns used in high-end graphic design.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(d, 0.4);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Dot Density', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_primary_color', name: 'Ink Dot', type: 'color', default: [0.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Paper White', type: 'color', default: [1.0, 1.0, 1.0, 1.0] }
  ]
};

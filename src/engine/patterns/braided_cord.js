export default {
  id: 'braided_cord_artisan',
  name: 'Braided Cord',
  category: 'Industrial',
  description: 'Overlapping thick strands of woven tactical rope found in automotive and maritime gear.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Braid Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Strand Top', type: 'color', default: [0.3, 0.3, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Seam Shadow', type: 'color', default: [0.05, 0.05, 0.1, 1.0] }
  ]
};

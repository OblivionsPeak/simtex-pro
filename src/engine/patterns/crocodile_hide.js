export default {
  id: 'crocodile_hide_artisan',
  name: 'Crocodile Hide',
  category: 'Natural',
  description: 'Large rectangular blocky scales with organic gap jitter found in reptilian leather.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Zoom', type: 'float', min: 2.0, max: 15.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Leather Top', type: 'color', default: [0.15, 0.1, 0.05, 1.0] },
    { id: 'u_secondary_color', name: 'Scale Gap', type: 'color', default: [0.05, 0.03, 0.01, 1.0] }
  ]
};

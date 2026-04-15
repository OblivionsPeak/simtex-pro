export default {
  id: 'wicker_weave_artisan',
  name: 'Wicker Weave',
  category: 'Natural',
  description: 'Interlocking thick strands of woven wood found in traditional basketry.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float w = floor(uv.y);
      if (mod(w, 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Wicker Slat', type: 'color', default: [0.7, 0.5, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Joint Deep', type: 'color', default: [0.2, 0.1, 0.05, 1.0] }
  ]
};

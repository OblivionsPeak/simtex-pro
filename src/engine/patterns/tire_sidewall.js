export default {
  id: 'tire_sidewall_artisan',
  name: 'Tire Sidewall',
  category: 'Racing',
  description: 'Raised geometric patterns and grip ridges found on professional racing tires.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.4) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Detail Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Rubber High', type: 'color', default: [0.15, 0.15, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Rubber Base', type: 'color', default: [0.08, 0.08, 0.08, 1.0] }
  ]
};

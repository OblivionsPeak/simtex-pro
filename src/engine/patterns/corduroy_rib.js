export default {
  id: 'corduroy_rib_artisan',
  name: 'Corduroy Rib',
  category: 'Abstract',
  description: 'Parallel fuzzy ridges of heavy fabric used in durable workwear.',
  shader: `
    vec4 generate() {
      float rib = sin(v_uv.x * 100.0 * u_scale);
      float mask = smoothstep(-0.5, 0.5, rib);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rib Frequency', type: 'float', min: 0.1, max: 2.0, default: 0.8 },
    { id: 'u_primary_color', name: 'Rib Ridge', type: 'color', default: [0.4, 0.3, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Rib Valley', type: 'color', default: [0.15, 0.1, 0.05, 1.0] }
  ]
};

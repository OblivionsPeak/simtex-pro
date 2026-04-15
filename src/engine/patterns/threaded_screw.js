export default {
  id: 'threaded_screw_artisan',
  name: 'Threaded Bolt',
  category: 'Industrial',
  description: 'Helical metal grooves representing industrial fasteners and bolts.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float thread = sin(uv.y * 10.0 - uv.x * 2.0);
      float mask = smoothstep(-0.1, 0.1, thread);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Thread Pitch', type: 'float', min: 1.0, max: 10.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Peak Metal', type: 'color', default: [0.9, 0.9, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Valley', type: 'color', default: [0.1, 0.1, 0.15, 1.0] }
  ]
};

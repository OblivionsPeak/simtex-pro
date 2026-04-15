export default {
  id: 'canvas_rip_artisan',
  name: 'Canvas Rip',
  category: 'Abstract',
  description: 'Rough, crossing threads with a torn opening mimicking shredded heavy canvas.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = step(0.8, hash(floor(uv.xx * 2.0))) * step(0.8, hash(floor(uv.yy * 2.0)));
      float rip = step(0.5 + hash(v_uv * 5.0) * 0.2, v_uv.x);
      return mix(u_secondary_color, u_primary_color, lines * rip);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Thread Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Thread', type: 'color', default: [0.9, 0.85, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.1, 0.1, 0.1, 0.0] }
  ]
};

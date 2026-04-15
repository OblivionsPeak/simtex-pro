export default {
  id: 'charcoal_sketch_artisan',
  name: 'Charcoal Sketch',
  category: 'Abstract',
  description: 'Cross-hatched noise lines mimicking hand-drawn charcoal or graphite sketches.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.9, hash(uv));
      mask += step(0.95, hash(uv.yx + 10.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Density', type: 'float', min: 50.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Pencil Lead', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Paper White', type: 'color', default: [0.95, 0.95, 0.92, 1.0] }
  ]
};

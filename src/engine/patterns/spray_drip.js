export default {
  id: 'spray_drip_artisan',
  name: 'Spray Drip',
  category: 'Abstract',
  description: 'Static vertical paint drip effect mimicking street-art application.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float x = floor(v_uv.x * u_scale);
      float h = hash(x);
      float mask = step(v_uv.y, h * 0.5 + 0.3);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Drip Count', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Drip Color', type: 'color', default: [1.0, 0.0, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

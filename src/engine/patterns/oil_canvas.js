export default {
  id: 'oil_canvas_artisan',
  name: 'Oil Canvas Strokes',
  category: 'Abstract',
  description: 'Directional brush-stroke noise mimicking thick oil paint on canvas.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv.y * 50.0) + vec2(floor(uv.x * 2.0), 0.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Canvas Zoom', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Paint Color', type: 'color', default: [0.6, 0.1, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Canvas Weave', type: 'color', default: [0.8, 0.75, 0.7, 1.0] }
  ]
};

export default {
  id: 'impasto_paint_artisan',
  name: 'Impasto Paint',
  category: 'Abstract',
  description: 'Thick, textured brush strokes and heavy oil paint impasto effects.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Paint Peak', type: 'color', default: [0.8, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Canvas Base', type: 'color', default: [0.4, 0.0, 0.0, 1.0] }
  ]
};

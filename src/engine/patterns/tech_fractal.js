export default {
  id: 'tech_fractal_artisan',
  name: 'Logic Fractal',
  category: 'Abstract',
  description: 'Geometric recursive logic patterns mimicking complex computational architectures.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      float d = 0.0;
      for (int i=0; i<3; i++) {
        uv = abs(uv - 0.5) * 2.0;
        d += length(uv - 0.5);
      }
      float mask = step(1.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Pattern Edge', type: 'color', default: [0.0, 0.8, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Core', type: 'color', default: [0.0, 0.1, 0.15, 1.0] }
  ]
};

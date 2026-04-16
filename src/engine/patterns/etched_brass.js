export default {
  id: 'etched_brass_artisan',
  name: 'Etched Brass',
  category: 'Industrial',
  description: 'Victorian-style chemical etching and ornate brass panel patterns.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * 10.0;
      float lines = sin(uv.x) * sin(uv.y) + sin(uv.x * 2.0) * cos(uv.y * 2.0);
      float mask = step(0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Brass High', type: 'color', default: [0.8, 0.6, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Etched Deep', type: 'color', default: [0.4, 0.3, 0.1, 1.0] }
  ]
};

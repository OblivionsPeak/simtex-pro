export default {
  id: 'damask_lace_artisan',
  name: 'Damask Lace',
  category: 'Abstract',
  description: 'Complex organic floral symmetry and decorative lace patterns.',
  shader: `
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float d = 0.0;
      for (int i=0; i<4; i++) {
        uv = abs(uv - 0.5) * 1.5;
        d += sin(uv.x * 10.0) * cos(uv.y * 10.0);
      }
      float mask = step(0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Lace High', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Sheer Base', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

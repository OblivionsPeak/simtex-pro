export default {
  id: 'seat_perforation_artisan',
  name: 'Seat Perforation',
  category: 'Racing',
  description: 'Grid of fine ventilation holes found in professional bucket seats and luxury automotive leather.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.3, 0.28, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Hole Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Punch Hold', type: 'color', default: [0.0, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Leather Surface', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

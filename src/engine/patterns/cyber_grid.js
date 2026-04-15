export default {
  id: 'cyber_grid_pro',
  name: 'Cyber Grid',
  category: 'Technology',
  description: 'Pulsing data-matrix style grid with secondary interference lines.',
  shader: `
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale);
      float grid = step(0.95, max(g.x, g.y));
      
      float pulse = sin(u_time * 2.0 + v_uv.y * 10.0) * 0.5 + 0.5;
      float mask = grid * pulse;
      
      // Secondary fine grid
      vec2 g2 = fract(v_uv * u_scale * 4.0);
      mask += step(0.98, max(g2.x, g2.y)) * 0.3;
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grid Resolution', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Grid Glow', type: 'color', default: [0.0, 0.6, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Base Void', type: 'color', default: [0.02, 0.02, 0.05, 1.0] }
  ]
};

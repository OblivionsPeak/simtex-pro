export default {
  id: 'wavy_checkers_artisan',
  name: 'Wavy Checkers',
  category: 'Racing',
  description: 'Flowing, distorted racing flags mimicking a waving checkered banner.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      uv.x += sin(uv.y * 3.0) * 0.2;
      uv.y += cos(uv.x * 2.0) * 0.1;
      
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Check Size', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Checker A', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Checker B', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

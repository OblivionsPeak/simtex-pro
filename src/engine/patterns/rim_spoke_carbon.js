export default {
  id: 'rim_spoke_carbon_artisan',
  name: 'Spoke Carbon',
  category: 'Racing',
  description: 'Multi-layered carbon strands optimized for high-strength wheel spokes.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x + uv.y) * sin(uv.x - uv.y);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wave Density', type: 'float', min: 20.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Fiber Top', type: 'color', default: [0.2, 0.2, 0.22, 1.0] },
    { id: 'u_secondary_color', name: 'Resin Base', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

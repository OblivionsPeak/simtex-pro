export default {
  id: 'fusion_panel_artisan',
  name: 'Fusion Plating',
  category: 'Technology',
  description: 'Complex geometric panel lines and "greebles" found on high-energy reactor housings.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.02, f_uv.x) * step(f_uv.x, 0.98) * step(0.02, f_uv.y) * step(f_uv.y, 0.98);
      float n = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask * n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Panel Detail', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Alloy Surface', type: 'color', default: [0.12, 0.12, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Panel Joint', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

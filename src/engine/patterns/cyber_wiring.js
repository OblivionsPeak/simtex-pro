export default {
  id: 'cyber_wiring_artisan',
  name: 'Cyber Bundle',
  category: 'Technology',
  description: 'Dense, tangled bundles of high-speed digital wiring and fiber-optic strands.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale + sin(v_uv.x * 5.0));
      float n = hash(vec2(y, y));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wire Density', type: 'float', min: 20.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Wire Signal', type: 'color', default: [1.0, 0.8, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Insulation', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

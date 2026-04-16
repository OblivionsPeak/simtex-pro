export default {
  id: 'quartz_crystal_artisan',
  name: 'Quartz Plane',
  category: 'Geology',
  description: 'Sharp geometric crystalline planes and internal mineral prisms.',
  shader: `
    vec4 generate() {
      float d = abs(v_uv.x - 0.5) + abs(v_uv.y - 0.5);
      float mask = step(0.4, fract(d * u_scale));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Crystal Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Quartz Face', type: 'color', default: [0.9, 0.9, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Prism Core', type: 'color', default: [0.8, 0.8, 0.9, 1.0] }
  ]
};

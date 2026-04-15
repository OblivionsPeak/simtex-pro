export default {
  id: 'speed_trails_artisan',
  name: 'Speed Trails',
  category: 'Racing',
  description: 'Horizontal motion-style smears representing velocity and aerodynamic flow.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(y);
      float trail = step(0.9, hash(v_uv.x * 0.1 + y));
      return mix(u_secondary_color, u_primary_color, trail);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Trail Density', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_primary_color', name: 'Trail Lite', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.0, 0.0, 0.0, 0.0] }
  ]
};

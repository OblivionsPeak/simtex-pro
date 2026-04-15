export default {
  id: 'tire_tread_rain',
  name: 'Rain Tire Tread',
  category: 'Racing',
  description: 'Deep directional grooves for wet weather conditions.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      float x = abs(fract(uv.x) - 0.5);
      float y = fract(uv.y);
      float mask = step(0.15, abs(x - y * 0.5)) * step(0.05, x);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Rubber', type: 'color', default: [0.15, 0.15, 0.15] },
    { id: 'u_secondary_color', name: 'Groove', type: 'color', default: [0.05, 0.05, 0.05] }
  ]
};

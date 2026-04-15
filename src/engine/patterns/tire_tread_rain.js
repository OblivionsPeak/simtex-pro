export default {
  id: 'tire_tread_rain',
  name: 'Rain Tire Tread',
  category: 'Racing',
  description: 'Deep-groove directional rain tire pattern.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      float x = abs(fract(uv.x) - 0.5);
      float y = fract(uv.y);
      float tread = step(0.15, abs(x - y * 0.5)) * step(0.05, x);
      vec3 color = mix(u_secondary_color, u_primary_color, tread);
      if (u_is_spec > 0.5) return vec3(0.0, 0.9, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Rubber', type: 'color', default: [0.2, 0.2, 0.2] },
    { id: 'u_secondary_color', name: 'Groove', type: 'color', default: [0.05, 0.05, 0.05] }
  ]
};

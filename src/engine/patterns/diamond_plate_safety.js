export default {
  id: 'diamond_plate_safety',
  name: 'Safety Diamond Plate',
  category: 'Industrial',
  description: 'Raised non-slip industrial floor texture.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = step(0.15, abs(gv.x + gv.y)) + step(0.15, abs(gv.x - gv.y));
      d = 1.0 - step(1.9, d);
      vec3 color = mix(u_secondary_color, u_primary_color, d);
      if (u_is_spec > 0.5) return vec3(1.0, 0.2, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 5.0, max: 100.0, default: 30.0 },
    { id: 'u_primary_color', name: 'Raised', type: 'color', default: [0.6, 0.6, 0.6] },
    { id: 'u_secondary_color', name: 'Floor', type: 'color', default: [0.3, 0.3, 0.3] }
  ]
};

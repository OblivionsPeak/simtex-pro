export default {
  id: 'greek_key_artisan',
  name: 'Greek Key',
  category: 'Abstract',
  description: 'Classic ancient geometric meander border patterns found in historic architecture.',
  shader: `
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale);
      float mask = step(0.1, uv.x) * step(uv.x, 0.9) * step(0.1, uv.y) * step(uv.y, 0.9);
      mask -= step(0.3, uv.x) * step(uv.x, 0.7) * step(0.3, uv.y) * step(uv.y, 0.7);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Key Rows', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Meander', type: 'color', default: [0.8, 0.7, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Plinth', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

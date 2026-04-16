export default {
  id: 'starlight_drive_artisan',
  name: 'Star Drive',
  category: 'Abstract',
  description: 'Streaked starfield with motion blur effects found in high-speed space transit simulations.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float h = hash(y);
      float dash = step(0.9, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, dash * h);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Star Streak', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Space', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

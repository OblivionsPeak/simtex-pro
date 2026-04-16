export default {
  id: 'glitch_interference_artisan',
  name: 'Signal Glitch',
  category: 'Abstract',
  description: 'Chaotic horizontal interference and data-stream glitch patterns.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float x = v_uv.x + hash(y);
      float mask = step(0.5, fract(x * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Signal Peak', type: 'color', default: [0.0, 1.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Static Floor', type: 'color', default: [0.0, 0.05, 0.0, 1.0] }
  ]
};

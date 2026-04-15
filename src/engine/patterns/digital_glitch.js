export default {
  id: 'digital_glitch_pro',
  name: 'Digital Glitch',
  category: 'Abstract',
  description: 'Static pixel shift and signal interference simulation.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      // Removed time dependency from shift
      float shift = hash(y) * 0.2;
      float x = v_uv.x + shift;
      
      float mask = step(0.9, hash(floor(x * 10.0) + y));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Glitch Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Signal', type: 'color', default: [0.0, 1.0, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Noise', type: 'color', default: [0.05, 0.05, 0.08, 1.0] }
  ]
};

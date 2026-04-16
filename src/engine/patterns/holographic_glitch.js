export default {
  id: 'holographic_glitch_artisan',
  name: 'Hologlitch',
  category: 'Abstract',
  description: 'Chromatic offset stripes and holographic artifacts mimicking digital interference.',
  shader: `
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 40.0);
      float offset = hash(y);
      float r = step(0.5, fract(v_uv.x * 10.0 + offset));
      return mix(u_secondary_color, u_primary_color, r);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Cyan Beam', type: 'color', default: [0.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Magenta Blur', type: 'color', default: [1.0, 0.0, 1.0, 1.0] }
  ]
};

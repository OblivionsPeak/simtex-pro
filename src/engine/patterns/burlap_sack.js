export default {
  id: 'burlap_sack_artisan',
  name: 'Burlap Sack',
  category: 'Abstract',
  description: 'Coarse, wide-gap organic woven fibers used in heavy storage bags.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float h = step(0.7, fract(uv.x)) + step(0.7, fract(uv.y));
      float mask = clamp(h, 0.0, 1.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fibre Size', type: 'float', min: 5.0, max: 40.0, default: 15.0 },
    { id: 'u_primary_color', name: 'Fibre', type: 'color', default: [0.6, 0.5, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Shadow', type: 'color', default: [0.15, 0.1, 0.05, 1.0] }
  ]
};

export default {
  id: 'lichen_growth_artisan',
  name: 'Lichen Moss',
  category: 'Nature',
  description: 'Splotchy organic crust and symbiotic growths found on weathered rocks and trees.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, step(0.5, n));
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Lichen High', type: 'color', default: [0.7, 0.8, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Rock Base', type: 'color', default: [0.2, 0.2, 0.2, 1.0] }
  ]
};

export default {
  id: 'marble_stone_artisan',
  name: 'Marbled Stone',
  category: 'Organic',
  description: 'Natural stone texture with randomized crystalline veins.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv + noise(uv * 2.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Vein Density', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Vein Color', type: 'color', default: [0.95, 0.95, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Stone Base', type: 'color', default: [0.3, 0.3, 0.35, 1.0] }
  ]
};

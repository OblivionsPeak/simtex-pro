export default {
  id: 'shift_boot_leather_artisan',
  name: 'Shift Boot Leather',
  category: 'Racing',
  description: 'Organic crumpled leather folds and distressed textures found in shift boots and gaiters.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Leather High', type: 'color', default: [0.12, 0.1, 0.08, 1.0] },
    { id: 'u_secondary_color', name: 'Fold Shadow', type: 'color', default: [0.05, 0.04, 0.03, 1.0] }
  ]
};

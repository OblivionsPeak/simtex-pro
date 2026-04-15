export default {
  id: 'mother_of_pearl_artisan',
  name: 'Mother of Pearl',
  category: 'Natural',
  description: 'Iridescent-like wavy organic noise smears mimicking biological nacre.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float m = noise(v_uv * u_scale * 2.0 + n);
      return mix(u_secondary_color, u_primary_color, m);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Iridescence Detail', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_primary_color', name: 'Shell Pearl', type: 'color', default: [0.9, 0.95, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Shell Deep', type: 'color', default: [0.8, 0.85, 0.9, 1.0] }
  ]
};

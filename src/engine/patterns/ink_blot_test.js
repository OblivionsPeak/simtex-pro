export default {
  id: 'ink_blot_test_artisan',
  name: 'Ink Blot',
  category: 'Abstract',
  description: 'Symmetrical organic Rorschach blobs mimicking organic ink flow on folded paper.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float n = noise(uv * 5.0 + noise(uv * 10.0));
      float mask = step(0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Ink Body', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Paper White', type: 'color', default: [0.95, 0.95, 0.9, 1.0] }
  ]
};

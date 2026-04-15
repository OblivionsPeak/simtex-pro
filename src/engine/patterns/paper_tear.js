export default {
  id: 'paper_tear_artisan',
  name: 'Paper Tear Edge',
  category: 'Abstract',
  description: 'Jagged, fibrous edge transition mimicking a torn sheet of heavy paper.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0) * 0.1;
      float mask = step(0.5 + n, v_uv.y);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Paper Top', type: 'color', default: [0.95, 0.95, 0.92, 1.0] },
    { id: 'u_secondary_color', name: 'Paper Under', type: 'color', default: [0.85, 0.85, 0.8, 1.0] }
  ]
};

export default {
  id: 'impasto_paint_artisan',
  name: 'Impasto Paint',
  category: 'Abstract',
  description: 'Thick, textured brush strokes and heavy oil paint impasto effects.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Paint Peak', type: 'color', default: [0.8, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Canvas Base', type: 'color', default: [0.4, 0.0, 0.0, 1.0] }
  ]
};

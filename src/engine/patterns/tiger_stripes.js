export default {
  id: 'tiger_stripes_artisan',
  name: 'Predator Stripes',
  category: 'Organic',
  description: 'Organic predator-style tiger stripes with tapered edges.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(vec2(uv.x * 0.2, uv.y * 2.0));
      float mask = smoothstep(0.4, 0.6, n + sin(uv.x * 2.0) * 0.2);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stripe Spacing', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Stripe Color', type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_secondary_color', name: 'Base Color', type: 'color', default: [1.0, 0.45, 0.05, 1.0] }
  ]
};

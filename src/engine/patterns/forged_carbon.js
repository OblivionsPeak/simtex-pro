export default {
  id: 'forged_carbon',
  name: 'Forged Carbon',
  category: 'Organic',
  description: 'Randomized carbon shred pattern used in hypercars.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float fbm(vec2 p) {
      float f = 0.0;
      float a = 0.5;
      for(int i=0; i<6; i++) {
        f += a * abs(sin(p.x + sin(p.y)));
        p *= 2.0;
        a *= 0.5;
      }
      return f;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = fbm(uv * 3.0);
      float n2 = fbm(uv * 5.0 + n);
      float mask = mix(n, n2, 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flake Size', type: 'float', min: 1.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'High Carbon', type: 'color', default: [0.15, 0.15, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Base Carbon', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};
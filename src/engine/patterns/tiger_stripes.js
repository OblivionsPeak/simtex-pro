export default {
  id: 'tiger_stripe_organic',
  name: 'Predator Stripes',
  category: 'Organic',
  description: 'Organic predator-style tiger stripes with tapered edges.',
  shader: `
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(floor(uv * vec2(0.5, 10.0)));
      float val = sin(uv.x * 2.0 + n * 5.0 + sin(uv.y * 3.0));
      float mask = smoothstep(0.0, 0.2, val);
      
      vec3 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec3(0.0, 0.9, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Stripe', type: 'color', default: [0.1, 0.1, 0.1] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.8, 0.4, 0.1] }
  ]
};

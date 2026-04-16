export default {
  id: 'coral_reef_artisan',
  name: 'Coral Branch',
  category: 'Nature',
  description: 'Branching organic calcium structures mimicking underwater coral reef formations.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float d = 1.0;
      for (int i=0; i<4; i++) {
        float n = hash(floor(uv));
        d = min(d, length(fract(uv) - 0.5));
        uv *= 1.2;
        uv += n;
      }
      return mix(u_secondary_color, u_primary_color, smoothstep(0.2, 0.1, d));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Reef Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Polyps', type: 'color', default: [1.0, 0.5, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Ocean Depth', type: 'color', default: [0.0, 0.2, 0.4, 1.0] }
  ]
};

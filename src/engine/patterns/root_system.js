export default {
  id: 'root_system_artisan',
  name: 'Root System',
  category: 'Nature',
  description: 'Branching procedural line networks found in organic root systems and neural pathways.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float d = 1.0;
      for (int i=0; i<3; i++) {
        float n = hash(floor(uv));
        d = min(d, abs(fract(uv.x + n) - 0.5));
        uv *= 1.5;
        uv += n;
      }
      float mask = smoothstep(0.1, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Branching', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Root Fiber', type: 'color', default: [0.5, 0.4, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Soil Deep', type: 'color', default: [0.1, 0.08, 0.05, 1.0] }
  ]
};

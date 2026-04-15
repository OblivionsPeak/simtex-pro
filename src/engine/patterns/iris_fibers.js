export default {
  id: 'iris_fibers_artisan',
  name: 'Iris Fibers',
  category: 'Natural',
  description: 'Radial organic fibrous patterns found in the human eye iris.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 50.0, 0.0));
      float mask = smoothstep(0.1, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Pupil Edge', type: 'color', default: [0.1, 0.3, 0.6, 1.0] },
    { id: 'u_secondary_color', name: 'Outer Stroma', type: 'color', default: [0.0, 0.05, 0.1, 1.0] }
  ]
};

export default {
  id: 'abstract_reaction',
  name: 'Abstract Reaction',
  category: 'Abstract',
  description: 'Dynamic biological-style cell nodes.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.7, 31.1))) * 43758.5); }
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float d = length(fract(uv)-0.5);
      float mask = step(n * 0.4, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Cell', type: 'color', default: [1.0, 0.3, 0.1] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.01, 0.01, 0.01] }
  ]
};

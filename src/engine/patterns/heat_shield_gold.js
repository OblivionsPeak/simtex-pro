export default {
  id: 'heat_shield_gold',
  name: 'Gold Shield',
  category: 'Racing',
  description: 'Reflective structural heat insulation.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.4, abs(fract(uv.x)-0.5) + abs(fract(uv.y)-0.5));
      return mix(vec3(1.0, 0.8, 0.1), vec3(0.7, 0.5, 0.0), mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 20.0, max: 200.0, default: 100.0 }
  ]
};

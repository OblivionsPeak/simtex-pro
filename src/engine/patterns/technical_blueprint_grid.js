export default {
  id: 'technical_blueprint_grid',
  name: 'Blueprint Grid',
  category: 'Geometric',
  description: 'Blue structural engineering grid.',
  shader: `
    vec3 generate() {
      vec2 g = fract(v_uv * u_scale);
      float line = step(0.95, g.x) + step(0.95, g.y);
      vec3 color = mix(vec3(0.01, 0.05, 0.15), vec3(0.0, 0.8, 1.0), clamp(line, 0.0, 1.0));
      if (u_is_spec > 0.5) return vec3(0.3, 0.5, 0.8);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grid Units', type: 'float', min: 5.0, max: 100.0, default: 20.0 }
  ]
};

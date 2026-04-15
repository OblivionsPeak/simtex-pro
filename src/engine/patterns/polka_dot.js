export default {
  id: 'polka_dot_pro',
  name: 'Polka Dot',
  category: 'Geometric',
  description: 'Precision industrial dot pattern with adjustable spacing.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(u_size, d);
      
      vec3 color = mix(u_primary_color, u_secondary_color, mask);
      if (u_is_spec > 0.5) return vec3(0.0, 0.0, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 10.0, max: 200.0, default: 40.0 },
    { id: 'u_size', name: 'Dot Size', type: 'float', min: 0.1, max: 0.5, default: 0.25 },
    { id: 'u_primary_color', name: 'Dot', type: 'color', default: [1.0, 0.0, 0.0] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [ white, white, white ] }
  ]
};

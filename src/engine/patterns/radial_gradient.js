export default {
  id: 'radial_gradient_artisan',
  name: 'Radial Gradient',
  category: 'Abstract',
  description: 'Circular color transition from a center point.',
  shader: `
    vec3 generate() {
      vec2 center = vec2(u_center_x, u_center_y);
      float d = length(v_uv - center) * u_scale;
      float t = clamp(d, 0.0, 1.0);
      
      vec3 color = mix(u_primary_color, u_secondary_color, t);
      if (u_is_spec > 0.5) return vec3(0.0, 0.0, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Radius', type: 'float', min: 0.1, max: 5.0, default: 1.0 },
    { id: 'u_center_x', name: 'Center X', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_center_y', name: 'Center Y', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Inner Color', type: 'color', default: [1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Outer Color', type: 'color', default: [0.0, 0.0, 0.0] }
  ]
};

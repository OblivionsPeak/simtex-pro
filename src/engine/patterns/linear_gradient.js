export default {
  id: 'linear_gradient_artisan',
  name: 'Linear Gradient',
  category: 'Abstract',
  description: 'Smooth vector-based linear color transition.',
  shader: `
    vec3 generate() {
      float angle = u_rotation * 0.0174533; // Degrees to radians
      vec2 dir = vec2(cos(angle), sin(angle));
      float t = dot(v_uv - 0.5, dir) + 0.5;
      t = clamp(t, 0.0, 1.0);
      
      // Add softness control
      t = smoothstep(0.0, 1.0, t);
      
      vec3 color = mix(u_secondary_color, u_primary_color, t);
      if (u_is_spec > 0.5) return vec3(0.0, 0.0, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_rotation', name: 'Angle', type: 'float', min: 0.0, max: 360.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Start Color', type: 'color', default: [0.0, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'End Color', type: 'color', default: [0.0, 0.0, 0.2] }
  ]
};

export default {
  id: 'harlequin_diamond',
  name: 'Harlequin Diamond',
  category: 'Geometric',
  description: 'Classic high-contrast diagonal diamond pattern.',
  shader: `
    vec4 generate() {
      // Rotate 45 degrees
      float a = 0.785398;
      mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
      vec2 uv = rot * (v_uv - 0.5) * u_scale;
      
      vec2 id = floor(uv);
      float mask = mod(id.x + id.y, 2.0);
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 50.0, default: 12.0 },
    { id: 'u_primary_color', name: 'Color A', type: 'color', default: [1.0, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Color B', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

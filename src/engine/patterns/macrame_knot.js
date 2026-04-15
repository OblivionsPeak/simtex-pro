export default {
  id: 'macrame_knot_artisan',
  name: 'Macrame Knot',
  category: 'Abstract',
  description: 'Interlocking geometric square knots found in traditional fiber crafts.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = smoothstep(0.4, 0.5, abs(gv.x - 0.5) + abs(gv.y - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Knot Density', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Cotton Rope', type: 'color', default: [0.95, 0.9, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Knot Deep', type: 'color', default: [0.6, 0.55, 0.5, 1.0] }
  ]
};

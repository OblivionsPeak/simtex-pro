export default {
  id: 'louis_check_artisan',
  name: 'Louis Check',
  category: 'Abstract',
  description: 'Luxury designer-style checkered leather pattern with premium soft shading.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      float edge = smoothstep(0.45, 0.5, abs(fract(uv.x) - 0.5)) + smoothstep(0.45, 0.5, abs(fract(uv.y) - 0.5));
      return mix(u_secondary_color, u_primary_color, mask + edge * 0.2);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Check Zoom', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Leather Dark', type: 'color', default: [0.3, 0.2, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Leather Tan', type: 'color', default: [0.6, 0.45, 0.35, 1.0] }
  ]
};

export default {
  id: 'snake_skin_artisan',
  name: 'Snake Skin',
  category: 'Natural',
  description: 'Precisely interlocking reptilian scales with organic variance.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      
      float d = length(gv);
      float mask = smoothstep(0.45, 0.4, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Scale Color', type: 'color', default: [0.2, 0.4, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Underlayer', type: 'color', default: [0.05, 0.1, 0.02, 1.0] }
  ]
};

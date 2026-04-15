export default {
  id: 'diatom_shells_artisan',
  name: 'Diatom Shells',
  category: 'Natural',
  description: 'Intricate microscopic silicate shells found in marine plankton formations.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float mask = sin(d * 10.0 + sin(angle * 8.0));
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Shell Scale', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Silicate', type: 'color', default: [0.8, 0.9, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Marine Deep', type: 'color', default: [0.0, 0.1, 0.2, 1.0] }
  ]
};

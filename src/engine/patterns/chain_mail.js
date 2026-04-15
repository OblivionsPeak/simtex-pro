export default {
  id: 'chain_mail_artisan',
  name: 'Chain Mail',
  category: 'Industrial',
  description: 'Interlocking metal ring structures used in protective armor and fencing.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(length(gv) - 0.35);
      float mask = smoothstep(0.05, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Ring Density', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Wire Metal', type: 'color', default: [0.7, 0.7, 0.72, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.02, 0.02, 0.02, 1.0] }
  ]
};

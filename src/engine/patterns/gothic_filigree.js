export default {
  id: 'gothic_filigree_artisan',
  name: 'Gothic Filigree',
  category: 'Abstract',
  description: 'Intricate iron-like symmetrical swirls and ornate architectural blackwork.',
  shader: `
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = sin(uv.x * 10.0 + sin(uv.y * 10.0));
      float mask = smoothstep(0.1, 0.0, abs(d - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Detail Zoom', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Iron', type: 'color', default: [0.1, 0.1, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.9, 0.85, 0.8, 1.0] }
  ]
};

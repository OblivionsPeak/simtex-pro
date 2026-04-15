export default {
  id: 'moire_silk_artisan',
  name: 'Moire Silk',
  category: 'Abstract',
  description: 'Water-like wavy fabric interference patterns found in heavy silk moire.',
  shader: `
    vec4 generate() {
      float lines1 = sin(v_uv.x * 400.0);
      float lines2 = sin((v_uv.x + v_uv.y * 0.1) * 405.0);
      float mask = smoothstep(-0.5, 0.5, lines1 * lines2);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Sheen', type: 'color', default: [0.3, 0.35, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Silk', type: 'color', default: [0.1, 0.1, 0.2, 1.0] }
  ]
};

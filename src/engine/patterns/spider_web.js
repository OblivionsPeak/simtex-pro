export default {
  id: 'spider_web_artisan',
  name: 'Silk Web',
  category: 'Nature',
  description: 'Radial-concentric silk networks found in professional predatory arachnid structures.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float radial = step(0.98, fract(angle * 8.0 / 6.283));
      float concentric = step(0.95, fract(d * 10.0));
      return mix(u_secondary_color, u_primary_color, clamp(radial + concentric, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Silk Strand', type: 'color', default: [0.9, 0.9, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Void Backdrop', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

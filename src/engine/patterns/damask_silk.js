export default {
  id: 'damask_silk_artisan',
  name: 'Damask Silk',
  category: 'Abstract',
  description: 'Floral symmetrical weave with high-end fabric sheen found in luxury upholstery.',
  shader: `
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = length(uv - sin(uv.x * 5.0) * 0.1);
      float mask = smoothstep(0.4, 0.35, fract(d * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pattern Density', type: 'float', min: 2.0, max: 15.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Silk Pattern', type: 'color', default: [0.8, 0.5, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Base Satin', type: 'color', default: [0.4, 0.2, 0.1, 1.0] }
  ]
};

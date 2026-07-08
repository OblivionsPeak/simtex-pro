export default {
  id: 'acoustic_foam',
  name: 'Acoustic Foam',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Studio sound-treatment pyramids — a relief grid of foam wedges with deep valleys.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 f = fract(uv) - 0.5;
      // pyramid height and facet
      float h = 1.0 - 2.0 * max(abs(f.x), abs(f.y));
      // which face are we on?
      float faceX = step(abs(f.y), abs(f.x)) * sign(f.x);
      float faceY = step(abs(f.x), abs(f.y)) * sign(f.y);
      // fixed light from upper-left
      float light = 0.55 - faceX * 0.28 + faceY * 0.22;
      // valley ambient occlusion
      float ao = mix(0.35, 1.0, smoothstep(0.0, 0.5, h));
      vec4 col = u_primary_color;
      // foam cell micro-noise
      float cellNoise = 0.92 + 0.08 * hash(floor(uv * 24.0));
      col.rgb *= light * ao * cellNoise;
      // slight color shift in the valleys
      col.rgb = mix(u_secondary_color.rgb, col.rgb, smoothstep(0.0, 0.35, h));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wedge Density', type: 'float', min: 4.0, max: 40.0, default: 14.0 },
    { id: 'u_primary_color', name: 'Foam', type: 'color', default: [0.16, 0.16, 0.18, 1.0] },
    { id: 'u_secondary_color', name: 'Valley', type: 'color', default: [0.05, 0.05, 0.06, 1.0] }
  ],
  variants: [
    { name: 'Studio Grey', uniforms: { u_primary_color: [0.16, 0.16, 0.18, 1.0], u_secondary_color: [0.05, 0.05, 0.06, 1.0] } },
    { name: 'Purple Booth', uniforms: { u_primary_color: [0.32, 0.14, 0.42, 1.0], u_secondary_color: [0.1, 0.04, 0.14, 1.0] } },
    { name: 'Safety Orange', uniforms: { u_primary_color: [0.85, 0.4, 0.08, 1.0], u_secondary_color: [0.3, 0.12, 0.02, 1.0] } }
  ]
};

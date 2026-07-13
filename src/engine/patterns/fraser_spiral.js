export default {
  id: 'fraser_spiral',
  name: 'Fraser Spiral',
  category: 'Geometric',
  added: '2026-07-13',
  description: 'The Fraser spiral illusion — concentric rings of twisted two-tone rope segments over a checkered ground that the eye insists is a spiral.',
  shader: `
    vec4 generate() {
      vec2 p = (v_uv - 0.5) * 2.0;
      float r = max(length(p), 0.001);
      float an = atan(p.y, p.x) / 6.2831853 + 0.5;
      float band = r * u_scale;
      float ri = floor(band);
      float fb = fract(band);
      // polar-checkered ground — the illusion needs a busy backdrop
      float sect = floor(an * 48.0);
      float chk = mod(floor(band * 2.0) + sect, 2.0);
      vec3 bg = mix(u_secondary_color.rgb * 0.7, u_secondary_color.rgb, chk);
      bg *= 0.94 + 0.06 * noise(v_uv * 40.0);
      // twisted rope: stripe phase advances across each band, tilting the cords
      float segs = (ri + 2.0) * 6.0;
      float phase = an * segs + fb * u_twist;
      float tw = abs(fract(phase) * 2.0 - 1.0);
      float tone = smoothstep(0.42, 0.58, tw);
      vec3 rope = mix(u_primary_color.rgb, u_accent_color.rgb, tone);
      // per-segment brightness plus rounded cord cross-section shading
      rope *= 0.9 + 0.16 * hash(vec2(floor(an * segs), ri + 31.0));
      rope *= 0.72 + 0.5 * sin(fb * 3.14159);
      // ring mask with AA edges; skip the innermost stub ring
      float g = 0.16;
      float mask = smoothstep(g, g + 0.06, fb) * (1.0 - smoothstep(0.94 - g, 1.0 - g, fb));
      mask *= step(0.5, ri);
      vec3 col = mix(bg, rope, mask);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Ring Count', type: 'float', min: 5.0, max: 18.0, default: 10.0 },
    { id: 'u_twist', name: 'Rope Twist', type: 'float', min: 0.4, max: 2.5, default: 1.4 },
    { id: 'u_primary_color', name: 'Rope Dark', type: 'color', default: [0.07, 0.07, 0.09, 1.0] },
    { id: 'u_accent_color', name: 'Rope Light', type: 'color', default: [0.95, 0.93, 0.88, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.42, 0.45, 0.5, 1.0] }
  ],
  variants: [
    { name: 'Classic Fraser', uniforms: { u_primary_color: [0.07, 0.07, 0.09, 1.0], u_accent_color: [0.95, 0.93, 0.88, 1.0], u_secondary_color: [0.42, 0.45, 0.5, 1.0], u_scale: 10.0, u_twist: 1.4 } },
    { name: 'Vortex Crimson', uniforms: { u_primary_color: [0.35, 0.02, 0.05, 1.0], u_accent_color: [1.0, 0.75, 0.3, 1.0], u_secondary_color: [0.12, 0.08, 0.09, 1.0], u_scale: 8.0, u_twist: 1.9 } },
    { name: 'Hypno Ice', uniforms: { u_primary_color: [0.03, 0.15, 0.3, 1.0], u_accent_color: [0.8, 0.97, 1.0, 1.0], u_secondary_color: [0.55, 0.68, 0.75, 1.0], u_scale: 13.0, u_twist: 1.0 } }
  ]
};

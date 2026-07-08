export default {
  id: 'dna_helix',
  name: 'DNA Helix',
  category: 'Organic',
  added: '2026-07-07',
  description: 'Double helix columns — two crossing strands joined by base-pair rungs.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float col_ = floor(uv.x);
      float fx = fract(uv.x) - 0.5;
      float phase = hash(vec2(col_, 3.1)) * 6.28;
      float y = uv.y * u_twist + phase;
      vec4 col = u_secondary_color;
      col.rgb *= 0.95 + 0.05 * snoise(uv * 2.0);
      // two strands: x positions cross as sines in antiphase
      float amp = 0.3;
      float s1 = amp * sin(y);
      float s2 = amp * sin(y + 3.14159);
      // depth cue: whichever sine's cosine is positive is in front
      float front1 = step(0.0, cos(y));
      float w = u_strand;
      float d1 = abs(fx - s1);
      float d2 = abs(fx - s2);
      // base-pair rungs between strands at regular intervals
      float rungY = fract(y * 1.27324); // ~4 rungs per twist
      float rung = smoothstep(0.1, 0.05, abs(rungY - 0.5)) * step(min(s1, s2), fx) * step(fx, max(s1, s2));
      float pairPick = hash(vec2(col_, floor(y * 1.27324)));
      vec3 rungC = mix(u_accent_color.rgb, u_pop_color.rgb, step(0.5, pairPick));
      col.rgb = mix(col.rgb, rungC, rung * 0.9);
      // draw back strand, then front strand
      float back = mix(smoothstep(w, w * 0.5, d1), smoothstep(w, w * 0.5, d2), front1);
      float frnt = mix(smoothstep(w, w * 0.5, d2), smoothstep(w, w * 0.5, d1), front1);
      col.rgb = mix(col.rgb, u_primary_color.rgb * 0.55, back);
      col.rgb = mix(col.rgb, u_primary_color.rgb, frnt);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Helix Density', type: 'float', min: 2.0, max: 12.0, default: 4.0 },
    { id: 'u_twist', name: 'Twist Rate', type: 'float', min: 2.0, max: 12.0, default: 6.0 },
    { id: 'u_strand', name: 'Strand Weight', type: 'float', min: 0.02, max: 0.12, default: 0.05 },
    { id: 'u_primary_color', name: 'Backbone', type: 'color', default: [0.85, 0.87, 0.9, 1.0] },
    { id: 'u_accent_color', name: 'Base Pair A-T', type: 'color', default: [0.2, 0.7, 0.85, 1.0] },
    { id: 'u_pop_color', name: 'Base Pair G-C', type: 'color', default: [0.95, 0.6, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.05, 0.08, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Genome Lab', uniforms: { u_primary_color: [0.85, 0.87, 0.9, 1.0], u_accent_color: [0.2, 0.7, 0.85, 1.0], u_pop_color: [0.95, 0.6, 0.2, 1.0], u_secondary_color: [0.05, 0.08, 0.14, 1.0] } },
    { name: 'X-Ray Film', uniforms: { u_primary_color: [0.2, 0.22, 0.25, 1.0], u_accent_color: [0.45, 0.45, 0.48, 1.0], u_pop_color: [0.6, 0.6, 0.62, 1.0], u_secondary_color: [0.88, 0.87, 0.84, 1.0] } },
    { name: 'Neon Bio', uniforms: { u_primary_color: [0.3, 0.95, 0.6, 1.0], u_accent_color: [0.9, 0.3, 0.7, 1.0], u_pop_color: [0.95, 0.9, 0.2, 1.0], u_secondary_color: [0.04, 0.03, 0.08, 1.0] } }
  ]
};

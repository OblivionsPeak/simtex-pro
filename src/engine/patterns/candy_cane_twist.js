export default {
  id: 'candy_cane_twist',
  name: 'Candy Cane Twist',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Diagonal barber-pole peppermint stripes with glossy cylindrical shading and sugar-crystal sparkle.',
  shader: `
    vec4 generate() {
      // diagonal barber-pole coordinate
      float s = (v_uv.x + v_uv.y) * u_scale * 0.5;
      float f = fract(s);
      float ratio = u_stripe_ratio;
      float w = 0.018;
      // stripe mask: 0 = primary (candy red), 1 = secondary (sugar white)
      float m = smoothstep(ratio - w, ratio + w, f);
      m *= 1.0 - smoothstep(1.0 - w, 1.0, f); // anti-alias the wrap seam too
      vec3 col = mix(u_primary_color.rgb, u_secondary_color.rgb, m);
      // thin accent pinstripe riding the middle of the white stripe
      float pinPos = (1.0 + ratio) * 0.5;
      float pin = 1.0 - smoothstep(0.018, 0.034, abs(f - pinPos));
      col = mix(col, u_accent_color.rgb, pin * m);
      // per-stripe brightness variation so the twist doesn't read flat
      col *= 0.95 + 0.1 * hash(vec2(floor(s), 3.7));
      // glossy cylindrical shading: each stripe is a rounded rod of pulled sugar
      float inWhite = step(ratio, f);
      float t = mix(f / max(ratio, 0.001), (f - ratio) / max(1.0 - ratio, 0.001), inWhite);
      float prof = sin(clamp(t, 0.0, 1.0) * 3.14159265);
      col *= 0.6 + 0.5 * prof;
      col += vec3(1.0, 0.98, 0.96) * pow(prof, 22.0) * 0.3;
      // sugar-crystal sparkle scattered over everything
      vec2 g = v_uv * 260.0;
      vec2 gc = floor(g);
      float glint = step(0.975, hash(gc)) * smoothstep(0.42, 0.05, length(fract(g) - 0.5));
      col += vec3(1.0) * glint * u_sparkle * 0.85;
      // faint fine sugar grain
      col *= 0.985 + 0.03 * hash(floor(v_uv * 520.0));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stripe Count', type: 'float', min: 4.0, max: 40.0, default: 14.0 },
    { id: 'u_stripe_ratio', name: 'Red Width', type: 'float', min: 0.3, max: 0.7, default: 0.5 },
    { id: 'u_sparkle', name: 'Sugar Sparkle', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_primary_color', name: 'Candy Stripe', type: 'color', default: [0.78, 0.08, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Sugar White', type: 'color', default: [0.97, 0.95, 0.93, 1.0] },
    { id: 'u_accent_color', name: 'Pinstripe', type: 'color', default: [0.12, 0.5, 0.28, 1.0] }
  ],
  variants: [
    { name: 'Peppermint Classic', uniforms: { u_primary_color: [0.78, 0.08, 0.12, 1.0], u_secondary_color: [0.97, 0.95, 0.93, 1.0], u_accent_color: [0.12, 0.5, 0.28, 1.0], u_scale: 14.0, u_stripe_ratio: 0.5, u_sparkle: 0.55 } },
    { name: 'Blue Ice Twist', uniforms: { u_primary_color: [0.08, 0.28, 0.62, 1.0], u_secondary_color: [0.93, 0.96, 0.99, 1.0], u_accent_color: [0.55, 0.8, 0.95, 1.0], u_scale: 20.0, u_stripe_ratio: 0.42, u_sparkle: 0.75 } },
    { name: 'Grape Taffy', uniforms: { u_primary_color: [0.42, 0.13, 0.55, 1.0], u_secondary_color: [0.96, 0.9, 0.82, 1.0], u_accent_color: [0.92, 0.4, 0.62, 1.0], u_scale: 10.0, u_stripe_ratio: 0.58, u_sparkle: 0.35 } }
  ]
};

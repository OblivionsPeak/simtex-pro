export default {
  id: 'watermelon_rind',
  name: 'Watermelon Rind',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Dark and light green watermelon striping with organic wavy edges, pale veining, and a waxy summer sheen.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // organic edge wobble: broad drift plus a finer jitter
      float wob = (fbm(uv * 5.0) - 0.5) * u_wobble;
      float wob2 = (fbm(uv * 13.0 + 31.7) - 0.5) * u_wobble * 0.35;
      float s = uv.x * u_scale + wob + wob2;
      float f = fract(s);
      // dark stripe band with anti-aliased wavy edges
      float w = 0.035;
      float dark = smoothstep(0.0, w, f) * (1.0 - smoothstep(0.44, 0.44 + w, f));
      vec3 col = mix(u_secondary_color.rgb, u_primary_color.rgb, dark);
      // pale veining streaks running through the light band
      float vein = fbm(vec2(s * 2.2, uv.y * 9.0) + 7.7);
      float veinM = smoothstep(0.55, 0.75, vein) * (1.0 - dark);
      col = mix(col, u_accent_color.rgb, veinM * 0.5);
      // mottling inside the dark stripe so it never reads flat
      float mot = fbm(uv * 22.0 + 3.1);
      col *= mix(1.0, 0.84 + 0.3 * mot, dark);
      // slow large-scale ripeness variation across the whole rind
      col *= 0.93 + 0.12 * fbm(uv * 2.0 + 51.3);
      // waxy sheen: broad diagonal gloss pools plus a fine cuticle speckle
      float sheen = pow(max(0.0, snoise(uv * 2.3 + 5.0)), 2.0);
      col += vec3(1.0, 1.0, 0.9) * sheen * u_sheen * 0.16;
      col *= 0.97 + 0.05 * noise(uv * 300.0);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stripe Count', type: 'float', min: 3.0, max: 24.0, default: 7.0 },
    { id: 'u_wobble', name: 'Edge Wobble', type: 'float', min: 0.0, max: 1.5, default: 0.6 },
    { id: 'u_sheen', name: 'Waxy Sheen', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Dark Stripe', type: 'color', default: [0.07, 0.26, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Light Rind', type: 'color', default: [0.55, 0.75, 0.38, 1.0] },
    { id: 'u_accent_color', name: 'Veining', type: 'color', default: [0.78, 0.88, 0.6, 1.0] }
  ],
  variants: [
    { name: 'Picnic Classic', uniforms: { u_primary_color: [0.07, 0.26, 0.1, 1.0], u_secondary_color: [0.55, 0.75, 0.38, 1.0], u_accent_color: [0.78, 0.88, 0.6, 1.0], u_scale: 7.0, u_wobble: 0.6, u_sheen: 0.6 } },
    { name: 'Sugar Baby', uniforms: { u_primary_color: [0.03, 0.12, 0.06, 1.0], u_secondary_color: [0.16, 0.34, 0.18, 1.0], u_accent_color: [0.4, 0.55, 0.32, 1.0], u_scale: 10.0, u_wobble: 0.4, u_sheen: 0.85 } },
    { name: 'Golden Melon', uniforms: { u_primary_color: [0.45, 0.36, 0.08, 1.0], u_secondary_color: [0.88, 0.8, 0.42, 1.0], u_accent_color: [0.97, 0.93, 0.68, 1.0], u_scale: 6.0, u_wobble: 0.9, u_sheen: 0.5 } }
  ]
};

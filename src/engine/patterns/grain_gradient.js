export default {
  id: 'grain_gradient',
  name: 'Grain Gradient',
  category: 'Abstract',
  added: '2026-07-07',
  description: 'Soft color-field blobs dissolved in film grain — the modern grainy-gradient aesthetic.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // two soft blob fields blend three colors
      float b1 = smoothstep(-0.6, 0.8, snoise(uv * 0.5));
      float b2 = smoothstep(-0.6, 0.8, snoise(uv * 0.4 + vec2(7.0, 3.0)));
      vec3 c = mix(u_secondary_color.rgb, u_primary_color.rgb, b1);
      c = mix(c, u_accent_color.rgb, b2 * 0.75);
      // heavy monochrome grain, stronger in the transitions
      float g = hash(v_uv * 1911.0) - 0.5;
      float transition = b1 * (1.0 - b1) + b2 * (1.0 - b2);
      c += g * u_grain * (0.35 + transition * 1.3);
      // slight dither posterization for print feel
      c = mix(c, floor(c * 14.0 + g) / 14.0, u_posterize);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Blob Scale', type: 'float', min: 0.5, max: 6.0, default: 2.0 },
    { id: 'u_grain', name: 'Grain', type: 'float', min: 0.0, max: 0.5, default: 0.18 },
    { id: 'u_posterize', name: 'Posterize', type: 'float', min: 0.0, max: 1.0, default: 0.2 },
    { id: 'u_primary_color', name: 'Color A', type: 'color', default: [0.95, 0.45, 0.3, 1.0] },
    { id: 'u_accent_color', name: 'Color B', type: 'color', default: [0.5, 0.3, 0.7, 1.0] },
    { id: 'u_secondary_color', name: 'Color C', type: 'color', default: [0.12, 0.14, 0.3, 1.0] }
  ],
  variants: [
    { name: 'Dusk Poster', uniforms: { u_primary_color: [0.95, 0.45, 0.3, 1.0], u_accent_color: [0.5, 0.3, 0.7, 1.0], u_secondary_color: [0.12, 0.14, 0.3, 1.0], u_grain: 0.18 } },
    { name: 'Meadow Mist', uniforms: { u_primary_color: [0.75, 0.85, 0.6, 1.0], u_accent_color: [0.4, 0.65, 0.6, 1.0], u_secondary_color: [0.9, 0.92, 0.88, 1.0], u_grain: 0.12 } },
    { name: 'Charcoal Ember', uniforms: { u_primary_color: [0.85, 0.35, 0.15, 1.0], u_accent_color: [0.4, 0.15, 0.2, 1.0], u_secondary_color: [0.08, 0.08, 0.1, 1.0], u_grain: 0.3 } }
  ]
};

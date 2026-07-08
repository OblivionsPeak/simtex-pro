export default {
  id: 'rainbow_eucalyptus',
  name: 'Rainbow Eucalyptus',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Peeling bark ribbons in impossible colors — the rainbow eucalyptus trunk up close.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // vertical ribbons with jittered edges
      float x = uv.x * 3.0 + snoise(vec2(uv.y * 0.6, uv.x * 0.4)) * u_wobble;
      float strip = floor(x);
      float f = fract(x);
      float h = hash(vec2(strip, 4.7));
      // each strip picks a hue between the three anchor colors
      vec3 c;
      if (h < 0.33) c = mix(u_primary_color.rgb, u_accent_color.rgb, h * 3.0);
      else if (h < 0.66) c = mix(u_accent_color.rgb, u_pop_color.rgb, (h - 0.33) * 3.0);
      else c = mix(u_pop_color.rgb, u_primary_color.rgb, (h - 0.66) * 3.0);
      // vertical streaking within each ribbon
      c *= 0.88 + 0.12 * snoise(vec2(uv.x * 8.0, uv.y * 1.2 + strip * 3.0));
      // peeled edge: dark crease and a pale curl on one side
      c *= 0.7 + 0.3 * smoothstep(0.0, 0.18, f);
      c += vec3(0.12) * smoothstep(0.92, 1.0, f);
      // older grey bark patches still clinging on
      float old = smoothstep(0.6, 0.85, snoise(vec2(uv.x * 1.2, uv.y * 0.5) + 9.0));
      c = mix(c, u_secondary_color.rgb * (0.85 + 0.15 * snoise(uv * 6.0)), old * u_oldbark);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Trunk Scale', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_wobble', name: 'Ribbon Wobble', type: 'float', min: 0.0, max: 2.0, default: 0.8 },
    { id: 'u_oldbark', name: 'Old Bark', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_primary_color', name: 'Fresh Green', type: 'color', default: [0.35, 0.68, 0.3, 1.0] },
    { id: 'u_accent_color', name: 'Teal Blue', type: 'color', default: [0.15, 0.5, 0.55, 1.0] },
    { id: 'u_pop_color', name: 'Sunset Orange', type: 'color', default: [0.85, 0.45, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Old Bark', type: 'color', default: [0.55, 0.5, 0.45, 1.0] }
  ],
  variants: [
    { name: 'Mindanao', uniforms: { u_primary_color: [0.35, 0.68, 0.3, 1.0], u_accent_color: [0.15, 0.5, 0.55, 1.0], u_pop_color: [0.85, 0.45, 0.25, 1.0], u_secondary_color: [0.55, 0.5, 0.45, 1.0], u_oldbark: 0.4 } },
    { name: 'Violet Grove', uniforms: { u_primary_color: [0.5, 0.3, 0.7, 1.0], u_accent_color: [0.2, 0.4, 0.75, 1.0], u_pop_color: [0.85, 0.35, 0.5, 1.0], u_secondary_color: [0.5, 0.48, 0.52, 1.0], u_oldbark: 0.3 } },
    { name: 'Autumn Peel', uniforms: { u_primary_color: [0.75, 0.55, 0.2, 1.0], u_accent_color: [0.6, 0.3, 0.15, 1.0], u_pop_color: [0.85, 0.65, 0.35, 1.0], u_secondary_color: [0.45, 0.4, 0.35, 1.0], u_oldbark: 0.6 } }
  ]
};

export default {
  id: 'dragonfly_wing',
  name: 'Dragonfly Wing',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Translucent wing membrane — fine vein cells inside bold structural veins, with a soft iridescent sheen.',
  shader: `
    float voroEdge(vec2 uv) {
      vec2 cell = floor(uv);
      float d1 = 8.0; float d2 = 8.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 c = cell + vec2(float(i), float(j));
          vec2 pt = c + vec2(hash(c + 1.1), hash(c + 2.2));
          float d = length(uv - pt);
          if (d < d1) { d2 = d1; d1 = d; }
          else if (d < d2) { d2 = d; }
        }
      }
      return d2 - d1;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // membrane: translucent with soft interference sheen
      float sheen = sin(uv.x * 2.2 + uv.y * 1.4) * 0.5 + 0.5;
      vec3 c = mix(u_secondary_color.rgb, u_accent_color.rgb, sheen * u_iridescence);
      // fine cells (stretched along the wing axis)
      vec2 stretch = vec2(uv.x * 0.7, uv.y * 1.6);
      float fine = voroEdge(stretch * 2.2);
      float fineVein = 1.0 - smoothstep(0.0, 0.05, fine);
      // bold structural veins: sparse elongated voronoi
      float boldE = voroEdge(vec2(uv.x * 0.25, uv.y * 0.9));
      float boldVein = 1.0 - smoothstep(0.0, 0.035, boldE);
      c = mix(c, u_primary_color.rgb * 0.8, fineVein * 0.7);
      c = mix(c, u_primary_color.rgb, boldVein);
      // pterostigma-ish darker patches
      float stig = smoothstep(0.75, 0.9, snoise(uv * 0.4 + 13.0));
      c = mix(c, u_primary_color.rgb * 0.6, stig * 0.5);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cell Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_iridescence', name: 'Iridescence', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Veins', type: 'color', default: [0.15, 0.12, 0.08, 1.0] },
    { id: 'u_secondary_color', name: 'Membrane', type: 'color', default: [0.85, 0.88, 0.9, 1.0] },
    { id: 'u_accent_color', name: 'Sheen', type: 'color', default: [0.7, 0.85, 1.0, 1.0] }
  ],
  variants: [
    { name: 'Clear Wing', uniforms: { u_primary_color: [0.15, 0.12, 0.08, 1.0], u_secondary_color: [0.85, 0.88, 0.9, 1.0], u_accent_color: [0.7, 0.85, 1.0, 1.0], u_iridescence: 0.5 } },
    { name: 'Amber Darter', uniforms: { u_primary_color: [0.3, 0.15, 0.05, 1.0], u_secondary_color: [0.92, 0.8, 0.55, 1.0], u_accent_color: [1.0, 0.65, 0.3, 1.0], u_iridescence: 0.65 } },
    { name: 'Neon Damsel', uniforms: { u_primary_color: [0.05, 0.08, 0.12, 1.0], u_secondary_color: [0.1, 0.2, 0.3, 1.0], u_accent_color: [0.2, 0.95, 0.85, 1.0], u_iridescence: 0.9 } }
  ]
};

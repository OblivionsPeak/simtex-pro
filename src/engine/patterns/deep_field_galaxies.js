export default {
  id: 'deep_field_galaxies',
  name: 'Deep Field Galaxies',
  category: 'Cosmos',
  added: '2026-07-07',
  description: 'A telescope deep field — hundreds of faint ellipticals, spirals, and edge-on streaks.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          // not every cell hosts a galaxy
          if (hash(cell + 0.7) < 0.35) continue;
          vec2 ctr = cell + vec2(hash(cell + 1.1), hash(cell + 2.2)) * 0.8 + 0.1;
          float ang = hash(cell + 3.3) * 6.28318;
          vec2 rel = uv - ctr;
          vec2 lp = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * rel;
          // random elongation: round elliptical to edge-on streak
          float elong = 1.0 + hash(cell + 4.4) * 6.0;
          float d = length(lp * vec2(1.0, elong));
          float size = 0.06 + hash(cell + 5.5) * 0.18;
          float glow = exp(-d * d / (size * size * 0.5));
          // core brightens
          float core = exp(-d * d / (size * size * 0.06));
          // hue drifts between the two galaxy tints, faint ones redshifted
          float t = hash(cell + 6.6);
          vec3 gc = mix(u_primary_color.rgb, u_accent_color.rgb, t);
          col.rgb += gc * glow * (0.25 + 0.5 * hash(cell + 7.7)) + vec3(1.0, 0.98, 0.9) * core * 0.5;
        }
      }
      // pinprick foreground stars with diffraction feel
      float s = hash(floor(uv * 13.0));
      col.rgb += step(0.997, s) * vec3(0.9);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Field Density', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_secondary_color', name: 'Deep Space', type: 'color', default: [0.01, 0.01, 0.03, 1.0] },
    { id: 'u_primary_color', name: 'Young Galaxies', type: 'color', default: [0.55, 0.7, 1.0, 1.0] },
    { id: 'u_accent_color', name: 'Old Galaxies', type: 'color', default: [1.0, 0.75, 0.5, 1.0] }
  ],
  variants: [
    { name: 'Hubble Deep', uniforms: { u_secondary_color: [0.01, 0.01, 0.03, 1.0], u_primary_color: [0.55, 0.7, 1.0, 1.0], u_accent_color: [1.0, 0.75, 0.5, 1.0] } },
    { name: 'Infrared Webb', uniforms: { u_secondary_color: [0.02, 0.01, 0.02, 1.0], u_primary_color: [0.9, 0.5, 0.2, 1.0], u_accent_color: [0.95, 0.2, 0.3, 1.0] } },
    { name: 'Violet Survey', uniforms: { u_secondary_color: [0.02, 0.0, 0.04, 1.0], u_primary_color: [0.6, 0.3, 0.95, 1.0], u_accent_color: [0.3, 0.8, 0.9, 1.0] } }
  ]
};

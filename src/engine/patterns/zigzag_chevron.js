export default {
  id: 'zigzag_chevron',
  name: 'Zigzag Chevron',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Flame-stitch zigzag rows — multicolor chevron bands with an optional knit texture.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      // triangle wave displaces the row coordinate
      float tri = abs(fract(uv.x * u_freq) - 0.5) * 2.0;
      float row = uv.y + tri * u_peak;
      float band = floor(row * 2.0);
      float pick = mod(band, 4.0);
      vec3 c = u_primary_color.rgb;
      if (pick > 2.5) c = u_pop_color.rgb;
      else if (pick > 1.5) c = u_secondary_color.rgb;
      else if (pick > 0.5) c = u_accent_color.rgb;
      // crisp band edges with a fine dark seam
      float f = fract(row * 2.0);
      float seam = smoothstep(0.05, 0.0, min(f, 1.0 - f));
      c *= 1.0 - seam * 0.25;
      // flame-stitch thread texture
      float knit = 0.5 + 0.5 * sin(uv.y * 90.0);
      c *= mix(1.0, 0.88 + 0.12 * knit, u_weave);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Row Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_freq', name: 'Zig Frequency', type: 'float', min: 0.25, max: 2.0, default: 0.7 },
    { id: 'u_peak', name: 'Peak Height', type: 'float', min: 0.2, max: 2.0, default: 0.8 },
    { id: 'u_weave', name: 'Stitch Texture', type: 'float', min: 0.0, max: 1.0, default: 0.3 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Band 1', type: 'color', default: [0.9, 0.85, 0.78, 1.0] },
    { id: 'u_accent_color', name: 'Band 2', type: 'color', default: [0.85, 0.45, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Band 3', type: 'color', default: [0.25, 0.3, 0.4, 1.0] },
    { id: 'u_pop_color', name: 'Band 4', type: 'color', default: [0.6, 0.65, 0.6, 1.0] }
  ],
  variants: [
    { name: 'Missoni Knit', uniforms: { u_primary_color: [0.9, 0.85, 0.78, 1.0], u_accent_color: [0.85, 0.45, 0.2, 1.0], u_secondary_color: [0.25, 0.3, 0.4, 1.0], u_pop_color: [0.6, 0.65, 0.6, 1.0], u_weave: 0.6 } },
    { name: 'Bargello Jewel', uniforms: { u_primary_color: [0.45, 0.12, 0.35, 1.0], u_accent_color: [0.8, 0.3, 0.35, 1.0], u_secondary_color: [0.2, 0.3, 0.55, 1.0], u_pop_color: [0.9, 0.7, 0.25, 1.0], u_weave: 0.8 } },
    { name: 'Clean Mod', uniforms: { u_primary_color: [0.95, 0.94, 0.92, 1.0], u_accent_color: [0.1, 0.1, 0.12, 1.0], u_secondary_color: [0.95, 0.94, 0.92, 1.0], u_pop_color: [0.1, 0.1, 0.12, 1.0], u_weave: 0.0 } }
  ]
};

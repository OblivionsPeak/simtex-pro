export default {
  id: 'piano_keys',
  name: 'Piano Keys',
  category: 'Retro',
  added: '2026-07-13',
  description: 'Repeating keyboard octaves — grained ivory whites split by shadowed gaps, glossy black keys and a felt strip at the keybed.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float row = floor(uv.y);
      float cy = fract(uv.y);
      float ox = uv.x + row * 0.5;            // stagger octaves per row
      float oct = floor(ox);
      float px = fract(ox) * 7.0;             // 7 white keys per octave
      float wk = floor(px);
      float fx = fract(px);
      float keyId = wk + oct * 7.0 + row * 31.0;

      // white key with ivory grain and per-key tint drift
      vec3 white = u_primary_color.rgb * (0.93 + 0.07 * hash(vec2(keyId, row + 3.7)));
      white *= 0.97 + 0.05 * noise(vec2(px * 14.0 + oct * 29.0, uv.y * 2.0));
      // soft sheen near the key front where fingers polish the ivory
      white *= 1.0 + 0.06 * smoothstep(0.35, 0.0, cy);

      // shadowed gaps between white keys
      float edge = min(fx, 1.0 - fx);
      float gap = smoothstep(0.015, 0.05, edge);
      vec3 col = mix(u_primary_color.rgb * 0.25, white, gap);

      // felt strip at the back of the keybed
      float felt = smoothstep(0.952, 0.965, cy);
      col = mix(col, u_accent_color.rgb * (0.82 + 0.18 * noise(vec2(uv.x * 40.0, row))), felt);

      // black keys over gaps 1,2,4,5,6
      float blackMask = 0.0;
      float bx = 0.0;
      float topStart = 1.0 - u_black_len;
      for (int i = 0; i < 5; i++) {
        float b = float(i) + 1.0 + step(1.5, float(i));
        float d = px - b;
        float inX = smoothstep(0.32, 0.25, abs(d));
        float inY = smoothstep(topStart, topStart + 0.025, cy);
        float m = inX * inY;
        if (m > blackMask) { blackMask = m; bx = d / 0.32; }
      }
      vec3 black = u_secondary_color.rgb * (0.8 + 0.35 * cy);
      // glossy highlight running down the left face
      black += vec3(0.32) * smoothstep(0.5, 0.05, abs(bx + 0.55)) * (0.35 + 0.65 * cy);
      // bright lip on the front face of the black key
      black += vec3(0.22) * smoothstep(0.06, 0.0, cy - topStart);
      col = mix(col, black, blackMask);

      // slight perspective: the keybed recedes toward the back of each row
      col *= mix(1.0, 0.74, cy);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Octaves', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_black_len', name: 'Black Key Length', type: 'float', min: 0.4, max: 0.75, default: 0.6 },
    { id: 'u_primary_color', name: 'White Keys', type: 'color', default: [0.95, 0.93, 0.86, 1.0] },
    { id: 'u_secondary_color', name: 'Black Keys', type: 'color', default: [0.07, 0.07, 0.08, 1.0] },
    { id: 'u_accent_color', name: 'Felt Strip', type: 'color', default: [0.55, 0.08, 0.1, 1.0] }
  ],
  variants: [
    { name: 'Grand Ivory', uniforms: { u_scale: 2.0, u_black_len: 0.6, u_primary_color: [0.95, 0.93, 0.86, 1.0], u_secondary_color: [0.07, 0.07, 0.08, 1.0], u_accent_color: [0.55, 0.08, 0.1, 1.0] } },
    { name: 'Synth Invert', uniforms: { u_scale: 3.0, u_black_len: 0.55, u_primary_color: [0.1, 0.1, 0.12, 1.0], u_secondary_color: [0.92, 0.92, 0.95, 1.0], u_accent_color: [0.05, 0.75, 0.85, 1.0] } },
    { name: 'Sunset Lounge', uniforms: { u_scale: 2.0, u_black_len: 0.68, u_primary_color: [0.96, 0.88, 0.74, 1.0], u_secondary_color: [0.12, 0.2, 0.24, 1.0], u_accent_color: [0.9, 0.45, 0.12, 1.0] } }
  ]
};

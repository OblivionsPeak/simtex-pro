export default {
  id: 'guitar_fretboard',
  name: 'Guitar Fretboard',
  category: 'Retro',
  added: '2026-07-13',
  description: 'Rosewood fretboard running vertically — worn nickel frets, pearl dot inlays and six wound strings catching the light.',
  shader: `
    vec4 generate() {
      float fy = v_uv.y * u_scale;
      float cell = floor(fy);
      float f = fract(fy);

      // rosewood grain running along the neck
      float grain = fbm(vec2(v_uv.x * 22.0, v_uv.y * 2.5));
      vec3 wood = u_primary_color.rgb * (0.72 + 0.45 * grain);
      wood *= 0.92 + 0.1 * noise(vec2(v_uv.x * 150.0, v_uv.y * 9.0));
      // subtle play-wear polish between frets
      wood = mix(wood, wood * 1.2,
                 0.35 * smoothstep(0.5, 0.15, abs(f - 0.5)) * noise(vec2(cell * 3.1, v_uv.x * 6.0)));
      vec3 col = wood;

      // pearl dot inlays: single dot on odd frets, double every sixth
      float dbl = step(4.5, mod(cell, 6.0));
      float dA = length(vec2((v_uv.x - 0.5) * u_scale, f - 0.52));
      float dB = min(length(vec2((v_uv.x - 0.3) * u_scale, f - 0.52)),
                     length(vec2((v_uv.x - 0.7) * u_scale, f - 0.52)));
      float dDot = mix(dA, dB, dbl);
      float inlay = smoothstep(0.16, 0.12, dDot) * step(0.5, mod(cell, 2.0));
      vec3 pearl = u_secondary_color.rgb * (0.85 + 0.25 * noise(v_uv * 90.0));
      col = mix(col, pearl, inlay);

      // frets: bright crowned bars with random wear dulling
      float fd = min(f, 1.0 - f);
      float fret = smoothstep(0.05, 0.025, fd);
      float wearN = noise(vec2(v_uv.x * 50.0, cell * 7.7));
      vec3 metal = u_accent_color.rgb * (0.6 + 0.75 * smoothstep(0.05, 0.0, fd));
      metal *= mix(1.0, 0.55 + 0.5 * wearN, u_wear);
      // seat shadow hugging each fret
      col *= 1.0 - 0.25 * (smoothstep(0.12, 0.05, fd) - fret);
      col = mix(col, metal, fret);

      // six strings, thin plain trebles to thick wound basses
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float sx = (fi + 0.5) / 6.0;
        float t = mix(0.006, 0.016, fi / 5.0);
        float dx = abs(v_uv.x - sx);
        // shadow cast on the board
        col *= 1.0 - 0.35 * smoothstep(t * 2.6, t * 0.6, abs(v_uv.x - sx - t * 1.4));
        float body = smoothstep(t, t * 0.45, dx);
        float wound = step(2.5, fi);
        float wind = 1.0 - wound * 0.28 * (0.5 + 0.5 * sin(v_uv.y * 700.0 + fi * 2.1));
        vec3 sc = vec3(0.62, 0.6, 0.55) * wind * (0.8 + 0.3 * hash(vec2(fi, 4.2)));
        sc += vec3(0.5) * smoothstep(t * 0.45, 0.0, dx);   // specular core
        col = mix(col, sc, body);
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fret Count', type: 'float', min: 3.0, max: 16.0, default: 8.0 },
    { id: 'u_wear', name: 'Fret Wear', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Board Wood', type: 'color', default: [0.24, 0.13, 0.09, 1.0] },
    { id: 'u_secondary_color', name: 'Inlays', type: 'color', default: [0.9, 0.87, 0.78, 1.0] },
    { id: 'u_accent_color', name: 'Fret Metal', type: 'color', default: [0.78, 0.8, 0.83, 1.0] }
  ],
  variants: [
    { name: 'Vintage Rosewood', uniforms: { u_scale: 8.0, u_wear: 0.5, u_primary_color: [0.24, 0.13, 0.09, 1.0], u_secondary_color: [0.9, 0.87, 0.78, 1.0], u_accent_color: [0.78, 0.8, 0.83, 1.0] } },
    { name: 'Maple Custom', uniforms: { u_scale: 10.0, u_wear: 0.7, u_primary_color: [0.78, 0.62, 0.38, 1.0], u_secondary_color: [0.1, 0.09, 0.08, 1.0], u_accent_color: [0.82, 0.83, 0.85, 1.0] } },
    { name: 'Ebony Gold', uniforms: { u_scale: 7.0, u_wear: 0.25, u_primary_color: [0.08, 0.07, 0.08, 1.0], u_secondary_color: [0.85, 0.78, 0.55, 1.0], u_accent_color: [0.85, 0.7, 0.3, 1.0] } }
  ]
};

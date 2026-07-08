export default {
  id: 'bokeh_lights',
  name: 'Bokeh Lights',
  category: 'Abstract',
  added: '2026-07-07',
  description: 'Out-of-focus night lights — soft glowing discs drifting at three depths.',
  shader: `
    vec3 bokehLayer(vec2 uv, float gridScale, float seed, float blur, vec3 tintA, vec3 tintB) {
      vec3 acc = vec3(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv * gridScale) + vec2(float(i), float(j));
          if (hash(cell + seed) < 0.55) continue;
          vec2 ctr = (cell + vec2(hash(cell + seed + 1.0), hash(cell + seed + 2.0))) / gridScale;
          float r = (0.12 + hash(cell + seed + 3.0) * 0.18) / gridScale * 2.2;
          float d = length(uv - ctr);
          // defocused disc: bright rim, softer core
          float disc = smoothstep(r, r * (1.0 - blur), d);
          float rim = disc - smoothstep(r * 0.8, r * 0.5, d) * 0.35;
          vec3 tint = mix(tintA, tintB, hash(cell + seed + 4.0));
          acc += tint * rim * (0.3 + 0.7 * hash(cell + seed + 5.0));
        }
      }
      return acc;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      // subtle background gradient
      col.rgb *= 0.8 + 0.4 * (1.0 - v_uv.y);
      float blur = clamp(u_blur, 0.1, 0.9);
      col.rgb += bokehLayer(uv, 1.0, 0.0, blur, u_primary_color.rgb, u_accent_color.rgb) * 0.55;
      col.rgb += bokehLayer(uv, 1.9, 40.0, blur * 0.7, u_accent_color.rgb, u_primary_color.rgb) * 0.4;
      col.rgb += bokehLayer(uv, 3.4, 80.0, blur * 0.45, u_primary_color.rgb, u_accent_color.rgb) * 0.3;
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Light Density', type: 'float', min: 1.5, max: 10.0, default: 4.0 },
    { id: 'u_blur', name: 'Defocus', type: 'float', min: 0.1, max: 0.9, default: 0.55 },
    { id: 'u_secondary_color', name: 'Night', type: 'color', default: [0.04, 0.04, 0.09, 1.0] },
    { id: 'u_primary_color', name: 'Warm Lights', type: 'color', default: [1.0, 0.7, 0.3, 1.0] },
    { id: 'u_accent_color', name: 'Cool Lights', type: 'color', default: [0.4, 0.6, 1.0, 1.0] }
  ],
  variants: [
    { name: 'City Night', uniforms: { u_secondary_color: [0.04, 0.04, 0.09, 1.0], u_primary_color: [1.0, 0.7, 0.3, 1.0], u_accent_color: [0.4, 0.6, 1.0, 1.0], u_blur: 0.55 } },
    { name: 'Fairy Lights', uniforms: { u_secondary_color: [0.06, 0.04, 0.03, 1.0], u_primary_color: [1.0, 0.85, 0.55, 1.0], u_accent_color: [1.0, 0.65, 0.4, 1.0], u_blur: 0.4 } },
    { name: 'Neon Rain', uniforms: { u_secondary_color: [0.03, 0.02, 0.07, 1.0], u_primary_color: [0.9, 0.25, 0.7, 1.0], u_accent_color: [0.2, 0.85, 0.9, 1.0], u_blur: 0.75 } }
  ]
};

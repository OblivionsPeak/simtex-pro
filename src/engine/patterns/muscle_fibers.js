export default {
  id: 'muscle_fibers',
  name: 'Muscle Fibers',
  category: 'Organic',
  added: '2026-07-07',
  description: 'Anatomical fiber bundles — wavy parallel strands with cross striations and fascia streaks.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      // fibers run along x, waving in y
      float wave = snoise(vec2(uv.x * 0.4, uv.y * 0.15)) * 1.6;
      float fiber = fract(uv.y * 3.0 + wave);
      // rounded fiber profile
      float shade = sin(fiber * 3.14159);
      vec3 c = mix(u_secondary_color.rgb, u_primary_color.rgb, 0.45 + 0.55 * shade);
      // sarcomere striations across the fibers
      float stria = 0.9 + 0.1 * sin(uv.x * 40.0 + wave * 8.0);
      c *= mix(1.0, stria, u_striation);
      // bundle grouping: darker perimysium every few fibers
      float bundle = smoothstep(0.12, 0.0, abs(fract(uv.y * 0.5 + wave * 0.15) - 0.5) - 0.38);
      c = mix(c, u_secondary_color.rgb * 0.6, bundle * 0.7);
      // glossy fascia streaks
      float fascia = smoothstep(0.75, 0.95, snoise(vec2(uv.x * 0.3, uv.y * 0.8) + 7.0));
      c = mix(c, vec3(0.9, 0.88, 0.86), fascia * u_fascia);
      // wet specular
      c += vec3(0.08) * pow(max(shade, 0.0), 8.0);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fiber Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_striation', name: 'Striations', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_fascia', name: 'Fascia', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Fiber', type: 'color', default: [0.75, 0.25, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Between', type: 'color', default: [0.35, 0.08, 0.1, 1.0] }
  ],
  variants: [
    { name: 'Anatomy Plate', uniforms: { u_primary_color: [0.75, 0.25, 0.25, 1.0], u_secondary_color: [0.35, 0.08, 0.1, 1.0], u_striation: 0.6, u_fascia: 0.5 } },
    { name: 'Cybernetic', uniforms: { u_primary_color: [0.6, 0.62, 0.68, 1.0], u_secondary_color: [0.15, 0.16, 0.2, 1.0], u_striation: 0.9, u_fascia: 0.2 } },
    { name: 'Demon Sinew', uniforms: { u_primary_color: [0.5, 0.12, 0.3, 1.0], u_secondary_color: [0.12, 0.03, 0.08, 1.0], u_striation: 0.4, u_fascia: 0.7 } }
  ]
};

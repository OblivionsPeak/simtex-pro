export default {
  id: 'notebook_paper',
  name: 'Notebook Paper',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'A well-used ruled notebook page — pale blue lines, red margin rule, punched binder holes, graphite smudges and a soft curl shadow toward the page edge.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // paper base with fibre grain and faint pulp unevenness
      vec3 col = u_primary_color.rgb;
      col *= 0.972 + 0.028 * noise(uv * 330.0);
      col *= 0.985 + 0.015 * fbm(uv * 7.0);
      // page curl: shading rolls off toward the outer edge
      float curl = smoothstep(0.55, 1.0, uv.x);
      col *= 1.0 - curl * curl * 0.16;
      col *= 1.0 - smoothstep(0.15, 0.0, uv.x) * 0.05;
      // ruled lines, with a hair of printing wobble
      float wobble = (noise(vec2(uv.x * 6.0, floor(uv.y * u_scale) * 3.7)) - 0.5) * 0.05;
      float dRule = abs(fract(uv.y * u_scale + wobble) - 0.5);
      float rule = 1.0 - smoothstep(0.015, 0.05, dRule);
      // rules print lighter where the ink ran dry
      rule *= 0.7 + 0.3 * noise(vec2(uv.x * 40.0, floor(uv.y * u_scale) * 9.1));
      col = mix(col, u_secondary_color.rgb, rule * 0.7);
      // red margin rule
      float dm = abs(uv.x - 0.14);
      float margin = 1.0 - smoothstep(0.0015, 0.0045, dm);
      col = mix(col, u_accent_color.rgb, margin * 0.8);
      // punched binder holes with rim shadow
      for (int i = 0; i < 3; i++) {
        vec2 c = vec2(0.055, (float(i) + 0.5) / 3.0);
        float d = length(uv - c);
        float ring = smoothstep(0.036, 0.024, d) * (1.0 - smoothstep(0.026, 0.020, d));
        col *= 1.0 - ring * 0.30;
        float hole = smoothstep(0.024, 0.020, d);
        col = mix(col, vec3(0.13, 0.12, 0.12), hole);
      }
      // graphite: broad side-of-hand smudges in the writing area
      float writeArea = smoothstep(0.15, 0.20, uv.x);
      float g = fbm(uv * 5.0 + 3.0);
      float smudge = smoothstep(0.55, 0.85, g) * u_smudge * writeArea;
      col = mix(col, vec3(0.32, 0.32, 0.34), smudge * 0.24);
      // finer streaky graphite grain inside the smudges
      float streak = noise(vec2(uv.x * 220.0, uv.y * 60.0));
      col = mix(col, vec3(0.25, 0.25, 0.27), smudge * streak * 0.18);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rule Count', type: 'float', min: 10.0, max: 50.0, default: 24.0 },
    { id: 'u_smudge', name: 'Graphite Smudge', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Paper', type: 'color', default: [0.95, 0.94, 0.90, 1.0] },
    { id: 'u_secondary_color', name: 'Rule Blue', type: 'color', default: [0.55, 0.68, 0.85, 1.0] },
    { id: 'u_accent_color', name: 'Margin Red', type: 'color', default: [0.85, 0.35, 0.38, 1.0] }
  ],
  variants: [
    { name: 'Composition', uniforms: { u_scale: 24.0, u_smudge: 0.5, u_primary_color: [0.95, 0.94, 0.90, 1.0], u_secondary_color: [0.55, 0.68, 0.85, 1.0], u_accent_color: [0.85, 0.35, 0.38, 1.0] } },
    { name: 'Legal Pad', uniforms: { u_scale: 30.0, u_smudge: 0.3, u_primary_color: [0.96, 0.90, 0.62, 1.0], u_secondary_color: [0.50, 0.62, 0.78, 1.0], u_accent_color: [0.80, 0.30, 0.30, 1.0] } },
    { name: 'Night Study', uniforms: { u_scale: 20.0, u_smudge: 0.8, u_primary_color: [0.16, 0.17, 0.20, 1.0], u_secondary_color: [0.35, 0.55, 0.75, 1.0], u_accent_color: [0.75, 0.32, 0.35, 1.0] } }
  ]
};

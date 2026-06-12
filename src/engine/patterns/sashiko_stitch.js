export default {
  id: 'sashiko_stitch',
  name: 'Sashiko Stitch',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Japanese sashiko: white cotton running stitches laid in a stepped diamond grid over mottled hand-dyed indigo, each stitch a raised dash with pucker shadow.',
  shader: `
    // Running stitch along a line: t = position along line, d = distance from line
    float stitch_ssk(float t, float d, float wobble) {
      float seg = fract(t);
      // dash: thread visible for the middle ~55% of each segment
      float dash = smoothstep(0.20, 0.30, seg) * smoothstep(0.80, 0.70, seg);
      // rounded thread profile across the line
      float prof = 1.0 - smoothstep(0.0, 0.030 + wobble, d);
      return dash * prof;
    }

    float tri_ssk(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    vec4 generate() {
      vec2 uv = v_uv;
      float g = u_grid;

      // --- Indigo ground: hand-dyed cotton with uneven dye take ---
      vec3 indigo_deep = vec3(0.07, 0.10, 0.22);
      vec3 indigo_lift = vec3(0.16, 0.24, 0.42);
      float dye = fbm(uv * 4.0) * 0.5 + 0.5;
      vec3 col = mix(indigo_deep, indigo_lift, dye * 0.55);

      // Cotton weave grain
      float warp = sin(uv.x * 3.14159 * 240.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 240.0) * 0.5 + 0.5;
      col *= 0.93 + 0.045 * warp + 0.045 * weft;
      // Wear: lighter abrasion patches
      col = mix(col, col * 1.4 + 0.03, smoothstep(0.65, 0.95, fbm(uv * 2.3 + 11.0)) * 0.4);

      // --- Stitch geometry: hitomezashi-style stepped grid + diamonds ---
      vec2 p = uv * g;
      // hand wobble: each stitch run drifts slightly
      float wob = (noise(p * 2.0) - 0.5) * 0.04;

      float s = 0.0;
      // Horizontal running stitches, offset every other row (stepped)
      float row = floor(p.y);
      float row_off = mod(row, 2.0) * 0.5;
      float dh = abs(fract(p.y) - 0.5 + wob);
      s = max(s, stitch_ssk(p.x * 2.0 + row_off, dh * 0.5, 0.004));

      // Vertical running stitches, offset every other column
      float cole = floor(p.x);
      float col_off = mod(cole, 2.0) * 0.5;
      float dv = abs(fract(p.x) - 0.5 + wob);
      s = max(s, stitch_ssk(p.y * 2.0 + col_off, dv * 0.5, 0.004));

      // Diagonal diamond stitches (asanoha flavour)
      float diag = u_diamonds;
      float d1 = abs(tri_ssk((p.x + p.y) * 0.5) - 0.5);
      float d2 = abs(tri_ssk((p.x - p.y) * 0.5) - 0.5);
      s = max(s, stitch_ssk((p.x - p.y) * 2.0, d1 * 0.25, 0.006) * diag);
      s = max(s, stitch_ssk((p.x + p.y) * 2.0, d2 * 0.25, 0.006) * diag);

      // --- Render thread: warm white cotton, slightly twisted ---
      float twist = sin((uv.x + uv.y) * 700.0) * 0.5 + 0.5;
      vec3 thread = vec3(0.93, 0.91, 0.85) * (0.85 + 0.15 * twist);

      // Pucker shadow: cloth dimples around every stitch
      float shadow_h = stitch_ssk(p.x * 2.0 + row_off, dh * 0.5 - 0.035, 0.02);
      float shadow_v = stitch_ssk(p.y * 2.0 + col_off, dv * 0.5 - 0.035, 0.02);
      float pucker = max(shadow_h, shadow_v) - s;
      col *= 1.0 - clamp(pucker, 0.0, 1.0) * 0.30;

      col = mix(col, thread, clamp(s, 0.0, 1.0));
      // Stitch highlight: raised thread catches light on top
      col += vec3(0.10) * s * smoothstep(0.3, 0.0, dh + dv);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grid',     name: 'Stitch Grid',     type: 'float', min: 3.0, max: 16.0, default: 7.0 },
    { id: 'u_diamonds', name: 'Diagonal Layers', type: 'float', min: 0.0, max: 1.0,  default: 1.0 }
  ]
};

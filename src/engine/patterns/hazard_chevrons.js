export default {
  id: 'hazard_chevrons',
  name: 'Hazard Chevrons',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Bold angled warning chevrons — safety yellow and night black marching diagonally, with reflective-tape sheen bands, scuffed wear-through and stencilled edge bleed.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: safety yellow / lamp black ---
      vec3 warn = u_warn_color.rgb;
      vec3 dark = u_dark_color.rgb;

      float n = u_stripe_count;

      // chevron field: diagonal stripes folded about the vertical centreline
      // so the bands meet in a point — a true chevron, not a barber pole
      float fold = abs(uv.x - 0.5);
      float c = (fold * 1.2 + uv.y) * n;                // chevron coordinate
      // faint stencil bleed only — chevron edges must still read straight
      float wob = (noise(uv * 28.0) - 0.5) * 0.012;
      float band = fract(c + wob);
      float aa = n * 0.006;
      // 0 = warn stripe, 1 = dark stripe, soft transitions both directions
      float is_dark = smoothstep(0.5 - aa, 0.5 + aa, band) - smoothstep(1.0 - aa, 1.0, band);

      // --- stripe base colours with material texture ---
      // warn: matte safety paint with roller mottle
      vec3 w_col = warn;
      w_col *= 0.94 + noise(uv * 300.0) * 0.10;
      w_col *= 0.97 + 0.05 * (fbm(uv * 5.0) * 0.5 + 0.5);
      // dark: slightly satin, hiding less dirt
      vec3 d_col = dark;
      d_col *= 0.92 + noise(uv * 260.0) * 0.10;

      vec3 col = mix(w_col, d_col, clamp(is_dark, 0.0, 1.0));

      // --- reflective-tape sheen: a glint band riding inside each warn stripe ---
      float inner = fract(c);
      float sheen = smoothstep(0.10, 0.22, inner) * smoothstep(0.40, 0.28, inner)
                  * (1.0 - is_dark);
      // glass-bead sparkle inside the sheen
      sheen *= 0.7 + 0.6 * step(0.85, hash(floor(uv * 260.0)));
      col += sheen * 0.13;

      // --- chevron point seam: paint doubles up where the two halves meet ---
      float seam = smoothstep(0.012, 0.0, fold);
      col *= 1.0 - seam * 0.12;
      col = mix(col, mix(w_col, d_col, clamp(is_dark, 0.0, 1.0)) * 1.06,
                smoothstep(0.006, 0.0, abs(fold - 0.012)) * 0.5);

      // --- wear: scuff-through to grey primer along high-contact diagonals ---
      float scuff = smoothstep(0.55, 0.85, fbm(uv * vec2(3.0, 9.0) + 17.0) * 0.5 + 0.5)
                  * u_wear;
      vec3 primer = vec3(0.52, 0.51, 0.49);
      col = mix(col, primer * (0.9 + noise(uv * 400.0) * 0.15), scuff * 0.7);

      // black overspray dusting the warn stripes near every boundary
      float near_edge = smoothstep(0.10, 0.0, min(abs(band - 0.5), min(band, 1.0 - band)));
      col = mix(col, d_col, near_edge * (1.0 - is_dark) * step(0.6, noise(uv * 150.0)) * 0.18);

      // grime settling along the bottom of the panel
      col *= 1.0 - smoothstep(0.25, 0.0, uv.y) * (fbm(uv * 8.0) * 0.5 + 0.5) * 0.12;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_stripe_count', name: 'Chevron Count', type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_wear', name: 'Scuff Wear', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_warn_color', name: 'Warning Colour', type: 'color', default: [0.93, 0.76, 0.10, 1.0] },
    { id: 'u_dark_color', name: 'Contrast Colour', type: 'color', default: [0.10, 0.10, 0.11, 1.0] }
  ]
};

export default {
  id: 'newsprint_offset',
  name: 'Newsprint Offset',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'A printed newspaper page — headline bar, three text columns of dashed type, a 45-degree halftone photo, thin column rules, and a cyan/magenta plate drifting out of register.',
  shader: `
    // soft rectangle mask
    float pageRect(vec2 p, vec2 lo, vec2 hi) {
      vec2 a = smoothstep(lo - 0.003, lo + 0.003, p);
      vec2 b = smoothstep(hi + 0.003, hi - 0.003, p);
      return a.x * a.y * b.x * b.y;
    }
    // body text: rows of short dark dashes with ragged line ends and paragraph gaps
    float bodyText(vec2 p, vec2 lo, vec2 hi, float seed) {
      float box = pageRect(p, lo, hi);
      if (box < 0.01) return 0.0;
      vec2 local = (p - lo) / (hi - lo);
      float rows = max(u_scale * (hi.y - lo.y), 4.0);
      float row = floor(local.y * rows);
      float fy = fract(local.y * rows);
      // blank paragraph gaps
      float blank = step(hash(vec2(row, seed)), 0.12);
      // ink band of the text line
      float band = smoothstep(0.20, 0.32, fy) * smoothstep(0.74, 0.62, fy);
      // ragged right edge; paragraph-ending lines run short
      float len = 0.74 + 0.26 * hash(vec2(row * 1.7 + 4.0, seed + 3.0));
      float paraEnd = step(hash(vec2(row + 1.0, seed)), 0.12);
      len = mix(len, 0.30 + 0.40 * hash(vec2(row, seed + 9.0)), paraEnd);
      float within = smoothstep(len + 0.015, len - 0.015, local.x);
      // word dashes of varying length
      float wx = local.x * 14.0 + hash(vec2(row, seed + 5.0)) * 4.0;
      float word = floor(wx);
      float fx = fract(wx);
      float gap = 0.20 + 0.16 * hash(vec2(word, row + seed));
      float dash = smoothstep(0.02, 0.10, fx) * smoothstep(1.0 - gap + 0.08, 1.0 - gap, fx);
      float weight = 0.72 + 0.28 * hash(vec2(word * 3.1, row + seed * 7.0));
      return box * (1.0 - blank) * band * within * dash * weight;
    }
    // headline: two rows of fat dashes, second row shorter
    float headline(vec2 p, vec2 lo, vec2 hi) {
      float box = pageRect(p, lo, hi);
      if (box < 0.01) return 0.0;
      vec2 local = (p - lo) / (hi - lo);
      float row = floor(local.y * 2.0);
      float fy = fract(local.y * 2.0);
      float band = smoothstep(0.12, 0.26, fy) * smoothstep(0.88, 0.74, fy);
      float len = mix(0.62, 0.97, row);
      float within = smoothstep(len + 0.02, len - 0.02, local.x);
      float wx = local.x * 6.5 + row * 2.3;
      float fx = fract(wx);
      float dash = smoothstep(0.02, 0.09, fx) * smoothstep(0.92, 0.84, fx);
      return box * band * within * dash;
    }
    // classic angled dot screen; dot size grows with tone
    float dotScreen(vec2 p, float ang, float freq, float tone) {
      mat2 r = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
      vec2 f = fract(r * p * freq) - 0.5;
      float rad = sqrt(clamp(tone, 0.0, 1.0)) * 0.62;
      return smoothstep(rad + 0.09, rad - 0.09, length(f));
    }
    vec4 generate() {
      vec2 uv = v_uv;
      vec3 ink = u_primary_color.rgb;
      // warm gray cheap-paper ground with pulp fibre grain
      vec3 col = u_secondary_color.rgb;
      col *= 0.95 + 0.05 * noise(uv * 340.0);
      col *= 0.97 + 0.03 * fbm(uv * 7.0);
      float inkAmt = 0.60 + 0.40 * u_ink;
      // ---- page layout (3 columns) ----
      float m = 0.045;                     // page margin
      float c1L = 0.045; float c1R = 0.328;
      float c2L = 0.358; float c2R = 0.642;
      float c3L = 0.672; float c3R = 0.955;
      float bodyTop = 0.855;
      // ---- headline bar with ghost pass (registration error) ----
      vec2 off = vec2(0.0022, -0.0016) * u_misreg;
      vec2 hLo = vec2(m, 0.885); vec2 hHi = vec2(1.0 - m, 0.965);
      float hGhost = headline(uv + off, hLo, hHi);
      col = mix(col, u_accent_color.rgb, hGhost * 0.35);
      float h = headline(uv, hLo, hHi);
      col = mix(col, ink, h * 0.95 * inkAmt);
      // rule under the headline
      float hr = (1.0 - smoothstep(0.0025, 0.005, abs(uv.y - 0.870))) * pageRect(uv, vec2(m, 0.0), vec2(1.0 - m, 1.0));
      col = mix(col, ink, hr * 0.8 * inkAmt);
      // ---- text columns ----
      float t = 0.0;
      t += bodyText(uv, vec2(c1L, m), vec2(c1R, bodyTop), 3.0);
      t += bodyText(uv, vec2(c2L, m), vec2(c2R, 0.47), 17.0);   // col 2 below the photo
      t += bodyText(uv, vec2(c3L, m), vec2(c3R, bodyTop), 41.0);
      col = mix(col, ink, clamp(t, 0.0, 1.0) * 0.88 * inkAmt);
      // ---- thin column rules ----
      float rules = 1.0 - smoothstep(0.0012, 0.0035, abs(uv.x - 0.343));
      rules += 1.0 - smoothstep(0.0012, 0.0035, abs(uv.x - 0.657));
      rules *= smoothstep(m - 0.005, m + 0.005, uv.y) * smoothstep(bodyTop + 0.005, bodyTop - 0.005, uv.y);
      col = mix(col, ink, clamp(rules, 0.0, 1.0) * 0.55 * inkAmt);
      // ---- halftone photo in column 2 ----
      vec2 pLo = vec2(c2L, 0.50); vec2 pHi = vec2(c2R, bodyTop);
      float photo = pageRect(uv, pLo, pHi);
      if (photo > 0.01) {
        vec2 pl = (uv - pLo) / (pHi - pLo);
        // tonal image patch: fbm shading plus a sky-to-ground gradient
        float tone = clamp(fbm(uv * 5.0 + 3.7) * 1.5 - 0.12, 0.0, 1.0);
        tone = tone * 0.72 + 0.34 * (1.0 - pl.y);
        float freq = u_scale * 1.6;
        // cyan-ish ghost plate at 15 degrees, drifted off register
        float kC = dotScreen(uv + off, 0.2618, freq * 0.99, tone * 0.85);
        col = mix(col, col * u_accent_color.rgb, kC * 0.45 * photo);
        // magenta-ish ghost plate at 75 degrees, drifted the other way
        float kM = dotScreen(uv - off, 1.3090, freq * 1.01, tone * 0.75);
        col = mix(col, col * (vec3(1.05) - u_accent_color.rgb), kM * 0.40 * photo);
        // black plate: the classic 45-degree screen
        float k = dotScreen(uv, 0.7854, freq, tone);
        col = mix(col, ink, k * 0.92 * inkAmt * photo);
      }
      // photo frame
      float fx1 = min(abs(uv.x - pLo.x), abs(uv.x - pHi.x));
      float fy1 = min(abs(uv.y - pLo.y), abs(uv.y - pHi.y));
      float frame = (1.0 - smoothstep(0.0015, 0.004, min(fx1, fy1)))
                  * pageRect(uv, pLo - 0.006, pHi + 0.006);
      col = mix(col, ink, frame * 0.85 * inkAmt);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Type Density', type: 'float', min: 28.0, max: 90.0, default: 48.0 },
    { id: 'u_misreg', name: 'Registration Error', type: 'float', min: 0.0, max: 3.0, default: 1.0 },
    { id: 'u_ink', name: 'Ink Weight', type: 'float', min: 0.0, max: 1.0, default: 0.65 },
    { id: 'u_primary_color', name: 'Ink', type: 'color', default: [0.10, 0.10, 0.11, 1.0] },
    { id: 'u_secondary_color', name: 'Pulp Paper', type: 'color', default: [0.82, 0.79, 0.72, 1.0] },
    { id: 'u_accent_color', name: 'Ghost Plate', type: 'color', default: [0.35, 0.75, 0.85, 1.0] }
  ],
  variants: [
    { name: 'Morning Edition', uniforms: { u_scale: 48.0, u_misreg: 1.0, u_ink: 0.65, u_primary_color: [0.10, 0.10, 0.11, 1.0], u_secondary_color: [0.82, 0.79, 0.72, 1.0], u_accent_color: [0.35, 0.75, 0.85, 1.0] } },
    { name: 'Sunday Comics', uniforms: { u_scale: 36.0, u_misreg: 2.4, u_ink: 0.8, u_primary_color: [0.13, 0.10, 0.15, 1.0], u_secondary_color: [0.90, 0.86, 0.76, 1.0], u_accent_color: [0.90, 0.35, 0.55, 1.0] } },
    { name: 'Archive Yellowed', uniforms: { u_scale: 60.0, u_misreg: 0.5, u_ink: 0.45, u_primary_color: [0.18, 0.15, 0.12, 1.0], u_secondary_color: [0.80, 0.72, 0.55, 1.0], u_accent_color: [0.55, 0.60, 0.70, 1.0] } }
  ]
};

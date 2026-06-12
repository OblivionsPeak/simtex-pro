export default {
  id: 'tricolore_sash',
  name: 'Tricolore Sash',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'A diagonal three-colour sash sweeping the panel — national-stripe trio with white keylines between bands, painted edge wobble, and gloss body either side.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: ivory body, tricolore sash, white separators ---
      vec3 body = u_body_color.rgb;
      vec3 c1   = u_color_a.rgb;                       // leading band
      vec3 c2   = vec3(0.95, 0.94, 0.90);              // centre band (white)
      vec3 c3   = u_color_b.rgb;                       // trailing band
      vec3 sep  = vec3(0.97, 0.96, 0.93);              // keyline between bands

      // gloss body: flake + diagonal polish sheen
      vec3 col = body;
      col *= 0.965 + noise(uv * 520.0) * 0.05;
      col += smoothstep(0.5, 0.0, abs(uv.x + uv.y - 1.55)) * 0.03;

      // sash axis: roughly 45 degrees, distance measured across the sash
      // whisper of edge texture — the sash must still read dead straight
      float along = (uv.x + uv.y) * 0.7071;             // position along the sash
      float wob = (noise(vec2(along * 8.0, 2.4)) - 0.5) * 0.0012;
      float d = (uv.x - uv.y) * 0.7071 + wob;           // signed distance from sash centre

      float w = u_sash_width * 0.5;                     // total sash half-width
      float bw = w / 1.5;                               // one band's half-extent step
      float aa = 0.004;

      float ad = abs(d);
      float in_sash = smoothstep(aa, -aa, ad - w);

      // ridge shadow at the outer masked edges
      col *= 1.0 - smoothstep(0.010, 0.0, abs(ad - w)) * step(w, ad) * 0.10;

      // --- three bands across the sash width ---
      // band index: 0 (leading), 1 (centre), 2 (trailing)
      float t = clamp((d + w) / (2.0 * w), 0.0, 1.0);
      vec3 sash_c = c1;
      sash_c = mix(sash_c, c2, smoothstep(0.3333 - 0.004, 0.3333 + 0.004, t));
      sash_c = mix(sash_c, c3, smoothstep(0.6667 - 0.004, 0.6667 + 0.004, t));

      // paint texture inside the sash: lengthwise brush striae
      sash_c *= 0.97 + 0.05 * noise(vec2(along * 160.0, d * 12.0));
      sash_c *= 0.985 + noise(uv * 320.0) * 0.03;

      // white keylines on the two internal seams
      float seam1 = smoothstep(aa, 0.0, abs(t - 0.3333) * 2.0 * w - 0.0035);
      float seam2 = smoothstep(aa, 0.0, abs(t - 0.6667) * 2.0 * w - 0.0035);
      sash_c = mix(sash_c, sep, max(seam1, seam2) * 0.85);

      // sun-fade running along the sash (top-right end weathers harder)
      sash_c = mix(sash_c, mix(sash_c, vec3(0.9), 0.3), smoothstep(0.5, 1.4, along) * 0.5);

      col = mix(col, sash_c, in_sash);

      // chips at the leading outer edge — stones hit the sash first
      float chip = step(0.972, hash(floor(uv * 220.0))) *
                   smoothstep(0.04, 0.0, abs(d + w));
      col = mix(col, body * 0.95, chip * 0.8);

      // a fine companion pinline outside each sash edge
      float pin = smoothstep(aa, 0.0, abs(ad - w - 0.018) - 0.0022);
      col = mix(col, mix(c1, c3, step(0.0, d)), pin * 0.85);

      // grime drifting against the sash's lower edge
      col *= 1.0 - smoothstep(0.05, 0.0, d - w) * step(w, d)
                 * (fbm(uv * 7.0) * 0.5 + 0.5) * 0.05;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_sash_width', name: 'Sash Width', type: 'float', min: 0.10, max: 0.45, default: 0.24 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.90, 0.88, 0.82, 1.0] },
    { id: 'u_color_a', name: 'Leading Band', type: 'color', default: [0.10, 0.32, 0.18, 1.0] },
    { id: 'u_color_b', name: 'Trailing Band', type: 'color', default: [0.74, 0.13, 0.12, 1.0] }
  ]
};

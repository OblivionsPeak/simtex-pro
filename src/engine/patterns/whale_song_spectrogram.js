export default {
  id: 'whale_song_spectrogram',
  name: 'Whale Song Spectrogram',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'A hydrophone spectrogram of humpback calls — sweeping harmonic arcs and low moans burning through cold analysis-grade noise.',
  shader: `
    // Heat palette: black → deep violet → magma orange → white-hot
    vec3 heat_wss(float t) {
      t = clamp(t, 0.0, 1.0);
      vec3 c = mix(vec3(0.01, 0.01, 0.04), vec3(0.25, 0.04, 0.35), smoothstep(0.0, 0.30, t));
      c = mix(c, vec3(0.85, 0.25, 0.10), smoothstep(0.30, 0.62, t));
      c = mix(c, vec3(1.00, 0.80, 0.30), smoothstep(0.62, 0.85, t));
      c = mix(c, vec3(1.00, 1.00, 0.92), smoothstep(0.85, 1.0, t));
      return c;
    }

    // Energy of one call: a frequency contour with harmonics above it
    float call_wss(vec2 uv, float idx) {
      float h = hash(vec2(idx, 13.7));
      float x0 = hash(vec2(idx, 5.3));              // start time (wraps)
      float len = 0.12 + 0.20 * hash(vec2(idx, 9.1));
      float t = fract(uv.x - x0);                   // wrapped time since onset
      if (t > len) return 0.0;
      float ph = t / len;                            // 0..1 through the call

      // contour: rising moan, falling cry, or arched whoop per call
      float kind = floor(h * 3.0);
      float f0 = 0.10 + 0.30 * hash(vec2(idx, 21.9));
      float swp = 0.10 + 0.22 * hash(vec2(idx, 31.3));
      float fc = f0;
      if (kind < 1.0)      fc = f0 + swp * ph;                       // upsweep
      else if (kind < 2.0) fc = f0 + swp * (1.0 - ph);               // downsweep
      else                 fc = f0 + swp * sin(ph * 3.14159);        // arch

      // amplitude envelope: fast attack, slow release
      float env = smoothstep(0.0, 0.10, ph) * smoothstep(1.0, 0.55, ph);

      // fundamental + 3 harmonics, weakening upward
      float e = 0.0;
      for (int m = 1; m <= 4; m++) {
        float fm = fc * float(m);
        float w = 0.00045 * float(m);  // harmonics slightly broader
        float d = uv.y - fm;
        e += exp(-d * d / w) * env / (float(m) * 0.9);
      }
      return e;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- background: cold hydrophone noise floor ---
      float floor_n = fbm(uv * vec2(40.0, 14.0)) * 0.5 + 0.5;
      float hiss = noise(uv * vec2(300.0, 90.0));
      float energy = floor_n * 0.10 + hiss * 0.06;
      // low-frequency rumble band along the bottom
      energy += exp(-uv.y * 14.0) * (0.20 + 0.15 * noise(uv * vec2(60.0, 8.0)));

      // --- whale calls ---
      float n_calls = u_calls;
      for (int c = 0; c < 9; c++) {
        if (float(c) >= n_calls) break;
        energy += call_wss(uv, float(c) * 7.31 + 2.0) * u_intensity;
      }

      vec3 col = heat_wss(energy);

      // --- analysis grid: faint time and frequency rules ---
      vec3 grid_col = u_grid_color.rgb;
      float gx = smoothstep(0.012, 0.0, abs(fract(uv.x * 8.0) - 0.5) - 0.485);
      float gy = smoothstep(0.012, 0.0, abs(fract(uv.y * 6.0) - 0.5) - 0.485);
      col = mix(col, grid_col, max(gx, gy) * 0.18);

      // scanline shimmer of the display
      col *= 0.96 + 0.04 * sin(uv.y * 700.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_calls',      name: 'Call Count',  type: 'float', min: 1.0, max: 9.0, default: 6.0 },
    { id: 'u_intensity',  name: 'Signal Gain', type: 'float', min: 0.3, max: 2.5, default: 1.2 },
    { id: 'u_grid_color', name: 'Grid Color',  type: 'color', default: [0.25, 0.55, 0.65, 1.0] }
  ]
};

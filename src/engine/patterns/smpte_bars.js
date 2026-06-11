export default {
  id: 'smpte_bars',
  name: 'SMPTE Bars',
  category: 'Retro',
  added: '2026-06-11',
  description: 'The broadcast test card itself — 75% colour bars over castellations, -I/+Q chroma patches and the PLUGE strip, softened by a breath of analogue transmission noise.',
  shader: `
    vec3 topbar_sb(float i, float lvl) {
      if (i < 0.5) return vec3(lvl);                 // grey
      if (i < 1.5) return vec3(lvl, lvl, 0.0);       // yellow
      if (i < 2.5) return vec3(0.0, lvl, lvl);       // cyan
      if (i < 3.5) return vec3(0.0, lvl, 0.0);       // green
      if (i < 4.5) return vec3(lvl, 0.0, lvl);       // magenta
      if (i < 5.5) return vec3(lvl, 0.0, 0.0);       // red
      return vec3(0.0, 0.0, lvl);                    // blue
    }

    vec3 castel_sb(float i, float lvl) {
      if (i < 0.5) return vec3(0.0, 0.0, lvl);       // blue
      if (i < 1.5) return vec3(0.0);                 // black
      if (i < 2.5) return vec3(lvl, 0.0, lvl);       // magenta
      if (i < 3.5) return vec3(0.0);                 // black
      if (i < 4.5) return vec3(0.0, lvl, lvl);       // cyan
      if (i < 5.5) return vec3(0.0);                 // black
      return vec3(lvl);                              // grey
    }

    vec3 bottom_sb(float x7) {
      if (x7 < 1.25) return vec3(0.0, 0.13, 0.30);   // -I
      if (x7 < 2.50) return vec3(1.0);               // 100% white
      if (x7 < 3.75) return vec3(0.20, 0.0, 0.42);   // +Q
      if (x7 < 5.00) return vec3(0.0);               // black
      // PLUGE: 3.5% / 7.5% / 11.5%
      if (x7 < 5.3333) return vec3(0.0);
      if (x7 < 5.6667) return vec3(0.075);
      if (x7 < 6.0)    return vec3(0.115);
      return vec3(0.0);                              // black
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);
      float lvl = u_bar_level;

      // analogue horizontal smearing: jitter the sampled x per scanline
      float line = floor(uv.y * 486.0);
      float smear = (hash(vec2(line, 7.0)) - 0.5) * u_softness * 0.004;
      float x = fract(uv.x + smear);
      float x7 = x * 7.0;

      vec3 col;
      if (uv.y > 0.3333) {
        col = topbar_sb(floor(x7), lvl);
      } else if (uv.y > 0.25) {
        col = castel_sb(floor(x7), lvl);
      } else {
        col = bottom_sb(x7);
      }

      // chroma fringing on vertical edges (NTSC dot crawl ghost)
      float edge = abs(fract(x7) - 0.5);
      float fringe = (1.0 - smoothstep(0.42, 0.5, edge)) * u_softness;
      vec3 colR;
      float xr7 = fract(x + 0.0035 * u_softness) * 7.0;
      if (uv.y > 0.3333)      colR = topbar_sb(floor(xr7), lvl);
      else if (uv.y > 0.25)   colR = castel_sb(floor(xr7), lvl);
      else                    colR = bottom_sb(xr7);
      col.r = mix(col.r, colR.r, fringe * 0.8);

      // transmission noise: per-scanline luminance hiss
      float hiss = (hash(vec2(floor(uv.x * 640.0), line)) - 0.5) * u_signal_noise;
      col += hiss;

      // faint scanline structure
      col *= 0.96 + 0.04 * sin(uv.y * 486.0 * 3.14159);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_bar_level', name: 'Bar Level', type: 'float', min: 0.5, max: 1.0, default: 0.75 },
    { id: 'u_softness', name: 'Analogue Softness', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_signal_noise', name: 'Signal Noise', type: 'float', min: 0.0, max: 0.3, default: 0.06 }
  ]
};

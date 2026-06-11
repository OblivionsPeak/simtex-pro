export default {
  id: 'constellation_chart',
  name: 'Constellation Chart',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A celestial atlas plate — named stars joined by fine asterism lines over an inked coordinate grid and faint ecliptic arc.',
  shader: `
    // Distance from point p to segment a-b
    float segDist_cch(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
      return length(pa - ba * h);
    }

    // Star position inside a wrapped grid cell
    vec2 starPos_cch(vec2 cell, float density) {
      vec2 c = mod(cell, density);
      return (cell + vec2(0.15, 0.15) + 0.7 * vec2(hash(c + 3.1), hash(c + 11.7))) / density;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);
      float density = u_density;

      // --- Parchment-dark chart background with subtle mottling ---
      vec3 ink = u_chart_color.rgb;
      float mottle = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 col = ink * (0.85 + 0.20 * mottle);

      // --- Coordinate grid: fine RA/Dec lines, heavier every 4th ---
      vec2 gridUv = fract(uv * density);
      float thin = 0.012 * density / 6.0;
      float gline = smoothstep(thin, 0.0, min(gridUv.x, 1.0 - gridUv.x))
                  + smoothstep(thin, 0.0, min(gridUv.y, 1.0 - gridUv.y));
      vec2 major = fract(uv * density * 0.25);
      float mline = smoothstep(thin * 1.6, 0.0, min(major.x, 1.0 - major.x))
                  + smoothstep(thin * 1.6, 0.0, min(major.y, 1.0 - major.y));
      vec3 gridCol = ink + vec3(0.10, 0.12, 0.16);
      col = mix(col, gridCol, clamp(gline, 0.0, 1.0) * 0.45);
      col = mix(col, gridCol + 0.06, clamp(mline, 0.0, 1.0) * 0.6);

      // --- Ecliptic: a sweeping dashed arc across the chart ---
      float arcY = 0.5 + 0.22 * sin(uv.x * 6.2831853);
      float arcD = abs(uv.y - arcY);
      float dash = step(0.5, fract(uv.x * 24.0));
      col = mix(col, vec3(0.55, 0.42, 0.25), smoothstep(0.004, 0.0015, arcD) * dash * 0.8);

      // --- Stars + asterism lines on the wrapped grid ---
      vec2 cell = floor(uv * density);
      float lineGlow = 0.0;
      float starGlow = 0.0;
      float haloGlow = 0.0;

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 c = cell + vec2(float(x), float(y));
          vec2 cw = mod(c, density);
          vec2 sp = starPos_cch(c, density);
          float mag = hash(cw + 41.0); // star magnitude

          // Star point with magnitude-scaled core
          float d = length(uv - sp);
          float size = 0.004 + 0.010 * pow(mag, 2.0);
          starGlow = max(starGlow, exp(-pow(d / size, 2.0)) * (0.5 + 0.7 * mag));
          // Bright stars get a printed halo circle
          float haloR = size * 3.2;
          haloGlow = max(haloGlow,
            smoothstep(0.0025, 0.0008, abs(d - haloR)) * step(0.72, mag));

          // Asterism: connect to right and lower neighbours selectively
          vec2 spR = starPos_cch(c + vec2(1.0, 0.0), density);
          vec2 spD = starPos_cch(c + vec2(0.0, 1.0), density);
          float linkR = step(hash(cw + 57.0), u_connect);
          float linkD = step(hash(cw + 91.0), u_connect * 0.8);
          float lw = 0.0016;
          lineGlow = max(lineGlow, smoothstep(lw, lw * 0.3, segDist_cch(uv, sp, spR)) * linkR);
          lineGlow = max(lineGlow, smoothstep(lw, lw * 0.3, segDist_cch(uv, sp, spD)) * linkD);
        }
      }

      vec3 lineCol = vec3(0.45, 0.60, 0.78);
      col = mix(col, lineCol, lineGlow * 0.85);
      col = mix(col, lineCol * 1.1, haloGlow * 0.7);
      col += u_star_color.rgb * starGlow;

      // Faintest background dusting of unnamed stars
      vec2 fg = floor(uv * 140.0);
      float faint = smoothstep(0.96, 1.0, hash(fg + 8.8));
      col += u_star_color.rgb * faint *
             smoothstep(0.08, 0.0, length(fract(uv * 140.0) - 0.5)) * 0.35;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density',     name: 'Star Density',   type: 'float', min: 3.0, max: 12.0, default: 6.0 },
    { id: 'u_connect',     name: 'Line Frequency', type: 'float', min: 0.0, max: 1.0,  default: 0.45 },
    { id: 'u_chart_color', name: 'Chart Ink',      type: 'color', default: [0.040, 0.060, 0.110, 1.0] },
    { id: 'u_star_color',  name: 'Star Colour',    type: 'color', default: [0.95, 0.92, 0.80, 1.0] }
  ]
};

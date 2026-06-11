export default {
  id: 'oscilloscope_lissajous',
  name: 'Oscilloscope Lissajous',
  category: 'Retro',
  added: '2026-06-11',
  description: 'A lab scope locked on a Lissajous figure — the phosphor beam looping its frequency-ratio knot over an etched graticule, green afterglow pooling in the glass.',
  shader: `
    vec4 generate() {
      vec2 p = fract(v_uv) - 0.5;
      vec2 uv = fract(v_uv);

      // --- CRT glass: deep green-black with a domed sheen ---
      float rr = length(p);
      vec3 col = vec3(0.012, 0.035, 0.022);
      col += vec3(0.0, 0.018, 0.010) * (1.0 - smoothstep(0.15, 0.70, rr));
      // glass dome glare upper-left
      vec2 gp = p - vec2(-0.22, 0.24);
      col += vec3(0.025, 0.045, 0.035) * exp(-dot(gp, gp) * 18.0);

      // --- graticule: 10x10 etched grid, centre axes heavier, axis ticks ---
      vec2 g = fract(uv * 10.0);
      float gl = min(min(g.x, 1.0 - g.x), min(g.y, 1.0 - g.y));
      float grid = 1.0 - smoothstep(0.0, 0.05, gl);
      col += vec3(0.05, 0.10, 0.07) * grid * 0.5;
      float axes = (1.0 - smoothstep(0.002, 0.006, abs(p.x)))
                 + (1.0 - smoothstep(0.002, 0.006, abs(p.y)));
      col += vec3(0.06, 0.12, 0.08) * clamp(axes, 0.0, 1.0) * 0.7;
      // fine tick dots along the axes
      float tickx = (1.0 - smoothstep(0.002, 0.005, abs(p.y))) * step(0.8, fract(uv.x * 50.0));
      float ticky = (1.0 - smoothstep(0.002, 0.005, abs(p.x))) * step(0.8, fract(uv.y * 50.0));
      col += vec3(0.05, 0.10, 0.07) * clamp(tickx + ticky, 0.0, 1.0) * 0.5;

      // --- the beam: closed Lissajous knot, sampled as a polyline ---
      float a = floor(u_ratio_a + 0.5);
      float b = floor(u_ratio_b + 0.5);
      float dmin = 1e5;
      for (int i = 0; i < 128; i++) {
        float t = float(i) / 128.0 * 6.2831853;
        vec2 q = vec2(sin(a * t + u_phase), sin(b * t)) * 0.385;
        float d = length(p - q);
        if (d < dmin) dmin = d;
      }

      vec3 beam = u_beam_color.rgb;
      // hot core, inner bloom, wide afterglow
      float core = exp(-dmin * dmin * 14000.0);
      float bloom = exp(-dmin * 38.0) * 0.55;
      float after = exp(-dmin * 9.0) * 0.16;
      col += beam * (core * 1.35 + bloom + after);
      // the core whites out where it burns hardest
      col += vec3(0.7, 0.9, 0.8) * core * 0.5;

      // phosphor grain + slow burn-in mottle
      col *= 0.92 + noise(uv * 420.0) * 0.16;
      col *= 0.95 + 0.05 * snoise(uv * 3.0);

      // bezel vignette
      col *= 1.0 - smoothstep(0.42, 0.55, rr) * 0.55;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_ratio_a', name: 'X Frequency', type: 'float', min: 1.0, max: 7.0, default: 3.0 },
    { id: 'u_ratio_b', name: 'Y Frequency', type: 'float', min: 1.0, max: 7.0, default: 2.0 },
    { id: 'u_phase', name: 'Phase Shift', type: 'float', min: 0.0, max: 3.14159, default: 1.5708 },
    { id: 'u_beam_color', name: 'Phosphor', type: 'color', default: [0.30, 1.0, 0.45, 1.0] }
  ]
};

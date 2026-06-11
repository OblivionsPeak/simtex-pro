export default {
  id: 'polaroid_fade',
  name: 'Polaroid Fade',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Instant photos pinned in a grid — chalky white frames with fat bottoms, each window holding a sun-bleached chemical sunset drowning in cyan shadows and grain.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_tiles;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      float seed = hash(cell);

      // photo window: equal sides/top, fat bottom margin
      vec2 lo = vec2(0.08, 0.215);
      vec2 hi = vec2(0.92, 0.925);
      bool inPhoto = f.x > lo.x && f.x < hi.x && f.y > lo.y && f.y < hi.y;

      // --- the frame ---
      vec3 frame = vec3(0.965, 0.955, 0.925);
      frame -= vec3(0.05, 0.06, 0.08) * noise(uv * 160.0) * 0.5;
      // age-yellowing creeping in from the tile edge
      float edged = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      frame = mix(frame * vec3(1.0, 0.96, 0.86), frame, smoothstep(0.0, 0.06, edged));
      // soft drop shadow ring hugging the photo window
      vec2 q = max(lo - f, f - hi);
      float outd = max(q.x, q.y);
      frame *= 1.0 - exp(-max(outd, 0.0) * 55.0) * 0.22;
      // tile separation shadow
      frame *= 0.88 + 0.12 * smoothstep(0.0, 0.025, edged);

      vec3 col = frame;

      if (inPhoto) {
        vec2 pf = (f - lo) / (hi - lo);   // 0..1 inside the photo

        // --- the photograph: a low-sun landscape ---
        float horizon = 0.42 + (seed - 0.5) * 0.10;
        vec3 skyTop = vec3(0.55, 0.62, 0.72);
        vec3 skyLow = vec3(0.95, 0.72, 0.50);
        vec3 ground = vec3(0.30, 0.26, 0.22);
        vec3 photo = mix(skyLow, skyTop, smoothstep(horizon, 1.0, pf.y));
        photo = mix(ground * (0.7 + 0.3 * pf.y / max(horizon, 0.01)), photo, smoothstep(horizon - 0.015, horizon, pf.y));

        // soft blown-out sun
        vec2 sp = pf - vec2(0.30 + seed * 0.4, horizon + 0.16);
        photo += vec3(1.0, 0.85, 0.6) * exp(-dot(sp, sp) * 55.0) * 0.7;

        // distant treeline scribble on the horizon
        float tree = smoothstep(0.0, 0.025, pf.y - horizon) * smoothstep(0.06, 0.02, pf.y - horizon);
        photo = mix(photo, vec3(0.22, 0.20, 0.17), tree * step(0.35, noise(vec2(pf.x * 30.0 + cell.x * 13.0, 2.0))));

        // --- chemical decay ---
        // milky fade toward beige + cyan-shifted shadows
        vec3 milk = vec3(0.88, 0.84, 0.74);
        float lum = dot(photo, vec3(0.299, 0.587, 0.114));
        photo = mix(photo, mix(vec3(0.30, 0.45, 0.48), milk, lum), u_fade);
        // warm cast from the tint uniform
        photo *= mix(vec3(1.0), u_tint.rgb, 0.35);
        // per-print exposure lottery
        photo *= 0.88 + hash(cell + 3.3) * 0.24;
        // vertical developer streaks
        photo += vec3(0.06, 0.05, 0.03) * (noise(vec2(pf.x * 18.0 + cell.x * 31.0, 0.5)) - 0.5);
        // emulsion grain
        photo += (noise(uv * 480.0) - 0.5) * 0.06;
        // hard vignette pooling in the corners
        vec2 vc = pf - 0.5;
        photo *= 1.0 - dot(vc, vc) * 0.55;

        col = photo;
      }

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_tiles', name: 'Prints Across', type: 'float', min: 1.0, max: 5.0, default: 2.0 },
    { id: 'u_fade', name: 'Chemical Fade', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_tint', name: 'Age Tint', type: 'color', default: [1.0, 0.88, 0.70, 1.0] }
  ]
};

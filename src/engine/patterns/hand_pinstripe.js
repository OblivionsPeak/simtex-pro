export default {
  id: 'hand_pinstripe',
  name: 'Hand Pinstripe',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Flowing symmetric pinstriper linework — mirrored sweeps, teardrop returns and crossover flourishes pulled by brush in one-shot enamel over deep lacquer.',
  shader: `
    // distance from y to a flowing stroke path, with hand wobble baked in
    float stroke_hrt4(vec2 p, float yc, float wob) {
      return abs(p.y - yc + wob);
    }

    vec4 generate() {
      // one motif per tile, mirrored about the vertical centreline
      vec2 uv = v_uv;
      vec2 p = vec2(abs(uv.x - 0.5), uv.y);   // symmetry fold

      // --- palette: black-cherry lacquer, one-shot ivory stripe ---
      vec3 body   = u_body_color.rgb;
      vec3 stripe = u_stripe_color.rgb;
      vec3 accent = stripe * vec3(0.55, 0.75, 1.25);   // cooler secondary line

      // deep lacquer: subtle flake, polishing swirls, dark vignette
      vec3 col = body;
      col *= 0.96 + noise(uv * 600.0) * 0.06;
      col += smoothstep(0.9, 0.2, length(uv - 0.5)) * 0.025;
      col *= 0.995 + 0.01 * snoise(uv * vec2(40.0, 3.0));

      // the striper's hand: low-frequency drift + bristle jitter
      float wob = (noise(p * 7.0) - 0.5) * 0.006 + (noise(p * 55.0) - 0.5) * 0.0015;

      float w = u_line_weight * 0.5;
      float aa = 0.0025;
      float ink = 0.0;
      float ink2 = 0.0;

      // --- primary sweep: long S-curve flowing out from centre ---
      float y1 = 0.62 + 0.16 * sin(p.x * 6.0 - 0.6) * u_flourish - p.x * 0.10;
      ink = max(ink, smoothstep(aa, -aa, stroke_hrt4(p, y1, wob) - w));

      // --- return sweep: curls back beneath, tapering as it goes ---
      float y2 = 0.50 + 0.20 * sin(p.x * 9.0 + 1.8) * u_flourish - p.x * 0.04;
      float taper2 = w * (1.0 - smoothstep(0.15, 0.5, p.x) * 0.55);
      ink = max(ink, smoothstep(aa, -aa, stroke_hrt4(p, y2, wob) - taper2));

      // --- low flourish: shallow arc with a teardrop ending ---
      float y3 = 0.30 + 0.10 * sin(p.x * 4.5 + 3.6) * u_flourish + p.x * 0.06;
      float taper3 = w * (1.0 - smoothstep(0.05, 0.42, p.x));
      ink2 = max(ink2, smoothstep(aa, -aa, stroke_hrt4(p, y3, wob) - taper3));

      // teardrop returns where strokes meet the centreline
      float drop = smoothstep(w * 2.6, w * 1.2, length(vec2(p.x, p.y - 0.62)));
      drop = max(drop, smoothstep(w * 2.2, w * 1.0, length(vec2(p.x, p.y - 0.30))));
      ink = max(ink, drop);

      // tiny crossover dots — striper's signature ticks between sweeps
      float tick = smoothstep(w * 1.6, w * 0.7, length(vec2(p.x - 0.32, p.y - 0.56)));
      tick = max(tick, smoothstep(w * 1.6, w * 0.7, length(vec2(p.x - 0.18, p.y - 0.42))));
      ink2 = max(ink2, tick);

      // enamel sits proud: faint shadow under every line
      float shadow = max(
        smoothstep(aa, -aa, stroke_hrt4(p + vec2(0.0, 0.006), y1, wob) - w),
        smoothstep(aa, -aa, stroke_hrt4(p + vec2(0.0, 0.006), y2, wob) - taper2));
      col *= 1.0 - shadow * (1.0 - ink) * 0.18;

      // lay the paint: primary ivory, secondary cool accent
      // brush loading varies opacity slightly along the stroke
      float load = 0.92 + 0.08 * noise(p * 13.0);
      col = mix(col, stripe * load, ink);
      col = mix(col, accent * load, ink2 * (1.0 - ink));

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_line_weight', name: 'Line Weight', type: 'float', min: 0.004, max: 0.03, default: 0.011 },
    { id: 'u_flourish', name: 'Flourish', type: 'float', min: 0.3, max: 1.6, default: 1.0 },
    { id: 'u_body_color', name: 'Lacquer Colour', type: 'color', default: [0.13, 0.04, 0.07, 1.0] },
    { id: 'u_stripe_color', name: 'Stripe Colour', type: 'color', default: [0.94, 0.90, 0.78, 1.0] }
  ]
};

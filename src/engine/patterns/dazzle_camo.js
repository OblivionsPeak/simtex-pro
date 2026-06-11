export default {
  id: 'dazzle_camo',
  name: 'Dazzle Camo',
  category: 'Geometric',
  description: 'WWI battleship razzle-dazzle: bold irregular geometric zones, each filled with hard-edged two-tone stripes at its own clashing angle and frequency, plus occasional accent zones.',
  shader: `

    vec4 generate() {
      vec2 baseUv = v_uv;

      // Warp the lookup so zone borders are irregular polygons, not neat cells
      vec2 uv = baseUv * u_zone_scale;
      uv += vec2(snoise(uv * 0.9 + 4.7), snoise(uv * 0.9 + 19.3)) * 0.22;

      // Nearest jittered cell point -> zone id (cheap voronoi)
      vec2 g = floor(uv);
      vec2 fpos = fract(uv);
      float bestD = 99.0;
      vec2 bestId = g;
      for (int yy = -1; yy <= 1; yy++) {
        for (int xx = -1; xx <= 1; xx++) {
          vec2 off = vec2(float(xx), float(yy));
          vec2 id = g + off;
          vec2 toPt = off + vec2(hash(id + 3.1), hash(id + 71.7)) - fpos;
          float d = dot(toPt, toPt);
          if (d < bestD) { bestD = d; bestId = id; }
        }
      }

      // Every zone gets its own stripe direction, frequency and phase
      float zoneAng = hash(bestId + 9.4) * 3.14159265;
      vec2 stripeDir = vec2(cos(zoneAng), sin(zoneAng));
      float freq = u_stripe_freq * (0.65 + hash(bestId + 27.2) * 0.8);
      float s = dot(baseUv, stripeDir) * freq + hash(bestId + 55.5) * 8.0;
      float stripe = step(0.5, fract(s));

      // ~15% of zones swap the dark tone for the accent colour
      float useAccent = step(0.85, hash(bestId + 41.3));
      vec4 ink = mix(u_color_b, u_color_accent, useAccent);

      vec4 color = mix(u_color_a, ink, stripe);
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Classic B&W',
      uniforms: {
        u_color_a: [0.95, 0.95, 0.94, 1.0],
        u_color_b: [0.06, 0.06, 0.07, 1.0],
        u_color_accent: [0.30, 0.32, 0.36, 1.0]
      }
    },
    {
      name: 'Navy',
      uniforms: {
        u_color_a: [0.78, 0.83, 0.88, 1.0],
        u_color_b: [0.07, 0.13, 0.26, 1.0],
        u_color_accent: [0.32, 0.45, 0.62, 1.0]
      }
    },
    {
      name: 'Magenta Pop',
      uniforms: {
        u_color_a: [0.97, 0.96, 0.97, 1.0],
        u_color_b: [0.10, 0.08, 0.12, 1.0],
        u_color_accent: [0.92, 0.10, 0.55, 1.0]
      }
    },
    {
      name: 'Ghost Grey',
      uniforms: {
        u_color_a: [0.82, 0.83, 0.85, 1.0],
        u_color_b: [0.55, 0.57, 0.61, 1.0],
        u_color_accent: [0.38, 0.40, 0.45, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_zone_scale', name: 'Zone Scale', type: 'float', min: 1.5, max: 10.0, default: 4.0 },
    { id: 'u_stripe_freq', name: 'Stripe Frequency', type: 'float', min: 5.0, max: 60.0, default: 18.0 },
    { id: 'u_color_a', name: 'Stripe Light', type: 'color', default: [0.95, 0.95, 0.94, 1.0] },
    { id: 'u_color_b', name: 'Stripe Dark', type: 'color', default: [0.06, 0.06, 0.07, 1.0] },
    { id: 'u_color_accent', name: 'Accent', type: 'color', default: [0.30, 0.32, 0.36, 1.0] }
  ]
};

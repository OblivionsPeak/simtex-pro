export default {
  id: 'abyssal_silt',
  name: 'Abyssal Silt',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'A hadal sediment plain — fine grey-brown ooze combed into faint current ripples, pocked with burrow holes and feeding trails.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- base ooze: soft tonal drifts ---
      vec3 silt = u_silt_color.rgb;
      float drift = fbm(uv * 3.0) * 0.5 + 0.5;
      vec3 col = mix(silt * 0.75, silt * 1.12, drift);

      // --- current ripples: long ridges combed horizontally ---
      // anisotropic noise (stretched in x) gives sinuous ridge crests
      float rip = snoise(vec2(uv.x * 2.5, uv.y * 16.0));
      rip += snoise(vec2(uv.x * 5.0 + 7.0, uv.y * 32.0)) * 0.4;
      float crest = smoothstep(-0.2, 0.8, rip);
      // crests catch the light, troughs hold shadow
      col *= 0.88 + crest * 0.22 * u_ripples;
      // crisp shadow line just under each crest
      float shadow_line = smoothstep(0.15, 0.0, abs(rip - 0.45)) * u_ripples;
      col *= 1.0 - shadow_line * 0.10;

      // --- fine sediment grain, two scales ---
      col += (noise(uv * 220.0) - 0.5) * 0.07 * u_grain;
      col += (noise(uv * 70.0 + 31.0) - 0.5) * 0.05 * u_grain;

      // --- burrow holes: sparse dark pits with raised rims ---
      vec2 g = uv * 9.0;
      vec2 id = floor(g);
      vec2 f = fract(g) - 0.5;
      float bh = hash(id + 13.1);
      if (bh > 0.72) {
        vec2 bp = f - (vec2(hash(id + 1.1), hash(id + 2.2)) - 0.5) * 0.6;
        float d = length(bp);
        float r = 0.05 + 0.05 * hash(id + 5.5);
        // dark pit
        col = mix(col, silt * 0.30, smoothstep(r, r * 0.4, d));
        // pale excavated rim ring
        col = mix(col, silt * 1.25, smoothstep(0.04, 0.0, abs(d - r * 1.4)) * 0.6);
      }

      // --- feeding trails: meandering grooves pressed into the ooze ---
      float trail = 1.0 - abs(snoise(uv * 2.0 + vec2(57.0, 23.0)));
      trail = pow(trail, 14.0);
      float trail2 = 1.0 - abs(snoise(uv * 3.3 + vec2(5.0, 91.0)));
      trail = max(trail, pow(trail2, 16.0) * 0.8);
      // a groove: dark centre, faint bright pushed-up edges
      col *= 1.0 - trail * 0.18;
      col += silt * 0.18 * smoothstep(0.35, 0.55, trail) * (1.0 - smoothstep(0.65, 0.9, trail));

      // scattered detritus flecks (marine snow that has landed)
      float fleck = step(0.988, hash(floor(uv * 130.0) + 77.0));
      col = mix(col, silt * 1.35 + vec3(0.04), fleck * 0.7);
      float dark_fleck = step(0.992, hash(floor(uv * 95.0) + 41.0));
      col = mix(col, silt * 0.45, dark_fleck * 0.6);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_ripples',    name: 'Ripple Relief', type: 'float', min: 0.0, max: 1.5, default: 0.8 },
    { id: 'u_grain',      name: 'Grain Amount',  type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_silt_color', name: 'Silt Color',    type: 'color', default: [0.45, 0.41, 0.36, 1.0] }
  ]
};

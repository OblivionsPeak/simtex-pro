export default {
  id: 'jade_polish',
  name: 'Jade Polish',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Polished nephrite jade — deep translucent green with drifting cloudy inclusions, dark specks, and the characteristic soft waxy lustre.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 jade = u_jade_color.rgb;

      // --- Translucent body with depth layers ---
      // Two fbm layers at different "depths" parallax-shifted slightly,
      // giving the sense of looking into the stone
      float deepLayer = fbm(uv * u_cloud_scale) * 0.5 + 0.5;
      float midLayer  = fbm(uv * u_cloud_scale * 2.1 + vec2(0.07, 0.04) + 19.0) * 0.5 + 0.5;

      vec3 deepCol = jade * vec3(0.30, 0.42, 0.32);
      vec3 col = mix(deepCol, jade, deepLayer);

      // --- Cloudy white inclusions: soft drifting wisps ---
      float wisp = smoothstep(0.55, 0.85, midLayer);
      vec3 cloudCol = mix(jade * 1.25, vec3(0.85, 0.92, 0.82), 0.5);
      col = mix(col, cloudCol, wisp * u_cloudiness * 0.55);

      // Streaky fibrous structure (nephrite is felted amphibole fibers)
      float fibre = snoise(uv * vec2(u_cloud_scale * 6.0, u_cloud_scale * 1.5));
      col *= 0.95 + fibre * 0.06;

      // --- Dark inclusions: chromite/graphite specks ---
      float speckCell = hash(floor(uv * 90.0));
      float speck = step(0.96, speckCell);
      float speckSoft = smoothstep(0.93, 0.99, speckCell);
      col = mix(col, vec3(0.05, 0.09, 0.06), speck * 0.7 + speckSoft * 0.15);

      // Faint healed fracture lines
      float crack = smoothstep(0.035, 0.0, abs(snoise(uv * 4.5 + 53.0)));
      col = mix(col, cloudCol * 0.9, crack * 0.18);

      // --- Waxy polish: the jade signature ---
      // Broad, soft, low-contrast highlight — greasy rather than glassy
      vec2 hdir = normalize(vec2(0.7, 0.55));
      float band = dot(uv - 0.5, hdir);
      float wax = exp(-band * band * 9.0);
      col += jade * wax * u_waxiness * 0.18 + wax * u_waxiness * 0.06;

      // Secondary small soft hotspot
      float spot = pow(clamp(1.0 - length(uv - vec2(0.62, 0.3)) * 2.2, 0.0, 1.0), 2.0);
      col += spot * u_waxiness * 0.08;

      // Subsurface glow: edges of cloudy zones catch light
      float rim = wisp * (1.0 - wisp) * 4.0;
      col += cloudCol * rim * 0.08;

      // Ultra-fine polished grain
      col += (hash(uv * 900.0) - 0.5) * 0.012;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cloud_scale', name: 'Cloud Scale',  type: 'float', min: 1.5, max: 12.0, default: 4.0 },
    { id: 'u_cloudiness',  name: 'Cloudiness',   type: 'float', min: 0.0, max: 1.5,  default: 0.8 },
    { id: 'u_waxiness',    name: 'Waxy Lustre',  type: 'float', min: 0.0, max: 2.0,  default: 1.0 },
    { id: 'u_jade_color',  name: 'Jade Green',   type: 'color', default: [0.13, 0.42, 0.25, 1.0] }
  ]
};

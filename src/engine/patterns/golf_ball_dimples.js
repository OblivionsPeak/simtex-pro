export default {
  id: 'golf_ball_dimples',
  name: 'Golf Ball Dimples',
  category: 'Sports',
  added: '2026-07-13',
  description: 'Hex-packed spherical dimples pressed into ivory — concave inner shading, lit rim highlights, and a soft tour-ball tint drift.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // hex-packed lattice: staggered rows at sqrt(3)/2 pitch
      float rowBase = floor(uv.y / 0.8660254);
      float dmin = 9.0;
      float id = 0.0;
      vec2 relMin = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          float r = rowBase + float(j);
          float xo = 0.5 * mod(r, 2.0);
          float c = floor(uv.x - xo) + float(i);
          vec2 ctr = vec2(c + xo + 0.5, (r + 0.5) * 0.8660254);
          float d = length(uv - ctr);
          if (d < dmin) { dmin = d; id = hash(vec2(c, r)); relMin = uv - ctr; }
        }
      }
      float R = 0.5 * u_dimple_size;
      vec2 nrel = relMin / max(dmin, 0.0001);
      vec2 L = normalize(vec2(-0.55, 0.75));
      // ivory base with slight per-region tint variation and micro grain
      vec3 base = mix(u_primary_color.rgb, u_secondary_color.rgb, 0.45 * fbm(v_uv * 5.0 + 11.0));
      base *= 0.985 + 0.030 * (id - 0.5);
      base *= 0.985 + 0.030 * fbm(v_uv * 60.0);
      // concave bowl shading: far wall catches light, near wall shades
      float rr = clamp(dmin / R, 0.0, 1.0);
      float wall = smoothstep(0.15, 0.9, rr);
      float lit = -dot(nrel, L) * wall;
      vec3 dimple = base * (0.80 + 0.22 * lit);
      dimple *= 1.0 - 0.16 * (1.0 - rr); // slightly darker bowl floor
      // bright rim arc where the lit edge rolls over
      float rim = smoothstep(R - 0.10, R, dmin) * (1.0 - smoothstep(R, R + 0.10, dmin));
      dimple += u_accent_color.rgb * rim * max(dot(nrel, L), 0.0) * 0.35;
      // land between dimples keeps a gentle sheen
      vec3 land = base * (1.0 + 0.06 * max(dot(nrel, L), 0.0));
      float inside = 1.0 - smoothstep(R - 0.05, R + 0.05, dmin);
      vec3 col = mix(land, dimple, inside);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Dimple Density', type: 'float', min: 6.0, max: 40.0, default: 16.0 },
    { id: 'u_dimple_size', name: 'Dimple Size', type: 'float', min: 0.5, max: 0.95, default: 0.82 },
    { id: 'u_primary_color', name: 'Ivory', type: 'color', default: [0.96, 0.95, 0.90, 1.0] },
    { id: 'u_secondary_color', name: 'Tint Drift', type: 'color', default: [0.88, 0.88, 0.84, 1.0] },
    { id: 'u_accent_color', name: 'Rim Highlight', type: 'color', default: [1.0, 1.0, 0.97, 1.0] }
  ],
  variants: [
    { name: 'Tour Ivory', uniforms: { u_scale: 16.0, u_dimple_size: 0.82, u_primary_color: [0.96, 0.95, 0.90, 1.0], u_secondary_color: [0.88, 0.88, 0.84, 1.0], u_accent_color: [1.0, 1.0, 0.97, 1.0] } },
    { name: 'Range Yellow', uniforms: { u_scale: 20.0, u_dimple_size: 0.85, u_primary_color: [0.95, 0.85, 0.20, 1.0], u_secondary_color: [0.82, 0.70, 0.14, 1.0], u_accent_color: [1.0, 0.98, 0.75, 1.0] } },
    { name: 'Night Round', uniforms: { u_scale: 12.0, u_dimple_size: 0.78, u_primary_color: [0.13, 0.15, 0.20, 1.0], u_secondary_color: [0.08, 0.09, 0.13, 1.0], u_accent_color: [0.45, 0.75, 0.95, 1.0] } }
  ]
};

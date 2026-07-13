export default {
  id: 'tennis_court_acrylic',
  name: 'Tennis Court Acrylic',
  category: 'Sports',
  added: '2026-07-13',
  description: 'Granular acrylic hard-court in two-tone — court and surround split by crisp painted lines, dusted with fuzzy ball scuffs.',
  shader: `
    vec4 generate() {
      // granular acrylic surface at two grit scales
      float grit1 = hash(floor(v_uv * u_scale));
      float grit2 = hash(floor(v_uv * u_scale * 0.47) + 7.0);
      // court rectangle vs surround
      vec2 p = abs(v_uv - 0.5);
      float cd = max(p.x - 0.36, p.y - 0.43);
      float court = 1.0 - smoothstep(0.0, 0.004, cd);
      vec3 base = mix(u_secondary_color.rgb, u_primary_color.rgb, court);
      base *= 0.92 + 0.11 * grit1 + 0.05 * grit2;
      base *= 0.95 + 0.09 * fbm(v_uv * 4.0 + 9.0); // broad sun/wear drift
      // painted line work
      float lw = u_line_width;
      float aa = 0.003;
      float L = 1.0 - smoothstep(lw, lw + aa, abs(cd));                                     // outer boundary
      L = max(L, (1.0 - smoothstep(lw, lw + aa, abs(p.x - 0.26))) * step(p.y, 0.43));       // singles sidelines
      L = max(L, (1.0 - smoothstep(lw, lw + aa, abs(p.y - 0.18))) * step(p.x, 0.26));       // service lines
      L = max(L, (1.0 - smoothstep(lw, lw + aa, p.x)) * step(p.y, 0.18));                   // center service line
      vec3 paint = u_accent_color.rgb * (0.90 + 0.14 * grit1);
      // paint wears thin over the granular surface
      float wear = 0.82 + 0.18 * smoothstep(0.2, 0.8, fbm(v_uv * 30.0 + 17.0));
      vec3 col = mix(base, paint, L * wear);
      // fuzzy ball scuff marks
      vec2 g = v_uv * 14.0;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;
      float sc = 0.0;
      if (hash(cell + 3.3) < 0.20) {
        vec2 jit = (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.2;
        float r = 0.14 + 0.18 * hash(cell + 4.4);
        float d = length(f - jit);
        float blob = 1.0 - smoothstep(r * 0.3, r, d);
        sc = blob * (0.35 + 0.45 * hash(cell + 5.5)) * (0.5 + 0.5 * fbm(v_uv * 45.0 + cell));
      }
      col = mix(col, col * 1.22 + vec3(0.06, 0.06, 0.02), sc * u_scuff_amount);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grit Density', type: 'float', min: 200.0, max: 1000.0, default: 520.0 },
    { id: 'u_line_width', name: 'Line Width', type: 'float', min: 0.004, max: 0.02, default: 0.008 },
    { id: 'u_scuff_amount', name: 'Ball Scuffs', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Court', type: 'color', default: [0.13, 0.32, 0.58, 1.0] },
    { id: 'u_secondary_color', name: 'Surround', type: 'color', default: [0.16, 0.42, 0.28, 1.0] },
    { id: 'u_accent_color', name: 'Lines', type: 'color', default: [0.95, 0.95, 0.93, 1.0] }
  ],
  variants: [
    { name: 'US Hard Court', uniforms: { u_scale: 520.0, u_line_width: 0.008, u_scuff_amount: 0.5, u_primary_color: [0.13, 0.32, 0.58, 1.0], u_secondary_color: [0.16, 0.42, 0.28, 1.0], u_accent_color: [0.95, 0.95, 0.93, 1.0] } },
    { name: 'Aussie Blue', uniforms: { u_scale: 600.0, u_line_width: 0.009, u_scuff_amount: 0.35, u_primary_color: [0.10, 0.45, 0.72, 1.0], u_secondary_color: [0.05, 0.28, 0.50, 1.0], u_accent_color: [0.97, 0.97, 0.95, 1.0] } },
    { name: 'Clay Classic', uniforms: { u_scale: 420.0, u_line_width: 0.010, u_scuff_amount: 0.7, u_primary_color: [0.72, 0.36, 0.20, 1.0], u_secondary_color: [0.60, 0.28, 0.15, 1.0], u_accent_color: [0.94, 0.92, 0.88, 1.0] } }
  ]
};

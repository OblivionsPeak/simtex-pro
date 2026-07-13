export default {
  id: 'citrus_slice',
  name: 'Citrus Slice',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Repeating juicy citrus wheels: radial pulp segments with glistening cell noise, white pith ring, and zesty rind edge.',
  shader: `
    vec4 generate() {
      vec2 uv0 = v_uv * u_scale;
      // brick-offset rows so the slices stagger instead of gridding up
      float row = floor(uv0.y);
      vec2 uv = uv0 + vec2(mod(row, 2.0) * 0.5, 0.0);
      vec2 cell = floor(uv);
      vec2 f = (fract(uv) - 0.5) * 2.0; // -1..1 in cell
      float r = length(f);
      // creamy ground between slices, softly mottled
      vec3 col = mix(u_accent_color.rgb, vec3(1.0), 0.3) * (0.94 + 0.08 * noise(uv * 3.0));
      // per-slice rotation so no two wheels align
      float a01 = fract(atan(f.y, f.x) / 6.2831853 + hash(cell + 8.8));
      float aa = 0.035;
      float slice = smoothstep(0.94 + aa, 0.94 - aa, r);
      float rindIn = smoothstep(0.85 + aa, 0.85 - aa, r);
      float pithIn = smoothstep(0.77 + aa, 0.77 - aa, r);
      float core = smoothstep(0.11 + aa, 0.11 - aa, r);
      // rind: zest pores and a slightly darker outer lip
      vec3 rind = u_secondary_color.rgb * (0.82 + 0.32 * noise(f * 24.0 + cell * 3.0));
      rind *= 0.85 + 0.15 * smoothstep(0.94, 0.86, r);
      col = mix(col, rind, slice);
      // pith ring
      vec3 pith = u_accent_color.rgb * (0.95 + 0.08 * noise(f * 14.0 + cell));
      col = mix(col, pith, rindIn);
      // pulp: juicy vesicle noise + radial streaks, brighter toward the pith
      float segF = fract(a01 * u_segments);
      float juice = noise(f * 16.0 + cell * 7.0);
      float streak = noise(vec2(a01 * u_segments * 5.0, r * 3.0) + cell);
      vec3 pulp = u_primary_color.rgb * (0.72 + 0.3 * juice + 0.14 * streak);
      pulp *= 0.82 + 0.28 * smoothstep(0.1, 0.77, r);
      // wet glisten on the plumpest vesicles
      pulp += vec3(1.0, 0.98, 0.9) * pow(juice, 4.0) * 0.35;
      col = mix(col, pulp, pithIn);
      // septa: thin pale membranes between segments, fading near the core
      float sd = min(segF, 1.0 - segF);
      float septa = smoothstep(0.05, 0.02, sd) * smoothstep(0.09, 0.2, r);
      col = mix(col, u_accent_color.rgb * 0.97, septa * pithIn);
      // central core
      col = mix(col, u_accent_color.rgb * (0.92 + 0.1 * hash(cell + 2.2)), core);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Slice Count', type: 'float', min: 2.0, max: 16.0, default: 5.0 },
    { id: 'u_segments', name: 'Pulp Segments', type: 'float', min: 6.0, max: 14.0, default: 9.0 },
    { id: 'u_primary_color', name: 'Pulp', type: 'color', default: [0.98, 0.55, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Rind', type: 'color', default: [0.95, 0.42, 0.06, 1.0] },
    { id: 'u_accent_color', name: 'Pith', type: 'color', default: [0.99, 0.94, 0.82, 1.0] }
  ],
  variants: [
    { name: 'Valencia Orange', uniforms: { u_primary_color: [0.98, 0.55, 0.12, 1.0], u_secondary_color: [0.95, 0.42, 0.06, 1.0], u_accent_color: [0.99, 0.94, 0.82, 1.0], u_scale: 5.0, u_segments: 9.0 } },
    { name: 'Lemon Wheel', uniforms: { u_primary_color: [0.98, 0.85, 0.25, 1.0], u_secondary_color: [0.93, 0.78, 0.1, 1.0], u_accent_color: [0.99, 0.97, 0.86, 1.0], u_scale: 7.0, u_segments: 10.0 } },
    { name: 'Blood Orange', uniforms: { u_primary_color: [0.72, 0.12, 0.18, 1.0], u_secondary_color: [0.88, 0.32, 0.14, 1.0], u_accent_color: [0.98, 0.9, 0.8, 1.0], u_scale: 4.0, u_segments: 8.0 } }
  ]
};

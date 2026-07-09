export default {
  id: 'steel_wool_artisan',
  name: 'Steel Wool',
  category: 'Industrial',
  added: '2026-04-15',
  description: 'Tangled swirling metal fibers — layered strand nests with directional sheen.',
  shader: `
    // one nest layer: contour lines of a domain-warped field — the level
    // sets read as long curling fibers
    float strands(vec2 p, float seed, float freq) {
      vec2 warp = vec2(fbm(p * 0.5 + seed), fbm(p * 0.5 + seed + 9.0));
      float n = fbm(p * 0.7 + warp * u_swirl * 1.6 + seed * 3.0) * 0.5 + 0.5;
      float band = abs(fract(n * freq) - 0.5) * 2.0;
      return smoothstep(0.8, 0.1, band);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec3 col = u_secondary_color.rgb;
      // three overlapping nests, brightest on top
      for (int i = 0; i < 3; i++) {
        float fi = float(i);
        float m = strands(uv + fi * 13.7, fi * 7.0 + 1.0, 7.0 + fi * 3.0);
        // deeper layers darker, top layer catches light
        float tone = 0.45 + fi * 0.3;
        // glint where strands align with the light axis
        float glint = pow(m, 6.0) * max(0.4 + 0.6 * sin(uv.x * 1.7 + fi * 2.0), 0.0);
        vec3 strand = u_primary_color.rgb * tone + glint * 0.5;
        col = mix(col, strand, m * (0.5 + fi * 0.25));
      }
      // sparse abrasive sparkle
      col += vec3(0.3) * step(0.998, hash(floor(uv * 24.0)));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Nest Scale', type: 'float', min: 1.0, max: 12.0, default: 3.0 },
    { id: 'u_swirl', name: 'Swirl', type: 'float', min: 0.2, max: 2.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Steel Strand', type: 'color', default: [0.7, 0.7, 0.75, 1.0] },
    { id: 'u_secondary_color', name: 'Internal Shadow', type: 'color', default: [0.1, 0.1, 0.15, 1.0] }
  ],
  variants: [
    { name: 'Fresh Pad', uniforms: { u_primary_color: [0.7, 0.7, 0.75, 1.0], u_secondary_color: [0.1, 0.1, 0.15, 1.0], u_swirl: 1.0 } },
    { name: 'Copper Scourer', uniforms: { u_primary_color: [0.78, 0.5, 0.3, 1.0], u_secondary_color: [0.15, 0.08, 0.05, 1.0], u_swirl: 1.3 } },
    { name: 'Burnt Wool', uniforms: { u_primary_color: [0.45, 0.4, 0.38, 1.0], u_secondary_color: [0.05, 0.04, 0.04, 1.0], u_swirl: 0.7 } }
  ]
};

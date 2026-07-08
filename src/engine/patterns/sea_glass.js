export default {
  id: 'sea_glass',
  name: 'Sea Glass',
  category: 'Ocean',
  added: '2026-07-07',
  description: 'Tumbled frosted glass pebbles in beach pastels, scattered on wet sand.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // wet sand base with fine speckle
      vec4 col = u_secondary_color;
      col.rgb *= 0.92 + 0.08 * snoise(uv * 18.0);
      // voronoi pebbles, shrunk from their cell borders
      vec2 cell = floor(uv);
      float d1 = 8.0; float d2 = 8.0;
      vec2 id1 = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 c = cell + vec2(float(i), float(j));
          vec2 pt = c + vec2(hash(c + 1.1), hash(c + 2.2));
          float d = length(uv - pt);
          if (d < d1) { d2 = d1; d1 = d; id1 = c; }
          else if (d < d2) { d2 = d; }
        }
      }
      float border = d2 - d1;
      float pebble = smoothstep(u_gap, u_gap + 0.12, border);
      // some cells are empty sand
      pebble *= step(0.22, hash(id1 + 6.2));
      // pastel pick per pebble
      float pick = hash(id1 + 4.8);
      vec3 glass = u_primary_color.rgb;
      if (pick > 0.72) glass = u_accent_color.rgb;
      else if (pick > 0.42) glass = u_pop_color.rgb;
      // frosted interior: soft noise, brighter center, matte rim
      glass *= 0.85 + 0.15 * snoise(uv * 7.0 + id1);
      glass += vec3(0.1) * exp(-d1 * d1 * 5.0);
      glass = mix(glass, glass * 0.8, smoothstep(0.3, 0.05, border));
      // soft shadow around each pebble
      float shadow = (smoothstep(u_gap + 0.22, u_gap, border) - (1.0 - pebble)) ;
      col.rgb *= 1.0 - clamp(shadow, 0.0, 1.0) * 0.15;
      col.rgb = mix(col.rgb, glass, pebble);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pebble Density', type: 'float', min: 2.0, max: 14.0, default: 6.0 },
    { id: 'u_gap', name: 'Spacing', type: 'float', min: 0.02, max: 0.3, default: 0.1 },
    { id: 'u_secondary_color', name: 'Wet Sand', type: 'color', default: [0.72, 0.65, 0.52, 1.0] },
    { id: 'u_primary_color', name: 'Seafoam Glass', type: 'color', default: [0.6, 0.85, 0.75, 1.0] },
    { id: 'u_pop_color', name: 'Bottle Blue', type: 'color', default: [0.55, 0.75, 0.85, 1.0] },
    { id: 'u_accent_color', name: 'Rare Amber', type: 'color', default: [0.85, 0.7, 0.45, 1.0] }
  ],
  variants: [
    { name: 'Beachcomber', uniforms: { u_secondary_color: [0.72, 0.65, 0.52, 1.0], u_primary_color: [0.6, 0.85, 0.75, 1.0], u_pop_color: [0.55, 0.75, 0.85, 1.0], u_accent_color: [0.85, 0.7, 0.45, 1.0] } },
    { name: 'Cobalt Finds', uniforms: { u_secondary_color: [0.55, 0.52, 0.48, 1.0], u_primary_color: [0.3, 0.45, 0.8, 1.0], u_pop_color: [0.5, 0.65, 0.9, 1.0], u_accent_color: [0.75, 0.8, 0.88, 1.0] } },
    { name: 'Rose Quartz Tide', uniforms: { u_secondary_color: [0.78, 0.72, 0.68, 1.0], u_primary_color: [0.9, 0.7, 0.75, 1.0], u_pop_color: [0.85, 0.8, 0.85, 1.0], u_accent_color: [0.95, 0.85, 0.7, 1.0] } }
  ]
};

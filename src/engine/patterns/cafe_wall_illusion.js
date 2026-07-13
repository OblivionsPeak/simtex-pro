export default {
  id: 'cafe_wall_illusion',
  name: 'Cafe Wall Illusion',
  category: 'Geometric',
  added: '2026-07-13',
  description: 'The classic café-wall illusion — half-offset rows of dark and light tiles split by gray mortar seams that trick the eye into sloping.',
  shader: `
    vec4 generate() {
      // tiles are twice as wide as tall, like real cafe-wall brickwork
      vec2 uv = v_uv * u_scale * vec2(0.5, 1.0);
      float row = floor(uv.y);
      // alternate rows shift by half a tile — the engine of the illusion
      float xx = uv.x + mod(row, 2.0) * 0.5;
      float w = 0.035;
      // smooth alternating square wave for tile parity (AA vertical joints)
      float tri = abs(fract(xx * 0.5) * 2.0 - 1.0);
      float tile = smoothstep(0.5 - w, 0.5 + w, tri);
      // per-tile brightness so the wall reads hand-laid, not printed
      vec2 cell = vec2(floor(xx), row);
      float b = 0.93 + 0.09 * hash(cell + 3.7);
      vec3 col = mix(u_primary_color.rgb, u_secondary_color.rgb, tile) * b;
      // horizontal gray mortar lines — must sit tonally between the tiles
      float my = fract(uv.y);
      float dy = min(my, 1.0 - my);
      float mortar = 1.0 - smoothstep(u_mortar, u_mortar + w, dy);
      col = mix(col, u_accent_color.rgb, mortar);
      // faint masonry grime
      col *= 0.94 + 0.06 * fbm(v_uv * 7.0);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Row Count', type: 'float', min: 4.0, max: 26.0, default: 11.0 },
    { id: 'u_mortar', name: 'Mortar Width', type: 'float', min: 0.01, max: 0.12, default: 0.05 },
    { id: 'u_primary_color', name: 'Dark Tile', type: 'color', default: [0.06, 0.06, 0.07, 1.0] },
    { id: 'u_secondary_color', name: 'Light Tile', type: 'color', default: [0.92, 0.9, 0.86, 1.0] },
    { id: 'u_accent_color', name: 'Mortar', type: 'color', default: [0.48, 0.48, 0.5, 1.0] }
  ],
  variants: [
    { name: 'Bristol Cafe', uniforms: { u_primary_color: [0.06, 0.06, 0.07, 1.0], u_secondary_color: [0.92, 0.9, 0.86, 1.0], u_accent_color: [0.48, 0.48, 0.5, 1.0], u_scale: 11.0, u_mortar: 0.05 } },
    { name: 'Racing Green Wall', uniforms: { u_primary_color: [0.04, 0.2, 0.1, 1.0], u_secondary_color: [0.94, 0.88, 0.66, 1.0], u_accent_color: [0.45, 0.5, 0.44, 1.0], u_scale: 8.0, u_mortar: 0.06 } },
    { name: 'Neon Slant', uniforms: { u_primary_color: [0.1, 0.02, 0.16, 1.0], u_secondary_color: [0.1, 0.9, 0.85, 1.0], u_accent_color: [0.5, 0.35, 0.6, 1.0], u_scale: 16.0, u_mortar: 0.04 } }
  ]
};

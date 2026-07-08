export default {
  id: 'engine_turned_guilloche',
  name: 'Engine Turning',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Overlapping abraded swirl discs — the jeweled dashboard finish of vintage racers and warbirds.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // staggered rows of swirl centers, later rows overlap earlier ones
      vec2 g = uv;
      g.x += step(1.0, mod(floor(g.y / 0.75), 2.0)) * 0.5;
      vec2 cell = vec2(floor(g.x), floor(g.y / 0.75));
      vec2 ctr = vec2(cell.x + 0.5, (cell.y + 0.5) * 0.75);
      vec2 rel = vec2(g.x, g.y) - ctr;
      float r = length(rel);
      float ang = atan(rel.y, rel.x);
      // fine abrasive arcs inside each disc
      float swirl = sin(r * u_grain * 6.28318 + ang * 2.0 + hash(cell) * 6.28);
      float disc = smoothstep(0.72, 0.68, r);
      vec4 col = u_primary_color;
      col.rgb *= 0.82 + 0.18 * swirl;
      // moving-light sheen: brightness depends on swirl phase vs position
      col.rgb += u_shine * 0.15 * sin(ang * 3.0 + (cell.x + cell.y) * 1.7);
      // outside the disc grid shows the previous row's edge — darken seams
      col.rgb = mix(col.rgb * 0.75, col.rgb, disc);
      col.rgb = mix(u_secondary_color.rgb, col.rgb, smoothstep(0.78, 0.72, r));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Disc Density', type: 'float', min: 3.0, max: 24.0, default: 8.0 },
    { id: 'u_grain', name: 'Swirl Fineness', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_shine', name: 'Sheen', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Metal', type: 'color', default: [0.75, 0.76, 0.78, 1.0] },
    { id: 'u_secondary_color', name: 'Seam', type: 'color', default: [0.5, 0.5, 0.52, 1.0] }
  ],
  variants: [
    { name: 'Spirit of St Louis', uniforms: { u_primary_color: [0.75, 0.76, 0.78, 1.0], u_secondary_color: [0.5, 0.5, 0.52, 1.0], u_grain: 12.0, u_shine: 0.6 } },
    { name: 'Brass Dash', uniforms: { u_primary_color: [0.8, 0.62, 0.3, 1.0], u_secondary_color: [0.55, 0.4, 0.18, 1.0], u_grain: 14.0, u_shine: 0.75 } },
    { name: 'Smoked Turn', uniforms: { u_primary_color: [0.32, 0.33, 0.36, 1.0], u_secondary_color: [0.18, 0.18, 0.2, 1.0], u_grain: 10.0, u_shine: 0.9 } }
  ]
};

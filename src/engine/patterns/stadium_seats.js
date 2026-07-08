export default {
  id: 'stadium_seats',
  name: 'Stadium Seats',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Grandstand seating from the air — blocks of colored seats split by aisles.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      // section color blocks
      vec2 section = floor(cell / vec2(7.0, 5.0));
      float pick = hash(section + 0.5);
      vec4 seatCol = u_primary_color;
      if (pick > 0.66) seatCol = u_accent_color;
      else if (pick > 0.33) seatCol = u_pop_color;
      // aisles between sections
      float aisleX = step(mod(cell.x, 7.0), 0.5);
      float aisleY = step(mod(cell.y, 5.0), 0.5);
      float aisle = max(aisleX, aisleY);
      // seat shell: rounded square with a backrest highlight
      vec2 p = f - 0.5;
      float seat = smoothstep(0.42, 0.36, max(abs(p.x), abs(p.y)));
      float back = smoothstep(0.1, 0.3, p.y) * 0.25;
      seatCol.rgb *= 0.85 + back + 0.1 * hash(cell + 9.9);
      vec4 col = mix(u_secondary_color, seatCol, seat * (1.0 - aisle));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Seat Density', type: 'float', min: 10.0, max: 80.0, default: 32.0 },
    { id: 'u_secondary_color', name: 'Concrete', type: 'color', default: [0.32, 0.32, 0.34, 1.0] },
    { id: 'u_primary_color', name: 'Section 1', type: 'color', default: [0.85, 0.12, 0.15, 1.0] },
    { id: 'u_accent_color', name: 'Section 2', type: 'color', default: [0.12, 0.3, 0.7, 1.0] },
    { id: 'u_pop_color', name: 'Section 3', type: 'color', default: [0.92, 0.78, 0.12, 1.0] }
  ],
  variants: [
    { name: 'Main Straight', uniforms: { u_secondary_color: [0.32, 0.32, 0.34, 1.0], u_primary_color: [0.85, 0.12, 0.15, 1.0], u_accent_color: [0.12, 0.3, 0.7, 1.0], u_pop_color: [0.92, 0.78, 0.12, 1.0] } },
    { name: 'Home Team', uniforms: { u_secondary_color: [0.25, 0.27, 0.28, 1.0], u_primary_color: [0.1, 0.45, 0.25, 1.0], u_accent_color: [0.95, 0.95, 0.92, 1.0], u_pop_color: [0.08, 0.3, 0.16, 1.0] } },
    { name: 'Night Race', uniforms: { u_secondary_color: [0.1, 0.1, 0.13, 1.0], u_primary_color: [0.5, 0.1, 0.55, 1.0], u_accent_color: [0.1, 0.55, 0.6, 1.0], u_pop_color: [0.2, 0.2, 0.3, 1.0] } }
  ]
};

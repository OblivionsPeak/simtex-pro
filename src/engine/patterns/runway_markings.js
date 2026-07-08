export default {
  id: 'runway_markings',
  name: 'Runway Markings',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Airport tarmac — centerline dashes, threshold piano keys, and rubber-scuffed asphalt.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // asphalt with rubber scuff streaks along y
      vec4 col = u_secondary_color;
      col.rgb *= 0.9 + 0.1 * snoise(uv * 6.0);
      float scuff = smoothstep(0.4, 0.9, snoise(vec2(uv.x * 8.0, uv.y * 0.6)));
      col.rgb = mix(col.rgb, col.rgb * 0.55, scuff * u_wear);
      float sector = mod(floor(uv.y), 6.0);
      float paint = 0.0;
      // centerline dashes down the middle of each tile column
      float cx = fract(uv.x) - 0.5;
      float dash = step(abs(cx), 0.05) * step(fract(uv.y * 2.0), 0.6);
      paint = max(paint, dash * step(1.5, sector));
      // threshold piano keys every sixth row
      float keys = step(sector, 0.99) * step(fract(uv.x * 4.0), 0.55);
      paint = max(paint, keys);
      // aiming-point wide bars on the second row
      float aim = step(abs(sector - 1.0), 0.01) * step(abs(cx), 0.28);
      paint = max(paint, aim);
      // weather the paint
      float flake = step(u_wear * 0.55, hash(floor(uv * 14.0)));
      vec4 mark = u_primary_color;
      mark.rgb *= 0.85 + 0.15 * hash(floor(uv * 7.0));
      return mix(col, mark, paint * flake);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Marking Scale', type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_wear', name: 'Wear', type: 'float', min: 0.0, max: 1.0, default: 0.45 },
    { id: 'u_primary_color', name: 'Paint', type: 'color', default: [0.92, 0.92, 0.88, 1.0] },
    { id: 'u_secondary_color', name: 'Tarmac', type: 'color', default: [0.16, 0.16, 0.17, 1.0] }
  ],
  variants: [
    { name: 'Runway 27', uniforms: { u_primary_color: [0.92, 0.92, 0.88, 1.0], u_secondary_color: [0.16, 0.16, 0.17, 1.0], u_wear: 0.45 } },
    { name: 'Taxiway Gold', uniforms: { u_primary_color: [0.95, 0.75, 0.1, 1.0], u_secondary_color: [0.2, 0.2, 0.21, 1.0], u_wear: 0.3 } },
    { name: 'Abandoned Strip', uniforms: { u_primary_color: [0.7, 0.68, 0.6, 1.0], u_secondary_color: [0.24, 0.23, 0.2, 1.0], u_wear: 0.9 } }
  ]
};

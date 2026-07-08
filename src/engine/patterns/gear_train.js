export default {
  id: 'gear_train',
  name: 'Gear Train',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Meshed toothed gears of varying sizes — clockwork machinery packed edge to edge.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float seed = hash(cell);
      float r = length(f);
      float ang = atan(f.y, f.x);
      float teethN = 8.0 + floor(seed * 5.0) * 2.0;
      float outer = 0.34 + seed * 0.08;
      // teeth ripple on the rim
      float teeth = outer + 0.05 * sign(sin(ang * teethN + seed * 6.28)) * 0.5;
      float body = smoothstep(teeth, teeth - 0.02, r);
      float hub = smoothstep(0.09, 0.07, r);
      float spoke = step(0.82, abs(sin(ang * 2.5 + seed * 3.0)));
      float cutout = smoothstep(0.14, 0.16, r) * smoothstep(teeth - 0.12, teeth - 0.14, r) * (1.0 - spoke);
      float metal = body * (1.0 - cutout * 0.85) ;
      vec4 col = mix(u_secondary_color, u_primary_color, clamp(metal, 0.0, 1.0));
      // radial machining sheen
      col.rgb *= 1.0 + body * 0.15 * sin(r * 60.0 + seed * 9.0);
      col = mix(col, u_accent_color, hub);
      // rim highlight
      col.rgb += body * 0.12 * smoothstep(0.03, 0.0, abs(r - (teeth - 0.03)));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Gear Density', type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Gear Metal', type: 'color', default: [0.62, 0.6, 0.58, 1.0] },
    { id: 'u_secondary_color', name: 'Backplate', type: 'color', default: [0.13, 0.12, 0.11, 1.0] },
    { id: 'u_accent_color', name: 'Hub', type: 'color', default: [0.75, 0.55, 0.2, 1.0] }
  ],
  variants: [
    { name: 'Steel Works', uniforms: { u_primary_color: [0.62, 0.6, 0.58, 1.0], u_secondary_color: [0.13, 0.12, 0.11, 1.0], u_accent_color: [0.75, 0.55, 0.2, 1.0] } },
    { name: 'Brass Clock', uniforms: { u_primary_color: [0.78, 0.6, 0.28, 1.0], u_secondary_color: [0.2, 0.14, 0.08, 1.0], u_accent_color: [0.5, 0.32, 0.14, 1.0] } },
    { name: 'Gunmetal', uniforms: { u_primary_color: [0.3, 0.32, 0.36, 1.0], u_secondary_color: [0.07, 0.07, 0.09, 1.0], u_accent_color: [0.85, 0.3, 0.1, 1.0] } }
  ]
};

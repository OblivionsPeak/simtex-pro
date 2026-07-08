export default {
  id: 'kaleidoscope',
  name: 'Kaleidoscope',
  category: 'Abstract',
  added: '2026-07-07',
  description: 'Mirror-folded color chips — a glass kaleidoscope chamber frozen mid-turn.',
  shader: `
    vec4 generate() {
      vec2 p = (v_uv - 0.5) * u_scale;
      float r = length(p);
      float ang = atan(p.y, p.x);
      // mirror fold into N wedges
      float wedge = 6.28318 / max(u_segments, 2.0);
      ang = abs(mod(ang, wedge) - wedge * 0.5);
      vec2 q = vec2(cos(ang), sin(ang)) * r;
      // colored glass chips: hard-edged noise cells in the folded space
      float n1 = snoise(q * 2.2);
      float n2 = snoise(q * 3.7 + vec2(8.0, 2.0));
      float n3 = snoise(q * 1.4 + vec2(3.0, 11.0));
      vec3 c = u_secondary_color.rgb;
      c = mix(c, u_primary_color.rgb, step(0.12, n1));
      c = mix(c, u_accent_color.rgb, step(0.25, n2));
      c = mix(c, u_pop_color.rgb, step(0.42, n3));
      // glass edge glints along chip boundaries
      float edge = smoothstep(0.1, 0.0, abs(n1 - 0.12)) + smoothstep(0.1, 0.0, abs(n2 - 0.25));
      c += vec3(0.2) * clamp(edge, 0.0, 1.0) * u_glint;
      // radial falloff like the scope tube
      c *= smoothstep(2.2, 0.9, r) * 0.35 + 0.65;
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Zoom', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_segments', name: 'Mirror Segments', type: 'float', min: 3.0, max: 16.0, default: 8.0 },
    { id: 'u_glint', name: 'Glass Glint', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_secondary_color', name: 'Chamber', type: 'color', default: [0.1, 0.08, 0.14, 1.0] },
    { id: 'u_primary_color', name: 'Chip 1', type: 'color', default: [0.85, 0.3, 0.4, 1.0] },
    { id: 'u_accent_color', name: 'Chip 2', type: 'color', default: [0.25, 0.6, 0.75, 1.0] },
    { id: 'u_pop_color', name: 'Chip 3', type: 'color', default: [0.95, 0.75, 0.25, 1.0] }
  ],
  variants: [
    { name: 'Toy Scope', uniforms: { u_secondary_color: [0.1, 0.08, 0.14, 1.0], u_primary_color: [0.85, 0.3, 0.4, 1.0], u_accent_color: [0.25, 0.6, 0.75, 1.0], u_pop_color: [0.95, 0.75, 0.25, 1.0], u_segments: 8.0 } },
    { name: 'Cathedral', uniforms: { u_secondary_color: [0.06, 0.06, 0.1, 1.0], u_primary_color: [0.5, 0.15, 0.5, 1.0], u_accent_color: [0.15, 0.3, 0.65, 1.0], u_pop_color: [0.9, 0.6, 0.2, 1.0], u_segments: 12.0 } },
    { name: 'Citrus Wheel', uniforms: { u_secondary_color: [0.95, 0.93, 0.85, 1.0], u_primary_color: [0.95, 0.6, 0.15, 1.0], u_accent_color: [0.6, 0.8, 0.3, 1.0], u_pop_color: [0.95, 0.85, 0.3, 1.0], u_segments: 6.0 } }
  ]
};

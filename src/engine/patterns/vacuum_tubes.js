export default {
  id: 'vacuum_tubes',
  name: 'Vacuum Tubes',
  category: 'Technology',
  added: '2026-07-07',
  description: 'Rows of warm glass valves on a dark chassis — glowing filaments and metal bases.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 p = fract(uv) - vec2(0.5, 0.0);
      vec4 col = u_secondary_color;
      // chassis texture
      col.rgb *= 0.92 + 0.08 * hash(floor(uv * 6.0));
      // tube body: capsule from y 0.15 to 0.85
      float w = 0.26;
      float capY = clamp(p.y, 0.28, 0.72);
      float d = length(vec2(p.x, p.y - capY) / vec2(w, 1.0));
      float glass = smoothstep(1.0, 0.92, d);
      // skip some sockets
      float present = step(0.15, hash(cell + 3.7));
      // glass shading: darker edges, vertical reflection stripe
      float edge = smoothstep(0.5, 1.0, d);
      vec3 glassC = mix(u_primary_color.rgb, u_primary_color.rgb * 0.25, edge);
      glassC += smoothstep(0.06, 0.0, abs(p.x + w * 0.45)) * 0.25;
      // filament glow in the core
      float glow = exp(-14.0 * (p.x * p.x) - 8.0 * (p.y - 0.42) * (p.y - 0.42));
      glassC += u_accent_color.rgb * glow * u_glow * (0.7 + 0.3 * hash(cell + 8.8));
      // metal base below
      float base = step(0.1, p.y) * step(p.y, 0.26) * step(abs(p.x), w * 0.9);
      vec3 baseC = vec3(0.35, 0.34, 0.32) * (0.8 + 0.2 * sin(p.y * 90.0));
      vec3 c = mix(col.rgb, glassC, glass * step(0.26, p.y) * present);
      c = mix(c, baseC, base * present);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tube Density', type: 'float', min: 3.0, max: 16.0, default: 6.0 },
    { id: 'u_glow', name: 'Filament Glow', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Glass', type: 'color', default: [0.25, 0.28, 0.3, 1.0] },
    { id: 'u_accent_color', name: 'Filament', type: 'color', default: [1.0, 0.55, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Chassis', type: 'color', default: [0.09, 0.08, 0.08, 1.0] }
  ],
  variants: [
    { name: 'Tube Amp', uniforms: { u_primary_color: [0.25, 0.28, 0.3, 1.0], u_accent_color: [1.0, 0.55, 0.15, 1.0], u_secondary_color: [0.09, 0.08, 0.08, 1.0], u_glow: 1.0 } },
    { name: 'Overdriven', uniforms: { u_primary_color: [0.3, 0.25, 0.22, 1.0], u_accent_color: [1.0, 0.3, 0.1, 1.0], u_secondary_color: [0.12, 0.07, 0.05, 1.0], u_glow: 1.8 } },
    { name: 'Cold Cathode', uniforms: { u_primary_color: [0.2, 0.26, 0.34, 1.0], u_accent_color: [0.3, 0.7, 1.0, 1.0], u_secondary_color: [0.05, 0.06, 0.09, 1.0], u_glow: 1.3 } }
  ]
};

export default {
  id: 'rebar_lattice',
  name: 'Rebar Lattice',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Ribbed reinforcement bars tied in a crossing grid, rust blooming along the ridges.',
  shader: `
    float rod(float x) {
      // cylindrical shading profile across a rod, 0 outside
      float d = abs(x);
      return d < 0.5 ? sqrt(max(1.0 - d * d * 4.0, 0.0)) : 0.0;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float w = u_thickness;
      // horizontal rods behind
      float hy = (fract(uv.y) - 0.5) / w;
      float hShade = rod(hy);
      float hRib = 0.85 + 0.15 * sin(uv.x * 40.0);
      // vertical rods in front
      float vx = (fract(uv.x) - 0.5) / w;
      float vShade = rod(vx);
      float vRib = 0.85 + 0.15 * sin(uv.y * 40.0);
      float rust = snoise(uv * 2.5) * 0.5 + 0.5;
      vec3 steel = mix(u_primary_color.rgb, u_accent_color.rgb, rust * u_rust);
      vec3 col = u_secondary_color.rgb;
      // drop shadow of vertical rod onto whatever is behind
      float shadow = rod((fract(uv.x + 0.06) - 0.5) / (w * 1.3)) * 0.5;
      if (hShade > 0.0) col = steel * hShade * hRib;
      col *= 1.0 - shadow * step(hShade, 0.999);
      if (vShade > 0.0) col = steel * vShade * vRib;
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grid Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_thickness', name: 'Bar Thickness', type: 'float', min: 0.08, max: 0.4, default: 0.18 },
    { id: 'u_rust', name: 'Rust', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_primary_color', name: 'Steel', type: 'color', default: [0.45, 0.44, 0.43, 1.0] },
    { id: 'u_accent_color', name: 'Rust', type: 'color', default: [0.55, 0.28, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Backdrop', type: 'color', default: [0.14, 0.14, 0.15, 1.0] }
  ],
  variants: [
    { name: 'Job Site', uniforms: { u_primary_color: [0.45, 0.44, 0.43, 1.0], u_accent_color: [0.55, 0.28, 0.12, 1.0], u_secondary_color: [0.14, 0.14, 0.15, 1.0], u_rust: 0.55 } },
    { name: 'Fresh Steel', uniforms: { u_primary_color: [0.55, 0.56, 0.6, 1.0], u_accent_color: [0.35, 0.3, 0.25, 1.0], u_secondary_color: [0.2, 0.2, 0.22, 1.0], u_rust: 0.15 } },
    { name: 'Deep Corrosion', uniforms: { u_primary_color: [0.4, 0.32, 0.26, 1.0], u_accent_color: [0.5, 0.2, 0.08, 1.0], u_secondary_color: [0.1, 0.09, 0.08, 1.0], u_rust: 0.95 } }
  ]
};

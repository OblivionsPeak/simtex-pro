export default {
  id: 'flower_of_life',
  name: 'Flower of Life',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Overlapping circle lattice on a triangular grid — the sacred geometry rosette field.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // triangular lattice of circle centers
      vec2 s = vec2(1.0, 0.8660254);
      float d = 10.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          // two interleaved rectangular grids make the tri lattice
          vec2 base = floor(uv / s) + vec2(float(i), float(j));
          vec2 c1 = base * s;
          vec2 c2 = (base + 0.5) * s;
          // ring distance: circle radius equals lattice spacing
          d = min(d, abs(length(uv - c1) - 1.0));
          d = min(d, abs(length(uv - c2) - 1.0));
        }
      }
      float w = max(u_line, 0.008);
      float line = smoothstep(w, w * 0.4, d);
      vec4 col = mix(u_secondary_color, u_primary_color, line);
      // soft glow option for the linework
      col.rgb += u_primary_color.rgb * u_glow * smoothstep(w * 4.0, 0.0, d) * 0.35;
      // gentle radial vignette per rosette for depth
      col.rgb *= 0.94 + 0.06 * sin(d * 6.0);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Circle Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_line', name: 'Line Weight', type: 'float', min: 0.01, max: 0.1, default: 0.03 },
    { id: 'u_glow', name: 'Glow', type: 'float', min: 0.0, max: 1.0, default: 0.3 },
    { id: 'u_primary_color', name: 'Lines', type: 'color', default: [0.85, 0.75, 0.45, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.12, 0.1, 0.16, 1.0] }
  ],
  variants: [
    { name: 'Temple Gold', uniforms: { u_primary_color: [0.85, 0.75, 0.45, 1.0], u_secondary_color: [0.12, 0.1, 0.16, 1.0], u_glow: 0.3 } },
    { name: 'Chalk Mandala', uniforms: { u_primary_color: [0.92, 0.92, 0.9, 1.0], u_secondary_color: [0.2, 0.22, 0.25, 1.0], u_glow: 0.0 } },
    { name: 'Aurora Grid', uniforms: { u_primary_color: [0.3, 0.9, 0.75, 1.0], u_secondary_color: [0.04, 0.07, 0.1, 1.0], u_glow: 0.8 } }
  ]
};

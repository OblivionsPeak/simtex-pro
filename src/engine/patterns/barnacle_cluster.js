export default {
  id: 'barnacle_cluster',
  name: 'Barnacle Cluster',
  category: 'Ocean',
  added: '2026-07-07',
  description: 'Volcano-shaped barnacles crowding a tide-worn rock, ridged shells around dark apertures.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // wet rock base
      vec4 col = u_secondary_color;
      col.rgb *= 0.85 + 0.15 * fbm(uv * 3.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.9) < u_bare) continue;
          vec2 ctr = cell + 0.5 + (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.55;
          vec2 rel = uv - ctr;
          float r = length(rel);
          float ang = atan(rel.y, rel.x);
          float size = 0.22 + hash(cell + 3.3) * 0.2;
          // ridged conical shell
          float ridges = 0.5 + 0.5 * sin(ang * (10.0 + floor(hash(cell + 4.4) * 6.0)));
          float rim = size * (0.94 + ridges * 0.06);
          float shell = smoothstep(rim, rim * 0.92, r);
          if (shell > 0.01) {
            vec3 sc = mix(u_primary_color.rgb, u_primary_color.rgb * 0.7, ridges);
            // cone shading: bright rim, darker toward the aperture
            sc *= 0.6 + 0.6 * smoothstep(0.0, size, r);
            // aperture: dark diamond-shaped opening
            float ap = smoothstep(size * 0.32, size * 0.2, r + 0.04 * sin(ang * 2.0));
            sc = mix(sc, vec3(0.03, 0.04, 0.05), ap);
            // rim lip highlight
            sc += vec3(0.12) * smoothstep(0.03, 0.0, abs(r - rim * 0.93)) * (1.0 - ap);
            col.rgb = mix(col.rgb, sc, shell);
          }
        }
      }
      // tide-line algae film
      float algae = smoothstep(0.55, 0.85, fbm(uv * 1.2 + 8.0));
      col.rgb = mix(col.rgb, col.rgb * vec3(0.7, 0.9, 0.7), algae * u_algae);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cluster Density', type: 'float', min: 3.0, max: 18.0, default: 8.0 },
    { id: 'u_bare', name: 'Bare Rock', type: 'float', min: 0.0, max: 0.8, default: 0.2 },
    { id: 'u_algae', name: 'Algae Film', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_primary_color', name: 'Shell', type: 'color', default: [0.8, 0.77, 0.7, 1.0] },
    { id: 'u_secondary_color', name: 'Rock', type: 'color', default: [0.2, 0.19, 0.18, 1.0] }
  ],
  variants: [
    { name: 'Tide Rock', uniforms: { u_primary_color: [0.8, 0.77, 0.7, 1.0], u_secondary_color: [0.2, 0.19, 0.18, 1.0], u_algae: 0.4 } },
    { name: 'Hull Fouling', uniforms: { u_primary_color: [0.75, 0.7, 0.6, 1.0], u_secondary_color: [0.35, 0.12, 0.1, 1.0], u_algae: 0.6 } },
    { name: 'Volcanic Shore', uniforms: { u_primary_color: [0.85, 0.82, 0.78, 1.0], u_secondary_color: [0.08, 0.08, 0.09, 1.0], u_algae: 0.2 } }
  ]
};

export default {
  id: 'hockey_ice_scratches',
  name: 'Hockey Ice Scratches',
  category: 'Sports',
  added: '2026-07-13',
  description: 'Fresh rink ice cut by layered skate-blade gouges — bright curved scratches, drifting snow dust, and faint painted lines under the surface.',
  shader: `
    float bladeArcs(vec2 uv, float lw, float seed) {
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      float m = 0.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 cc = cell + o;
          if (hash(cc + seed) < 0.7) {
            // curved gouge: arc of a circle anchored in this cell
            vec2 ctr = o + 0.3 + 0.4 * vec2(hash(cc + seed + 1.3), hash(cc + seed + 2.6));
            float rad = 0.35 + 0.65 * hash(cc + seed + 3.9);
            vec2 pc = f - ctr;
            float d = abs(length(pc) - rad);
            float ang = atan(pc.y, pc.x);
            float a0 = hash(cc + seed + 5.2) * 6.28318;
            float span = 0.5 + 1.5 * hash(cc + seed + 6.5);
            float da = abs(mod(ang - a0 + 3.14159, 6.28318) - 3.14159);
            float win = 1.0 - smoothstep(span * 0.6, span, da);
            float line = 1.0 - smoothstep(lw * 0.35, lw, d);
            m = max(m, line * win * (0.4 + 0.6 * hash(cc + seed + 7.8)));
          }
        }
      }
      return m;
    }
    vec4 generate() {
      // white-blue ice with depth mottling
      vec3 ice = mix(u_primary_color.rgb, u_secondary_color.rgb, 0.30 + 0.40 * fbm(v_uv * 3.0));
      ice *= 0.95 + 0.08 * fbm(v_uv * 9.0 + 4.7);
      // faint painted lines frozen under the surface
      float ly = abs(v_uv.y - 0.5);
      float redLine = 1.0 - smoothstep(0.014, 0.020, ly);
      ice = mix(ice, mix(ice, u_accent_color.rgb, 0.55), redLine * u_line_strength);
      float lb = min(abs(v_uv.y - 0.25), abs(v_uv.y - 0.75));
      float blueLine = 1.0 - smoothstep(0.006, 0.011, lb);
      ice = mix(ice, mix(ice, vec3(0.15, 0.25, 0.62), 0.5), blueLine * u_line_strength);
      // layered skate-blade scratch arcs at three scales
      vec2 uv = v_uv * u_scale;
      float sc = bladeArcs(uv, 0.050, 0.0);
      sc = max(sc, 0.80 * bladeArcs(uv * 1.7 + 13.0, 0.065, 20.0));
      sc = max(sc, 0.65 * bladeArcs(uv * 2.9 + 31.0, 0.090, 40.0));
      ice = mix(ice, vec3(1.0), sc * 0.75);
      // snow dust shaved into drifting patches
      float snow = smoothstep(0.55, 0.85, fbm(v_uv * 7.0 + 51.0));
      ice = mix(ice, vec3(0.97, 0.98, 1.0), snow * 0.45 * (0.6 + 0.4 * hash(floor(v_uv * u_scale * 6.0))));
      return vec4(ice, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scratch Density', type: 'float', min: 3.0, max: 20.0, default: 8.0 },
    { id: 'u_line_strength', name: 'Rink Lines', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_primary_color', name: 'Ice', type: 'color', default: [0.92, 0.96, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Ice', type: 'color', default: [0.66, 0.78, 0.90, 1.0] },
    { id: 'u_accent_color', name: 'Center Line', type: 'color', default: [0.75, 0.12, 0.15, 1.0] }
  ],
  variants: [
    { name: 'Game Night', uniforms: { u_scale: 8.0, u_line_strength: 0.35, u_primary_color: [0.92, 0.96, 1.0, 1.0], u_secondary_color: [0.66, 0.78, 0.90, 1.0], u_accent_color: [0.75, 0.12, 0.15, 1.0] } },
    { name: 'Pond Hockey', uniforms: { u_scale: 6.0, u_line_strength: 0.0, u_primary_color: [0.85, 0.91, 0.94, 1.0], u_secondary_color: [0.45, 0.60, 0.68, 1.0], u_accent_color: [0.75, 0.12, 0.15, 1.0] } },
    { name: 'Frozen Neon', uniforms: { u_scale: 12.0, u_line_strength: 0.8, u_primary_color: [0.10, 0.14, 0.24, 1.0], u_secondary_color: [0.05, 0.08, 0.16, 1.0], u_accent_color: [0.10, 0.85, 0.95, 1.0] } }
  ]
};

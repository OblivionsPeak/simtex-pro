export default {
  id: 'arcade_carpet',
  name: 'Arcade Carpet',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Blacklight bowling-alley carpet circa 1992 — neon triangles, squiggles, rings and dots glowing out of a deep ultraviolet pile.',
  shader: `
    vec3 neon_ac(float h) {
      if (h < 0.2) return vec3(0.05, 1.00, 0.95);  // electric cyan
      if (h < 0.4) return vec3(1.00, 0.12, 0.85);  // hot magenta
      if (h < 0.6) return vec3(0.55, 1.00, 0.10);  // toxic lime
      if (h < 0.8) return vec3(1.00, 0.55, 0.05);  // blaze orange
      return vec3(0.60, 0.30, 1.00);               // ultraviolet purple
    }
    // distance to one confetti glyph, selected by pick
    float glyph_ac(vec2 p, float pick) {
      if (pick < 0.25) {          // hollow triangle
        float an = atan(p.y, p.x);
        float seg = 2.0943951;
        float tri = cos(floor(0.5 + an / seg) * seg - an) * length(p);
        return abs(tri - 0.2) - 0.045;
      } else if (pick < 0.5) {    // squiggle stroke
        float w = sin(p.x * 13.0) * 0.11;
        return max(abs(p.y - w) - 0.04, abs(p.x) - 0.3);
      } else if (pick < 0.75) {   // ring
        return abs(length(p) - 0.2) - 0.05;
      }                           // bold dot
      return length(p) - 0.11;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_density;
      // UV pile: dark base with fibrous mottle so it reads as carpet
      vec3 col = u_bg_color.rgb * (0.7 + 0.5 * (fbm(uv * 6.0) * 0.5 + 0.5));
      // scatter glyphs: 3x3 neighborhood, one glyph per cell
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.7) < 0.25) continue;   // breathing room
          vec2 ctr = cell + 0.5 + (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.5;
          float a = hash(cell + 3.3) * 6.28318;
          vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (uv - ctr);
          float d = glyph_ac(p * (0.8 + hash(cell + 4.4) * 0.5), hash(cell + 5.5));
          vec3 neon = neon_ac(hash(cell + 6.6));
          float body = smoothstep(0.012, -0.012, d);
          float halo = exp(-max(d, 0.0) * 12.0) * u_glow * 0.5;
          col = mix(col, neon, body);
          col += neon * halo * (1.0 - body);       // blacklight bloom
        }
      }
      // pile speckle over everything
      col *= 0.92 + 0.08 * hash(floor(uv * 60.0));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density', name: 'Confetti Density', type: 'float', min: 3.0, max: 12.0, default: 6.0 },
    { id: 'u_glow', name: 'Blacklight Glow', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_bg_color', name: 'Carpet Pile', type: 'color', default: [0.05, 0.01, 0.10, 1.0] }
  ],
  variants: [
    { name: 'Bowling Alley 92', uniforms: { u_bg_color: [0.05, 0.01, 0.10, 1.0], u_glow: 1.0, u_density: 6.0 } },
    { name: 'Laser Tag Lobby', uniforms: { u_bg_color: [0.01, 0.03, 0.09, 1.0], u_glow: 1.6, u_density: 8.0 } },
    { name: 'Cinema Mezzanine', uniforms: { u_bg_color: [0.08, 0.02, 0.04, 1.0], u_glow: 0.6, u_density: 5.0 } }
  ]
};

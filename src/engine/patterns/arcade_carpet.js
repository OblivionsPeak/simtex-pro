export default {
  id: 'arcade_carpet',
  name: 'Arcade Carpet',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Blacklight bowling-alley carpet circa 1992 — neon confetti triangles, squiggles, rings and zigzag bolts glowing out of a deep ultraviolet pile.',
  shader: `
    mat2 rot2_ac(float a) {
      float c = cos(a); float s = sin(a);
      return mat2(c, -s, s, c);
    }

    vec3 neon_ac(float h) {
      if (h < 0.2) return vec3(0.05, 1.00, 0.95);  // electric cyan
      if (h < 0.4) return vec3(1.00, 0.12, 0.85);  // hot magenta
      if (h < 0.6) return vec3(0.55, 1.00, 0.10);  // toxic lime
      if (h < 0.8) return vec3(1.00, 0.55, 0.05);  // blaze orange
      return vec3(0.60, 0.30, 1.00);               // ultraviolet purple
    }

    // signed distance to one confetti glyph, selected by 'pick'
    float glyph_ac(vec2 p, float pick) {
      if (pick < 0.25) {
        // hollow triangle
        float an = atan(p.y, p.x);
        float seg = 2.0943951; // 2*pi/3
        float tri = cos(floor(0.5 + an / seg) * seg - an) * length(p);
        return abs(tri - 0.22) - 0.05;
      } else if (pick < 0.5) {
        // squiggle stroke
        float w = sin(p.x * 14.0) * 0.12;
        float d = abs(p.y - w) - 0.045;
        return max(d, abs(p.x) - 0.32);
      } else if (pick < 0.75) {
        // ring
        return abs(length(p) - 0.22) - 0.055;
      }
      // zigzag bolt
      float zx = fract(p.x * 3.2) - 0.5;
      float zig = (abs(zx) * 2.0 - 0.5) * 0.20;
      float d = abs(p.y - zig) - 0.05;
      return max(d, abs(p.x) - 0.30);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_density;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;

      // UV-soaked carpet pile: mottled near-black with faint purple fibre noise
      vec3 base = u_bg_color.rgb;
      float pile = noise(v_uv * 220.0) * 0.5 + noise(v_uv * 47.0) * 0.5;
      base *= 0.75 + pile * 0.5;
      base += vec3(0.02, 0.0, 0.05) * noise(v_uv * 9.0);

      vec3 col = base;

      // one confetti glyph per cell with random spin / size / jitter / hue
      float h1 = hash(cell);
      float h2 = hash(cell + 19.7);
      float h3 = hash(cell + 53.1);
      vec2 jitter = vec2(hash(cell + 7.3), hash(cell + 91.4)) * 0.3 - 0.15;
      vec2 p = rot2_ac(h2 * 6.2831) * ((f - jitter) / (0.7 + h3 * 0.6));
      float d = glyph_ac(p, h1);

      vec3 ink = neon_ac(hash(cell + 37.7));
      float body = 1.0 - smoothstep(0.0, 0.025, d);
      float halo = exp(-max(d, 0.0) * 14.0) * u_glow * 0.55;

      // the pile eats a little of the print — fibre-level fade
      float fade = 0.78 + 0.22 * noise(v_uv * 160.0);
      col = mix(col, ink * fade, body);
      col += ink * halo * fade;

      // scattered micro-flecks between the big glyphs
      vec2 fuv = v_uv * u_density * 4.0;
      vec2 fc = floor(fuv);
      vec2 ff = fract(fuv) - 0.5;
      float fh = hash(fc + 311.0);
      if (fh > 0.86) {
        float fd = length(ff) - 0.07;
        float fleck = 1.0 - smoothstep(0.0, 0.05, fd);
        col += neon_ac(hash(fc + 77.0)) * fleck * 0.8 * fade;
      }

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density', name: 'Confetti Density', type: 'float', min: 3.0, max: 12.0, default: 6.0 },
    { id: 'u_glow', name: 'Blacklight Glow', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_bg_color', name: 'Carpet Pile', type: 'color', default: [0.05, 0.01, 0.10, 1.0] }
  ]
};

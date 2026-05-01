export default {
  id: 'laser_etch',
  name: 'Laser Etch',
  category: 'Technology',
  description: 'Laser-engraved geometric lines on dark anodized metal, revealing bright bare aluminium in precise 45-degree patterns.',
  shader: `
    // --- helpers BEFORE generate() ---

    // Rotate UV by 45 degrees
    vec2 rotate45(vec2 uv) {
      float c = 0.70710678; // cos(45deg)
      float s = 0.70710678; // sin(45deg)
      return vec2(c * uv.x - s * uv.y,
                  s * uv.x + c * uv.y);
    }

    // Rotate UV by -45 degrees
    vec2 rotate_neg45(vec2 uv) {
      float c =  0.70710678;
      float s = -0.70710678;
      return vec2(c * uv.x - s * uv.y,
                  s * uv.x + c * uv.y);
    }

    // Sharp line: returns 1.0 on a thin periodic line, 0.0 elsewhere
    // period_fract: fract within one repeat period, width: fraction of period
    float laser_line(float period_fract, float width) {
      // Line lives at fract = 0.0 (and 1.0)
      float dist_to_line = min(period_fract, 1.0 - period_fract);
      return 1.0 - smoothstep(width * 0.3, width * 0.5, dist_to_line);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Primary lines at +45 degrees ---
      vec2 uv45     = rotate45(uv) * u_line_density;
      float line_a  = laser_line(fract(uv45.x), u_line_width);

      // --- Secondary lines at -45 degrees (perpendicular cross) ---
      vec2 uv_neg45 = rotate_neg45(uv) * u_line_density;
      float line_b  = laser_line(fract(uv_neg45.x), u_line_width);

      // --- Cross-hatch gate: only draw second layer in checker zones ---
      // Checker based on grid cells in original UV space
      vec2  grid_cell  = floor(uv * u_line_density * 0.5);
      float checker    = mod(grid_cell.x + grid_cell.y, 2.0);
      // In checker=1 cells, show both line_a and line_b (cross-hatch)
      // In checker=0 cells, show only line_a (single hatch)
      float cross_hatch = mix(0.0, line_b, checker);

      // Combine: primary lines always on, cross-hatch in checker zones
      float etched = clamp(line_a + cross_hatch, 0.0, 1.0);

      // --- Colors ---
      vec3 bg    = u_background.rgb;
      vec3 etch  = u_etch_color.rgb;

      // Bright aluminium in etched lines
      vec3 col   = mix(bg, etch, etched);

      // Slight anodized surface micro-texture in background
      // Use simple high-frequency variation — no extra helper needed
      float micro_x = fract(uv.x * 210.3 + 0.17);
      float micro_y = fract(uv.y * 197.7 + 0.83);
      float micro   = fract(micro_x * 7.3 + micro_y * 13.1);
      float micro_n = (micro - 0.5) * 0.025 * (1.0 - etched);
      col += micro_n;

      // Edge glow on etched lines — very subtle warm glow (laser heat)
      // Lines slightly brighter at center
      float glow_a = laser_line(fract(uv45.x),     u_line_width * 0.18) * 0.08;
      float glow_b = laser_line(fract(uv_neg45.x), u_line_width * 0.18) * checker * 0.08;
      col += (glow_a + glow_b) * vec3(1.0, 0.92, 0.75) * (1.0 - etched * 0.5);

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_line_density', name: 'Line Density',   type: 'float', min: 4.0,  max: 40.0, default: 16.0 },
    { id: 'u_background',   name: 'Background',     type: 'color', default: [0.08, 0.08, 0.10, 1.0]    },
    { id: 'u_etch_color',   name: 'Etch Color',     type: 'color', default: [0.85, 0.87, 0.88, 1.0]    },
    { id: 'u_line_width',   name: 'Line Width',     type: 'float', min: 0.01, max: 0.2,  default: 0.06 }
  ]
};

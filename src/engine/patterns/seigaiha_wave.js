export default {
  id: 'seigaiha_wave',
  name: 'Seigaiha Waves',
  category: 'Geometric',
  added: '2026-06-11',
  description: 'The classic Japanese seigaiha wave pattern: staggered overlapping fans of crisp concentric semicircle arcs, like a stylized sea.',
  shader: `

    vec4 generate() {
      // Cell width 1.0, rows every 0.5 with alternate rows offset by half
      // a cell. Each fan is a circle of radius 0.8 whose visible part is
      // whatever the fans of the row in front (below) do not cover.
      vec2 p = v_uv * u_scale;
      float R = 0.8;
      float rowIdx = floor(p.y / 0.5);

      // Scan from the lowest row that can still reach this point upward;
      // the first covering fan is the one in front.
      float d = -1.0;
      for (int k = 0; k < 2; k++) {
        if (d < 0.0) {
          float j = rowIdx - 1.0 + float(k);
          float off = mod(j, 2.0) * 0.5;
          float cx = floor(p.x - off + 0.5) + off;
          vec2 c = vec2(cx, j * 0.5);
          float dd = distance(p, c);
          if (dd <= R) {
            d = dd;
          }
        }
      }
      if (d < 0.0) {
        d = 0.0;
      }

      // Concentric ring lines: one line per integer of f, including the
      // fan's outer rim. The innermost ring collapses into a solid dot.
      float rings = floor(u_rings + 0.5);
      float f = d / R * rings;
      float tri = abs(fract(f) - 0.5);

      // Crisp analytic anti-aliasing sized from the screen resolution.
      float aa = u_scale * rings * 1.5 / (R * u_resolution.y);
      float halfT = clamp(u_line * 0.5, 0.02, 0.45);
      float line = smoothstep(0.5 - halfT - aa, 0.5 - halfT + aa, tri);

      vec4 color = mix(u_color_bg, u_color_line, line);
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Indigo',
      uniforms: {
        u_color_line: [0.93, 0.96, 0.98, 1.0],
        u_color_bg: [0.10, 0.20, 0.42, 1.0]
      }
    },
    {
      name: 'Gold on Black',
      uniforms: {
        u_color_line: [0.85, 0.68, 0.25, 1.0],
        u_color_bg: [0.05, 0.05, 0.06, 1.0]
      }
    },
    {
      name: 'Sakura Pink',
      uniforms: {
        u_color_line: [1.00, 0.96, 0.97, 1.0],
        u_color_bg: [0.91, 0.55, 0.67, 1.0]
      }
    },
    {
      name: 'Mono',
      uniforms: {
        u_color_line: [0.12, 0.12, 0.13, 1.0],
        u_color_bg: [0.93, 0.93, 0.92, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Pattern Scale', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_rings', name: 'Rings Per Fan', type: 'float', min: 2.0, max: 10.0, default: 5.0 },
    { id: 'u_line', name: 'Line Thickness', type: 'float', min: 0.06, max: 0.9, default: 0.36 },
    { id: 'u_color_line', name: 'Line Color', type: 'color', default: [0.93, 0.96, 0.98, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [0.10, 0.20, 0.42, 1.0] }
  ]
};

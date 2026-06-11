export default {
  id: 'paisley_bandana',
  name: 'Paisley Bandana',
  category: 'Abstract',
  description: 'Bandana-style repeat of curled paisley boteh teardrops with echo outlines, center dots and dotted halo rings, alternating orientation on a staggered grid.',
  shader: `

    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // Paisley boteh: a body circle smooth-joined to a tip circle, with a
    // bite carved out to bend the tip into the signature curl.
    float boteh(vec2 p) {
      float body = length(p - vec2(-0.02, -0.10)) - 0.21;
      float tip = length(p - vec2(0.10, 0.22)) - 0.07;
      float d = smin(body, tip, 0.16);
      float bite = length(p - vec2(0.28, 0.28)) - 0.13;
      d = max(d, -bite);
      return d;
    }

    vec4 generate() {
      vec2 gp = v_uv * u_scale;
      float row = floor(gp.y);
      float offx = mod(row, 2.0) * 0.5;
      vec2 sp = vec2(gp.x - offx, gp.y);
      vec2 cell = floor(sp);
      vec2 p = sp - cell - 0.5;

      // Alternate cells flip the motif for the woven bandana rhythm.
      float checker = mod(cell.x + cell.y, 2.0);
      if (checker > 0.5) {
        p = -p;
      }

      float d = boteh(p);
      float aa = u_scale * 1.5 / u_resolution.y;
      float t = u_line;

      // Main outline plus an inner echo line, classic bandana engraving.
      float outline = 1.0 - smoothstep(t, t + aa, abs(d));
      float echo = 1.0 - smoothstep(t * 0.7, t * 0.7 + aa, abs(d + 0.065));

      // Dotted halo ring around the motif.
      float pr = length(p);
      float pa = atan(p.y, p.x) / 6.2831853;
      float arc = (fract(pa * 16.0) - 0.5) / 16.0 * 6.2831853 * 0.40;
      float dotD = length(vec2(pr - 0.40, arc)) - 0.022;
      float dots = 1.0 - smoothstep(0.0, aa * 2.0, dotD);

      // Seed dot in the heart of the boteh.
      float cdot = 1.0 - smoothstep(0.045, 0.045 + aa, length(p - vec2(-0.02, -0.10)));

      vec4 color = u_color_bg;
      color = mix(color, u_color_accent, echo * u_dots);
      color = mix(color, u_color_motif, outline);
      color = mix(color, u_color_motif, dots * u_dots);
      color = mix(color, u_color_accent, cdot);

      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Bandana Red',
      uniforms: {
        u_color_motif: [0.97, 0.95, 0.92, 1.0],
        u_color_accent: [0.12, 0.05, 0.05, 1.0],
        u_color_bg: [0.62, 0.10, 0.12, 1.0]
      }
    },
    {
      name: 'Bandana Blue',
      uniforms: {
        u_color_motif: [0.96, 0.96, 0.97, 1.0],
        u_color_accent: [0.04, 0.05, 0.12, 1.0],
        u_color_bg: [0.12, 0.20, 0.45, 1.0]
      }
    },
    {
      name: 'Black & Gold',
      uniforms: {
        u_color_motif: [0.88, 0.71, 0.28, 1.0],
        u_color_accent: [0.55, 0.42, 0.15, 1.0],
        u_color_bg: [0.06, 0.06, 0.07, 1.0]
      }
    },
    {
      name: 'Ivory',
      uniforms: {
        u_color_motif: [0.35, 0.30, 0.26, 1.0],
        u_color_accent: [0.62, 0.54, 0.44, 1.0],
        u_color_bg: [0.94, 0.91, 0.84, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Motif Scale', type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_dots', name: 'Dot Detail', type: 'float', min: 0.0, max: 1.0, default: 1.0 },
    { id: 'u_line', name: 'Line Thickness', type: 'float', min: 0.005, max: 0.05, default: 0.016 },
    { id: 'u_color_motif', name: 'Motif Color', type: 'color', default: [0.97, 0.95, 0.92, 1.0] },
    { id: 'u_color_accent', name: 'Accent Color', type: 'color', default: [0.12, 0.05, 0.05, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [0.62, 0.10, 0.12, 1.0] }
  ]
};

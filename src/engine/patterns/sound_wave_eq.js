export default {
  id: 'sound_wave_eq',
  name: 'Sound Wave EQ',
  category: 'Abstract',
  added: '2026-06-11',
  description: 'A frozen spectrum analyzer: vertical equalizer bars of random heights rising from the baseline, segmented into LED blocks with a hot peak tip.',
  shader: `

    vec4 generate() {
      float bars = floor(u_bars + 0.5);
      float bx = v_uv.x * bars;
      float bi = floor(bx);
      float fx = fract(bx);

      // Bar height: smooth noise across bar indices so neighbours relate,
      // plus per-bar hash so it still jumps like real audio.
      float hN = noise(vec2(bi * 0.35 + 0.5, 3.7));
      float hH = hash(vec2(bi, 17.0));
      float h = clamp(0.10 + 0.85 * (hN * 0.6 + hH * 0.4), 0.06, 0.97);

      float g = u_gap * 0.5;
      float inBarX = step(g, fx) * (1.0 - step(1.0 - g, fx));

      float lit = 0.0;
      float tip = 0.0;
      float yMid = v_uv.y;

      if (u_segments >= 1.0) {
        // LED block mode: quantize the bar into stacked blocks.
        float segs = floor(u_segments + 0.5);
        float sy = v_uv.y * segs;
        float si = floor(sy);
        float fy = fract(sy);
        float topSeg = max(floor(h * segs), 1.0);
        float inSegY = step(g, fy) * (1.0 - step(1.0 - g, fy));
        lit = step(si + 0.5, topSeg) * inSegY;
        tip = step(abs(si - (topSeg - 1.0)), 0.25);
        yMid = (si + 0.5) / segs;
      } else {
        // Solid bar mode with a glowing tip band.
        lit = step(v_uv.y, h);
        tip = step(h - 0.05, v_uv.y);
      }

      lit *= inBarX;

      // Vertical gradient up the bar, then the hot tip overrides it.
      float grad = clamp(yMid / max(h, 0.001), 0.0, 1.0);
      vec3 barRGB = mix(u_color_bar.rgb * 0.4, u_color_bar.rgb, grad);
      vec3 rgb = mix(barRGB, u_color_tip.rgb, tip);
      float alpha = mix(u_color_bar.a, u_color_tip.a, tip);

      vec4 color = mix(u_color_bg, vec4(rgb, alpha), lit);
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Neon Green',
      uniforms: {
        u_color_bar: [0.10, 0.90, 0.30, 1.0],
        u_color_tip: [1.00, 0.30, 0.15, 1.0],
        u_color_bg: [0.03, 0.04, 0.04, 1.0]
      }
    },
    {
      name: 'Sunset Meter',
      uniforms: {
        u_color_bar: [0.98, 0.45, 0.12, 1.0],
        u_color_tip: [1.00, 0.90, 0.40, 1.0],
        u_color_bg: [0.12, 0.04, 0.14, 1.0]
      }
    },
    {
      name: 'Ice Blue',
      uniforms: {
        u_color_bar: [0.25, 0.70, 0.95, 1.0],
        u_color_tip: [0.95, 0.99, 1.00, 1.0],
        u_color_bg: [0.02, 0.04, 0.10, 1.0]
      }
    },
    {
      name: 'Magma',
      uniforms: {
        u_color_bar: [0.75, 0.12, 0.05, 1.0],
        u_color_tip: [1.00, 0.85, 0.25, 1.0],
        u_color_bg: [0.04, 0.02, 0.02, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_bars', name: 'Bar Count', type: 'float', min: 8.0, max: 96.0, default: 32.0 },
    { id: 'u_segments', name: 'LED Segments (0 = solid)', type: 'float', min: 0.0, max: 40.0, default: 18.0 },
    { id: 'u_gap', name: 'Gap Thickness', type: 'float', min: 0.0, max: 0.6, default: 0.25 },
    { id: 'u_color_bar', name: 'Bar Color', type: 'color', default: [0.10, 0.90, 0.30, 1.0] },
    { id: 'u_color_tip', name: 'Peak Tip Color', type: 'color', default: [1.00, 0.30, 0.15, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [0.03, 0.04, 0.04, 1.0] }
  ]
};

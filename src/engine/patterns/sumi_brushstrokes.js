export default {
  id: 'sumi_brushstrokes',
  name: 'Sumi Brushstrokes',
  category: 'Abstract',
  added: '2026-07-07',
  description: 'Ink-loaded brush strokes on paper — tapered sweeps with dry-brush streaks and flick spatter.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // paper with faint fiber
      vec4 col = u_secondary_color;
      col.rgb *= 0.96 + 0.04 * snoise(uv * 15.0);
      // rows of strokes, alternating sweep direction
      float row = floor(uv.y);
      float dir = mix(1.0, -1.0, mod(row, 2.0));
      float t = fract(uv.x * 0.5 + hash(vec2(row, 1.0)));  // position along the stroke
      float yy = fract(uv.y) - 0.5;
      // stroke path droops slightly
      float path = yy + 0.1 * sin(t * 3.14159 + row) * dir;
      // width: fat entry, tapered flick exit
      float width = u_weight * (0.2 + 1.2 * pow(1.0 - t, 1.4) * smoothstep(0.0, 0.15, t));
      float body = smoothstep(width, width * 0.55, abs(path));
      // dry-brush: streaks of missing ink along the stroke, worse near the end
      float streaks = snoise(vec2(t * 4.0 + row * 9.0, path * 60.0));
      float dry = smoothstep(0.2 - t * 0.9, 1.0, streaks);
      float ink = body * clamp(1.0 - dry * u_dryness, 0.0, 1.0);
      // ink pooling at the entry
      ink = max(ink, smoothstep(0.09, 0.03, length(vec2((t - 0.06) * 0.8, path))) * 0.95);
      // flick spatter past the tail
      float sp = step(0.992, hash(floor(uv * 24.0) + row)) * smoothstep(0.7, 1.0, t);
      ink = max(ink, sp * 0.8);
      // some rows are empty for breathing room
      ink *= step(0.25, hash(vec2(row, 7.0)));
      vec3 inkC = u_primary_color.rgb * (0.85 + 0.15 * (1.0 - t));
      col.rgb = mix(col.rgb, inkC, ink * u_opacity_ink);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stroke Density', type: 'float', min: 1.5, max: 12.0, default: 4.0 },
    { id: 'u_weight', name: 'Brush Weight', type: 'float', min: 0.1, max: 0.5, default: 0.26 },
    { id: 'u_dryness', name: 'Dry Brush', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_opacity_ink', name: 'Ink Opacity', type: 'float', min: 0.4, max: 1.0, default: 0.92 },
    { id: 'u_primary_color', name: 'Ink', type: 'color', default: [0.09, 0.09, 0.11, 1.0] },
    { id: 'u_secondary_color', name: 'Paper', type: 'color', default: [0.93, 0.91, 0.85, 1.0] }
  ],
  variants: [
    { name: 'Zen Study', uniforms: { u_primary_color: [0.09, 0.09, 0.11, 1.0], u_secondary_color: [0.93, 0.91, 0.85, 1.0], u_dryness: 0.55 } },
    { name: 'Vermilion Seal', uniforms: { u_primary_color: [0.65, 0.15, 0.1, 1.0], u_secondary_color: [0.95, 0.92, 0.86, 1.0], u_dryness: 0.4 } },
    { name: 'Ghost Ink', uniforms: { u_primary_color: [0.85, 0.87, 0.9, 1.0], u_secondary_color: [0.1, 0.11, 0.14, 1.0], u_dryness: 0.7 } }
  ]
};

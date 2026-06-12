export default {
  id: 'vintage_scallops',
  name: 'Vintage Scallops',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Hand-painted hot-rod scallops — rows of long tapering spears with a contrasting keyline, brush-edge wobble, and lacquer that has yellowed in the sun.',
  shader: `
    // distance to a scallop spear: round head at the left, long taper right
    float spear_hrt3(vec2 p, float len, float head) {
      float t = clamp(p.x / len, 0.0, 1.0);
      float half_h = head * (1.0 - t) * (1.0 - t * 0.35); // tapering profile
      // round the nose
      if (p.x < 0.0) return length(p) - head;
      return abs(p.y) - half_h + smoothstep(0.92, 1.0, t) * head;
    }

    vec4 generate() {
      float rows = u_row_count;
      vec2 guv = vec2(v_uv.x, v_uv.y * rows);
      float row = floor(guv.y);
      // alternate rows stagger by half a period and flip stagger phase
      float phase = mod(row, 2.0) * 0.5;
      vec2 p = vec2(fract(guv.x + phase), fract(guv.y) - 0.5);

      // --- palette: deep maroon body, butterscotch scallop, mint keyline ---
      vec3 body    = u_body_color.rgb;
      vec3 scallop = u_scallop_color.rgb;
      vec3 keyline = vec3(0.78, 0.92, 0.80);

      // nitro-era lacquer: warm yellowing + orange peel
      vec3 col = body;
      col *= 0.96 + noise(v_uv * 420.0) * 0.06;
      col = mix(col, col * vec3(1.05, 1.0, 0.88), smoothstep(0.2, 0.9, fbm(v_uv * 2.5) * 0.5 + 0.5) * 0.25);

      // brush wobble along scallop edges — a striper's hand, not a plotter
      float wob = (noise(vec2(p.x * 14.0, row * 3.7)) - 0.5) * 0.05
                + (noise(vec2(p.x * 47.0, row * 9.1)) - 0.5) * 0.018;

      float len = u_scallop_length;
      float d = spear_hrt3(vec2(p.x - 0.06, p.y + wob), len, 0.30);
      float aa = 0.02;

      // keyline first (sits just outside the fill)
      float key = smoothstep(aa, 0.0, abs(d - 0.07) - 0.030);
      col = mix(col, keyline, key * 0.9);

      // scallop fill with lengthwise brush striae
      float fill = smoothstep(aa, -aa, d);
      vec3 s_col = scallop;
      s_col *= 0.95 + 0.08 * noise(vec2(p.x * 6.0, p.y * 90.0 + row * 13.0));
      // hot highlight along the spine of each spear
      s_col += exp(-p.y * p.y * 220.0) * 0.10 * (1.0 - smoothstep(0.0, len, p.x));
      col = mix(col, s_col, fill);

      // edge shading: a soft kiss of shadow just outside each scallop
      col *= 1.0 - smoothstep(0.10, 0.02, abs(d)) * step(0.0, d) * 0.08;

      // tip flicks: tiny paint tails past the taper, hand-finished
      float tail = step(0.985, hash(vec2(floor(guv.x * 60.0), row))) *
                   smoothstep(0.12, 0.0, abs(p.y)) * step(len, p.x) * step(p.x, len + 0.12);
      col = mix(col, scallop * 0.9, tail * 0.5);

      // sun bleach gradient across the panel
      col = mix(col, col * 1.07, smoothstep(0.4, 1.0, v_uv.y) * 0.18);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_row_count', name: 'Scallop Rows', type: 'float', min: 2.0, max: 8.0, default: 4.0 },
    { id: 'u_scallop_length', name: 'Spear Length', type: 'float', min: 0.4, max: 0.95, default: 0.8 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.30, 0.06, 0.09, 1.0] },
    { id: 'u_scallop_color', name: 'Scallop Colour', type: 'color', default: [0.93, 0.72, 0.25, 1.0] }
  ]
};

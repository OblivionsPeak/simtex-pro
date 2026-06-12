export default {
  id: 'heritage_arcs',
  name: 'Heritage Arcs',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Two broad contrasting arc stripes sweeping across the panel — the classic endurance-racer look, with painted keylines, edge feather, and decades of clearcoat micro-wear.',
  shader: `
    // signed distance to an arc band centred on a big off-panel circle
    float arcband_hrt1(vec2 p, vec2 c, float r) {
      return length(p - c) - r;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: powder-blue body, marigold + navy sweep ---
      vec3 body    = u_body_color.rgb;
      vec3 arc_a   = u_arc_color.rgb;                       // leading broad arc
      vec3 arc_b   = arc_a * vec3(0.30, 0.32, 0.42) + vec3(0.02, 0.03, 0.10); // trailing dark mate
      vec3 keyline = vec3(0.96, 0.95, 0.90);                // hand-pulled cream keyline

      // big circle centre sits below-left of the tile so the band reads
      // as a sweeping arc rather than a ring
      vec2 centre = vec2(-0.35, -0.85 + u_arc_sweep * 0.5);

      // faint brush texture only — the arc edge should sweep clean
      float wob = (noise(uv * 9.0) - 0.5) * 0.002 + (noise(uv * 33.0) - 0.5) * 0.0008;

      float d = arcband_hrt1(uv, centre, 1.35) + wob;

      float w  = u_arc_width;            // broad arc half-width
      float aa = 0.0035;                 // paint edge softness

      vec3 col = body;

      // body-colour metallic flake + vertical polish striae
      col *= 0.97 + noise(uv * 480.0) * 0.05;
      col *= 0.995 + 0.01 * sin(uv.x * 900.0 + noise(uv * 6.0) * 8.0);

      // --- trailing arc (narrower, tucked behind the lead arc) ---
      float d2 = d - w * 1.55;
      float in_b = smoothstep(aa, -aa, abs(d2) - w * 0.45);
      col = mix(col, arc_b, in_b);

      // --- leading broad arc ---
      float in_a = smoothstep(aa, -aa, abs(d) - w);
      vec3 a_col = arc_a;
      // sun-fade: the arc bleaches slightly toward the top of the panel
      a_col = mix(a_col, a_col * 1.12 + 0.04, smoothstep(0.3, 1.0, uv.y) * 0.35);
      col = mix(col, a_col, in_a);

      // --- cream keylines hugging both arcs ---
      float k1 = smoothstep(aa * 2.0, 0.0, abs(abs(d)  - w        - 0.012) - 0.004);
      float k2 = smoothstep(aa * 2.0, 0.0, abs(abs(d2) - w * 0.45 - 0.010) - 0.0035);
      col = mix(col, keyline, max(k1, k2) * 0.92);

      // --- micro-wear: chips biting into the arc edges ---
      float chip = step(0.965, hash(floor(uv * 140.0))) *
                   smoothstep(0.02, 0.0, abs(abs(d) - w));
      col = mix(col, body * 0.92, chip * 0.8);

      // panel grime gathering low on the tile
      col *= 1.0 - smoothstep(0.5, 0.0, uv.y) * (fbm(uv * 5.0) * 0.5 + 0.5) * 0.07;

      // clearcoat sheen band
      col += smoothstep(0.25, 0.0, abs(uv.y - 0.72)) * 0.045;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_arc_width', name: 'Arc Width', type: 'float', min: 0.04, max: 0.22, default: 0.11 },
    { id: 'u_arc_sweep', name: 'Sweep Height', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.62, 0.78, 0.86, 1.0] },
    { id: 'u_arc_color', name: 'Arc Colour', type: 'color', default: [0.95, 0.55, 0.10, 1.0] }
  ]
};

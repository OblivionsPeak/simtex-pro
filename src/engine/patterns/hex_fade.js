export default {
  id: 'hex_fade',
  name: 'Hex Fade',
  category: 'Geometric',
  description: 'The signature modern GT livery motif: a crisp honeycomb hexagon grid that shrinks and dissolves to nothing along a controllable fade direction with dithered per-cell dropout.',
  shader: `

    // Signed-ish distance to a hexagon edge in cell space (edge sits at 0.5)
    float hexEdge(vec2 p) {
      p = abs(p);
      return max(dot(p, vec2(0.5, 0.8660254)), p.x);
    }

    vec4 generate() {
      float angRad = radians(u_fade_angle);
      vec2 fadeDir = vec2(cos(angRad), sin(angRad));

      // Standard interleaved hex grid lookup
      vec2 uv = v_uv * u_scale;
      vec2 rep = vec2(1.0, 1.7320508);
      vec2 halfRep = rep * 0.5;
      vec2 a = mod(uv, rep) - halfRep;
      vec2 b = mod(uv - halfRep, rep) - halfRep;
      vec2 gv = (dot(a, a) < dot(b, b)) ? a : b;
      vec2 id = uv - gv;

      // Fade progress measured at the cell centre so whole cells act together
      float prog = dot(id / u_scale - 0.5, fadeDir) + 0.5;
      float t = clamp((prog - u_fade_start) / max(u_fade_length, 0.001), 0.0, 1.0);

      // Per-cell dropout threshold -> dithered dissolve instead of a hard wipe
      float cellHash = hash(id * 0.731 + 17.13);
      float alive = step(t, cellHash * 0.999);

      // Cells shrink as the fade approaches their personal dropout point
      float local = clamp(t / max(cellHash, 0.0001), 0.0, 1.0);
      float radius = (0.5 - u_border * 0.5) * (1.0 - local * 0.9);

      float d = hexEdge(gv);
      float hexMask = smoothstep(radius, radius - 0.035, d) * alive;

      vec4 color = mix(u_color_bg, u_color_hex, hexMask);
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Carbon Fade',
      uniforms: {
        u_color_hex: [0.16, 0.17, 0.19, 1.0],
        u_color_bg: [0.05, 0.05, 0.06, 1.0]
      }
    },
    {
      name: 'Victory Red',
      uniforms: {
        u_color_hex: [0.82, 0.07, 0.10, 1.0],
        u_color_bg: [0.96, 0.96, 0.96, 1.0]
      }
    },
    {
      name: 'Electric Blue',
      uniforms: {
        u_color_hex: [0.05, 0.55, 1.00, 1.0],
        u_color_bg: [0.02, 0.04, 0.10, 1.0]
      }
    },
    {
      name: 'Stealth',
      uniforms: {
        u_color_hex: [0.10, 0.10, 0.11, 1.0],
        u_color_bg: [0.20, 0.21, 0.23, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Hex Scale', type: 'float', min: 4.0, max: 40.0, default: 14.0 },
    { id: 'u_fade_angle', name: 'Fade Angle (deg)', type: 'float', min: 0.0, max: 360.0, default: 0.0 },
    { id: 'u_fade_start', name: 'Fade Start', type: 'float', min: 0.0, max: 1.0, default: 0.2 },
    { id: 'u_fade_length', name: 'Fade Length', type: 'float', min: 0.05, max: 1.0, default: 0.6 },
    { id: 'u_border', name: 'Hex Border', type: 'float', min: 0.0, max: 0.3, default: 0.08 },
    { id: 'u_color_hex', name: 'Hex Color', type: 'color', default: [0.16, 0.17, 0.19, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [0.05, 0.05, 0.06, 1.0] }
  ]
};

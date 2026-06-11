export default {
  id: 'sakura_petals',
  name: 'Sakura Petals',
  category: 'Natural',
  added: '2026-06-11',
  description: 'Scattered cherry-blossom petals drifting across the surface at three depths, each petal a softly notched teardrop with its own size, tilt and tint.',
  shader: `

    vec2 rot2(vec2 q, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec2(c * q.x - s * q.y, s * q.x + c * q.y);
    }

    // Signed distance (normalized by size) to a sakura petal pointing +y:
    // an ellipse tapered toward the stem with a small notch at the tip.
    float petalDist(vec2 q, float size) {
      float taper = 0.55 + 0.45 * smoothstep(-size, size * 0.7, q.y);
      float d = length(vec2(q.x / max(taper * 0.62, 0.01), q.y)) - size;
      float notch = exp(-pow(q.x / (0.14 * size), 2.0)) * smoothstep(size * 0.35, size, q.y);
      d += 0.22 * size * notch;
      return d / size;
    }

    vec4 petalLayer(vec4 color, vec2 uv, float seed, float fade) {
      vec2 cell = floor(uv);
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 cc = cell + vec2(float(dx), float(dy));
          float h1 = hash(cc + seed);
          float h2 = hash(cc + seed + 17.31);
          float h3 = hash(cc + seed + 41.77);
          if (h1 < 0.68) {
            vec2 center = cc + 0.5 + (vec2(h2, h3) - 0.5) * 0.7;
            float ang = mix(0.7, h2 * 6.2831853, u_chaos);
            float size = 0.32 * (1.0 - u_var * h3 * 0.65);
            vec2 q = rot2(uv - center, ang);
            float dn = petalDist(q, size);
            float mask = smoothstep(0.09, -0.09, dn);
            // Darker accent toward the petal rim.
            float edge = smoothstep(-0.5, -0.02, dn);
            vec3 pc = mix(u_color_petal.rgb, u_color_accent.rgb, edge * 0.7);
            pc *= 0.88 + 0.24 * h2;
            float a = mask * u_color_petal.a * fade;
            color.rgb = mix(color.rgb, pc, a);
            color.a = color.a + (1.0 - color.a) * a;
          }
        }
      }
      return color;
    }

    vec4 generate() {
      vec4 color = u_color_bg;
      float s = u_density;
      // Back (small, faint) to front (large, full strength).
      color = petalLayer(color, v_uv * s * 1.9 + 7.13, 3.1, 0.45);
      color = petalLayer(color, v_uv * s * 1.35 + 3.41, 9.7, 0.72);
      color = petalLayer(color, v_uv * s, 1.0, 1.0);
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Spring Pink',
      uniforms: {
        u_color_petal: [0.99, 0.78, 0.85, 1.0],
        u_color_accent: [0.88, 0.45, 0.62, 1.0],
        u_color_bg: [1.00, 0.96, 0.96, 1.0]
      }
    },
    {
      name: 'White Blossom',
      uniforms: {
        u_color_petal: [0.99, 0.98, 0.97, 1.0],
        u_color_accent: [0.82, 0.76, 0.80, 1.0],
        u_color_bg: [0.66, 0.78, 0.82, 1.0]
      }
    },
    {
      name: 'Night Bloom',
      uniforms: {
        u_color_petal: [0.85, 0.55, 0.75, 1.0],
        u_color_accent: [0.55, 0.25, 0.50, 1.0],
        u_color_bg: [0.05, 0.04, 0.10, 1.0]
      }
    },
    {
      name: 'Autumn Gold',
      uniforms: {
        u_color_petal: [0.94, 0.72, 0.30, 1.0],
        u_color_accent: [0.72, 0.40, 0.12, 1.0],
        u_color_bg: [0.16, 0.09, 0.06, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_density', name: 'Petal Density', type: 'float', min: 2.0, max: 14.0, default: 6.0 },
    { id: 'u_var', name: 'Size Variation', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_chaos', name: 'Rotation Chaos', type: 'float', min: 0.0, max: 1.0, default: 1.0 },
    { id: 'u_color_petal', name: 'Petal Color', type: 'color', default: [0.99, 0.78, 0.85, 1.0] },
    { id: 'u_color_accent', name: 'Petal Accent', type: 'color', default: [0.88, 0.45, 0.62, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [1.0, 0.96, 0.96, 1.0] }
  ]
};

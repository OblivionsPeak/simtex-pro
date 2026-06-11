export default {
  id: 'multicam',
  name: 'MultiCam',
  category: 'Organic',
  description: 'The modern multi-terrain camouflage standard: a drifting tan-to-cream base gradient layered with organic olive and brown blobs and the signature small dark and cream spots.',
  shader: `

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Signature MultiCam trait: the base colour drifts horizontally
      // between tan and cream across the fabric.
      float drift = snoise(vec2(v_uv.x * 2.5, v_uv.y * 0.6)) * 0.5 + 0.5;
      vec4 color = mix(u_color_base, u_color_light, drift * 0.65);

      // Large organic blobs — olive first, brown layered over,
      // with fairly crisp (but not hard) edges like printed fabric.
      float blob1 = fbm(uv);
      float blob2 = fbm(uv * 1.25 + vec2(41.3, 17.8));
      color = mix(color, u_color_olive, smoothstep(0.14, 0.24, blob1));
      color = mix(color, u_color_brown, smoothstep(0.22, 0.32, blob2));

      // Small rounded accent spots — dark brown and pale cream
      float spot1 = snoise(uv * 2.8 + vec2(7.7, 91.0));
      float spot2 = snoise(uv * 2.8 + vec2(55.5, 23.0));
      color = mix(color, u_color_dark, smoothstep(0.50, 0.60, spot1));
      color = mix(color, u_color_light, smoothstep(0.58, 0.68, spot2) * 0.9);

      // Subtle fabric weave grain
      float grain = snoise(uv * 60.0) * 0.025;
      color.rgb += grain;

      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Original',
      uniforms: {
        u_color_base: [0.62, 0.56, 0.43, 1.0],   // Tan
        u_color_light: [0.85, 0.81, 0.69, 1.0],  // Cream
        u_color_olive: [0.42, 0.43, 0.30, 1.0],  // Olive Green
        u_color_brown: [0.49, 0.39, 0.28, 1.0],  // Field Brown
        u_color_dark: [0.27, 0.21, 0.15, 1.0]    // Dark Brown Spots
      }
    },
    {
      name: 'Black',
      uniforms: {
        u_color_base: [0.20, 0.20, 0.21, 1.0],
        u_color_light: [0.38, 0.38, 0.40, 1.0],
        u_color_olive: [0.13, 0.13, 0.14, 1.0],
        u_color_brown: [0.24, 0.23, 0.25, 1.0],
        u_color_dark: [0.05, 0.05, 0.06, 1.0]
      }
    },
    {
      name: 'Tropic',
      uniforms: {
        u_color_base: [0.30, 0.40, 0.22, 1.0],
        u_color_light: [0.55, 0.62, 0.38, 1.0],
        u_color_olive: [0.18, 0.28, 0.13, 1.0],
        u_color_brown: [0.32, 0.27, 0.17, 1.0],
        u_color_dark: [0.08, 0.14, 0.07, 1.0]
      }
    },
    {
      name: 'Arid',
      uniforms: {
        u_color_base: [0.72, 0.65, 0.50, 1.0],
        u_color_light: [0.89, 0.85, 0.73, 1.0],
        u_color_olive: [0.55, 0.50, 0.36, 1.0],
        u_color_brown: [0.60, 0.49, 0.35, 1.0],
        u_color_dark: [0.38, 0.30, 0.21, 1.0]
      }
    },
    {
      name: 'Alpine',
      uniforms: {
        u_color_base: [0.78, 0.79, 0.82, 1.0],
        u_color_light: [0.94, 0.94, 0.96, 1.0],
        u_color_olive: [0.58, 0.60, 0.65, 1.0],
        u_color_brown: [0.66, 0.66, 0.70, 1.0],
        u_color_dark: [0.40, 0.41, 0.46, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Pattern Scale', type: 'float', min: 1.0, max: 20.0, default: 5.0 },
    { id: 'u_color_base', name: 'Base Tan', type: 'color', default: [0.62, 0.56, 0.43, 1.0] },
    { id: 'u_color_light', name: 'Highlight Cream', type: 'color', default: [0.85, 0.81, 0.69, 1.0] },
    { id: 'u_color_olive', name: 'Olive Blobs', type: 'color', default: [0.42, 0.43, 0.30, 1.0] },
    { id: 'u_color_brown', name: 'Brown Blobs', type: 'color', default: [0.49, 0.39, 0.28, 1.0] },
    { id: 'u_color_dark', name: 'Dark Spots', type: 'color', default: [0.27, 0.21, 0.15, 1.0] }
  ]
};

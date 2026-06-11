export default {
  id: 'plaid_tartan_artisan',
  name: 'Plaid Tartan',
  category: 'Abstract',
  added: '2026-04-15',
  description: 'Multi-colored interlocking textile grid found in classic Scottish kilts.',
  shader: `
    vec4 generate() {
      float s = max(u_softness, 0.0005);
      float t = 1.0 - u_band;
      float fx = fract(v_uv.x * u_scale);
      float fy = fract(v_uv.y * u_scale);

      float hor = smoothstep(t - s, t + s, fx) * 0.5;
      float ver = smoothstep(t - s, t + s, fy) * 0.5;
      vec4 color = mix(u_secondary_color, u_primary_color, hor + ver);

      // Optional thin overcheck lines (hidden when width is 0)
      float on = step(0.001, u_accent_width);
      float accA = 1.0 - smoothstep(u_accent_width, u_accent_width + s, abs(fx - 0.35));
      float accB = 1.0 - smoothstep(u_accent_width, u_accent_width + s, abs(fy - 0.35));
      float acc = clamp(accA + accB, 0.0, 1.0) * on;
      color = mix(color, u_accent_color, acc * 0.85);
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [1.0, 0.0, 0.0, 1.0],
        u_secondary_color: [0.0, 0.2, 0.1, 1.0],
        u_accent_color: [0.95, 0.9, 0.3, 1.0],
        u_band: 0.3,
        u_accent_width: 0.0
      }
    },
    {
      name: 'Royal Stewart',
      uniforms: {
        u_primary_color: [0.08, 0.1, 0.3, 1.0],
        u_secondary_color: [0.6, 0.07, 0.1, 1.0],
        u_accent_color: [0.95, 0.85, 0.25, 1.0],
        u_band: 0.28,
        u_accent_width: 0.02
      }
    },
    {
      name: 'Blackwatch',
      uniforms: {
        u_primary_color: [0.05, 0.22, 0.12, 1.0],
        u_secondary_color: [0.05, 0.12, 0.2, 1.0],
        u_accent_color: [0.08, 0.08, 0.1, 1.0],
        u_band: 0.35,
        u_accent_width: 0.025
      }
    },
    {
      name: 'Grey Flannel',
      uniforms: {
        u_primary_color: [0.2, 0.2, 0.22, 1.0],
        u_secondary_color: [0.45, 0.45, 0.47, 1.0],
        u_accent_color: [0.7, 0.15, 0.15, 1.0],
        u_band: 0.3,
        u_accent_width: 0.015
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Grid Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_band', name: 'Band Width', type: 'float', min: 0.05, max: 0.6, default: 0.3 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.1, default: 0.008 },
    { id: 'u_accent_width', name: 'Overcheck Width', type: 'float', min: 0.0, max: 0.1, default: 0.0 },
    { id: 'u_primary_color', name: 'Stripe', type: 'color', default: [1.0, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Base Wool', type: 'color', default: [0.0, 0.2, 0.1, 1.0] },
    { id: 'u_accent_color', name: 'Overcheck', type: 'color', default: [0.95, 0.9, 0.3, 1.0] }
  ]
};

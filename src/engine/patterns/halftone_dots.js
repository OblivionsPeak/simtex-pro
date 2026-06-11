export default {
  id: 'halftone_dots_artisan',
  name: 'CMYK Halftone',
  category: 'Abstract',
  description: 'Professional offset color dots and halftone patterns used in high-end graphic design.',
  shader: `
    vec4 generate() {
      float a = u_angle * 0.01745329;
      vec2 p = v_uv - 0.5;
      p = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
      vec2 uv = (p + 0.5) * u_scale;

      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);

      // Optional print-style tonal fade across the sheet
      float r = u_dot_size * mix(1.0, 1.0 - v_uv.y * 0.85, u_fade);
      float s = max(u_softness, 0.003);
      float mask = smoothstep(r + s, r - s, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.0, 1.0, 1.0, 1.0],
        u_secondary_color: [1.0, 1.0, 1.0, 1.0],
        u_dot_size: 0.4,
        u_angle: 0.0,
        u_fade: 0.0
      }
    },
    {
      name: 'Comic Pop',
      uniforms: {
        u_primary_color: [0.95, 0.1, 0.5, 1.0],
        u_secondary_color: [1.0, 0.92, 0.3, 1.0],
        u_dot_size: 0.35,
        u_angle: 45.0,
        u_fade: 0.5
      }
    },
    {
      name: 'Newsprint',
      uniforms: {
        u_primary_color: [0.08, 0.08, 0.08, 1.0],
        u_secondary_color: [0.94, 0.92, 0.87, 1.0],
        u_dot_size: 0.3,
        u_angle: 22.0,
        u_fade: 0.0
      }
    },
    {
      name: 'Neon Fade',
      uniforms: {
        u_primary_color: [0.1, 1.0, 0.5, 1.0],
        u_secondary_color: [0.02, 0.02, 0.05, 1.0],
        u_dot_size: 0.42,
        u_angle: 30.0,
        u_fade: 0.8
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Dot Density', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_dot_size', name: 'Dot Size', type: 'float', min: 0.05, max: 0.7, default: 0.4 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.3, default: 0.01 },
    { id: 'u_angle', name: 'Screen Angle', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_fade', name: 'Tonal Fade', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Ink Dot', type: 'color', default: [0.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Paper White', type: 'color', default: [1.0, 1.0, 1.0, 1.0] }
  ]
};

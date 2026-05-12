export default {
  id: 'digi_camo_urban',
  name: 'Urban Digi Camo',
  category: 'Racing',
  description: 'High-contrast city digital camouflage.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      vec4 color = u_color_base;
      if (n > 0.8) color = u_color_1;
      else if (n > 0.5) color = u_color_2;
      else if (n > 0.2) color = u_color_3;
      return color;
    }
  `,
  variants: [
    {
      name: 'Urban (Default)',
      uniforms: {
        u_color_base: [0.5, 0.5, 0.5, 1.0],
        u_color_1: [0.1, 0.1, 0.1, 1.0],
        u_color_2: [0.3, 0.3, 0.3, 1.0],
        u_color_3: [0.7, 0.7, 0.7, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.08, 0.08, 0.09, 1.0],
        u_color_1: [0.0, 0.0, 0.0, 1.0],
        u_color_2: [0.04, 0.04, 0.05, 1.0],
        u_color_3: [0.12, 0.12, 0.14, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Detail', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_color_base', name: 'Base', type: 'color', default: [0.5, 0.5, 0.5, 1.0] },
    { id: 'u_color_1', name: 'Dark', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_color_2', name: 'Mid', type: 'color', default: [0.3, 0.3, 0.3, 1.0] },
    { id: 'u_color_3', name: 'Light', type: 'color', default: [0.7, 0.7, 0.7, 1.0] }
  ]
};

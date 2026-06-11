export default {
  id: 'hunting_camo_forest',
  name: 'Forest Hunting Camo',
  category: 'Racing',
  description: 'Pro-grade wilderness camouflage with organic branch and leaf shapes.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv * 1.5);
      float mask1 = step(0.6, n1);
      float n2 = noise(uv * 3.0 + n1 * 0.5);
      float mask2 = step(0.6, n2);
      float n3 = noise(vec2(uv.x * 0.5, uv.y * 4.0));
      float mask3 = step(0.7, n3);
      
      vec4 color = u_color_tan;
      color = mix(color, u_color_green, mask2);
      color = mix(color, u_color_brown, mask1);
      color = mix(color, u_color_dark, mask3);
      
      if (u_is_spec > 0.5) return vec4(0.0, 0.9, 0.0, 1.0);
      return color;
    }
  `,
  variants: [
    {
      name: 'Forest (Default)',
      uniforms: {
        u_color_green: [0.1, 0.15, 0.05, 1.0],
        u_color_tan: [0.5, 0.45, 0.3, 1.0],
        u_color_brown: [0.25, 0.15, 0.1, 1.0],
        u_color_dark: [0.05, 0.05, 0.02, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_green: [0.06, 0.06, 0.07, 1.0],
        u_color_tan: [0.15, 0.15, 0.16, 1.0],
        u_color_brown: [0.03, 0.03, 0.04, 1.0],
        u_color_dark: [0.0, 0.0, 0.0, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Detail Density', type: 'float', min: 1.0, max: 10.0, default: 3.5 },
    { id: 'u_color_green', name: 'Greenish', type: 'color', default: [0.1, 0.15, 0.05, 1.0] },
    { id: 'u_color_tan', name: 'Tan Base', type: 'color', default: [0.5, 0.45, 0.3, 1.0] },
    { id: 'u_color_brown', name: 'Brown', type: 'color', default: [0.25, 0.15, 0.1, 1.0] },
    { id: 'u_color_dark', name: 'Dark', type: 'color', default: [0.05, 0.05, 0.02, 1.0] }
  ]
};

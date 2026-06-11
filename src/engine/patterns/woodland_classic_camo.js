export default {
  id: 'woodland_classic_camo',
  name: 'Woodland Classic Camo',
  category: 'Organic',
  added: '2026-05-12',
  description: 'Classic M81 style camouflage with large organic blobs overlapping each other.',
  shader: `
    

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      float n1 = fbm(uv);
      float n2 = fbm(uv + vec2(5.2, 1.3));
      float n3 = fbm(uv + vec2(10.1, -3.4));
      
      vec4 color = u_color_base;
      if (n1 > 0.1) color = u_color_1;
      if (n2 > 0.3) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic Woodland',
      uniforms: {
        u_color_base: [0.63, 0.56, 0.45, 1.0], // Tan
        u_color_1: [0.28, 0.35, 0.22, 1.0],    // Green
        u_color_2: [0.35, 0.26, 0.18, 1.0],    // Brown
        u_color_3: [0.08, 0.08, 0.08, 1.0]     // Black
      }
    },
    {
      name: 'Desert Recon',
      uniforms: {
        u_color_base: [0.82, 0.75, 0.61, 1.0],
        u_color_1: [0.73, 0.62, 0.47, 1.0],
        u_color_2: [0.55, 0.44, 0.31, 1.0],
        u_color_3: [0.35, 0.25, 0.15, 1.0]
      }
    },
    {
      name: 'Urban Stealth',
      uniforms: {
        u_color_base: [0.70, 0.70, 0.75, 1.0],
        u_color_1: [0.45, 0.45, 0.50, 1.0],
        u_color_2: [0.25, 0.25, 0.30, 1.0],
        u_color_3: [0.10, 0.10, 0.12, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.12, 0.12, 0.14, 1.0],
        u_color_1: [0.08, 0.08, 0.10, 1.0],
        u_color_2: [0.04, 0.04, 0.05, 1.0],
        u_color_3: [0.01, 0.01, 0.01, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Pattern Scale', type: 'float', min: 1.0, max: 20.0, default: 5.0 },
    { id: 'u_color_base', name: 'Base (Tan)', type: 'color', default: [0.63, 0.56, 0.45, 1.0] },
    { id: 'u_color_1', name: 'Layer 1 (Green)', type: 'color', default: [0.28, 0.35, 0.22, 1.0] },
    { id: 'u_color_2', name: 'Layer 2 (Brown)', type: 'color', default: [0.35, 0.26, 0.18, 1.0] },
    { id: 'u_color_3', name: 'Layer 3 (Black)', type: 'color', default: [0.08, 0.08, 0.08, 1.0] }
  ]
};

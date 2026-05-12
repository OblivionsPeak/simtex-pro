export default {
  id: 'geometric_camo_ops',
  name: 'Geometric Camo (Ops)',
  category: 'Geometric',
  description: 'A modern, sharp geometric splinter camouflage designed for high-performance racing liveries with vibrant accent capabilities.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        vec2 g1 = floor(uv + vec2(uv.y * 0.5, 0.0));
        float h1 = hash(g1);
        
        vec2 g2 = floor(uv * 1.3 + vec2(0.0, uv.x * 0.5));
        float h2 = hash(g2 + vec2(11.0, 17.0));
        
        vec2 g3 = floor(uv * mat2(0.707, -0.707, 0.707, 0.707) * 1.7);
        float h3 = hash(g3 + vec2(23.0, 29.0));
        
        float val = fract(h1 + h2 + h3);
        
        vec4 col = u_color_base;
        if(val < 0.3) col = u_color_1;
        else if(val < 0.6) col = u_color_2;
        else if(val < 0.9) col = u_color_3;
        
        if (val > 0.98 - (u_accent_amount * 0.1)) {
             col = u_color_accent;
        }
        
        return col;
    }
  `,
  variants: [
    {
      name: 'Woodland (Ops)',
      uniforms: {
        u_color_base: [0.22, 0.27, 0.20, 1.0],
        u_color_1: [0.15, 0.16, 0.15, 1.0],
        u_color_2: [0.05, 0.05, 0.05, 1.0],
        u_color_3: [0.35, 0.35, 0.35, 1.0],
        u_color_accent: [0.35, 0.28, 0.18, 1.0] // Dark Earth
      }
    },
    {
      name: 'Desert Recon',
      uniforms: {
        u_color_base: [0.76, 0.69, 0.50, 1.0], // Sandy Tan
        u_color_1: [0.55, 0.47, 0.33, 1.0],    // Coyote Brown
        u_color_2: [0.25, 0.28, 0.20, 1.0],    // Olive Drab
        u_color_3: [0.10, 0.10, 0.10, 1.0],    // Matte Black
        u_color_accent: [0.60, 0.40, 0.10, 1.0] // Bronze
      }
    },
    {
      name: 'Urban Stealth',
      uniforms: {
        u_color_base: [0.90, 0.90, 0.92, 1.0], // White/Light Grey
        u_color_1: [0.60, 0.60, 0.65, 1.0],    // Mid Grey
        u_color_2: [0.15, 0.15, 0.18, 1.0],    // Charcoal Black
        u_color_3: [0.30, 0.30, 0.35, 1.0],    // Dark Grey
        u_color_accent: [0.25, 0.28, 0.35, 1.0] // Dark Blue-Grey
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Camo Scale', type: 'float', min: 1.0, max: 50.0, default: 12.0 },
    { id: 'u_color_base', name: 'Base Green', type: 'color', default: [0.22, 0.27, 0.20, 1.0] },
    { id: 'u_color_1', name: 'Dark Grey', type: 'color', default: [0.15, 0.16, 0.15, 1.0] },
    { id: 'u_color_2', name: 'Black', type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_color_3', name: 'Light Grey', type: 'color', default: [0.35, 0.35, 0.35, 1.0] },
    { id: 'u_color_accent', name: 'Accent Line', type: 'color', default: [0.35, 0.28, 0.18, 1.0] },
    { id: 'u_accent_amount', name: 'Accent Amount', type: 'float', min: 0.0, max: 1.0, default: 0.5 }
  ]
};

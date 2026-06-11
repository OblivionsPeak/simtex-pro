export default {
  id: 'splinter_camo',
  name: 'Splinter Camo',
  category: 'Geometric',
  added: '2026-05-12',
  description: 'A non-digital but highly angular, geometric camouflage consisting of sharp intersecting polygons and shards.',
  shader: `
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Create intersecting angular grids
      mat2 rot1 = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      mat2 rot2 = mat2(cos(-0.8), sin(-0.8), -sin(-0.8), cos(-0.8));
      mat2 rot3 = mat2(cos(1.2), sin(1.2), -sin(1.2), cos(1.2));
      
      vec2 g1 = floor(rot1 * uv);
      vec2 g2 = floor(rot2 * uv * 1.5 + vec2(10.0));
      vec2 g3 = floor(rot3 * uv * 2.0 + vec2(20.0));
      
      float h1 = hash(g1);
      float h2 = hash(g2);
      float h3 = hash(g3);
      
      // Combine to create shards
      float val = fract(h1 + h2 * 0.5 + h3 * 0.25);
      
      vec4 color = u_color_base;
      if (val > 0.3) color = u_color_1;
      if (val > 0.6) color = u_color_2;
      if (val > 0.85) color = u_color_3;
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Swedish M90',
      uniforms: {
        u_color_base: [0.65, 0.70, 0.55, 1.0], // Light Green
        u_color_1: [0.35, 0.45, 0.30, 1.0],    // Mid Green
        u_color_2: [0.15, 0.25, 0.15, 1.0],    // Dark Green
        u_color_3: [0.10, 0.12, 0.10, 1.0]     // Darker Navy/Black
      }
    },
    {
      name: 'Winter Splinter',
      uniforms: {
        u_color_base: [0.90, 0.90, 0.95, 1.0],
        u_color_1: [0.70, 0.70, 0.75, 1.0],
        u_color_2: [0.40, 0.45, 0.50, 1.0],
        u_color_3: [0.20, 0.20, 0.25, 1.0]
      }
    },
    {
      name: 'Urban Splinter',
      uniforms: {
        u_color_base: [0.55, 0.55, 0.55, 1.0],
        u_color_1: [0.40, 0.40, 0.40, 1.0],
        u_color_2: [0.20, 0.20, 0.20, 1.0],
        u_color_3: [0.05, 0.05, 0.05, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.15, 0.15, 0.15, 1.0],
        u_color_1: [0.10, 0.10, 0.10, 1.0],
        u_color_2: [0.05, 0.05, 0.05, 1.0],
        u_color_3: [0.02, 0.02, 0.02, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Grid Scale', type: 'float', min: 1.0, max: 20.0, default: 8.0 },
    { id: 'u_color_base', name: 'Base Color', type: 'color', default: [0.65, 0.70, 0.55, 1.0] },
    { id: 'u_color_1', name: 'Shard 1', type: 'color', default: [0.35, 0.45, 0.30, 1.0] },
    { id: 'u_color_2', name: 'Shard 2', type: 'color', default: [0.15, 0.25, 0.15, 1.0] },
    { id: 'u_color_3', name: 'Shard 3', type: 'color', default: [0.10, 0.12, 0.10, 1.0] }
  ]
};

export default {
  id: 'flecktarn_camo',
  name: 'Flecktarn Camo',
  category: 'Organic',
  description: 'A complex pattern consisting of small, densely packed spots and dots that create a disruptive, noisy texture.',
  shader: `
    
    // Cellular noise for dots
    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float cellular(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float min_dist = 1.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i + neighbor);
          float dist = length(neighbor + point - f);
          min_dist = min(min_dist, dist);
        }
      }
      return min_dist;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Base organic blobs
      float base_noise = snoise(uv * 0.3);
      vec4 color = u_color_base;
      if (base_noise > 0.0) color = u_color_1;
      
      // Dots/Spots layered on top
      float spots1 = cellular(uv * 2.5);
      float spots2 = cellular(uv * 3.0 + vec2(10.0));
      float spots3 = cellular(uv * 3.5 + vec2(20.0));
      
      if (spots1 < 0.25) color = u_color_2;
      if (spots2 < 0.20) color = u_color_3;
      if (spots3 < 0.15) color = u_color_4;
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Flecktarn (Woodland)',
      uniforms: {
        u_color_base: [0.35, 0.40, 0.25, 1.0], // Light Green
        u_color_1: [0.25, 0.30, 0.20, 1.0],    // Mid Green
        u_color_2: [0.45, 0.35, 0.25, 1.0],    // Light Brown
        u_color_3: [0.25, 0.15, 0.10, 1.0],    // Dark Brown
        u_color_4: [0.10, 0.10, 0.10, 1.0]     // Black
      }
    },
    {
      name: 'Tropentarn (Desert)',
      uniforms: {
        u_color_base: [0.75, 0.65, 0.50, 1.0],
        u_color_1: [0.65, 0.55, 0.40, 1.0],
        u_color_2: [0.45, 0.50, 0.35, 1.0],
        u_color_3: [0.35, 0.25, 0.15, 1.0],
        u_color_4: [0.15, 0.15, 0.15, 1.0]
      }
    },
    {
      name: 'Urban Mottled',
      uniforms: {
        u_color_base: [0.60, 0.60, 0.65, 1.0],
        u_color_1: [0.40, 0.40, 0.45, 1.0],
        u_color_2: [0.30, 0.30, 0.35, 1.0],
        u_color_3: [0.20, 0.20, 0.25, 1.0],
        u_color_4: [0.10, 0.10, 0.12, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.15, 0.15, 0.15, 1.0],
        u_color_1: [0.12, 0.12, 0.12, 1.0],
        u_color_2: [0.08, 0.08, 0.08, 1.0],
        u_color_3: [0.05, 0.05, 0.05, 1.0],
        u_color_4: [0.02, 0.02, 0.02, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Spot Scale', type: 'float', min: 5.0, max: 40.0, default: 15.0 },
    { id: 'u_color_base', name: 'Base Color', type: 'color', default: [0.35, 0.40, 0.25, 1.0] },
    { id: 'u_color_1', name: 'Blob Color', type: 'color', default: [0.25, 0.30, 0.20, 1.0] },
    { id: 'u_color_2', name: 'Spot 1', type: 'color', default: [0.45, 0.35, 0.25, 1.0] },
    { id: 'u_color_3', name: 'Spot 2', type: 'color', default: [0.25, 0.15, 0.10, 1.0] },
    { id: 'u_color_4', name: 'Spot 3', type: 'color', default: [0.10, 0.10, 0.10, 1.0] }
  ]
};

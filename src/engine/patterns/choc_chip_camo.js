export default {
  id: 'choc_chip_camo',
  name: 'Chocolate Chip Camo',
  category: 'Organic',
  description: 'Broad waves of base color overlaid with small, high-contrast pebbles to mimic a rocky desert floor.',
  shader: `
    
    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    
    // Returns distance and vector to closest point
    vec3 cellular(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float min_dist = 1.0;
      vec2 closest_diff;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i + neighbor);
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          if(dist < min_dist) {
            min_dist = dist;
            closest_diff = diff;
          }
        }
      }
      return vec3(min_dist, closest_diff);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Background waves
      float n1 = snoise(uv * 0.5);
      float n2 = snoise(uv * 0.8 + vec2(4.2));
      
      vec4 color = u_color_base;
      if (n1 > 0.2) color = u_color_1;
      if (n2 > 0.4) color = u_color_2;
      
      // Chocolate Chips (Pebbles with shadows)
      vec3 cell = cellular(uv * 3.0);
      float dist = cell.x;
      vec2 diff = cell.yz;
      
      // Shadow offset
      float shadow = length(diff - vec2(0.08, -0.08));
      
      if (dist < 0.12) {
        color = u_color_chip; // The white/light pebble
      } else if (shadow < 0.15) {
        color = u_color_shadow; // The black shadow
      }
      
      return color;
    }
  `,
  variants: [
    {
      name: 'Desert Storm',
      uniforms: {
        u_color_base: [0.75, 0.65, 0.50, 1.0], // Tan
        u_color_1: [0.60, 0.50, 0.35, 1.0],    // Sand
        u_color_2: [0.45, 0.35, 0.25, 1.0],    // Brown
        u_color_chip: [0.90, 0.85, 0.75, 1.0], // White/Light
        u_color_shadow: [0.10, 0.08, 0.05, 1.0]// Black/Dark Brown
      }
    },
    {
      name: 'Mars Surface',
      uniforms: {
        u_color_base: [0.65, 0.30, 0.15, 1.0],
        u_color_1: [0.50, 0.20, 0.10, 1.0],
        u_color_2: [0.80, 0.45, 0.25, 1.0],
        u_color_chip: [0.95, 0.65, 0.40, 1.0],
        u_color_shadow: [0.15, 0.05, 0.02, 1.0]
      }
    },
    {
      name: 'Urban Rubble',
      uniforms: {
        u_color_base: [0.55, 0.55, 0.60, 1.0],
        u_color_1: [0.40, 0.40, 0.45, 1.0],
        u_color_2: [0.30, 0.30, 0.35, 1.0],
        u_color_chip: [0.85, 0.85, 0.90, 1.0],
        u_color_shadow: [0.10, 0.10, 0.15, 1.0]
      }
    },
    {
      name: 'Blackout Stealth',
      uniforms: {
        u_color_base: [0.12, 0.12, 0.14, 1.0],
        u_color_1: [0.08, 0.08, 0.10, 1.0],
        u_color_2: [0.05, 0.05, 0.06, 1.0],
        u_color_chip: [0.20, 0.20, 0.22, 1.0],
        u_color_shadow: [0.02, 0.02, 0.02, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Pattern Scale', type: 'float', min: 1.0, max: 20.0, default: 5.0 },
    { id: 'u_color_base', name: 'Base Sand', type: 'color', default: [0.75, 0.65, 0.50, 1.0] },
    { id: 'u_color_1', name: 'Wave 1', type: 'color', default: [0.60, 0.50, 0.35, 1.0] },
    { id: 'u_color_2', name: 'Wave 2', type: 'color', default: [0.45, 0.35, 0.25, 1.0] },
    { id: 'u_color_chip', name: 'Pebble Color', type: 'color', default: [0.90, 0.85, 0.75, 1.0] },
    { id: 'u_color_shadow', name: 'Shadow Color', type: 'color', default: [0.10, 0.08, 0.05, 1.0] }
  ]
};

export const CATEGORIES = ['All', 'Racing', 'Geometric', 'Technology', 'Organic', 'Utility'];

export const PATTERNS = [
  {
    id: 'forged_carbon',
    name: 'Forged Carbon',
    category: 'Organic',
    description: 'Randomized carbon shred pattern used in hypercars.',
    shader: `
      float fbm(vec2 p) {
        float f = 0.0;
        float a = 0.5;
        for(int i=0; i<6; i++) {
          f += a * abs(sin(p.x + sin(p.y)));
          p *= 2.0;
          a *= 0.5;
        }
        return f;
      }
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        float n = fbm(uv * 3.0);
        float n2 = fbm(uv * 5.0 + n);
        float final = mix(n, n2, 0.5);
        
        vec3 color = mix(u_secondary_color, u_primary_color, final);
        if (u_is_spec > 0.5) return vec3(0.9, 0.4, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 1.0, max: 20.0, default: 8.0 },
      { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.1, 0.1, 0.1] },
      { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.05, 0.05, 0.05] }
    ]
  },
  {
    id: 'twill_carbon',
    name: 'Twill Carbon 2x2',
    category: 'Racing',
    description: 'Classic 2x2 weave carbon fiber pattern.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 gv = fract(uv);
        vec2 id = floor(uv);
        
        float checker = mod(id.x + id.y, 2.0);
        float pattern = step(0.5, abs(gv.x - gv.y));
        if (checker > 0.5) pattern = 1.0 - pattern;
        
        float grain = sin(v_uv.x * 1000.0) * sin(v_uv.y * 1000.0) * 0.05;
        vec3 color = mix(u_secondary_color, u_primary_color, pattern + grain);
        
        if (u_is_spec > 0.5) return vec3(1.0, 0.3, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 5.0, max: 100.0, default: 40.0 },
      { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.15, 0.15, 0.15] },
      { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.08, 0.08, 0.08] }
    ]
  },
  {
    id: 'tire_tread_v',
    name: 'V-Tread Pattern',
    category: 'Racing',
    description: 'Aggressive directional tire tread geometry.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        float x = abs(fract(uv.x) - 0.5);
        float y = fract(uv.y);
        
        float tread = step(0.2, abs(x - y * 0.5));
        tread *= step(0.1, x);
        
        vec3 color = mix(u_secondary_color, u_primary_color, tread);
        if (u_is_spec > 0.5) return vec3(0.0, 0.8, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
      { id: 'u_primary_color', name: 'Tread', type: 'color', default: [0.2, 0.2, 0.2] },
      { id: 'u_secondary_color', name: 'Groove', type: 'color', default: [0.05, 0.05, 0.05] }
    ]
  },
  {
    id: 'hex_lattice',
    name: 'Hex Lattice',
    category: 'Geometric',
    description: 'Modern technical hexagonal grid pattern.',
    shader: `
      float hexDist(vec2 p) {
        p = abs(p);
        float c = dot(p, normalize(vec2(1, 1.73)));
        c = max(c, p.x);
        return c;
      }
      vec3 generate() {
        vec2 r = vec2(1, 1.73);
        vec2 h = r * 0.5;
        vec2 a = mod(v_uv * u_scale, r) - h;
        vec2 b = mod(v_uv * u_scale - h, r) - h;
        vec2 gv = dot(a, a) < dot(b, b) ? a : b;
        
        float d = hexDist(gv);
        float mask = step(u_thickness, 0.5 - d);
        
        vec3 color = mix(u_secondary_color, u_primary_color, mask);
        if (u_is_spec > 0.5) return vec3(0.5, 0.5, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
      { id: 'u_thickness', name: 'Thickness', type: 'float', min: 0.01, max: 0.2, default: 0.05 },
      { id: 'u_primary_color', name: 'Lines', type: 'color', default: [0.3, 0.3, 0.35] },
      { id: 'u_secondary_color', name: 'Fill', type: 'color', default: [0.1, 0.1, 0.12] }
    ]
  },
  {
    id: 'voronoi_cells',
    name: 'Voronoi Armor',
    category: 'Geometric',
    description: 'Angular cell-based armor plating texture.',
    shader: `
      vec2 hash2(vec2 p) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
      }
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 n = floor(uv);
        vec2 f = fract(uv);
        float m_dist = 1.0;
        for (int j=-1; j<=1; j++) {
          for (int i=-1; i<=1; i++) {
            vec2 g = vec2(float(i),float(j));
            vec2 o = hash2(n + g);
            vec2 r = g + o - f;
            float d = dot(r,r);
            if (d < m_dist) m_dist = d;
          }
        }
        float val = step(0.1, m_dist);
        vec3 color = mix(u_secondary_color, u_primary_color, val);
        if (u_is_spec > 0.5) return vec3(0.7, 0.3, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 2.0, max: 30.0, default: 12.0 },
      { id: 'u_primary_color', name: 'Plates', type: 'color', default: [0.2, 0.2, 0.25] },
      { id: 'u_secondary_color', name: 'Gaps', type: 'color', default: [0.05, 0.05, 0.05] }
    ]
  },
  {
    id: 'neural_grid',
    name: 'Neural Grid',
    category: 'Technology',
    description: 'Complex polygonal circuitry paths.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 gv = fract(uv) - 0.5;
        vec2 id = floor(uv);
        float n = fract(sin(id.x * 12.3 + id.y * 45.6) * 78.9);
        float line = 0.0;
        if (n > 0.5) line = step(0.45, abs(gv.x + gv.y));
        else line = step(0.45, abs(gv.x - gv.y));
        
        vec3 color = mix(u_secondary_color, u_primary_color, line);
        if (u_is_spec > 0.5) return vec3(0.2, 0.1, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
      { id: 'u_primary_color', name: 'Circuits', type: 'color', default: [0.0, 0.4, 0.8] },
      { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.02, 0.02, 0.05] }
    ]
  },
  {
    id: 'digital_camo',
    name: 'Digital Camo',
    category: 'Racing',
    description: 'Classic block-based digital camouflage.',
    shader: `
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      vec3 generate() {
        vec2 uv = floor(v_uv * u_scale);
        float n = hash(uv);
        vec3 color = u_primary_color;
        if (n > 0.75) color = u_secondary_color;
        else if (n > 0.5) color = vec3(0.1, 0.1, 0.1);
        else if (n > 0.25) color = vec3(0.05, 0.05, 0.05);
        
        if (u_is_spec > 0.5) return vec3(0.1, 0.9, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
      { id: 'u_primary_color', name: 'Camo A', type: 'color', default: [0.2, 0.25, 0.2] },
      { id: 'u_secondary_color', name: 'Camo B', type: 'color', default: [0.1, 0.12, 0.1] }
    ]
  },
  {
    id: 'brushed_steel',
    name: 'Brushed Steel',
    category: 'Organic',
    description: 'Realistic directional metal brushing.',
    shader: `
      float rand(vec2 n) { 
        return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
      }
      vec3 generate() {
        float n = rand(vec2(v_uv.x * 0.1, v_uv.y * u_intensity));
        for(int i=0; i<3; i++) {
            n += rand(vec2(v_uv.x * float(i), v_uv.y * u_intensity * float(i)));
        }
        n /= 4.0;
        vec3 color = mix(u_secondary_color, u_primary_color, n);
        if (u_is_spec > 0.5) return vec3(0.9, 0.2, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_intensity', name: 'Grain', type: 'float', min: 100.0, max: 2000.0, default: 800.0 },
      { id: 'u_primary_color', name: 'Highlight', type: 'color', default: [0.6, 0.6, 0.65] },
      { id: 'u_secondary_color', name: 'Lowlight', type: 'color', default: [0.3, 0.3, 0.35] }
    ]
  },
  {
    id: 'dot_matrix',
    name: 'Dot Matrix',
    category: 'Technology',
    description: 'Precision industrial dot pattern.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 gv = fract(uv) - 0.5;
        float dist = length(gv);
        float mask = step(u_size, dist);
        
        vec3 color = mix(u_primary_color, u_secondary_color, mask);
        if (u_is_spec > 0.5) return vec3(0.4, 0.6, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 10.0, max: 200.0, default: 60.0 },
      { id: 'u_size', name: 'Dot Size', type: 'float', min: 0.1, max: 0.5, default: 0.3 },
      { id: 'u_primary_color', name: 'Dot', type: 'color', default: [0.8, 0.1, 0.1] },
      { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.05, 0.05, 0.05] }
    ]
  },
  {
    id: 'diagonal_hatch',
    name: 'Diagonal Hatch',
    category: 'Geometric',
    description: 'Classic high-contrast diagonal safety stripes.',
    shader: `
      vec3 generate() {
        float val = fract((v_uv.x + v_uv.y) * u_scale);
        float mask = step(0.5, val);
        vec3 color = mix(u_secondary_color, u_primary_color, mask);
        if (u_is_spec > 0.5) return vec3(0.3, 0.1, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Frequency', type: 'float', min: 5.0, max: 100.0, default: 20.0 },
      { id: 'u_primary_color', name: 'Stripe 1', type: 'color', default: [1.0, 0.8, 0.0] },
      { id: 'u_secondary_color', name: 'Stripe 2', type: 'color', default: [0.0, 0.0, 0.0] }
    ]
  },
  {
    id: 'nano_mesh',
    name: 'Nano Mesh',
    category: 'Technology',
    description: 'Ultra-fine technical structural weave.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        float mesh = sin(uv.x * 6.28) * sin(uv.y * 6.28);
        mesh = step(u_threshold, abs(mesh));
        
        vec3 color = mix(u_secondary_color, u_primary_color, mesh);
        if (u_is_spec > 0.5) return vec3(0.8, 0.5, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 20.0, max: 500.0, default: 200.0 },
      { id: 'u_threshold', name: 'Mesh Gap', type: 'float', min: 0.1, max: 0.9, default: 0.7 },
      { id: 'u_primary_color', name: 'Wire', type: 'color', default: [0.4, 0.4, 0.5] },
      { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.02, 0.02, 0.04] }
    ]
  },
  {
    id: 'speed_blur',
    name: 'Speed Streaks',
    category: 'Racing',
    description: 'Static motion blur streaks for dynamic liveries.',
    shader: `
      float rand(float n) { return fract(sin(n) * 43758.5453123); }
      vec3 generate() {
        float row = floor(v_uv.y * u_scale);
        float offset = rand(row);
        float val = step(0.1, fract(v_uv.x * 2.0 + offset));
        
        vec3 color = mix(u_secondary_color, u_primary_color, val);
        if (u_is_spec > 0.5) return vec3(0.0, 0.5, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Rows', type: 'float', min: 5.0, max: 100.0, default: 40.0 },
      { id: 'u_primary_color', name: 'Streak', type: 'color', default: [1.0, 1.0, 1.0] },
      { id: 'u_secondary_color', name: 'Space', type: 'color', default: [0.0, 0.0, 0.0] }
    ]
  },
  {
    id: 'crackle_paint',
    name: 'Crackle Paint',
    category: 'Organic',
    description: 'Weathered, cracked surface texture.',
    shader: `
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
      float noise(vec2 p) {
        vec2 i = floor(p); vec2 f = fract(p);
        f = f*f*(3.0-2.0*f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
      }
      vec3 generate() {
        float n = noise(v_uv * u_scale);
        float cracks = step(u_threshold, abs(sin(n * 10.0)));
        vec3 color = mix(u_primary_color, u_secondary_color, cracks);
        if (u_is_spec > 0.5) return vec3(0.2, 0.9, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Complexity', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
      { id: 'u_threshold', name: 'Crack Width', type: 'float', min: 0.8, max: 0.99, default: 0.95 },
      { id: 'u_primary_color', name: 'Surface', type: 'color', default: [0.8, 0.8, 0.8] },
      { id: 'u_secondary_color', name: 'Cracks', type: 'color', default: [0.1, 0.1, 0.1] }
    ]
  },
  {
    id: 'offset_bricks',
    name: 'Technical Blocks',
    category: 'Geometric',
    description: 'Offset architectural block pattern.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
        vec2 gv = fract(uv);
        float mask = step(0.05, gv.x) * step(0.05, gv.y) * step(gv.x, 0.95) * step(gv.y, 0.95);
        vec3 color = mix(u_secondary_color, u_primary_color, mask);
        if (u_is_spec > 0.5) return vec3(0.5, 0.2, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 50.0, default: 15.0 },
      { id: 'u_primary_color', name: 'Block', type: 'color', default: [0.25, 0.25, 0.3] },
      { id: 'u_secondary_color', name: 'Grout', type: 'color', default: [0.05, 0.05, 0.08] }
    ]
  },
  {
    id: 'apex_checkers',
    name: 'Apex Checkers',
    category: 'Racing',
    description: 'Traditional racing checkerboard pattern.',
    shader: `
      vec3 generate() {
        vec2 uv = floor(v_uv * u_scale);
        float mask = mod(uv.x + uv.y, 2.0);
        vec3 color = mix(u_secondary_color, u_primary_color, mask);
        if (u_is_spec > 0.5) return vec3(0.1, 0.1, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 100.0, default: 16.0 },
      { id: 'u_primary_color', name: 'Square 1', type: 'color', default: [1.0, 1.0, 1.0] },
      { id: 'u_secondary_color', name: 'Square 2', type: 'color', default: [0.0, 0.0, 0.0] }
    ]
  },
  {
    id: 'circuit_nodes',
    name: 'Circuit Nodes',
    category: 'Technology',
    description: 'High-tech node connectivity points.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 gv = fract(uv) - 0.5;
        float d = length(gv);
        float nodes = step(0.3, d) * step(d, 0.4);
        float inner = step(0.1, d);
        
        vec3 color = mix(u_secondary_color, u_primary_color, 1.0 - nodes * inner);
        if (u_is_spec > 0.5) return vec3(0.3, 0.8, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 5.0, max: 100.0, default: 20.0 },
      { id: 'u_primary_color', name: 'Node', type: 'color', default: [0.0, 1.0, 0.6] },
      { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.01, 0.05, 0.03] }
    ]
  },
  {
    id: 'noise_grain',
    name: 'Noise Grain',
    category: 'Utility',
    description: 'Universal fine-grain surface noise.',
    shader: `
      float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
      vec3 generate() {
        float n = rand(v_uv * u_scale);
        vec3 color = mix(u_secondary_color, u_primary_color, n);
        if (u_is_spec > 0.5) return vec3(0.1, 0.1, 1.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Grain Density', type: 'float', min: 100.0, max: 2000.0, default: 1000.0 },
      { id: 'u_primary_color', name: 'Bright', type: 'color', default: [0.2, 0.2, 0.2] },
      { id: 'u_secondary_color', name: 'Dark', type: 'color', default: [0.1, 0.1, 0.1] }
    ]
  },
  {
    id: 'diamond_plate',
    name: 'Diamond Plate',
    category: 'Utility',
    description: 'Industrial safety flooring texture.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 gv = fract(uv) - 0.5;
        float diamond = step(0.15, abs(gv.x + gv.y)) + step(0.15, abs(gv.x - gv.y));
        diamond = 1.0 - step(1.9, diamond);
        
        vec3 color = mix(u_secondary_color, u_primary_color, diamond);
        if (u_is_spec > 0.5) return vec3(0.9, 0.1, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 5.0, max: 100.0, default: 30.0 },
      { id: 'u_primary_color', name: 'Plate', type: 'color', default: [0.5, 0.5, 0.55] },
      { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.2, 0.2, 0.22] }
    ]
  },
  {
    id: 'honeycomb',
    name: 'Honeycomb Mesh',
    category: 'Technology',
    description: 'Aeronautical honeycomb structural pattern.',
    shader: `
      vec3 generate() {
        vec2 r = vec2(1, 1.73);
        vec2 h = r * 0.5;
        vec2 a = mod(v_uv * u_scale, r) - h;
        vec2 b = mod(v_uv * u_scale - h, r) - h;
        vec2 gv = dot(a, a) < dot(b, b) ? a : b;
        
        float d = max(abs(gv.x) * 0.866 + abs(gv.y) * 0.5, abs(gv.y));
        float mask = step(0.4, d);
        
        vec3 color = mix(u_secondary_color, u_primary_color, mask);
        if (u_is_spec > 0.5) return vec3(1.0, 1.0, 0.0);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 5.0, max: 100.0, default: 40.0 },
      { id: 'u_primary_color', name: 'Walls', type: 'color', default: [1.0, 0.7, 0.0] },
      { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.1, 0.07, 0.0] }
    ]
  },
  {
    id: 'isometric_grid',
    name: 'Isometric Grid',
    category: 'Geometric',
    description: '3D-effect isometric structural grid.',
    shader: `
      vec3 generate() {
        vec2 uv = v_uv * u_scale;
        float line1 = step(0.95, fract(uv.x + uv.y * 1.73));
        float line2 = step(0.95, fract(uv.x - uv.y * 1.73));
        float line3 = step(0.95, fract(uv.x * 2.0));
        float mask = max(max(line1, line2), line3);
        
        vec3 color = mix(u_secondary_color, u_primary_color, mask);
        if (u_is_spec > 0.5) return vec3(0.5, 0.5, 0.5);
        return color;
      }
    `,
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
      { id: 'u_primary_color', name: 'Grid', type: 'color', default: [0.4, 0.4, 0.45] },
      { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.05, 0.05, 0.05] }
    ]
  }
];

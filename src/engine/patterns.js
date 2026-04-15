export const CATEGORIES = ['All', 'Geometric', 'Technology', 'Organic', 'Racing', 'Utility'];

export const PATTERNS = [
  {
    id: 'carbon-fiber',
    name: 'Carbon Fiber',
    category: 'Organic',
    description: 'Classic lightweight racing weave with anisotropic highlights.',
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 1, max: 100, default: 20 },
      { id: 'u_intensity', name: 'Reflectivity', type: 'float', min: 0, max: 1, default: 0.5 },
      { id: 'u_color', name: 'Base Color', type: 'color', default: [0.1, 0.1, 0.1] }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_scale;
      uniform float u_intensity;
      uniform vec3 u_color;
      uniform float u_is_spec;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 st = uv * u_scale;
        vec2 cell = floor(st);
        vec2 local = fract(st);
        float parity = mod(cell.x + cell.y, 2.0);
        float fiber = (parity < 0.5) ? local.x : local.y;
        float grain = sin(fiber * 30.0 + (parity * 3.14));
        float shade = 0.5 + 0.5 * sin(fiber * 3.14159);
        vec3 finalColor = u_color + (shade * 0.1 * u_intensity) + (grain * 0.02);
        if (u_is_spec > 0.5) finalColor = vec3(0.8, 0.4 + grain * 0.1, 1.0);
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `
  },
  {
      id: 'forged-carbon',
      name: 'Forged Carbon',
      category: 'Organic',
      description: 'Randomized carbon shred pattern used in hypercars.',
      uniforms: [
        { id: 'u_scale', name: 'Scale', type: 'float', min: 1, max: 20, default: 10 },
        { id: 'u_contrast', name: 'Contrast', type: 'float', min: 1, max: 10, default: 4 },
        { id: 'u_seed', name: 'Seed', type: 'float', min: 0, max: 100, default: 42 }
      ],
      shader: `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_scale;
        uniform float u_contrast;
        uniform float u_seed;
        uniform float u_is_spec;

        vec2 hash(vec2 p) {
            p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
            return fract(sin(p + u_seed) * 43758.5453);
        }

        float voronoi(vec2 x) {
            vec2 n = floor(x);
            vec2 f = fract(x);
            float d = 8.0;
            for(int j=-1; j<=1; j++)
            for(int i=-1; i<=1; i++) {
                vec2 g = vec2(float(i),float(j));
                vec2 o = hash(n + g);
                vec2 r = g + o - f;
                d = min(d, dot(r,r));
            }
            return sqrt(d);
        }

        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            float val = voronoi(uv * u_scale + voronoi(uv * u_scale * 0.5) * 2.0);
            val = pow(1.0 - val, u_contrast);
            vec3 col = vec3(0.05 + val * 0.15);
            if (u_is_spec > 0.5) col = vec3(0.7, 0.3 + val * 0.2, 1.0);
            gl_FragColor = vec4(col, 1.0);
        }
      `
  },
  {
    id: 'hex-lattice',
    name: 'Hex Lattice',
    category: 'Geometric',
    description: 'Modern technical hexagonal grid pattern.',
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 1, max: 50, default: 10 },
      { id: 'u_thickness', name: 'Border', type: 'float', min: 0.01, max: 0.2, default: 0.05 },
      { id: 'u_glow', name: 'Glow', type: 'float', min: 0, max: 1, default: 0.3 },
      { id: 'u_color', name: 'Grid Color', type: 'color', default: [0.2, 0.5, 1.0] }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_scale;
      uniform float u_thickness;
      uniform float u_glow;
      uniform vec3 u_color;
      uniform float u_is_spec;

      float hex(vec2 p) {
        p = abs(p);
        return max(dot(p, vec2(0.866025, 0.5)), p.x);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x) * u_scale;
        vec2 s = vec2(1.0, 1.73205);
        vec2 h1 = floor(uv/s) + 0.5;
        vec2 h2 = floor((uv - s*0.5)/s) + 0.5;
        vec2 center = length(uv - h1*s) < length(uv - h2*s) ? h1*s : h2*s + s*0.5;
        float d = hex(uv - center);
        float grid = smoothstep(0.45, 0.45 - u_thickness, d);
        vec3 col = mix(vec3(0.0), u_color, grid);
        col += u_color * u_glow * (1.0 - smoothstep(0.0, 0.5, d));
        if (u_is_spec > 0.5) col = vec3(grid, 1.0 - grid * 0.5, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'circuitry',
    name: 'Neural Grid',
    category: 'Technology',
    description: 'Complex orthogonal circuitry paths.',
    uniforms: [
      { id: 'u_scale', name: 'Complexity', type: 'float', min: 1, max: 20, default: 8 },
      { id: 'u_thickness', name: 'Trace Width', type: 'float', min: 0.01, max: 0.2, default: 0.04 },
      { id: 'u_color', name: 'Trace Color', type: 'color', default: [0.0, 1.0, 0.5] }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_scale;
      uniform float u_thickness;
      uniform vec3 u_color;
      uniform float u_is_spec;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy * u_scale;
        vec2 id = floor(uv);
        vec2 f = fract(uv);
        float h = hash(id);
        float line = 0.0;
        if (h < 0.25) line = smoothstep(u_thickness, 0.0, abs(f.x - 0.5));
        else if (h < 0.5) line = smoothstep(u_thickness, 0.0, abs(f.y - 0.5));
        else if (h < 0.75) line = smoothstep(u_thickness, 0.0, abs(f.x - f.y));
        else line = smoothstep(u_thickness, 0.0, abs(f.x + f.y - 1.0));
        vec3 col = u_color * line;
        if (u_is_spec > 0.5) col = vec3(line, 1.0 - line * 0.8, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'digital-rain',
    name: 'Data Streams',
    category: 'Technology',
    description: 'Falling digital code fragments.',
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 5, max: 100, default: 40 },
      { id: 'u_speed', name: 'Flow Speed', type: 'float', min: 0.1, max: 5.0, default: 1.0 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_scale;
      uniform float u_speed;
      uniform float u_is_spec;

      float hash(float n) { return fract(sin(n) * 43758.5453); }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float x = floor(uv.x * u_scale);
        float y = uv.y + u_time * u_speed * (0.5 + hash(x));
        float val = fract(y * 10.0 + hash(x));
        val = step(0.8, val) * hash(x + floor(y * 10.0));
        vec3 col = vec3(0.0, val, 0.0);
        if (u_is_spec > 0.5) col = vec3(0.0, 1.0 - val, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'triangle-mesh',
    name: 'Prism Overload',
    category: 'Geometric',
    description: 'Aggressive sharp-edged triangular grid.',
    uniforms: [
      { id: 'u_scale', name: 'Scale', type: 'float', min: 2, max: 40, default: 12 },
      { id: 'u_seed', name: 'Seed', type: 'float', min: 0, max: 100, default: 1 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_scale;
      uniform float u_seed;
      uniform float u_is_spec;

      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233) + u_seed)) * 43758.5453); }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy * u_scale;
        vec2 p = floor(uv);
        vec2 f = fract(uv);
        float h = hash(p + step(f.y, f.x));
        vec3 col = vec3(h);
        if (u_is_spec > 0.5) col = vec3(h * 0.5, 0.8 + h * 0.2, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'checker-v2',
    name: 'Velocity Warp',
    category: 'Racing',
    description: 'Dynamic warped checkerboard for speed effects.',
    uniforms: [
      { id: 'u_scale', name: 'Density', type: 'float', min: 1, max: 20, default: 8 },
      { id: 'u_warp', name: 'Warp Intensity', type: 'float', min: 0, max: 1, default: 0.5 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_scale;
      uniform float u_warp;
      uniform float u_is_spec;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.x += sin(uv.y * 5.0) * u_warp * 0.2;
        vec2 st = floor(uv * u_scale);
        float check = mod(st.x + st.y, 2.0);
        vec3 col = vec3(check);
        if (u_is_spec > 0.5) col = vec3(0.0, 1.0 - check * 0.5, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'liquid-flow',
    name: 'Aero Flow',
    category: 'Organic',
    description: 'Smooth flowing lines mimicking air resistance.',
    uniforms: [
      { id: 'u_scale', name: 'Flow Lines', type: 'float', min: 1, max: 50, default: 20 },
      { id: 'u_speed', name: 'Animation', type: 'float', min: 0, max: 10, default: 1 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_scale;
      uniform float u_speed;
      uniform float u_is_spec;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float flow = sin(uv.x * u_scale + sin(uv.y * 3.0 + u_time * u_speed));
        float mask = smoothstep(0.1, 0.0, abs(flow));
        vec3 col = vec3(mask);
        if (u_is_spec > 0.5) col = vec3(0.0, 1.0 - mask, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'halftone',
    name: 'Retro Halftone',
    category: 'Utility',
    description: 'Comic-style dot patterns for vintage liveries.',
    uniforms: [
      { id: 'u_scale', name: 'Dot Size', type: 'float', min: 10, max: 200, default: 80 },
      { id: 'u_smooth', name: 'Softness', type: 'float', min: 0, max: 1, default: 0.1 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_scale;
      uniform float u_smooth;
      uniform float u_is_spec;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 st = fract(uv * u_scale) - 0.5;
        float d = length(st);
        float mask = smoothstep(0.4, 0.4 - u_smooth, d);
        vec3 col = vec3(mask);
        if (u_is_spec > 0.5) col = vec3(0.0, 1.0 - mask * 0.3, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'sunburst',
    name: 'Apex Sunburst',
    category: 'Racing',
    description: 'Radiating rays focused from a central point.',
    uniforms: [
      { id: 'u_rays', name: 'Ray Count', type: 'float', min: 4, max: 100, default: 32 },
      { id: 'u_color', name: 'Ray Color', type: 'color', default: [1.0, 0.8, 0.0] }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_rays;
      uniform vec3 u_color;
      uniform float u_is_spec;

      void main() {
        vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;
        float angle = atan(uv.y, uv.x);
        float ray = step(0.5, fract(angle * u_rays / 6.2831));
        vec3 col = u_color * ray;
        if (u_is_spec > 0.5) col = vec3(ray * 0.4, 1.0 - ray * 0.2, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'diamond-plate',
    name: 'Industrial Base',
    category: 'Geometric',
    description: 'Heavy duty metal tread pattern.',
    uniforms: [
      { id: 'u_scale', name: 'Tread Size', type: 'float', min: 5, max: 50, default: 15 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_scale;
      uniform float u_is_spec;

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy * u_scale;
        vec2 p = fract(uv) - 0.5;
        vec2 id = floor(uv);
        if (mod(id.x + id.y, 2.0) > 0.5) p = vec2(p.y, p.x);
        float d = smoothstep(0.1, 0.08, abs(p.x)) * smoothstep(0.3, 0.25, abs(p.y));
        vec3 col = vec3(0.2 + d * 0.3);
        if (u_is_spec > 0.5) col = vec3(0.9, 0.1 + d * 0.1, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  },
  {
    id: 'glitch-line',
    name: 'Corrupted Signal',
    category: 'Technology',
    description: 'Horizontally displaced glitch artifacts.',
    uniforms: [
      { id: 'u_intensity', name: 'Glitch Level', type: 'float', min: 0, max: 1, default: 0.5 },
      { id: 'u_speed', name: 'Frequency', type: 'float', min: 0, max: 20, default: 5 }
    ],
    shader: `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_intensity;
      uniform float u_speed;
      uniform float u_is_spec;

      float hash(float n) { return fract(sin(n) * 43758.5453); }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        float h = hash(floor(uv.y * 50.0) + floor(u_time * u_speed));
        float shift = step(0.9 - u_intensity * 0.5, h) * (h - 0.5) * 0.2;
        uv.x += shift;
        float pattern = step(0.5, hash(floor(uv.x * 100.0) + h * 10.0));
        vec3 col = vec3(pattern);
        if (u_is_spec > 0.5) col = vec3(pattern * 0.2, 0.9, 1.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `
  }
];

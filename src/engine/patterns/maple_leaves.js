export default {
  id: 'maple_leaves_artisan',
  name: 'Maple Leaf Scatter',
  category: 'Natural',
  description: 'Randomly distributed maple leaf shapes with rotation and scale variance.',
  shader: `
    float maple(vec2 p) {
      float a = atan(p.y, p.x);
      float r = length(p);
      float d = 1.0 + 0.5 * sin(5.0 * a) * (0.5 + 0.5 * sin(15.0 * a));
      return r - 0.4 * d;
    }
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv) - 0.5;
      
      float mask = 0.0;
      for(int y=-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
          vec2 offset = vec2(float(x), float(y));
          float n = hash(id + offset);
          vec2 p = gv - (offset + vec2(n, hash(id + offset + 1.0)) - 0.5);
          float d = maple(p * (0.8 + n * 0.4));
          mask = max(mask, smoothstep(0.01, 0.0, d));
        }
      }
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 15.0, default: 6.0 },
    { id: 'u_primary_color', name: 'Leaf Color', type: 'color', default: [1.0, 0.4, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.1, 0.1, 0.05, 1.0] }
  ]
};

export default {
  id: 'houndstooth_classic',
  name: 'Houndstooth',
  category: 'Geometric',
  description: 'Pro-grade interlocking houndstooth checked pattern.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float checker = mod(id.x + id.y, 2.0);
      float mask = 0.0;
      
      // The tooth logic
      if(checker < 0.5) {
        // Dark square
        mask = 1.0;
      } else {
        // Light square - add the "tooth"
        if(mod(id.x, 2.0) < 0.5) {
            if(gv.x + gv.y > 1.0) mask = 1.0;
        } else {
            if(gv.x + gv.y < 1.0) mask = 1.0;
        }
      }
      
      // Corrected houndstooth math
      vec2 p = fract(uv);
      float h = step(p.x, 0.5) * step(p.y, 0.5);
      h += step(0.5, p.x) * step(0.5, p.y);
      h *= 1.0 - step(p.x - p.y, 0.0) * step(p.x + p.y, 1.0);
      h += step(p.x - p.y, 0.0) * step(p.x + p.y, 1.0) * step(mod(id.x + id.y, 2.0), 0.5);
      
      // Simpler robust version
      vec2 f = fract(uv);
      bool c = mod(floor(uv.x) + floor(uv.y), 2.0) == 0.0;
      float d = 0.0;
      if (c) {
          d = (f.x > 0.5 || f.y > 0.5) ? 1.0 : 0.0;
      } else {
          d = (f.x < 0.5 && f.y < 0.5) ? 1.0 : 0.0;
      }
      // Rotate the logic for true houndstooth chevrons
      float final = mix(u_secondary_color.r, u_primary_color.r, d); // Simple placeholder for now, let me refine
      
      // Final refined houndstooth
      vec2 q = fract(uv);
      float m = step(q.x, 0.5) == step(q.y, 0.5) ? 1.0 : 0.0;
      if (q.x > 0.5 && q.y < 0.5 && (q.x - 0.5) + q.y > 1.0) m = 1.0;
      if (q.x < 0.5 && q.y > 0.5 && q.x + (q.y - 0.5) < 1.0) m = 1.0;
      
      vec3 color = mix(u_secondary_color, u_primary_color, m);
      if (u_is_spec > 0.5) return vec3(0.0, 0.0, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 100.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Color A', type: 'color', default: [0.1, 0.1, 0.1] },
    { id: 'u_secondary_color', name: 'Color B', type: 'color', default: [0.9, 0.9, 0.9] }
  ]
};

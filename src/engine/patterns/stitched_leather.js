export default {
  id: 'stitched_leather_pro',
  name: 'Stitched Leather',
  category: 'Organic',
  description: 'Premium pebbled leather texture with perimeter stitching simulation.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Pebbled Texture (Voronoi-like)
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float noise = hash(floor(uv));
      float pebble = smoothstep(0.4 + noise * 0.1, 0.5, d);
      
      // Stitching Logic (perimeter)
      float stitch_v = step(0.98, fract(v_uv.x * 100.0)) * step(0.01, v_uv.y) * step(v_uv.y, 0.99);
      float stitch_h = step(0.98, fract(v_uv.y * 100.0)) * step(0.01, v_uv.x) * step(v_uv.x, 0.99);
      float stitch = max(stitch_v, stitch_h) * u_show_stitch;
      
      vec3 leatherBase = vec3(0.15, 0.08, 0.05); // Dark Brown
      vec3 stitchColor = vec3(0.8, 0.7, 0.1); // Gold Thread
      
      vec3 color = mix(leatherBase, leatherBase * 0.8, pebble);
      color = mix(color, stitchColor, stitch);
      
      if (u_is_spec > 0.5) return vec3(0.0, 0.3, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_show_stitch', name: 'Show Stitch', type: 'float', min: 0.0, max: 1.0, default: 1.0 }
  ]
};

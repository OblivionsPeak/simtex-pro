export default {
  id: 'stitched_leather_pro',
  name: 'Stitched Leather',
  category: 'Organic',
  description: 'Premium pebbled leather texture with perimeter stitching simulation.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float pebble = smoothstep(0.4, 0.5, d);
      
      float stitch_v = step(0.98, fract(v_uv.x * 100.0)) * step(0.01, v_uv.y) * step(v_uv.y, 0.99);
      float stitch_h = step(0.98, fract(v_uv.y * 100.0)) * step(0.01, v_uv.x) * step(v_uv.x, 0.99);
      float stitch = max(stitch_v, stitch_h) * u_show_stitch;
      
      vec4 leather = vec4(0.15, 0.08, 0.05, 1.0);
      vec4 thread = vec4(0.8, 0.7, 0.1, 1.0);
      
      vec4 color = mix(leather, leather * 0.8, pebble);
      return mix(color, thread, stitch);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_show_stitch', name: 'Show Stitch', type: 'float', min: 0.0, max: 1.0, default: 1.0 }
  ]
};

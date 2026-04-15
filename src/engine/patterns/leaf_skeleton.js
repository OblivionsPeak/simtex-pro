export default {
  id: 'leaf_skeleton_pro',
  name: 'Leaf Skeleton',
  category: 'Natural',
  description: 'Technical vein structure mimicking a decaying leaf skeleton.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float mask = step(0.95, hash(id + gv.x * 0.1));
      mask += step(0.98, max(gv.x, gv.y));
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Vein Detail', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_primary_color', name: 'Vein Color', type: 'color', default: [0.95, 0.95, 0.9, 1.0] },
    { id: 'u_secondary_color', name: 'Void Space', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

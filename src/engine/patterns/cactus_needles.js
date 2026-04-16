export default {
  id: 'cactus_needles_artisan',
  name: 'Cactus Spine',
  category: 'Nature',
  description: 'Geometric star-cluster spines found on high-fidelity xerophytic vegetation.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 gv = fract(uv) - 0.5;
      float angle = atan(gv.y, gv.x);
      float star = step(0.9, sin(angle * 8.0));
      float d = length(gv);
      float mask = star * step(d, 0.4) * step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Spine Clusters', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Sharp Needle', type: 'color', default: [0.9, 0.9, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Cactus Base', type: 'color', default: [0.2, 0.4, 0.1, 1.0] }
  ]
};

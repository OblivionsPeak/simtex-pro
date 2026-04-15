export default {
  id: 'voronoi_cells_pro',
  name: 'Voronoi Cells',
  category: 'Abstract',
  description: 'Mathematical fractured cell structures often found in biological and geological formations.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec2 hash2(vec2 p) {
      return vec2(hash(p), hash(p + 1.0));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv);
      
      float minDist = 1.0;
      for(int y=-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
          vec2 offset = vec2(float(x), float(y));
          vec2 p = hash2(id + offset);
          float d = length(gv - (offset + p));
          minDist = min(minDist, d);
        }
      }
      
      float mask = smoothstep(0.0, 1.0, minDist);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cell Count', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Cell Center', type: 'color', default: [0.2, 0.2, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Cell Border', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

export default {
  id: 'diamond_plate_pro',
  name: 'Diamond Plate',
  category: 'Industrial',
  description: 'Classic anti-slip safety metal floor texture.',
  shader: `
    float diamond(vec2 p) {
      p = abs(p);
      return max(p.x * 2.5, p.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      if (mod(id.x + id.y, 2.0) > 0.5) uv.x += 0.5;
      
      vec2 gv = fract(uv) - 0.5;
      float d = diamond(gv);
      float mask = smoothstep(0.4, 0.35, d);
      
      // Metal highlights
      float highlight = smoothstep(0.3, 0.35, d) * 0.2;
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb += highlight;
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Plate Scale', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Diamond Face', type: 'color', default: [0.7, 0.7, 0.72, 1.0] },
    { id: 'u_secondary_color', name: 'Plate Base', type: 'color', default: [0.4, 0.4, 0.42, 1.0] }
  ]
};

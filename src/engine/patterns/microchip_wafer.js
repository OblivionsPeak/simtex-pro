export default {
  id: 'microchip_wafer_pro',
  name: 'Microchip Die',
  category: 'Technology',
  description: 'High-density silicon wafer etching with localized circuit density.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 id = floor(v_uv * u_scale);
      vec2 gv = fract(v_uv * u_scale);
      
      float n = hash(id);
      float mask = step(0.8, n);
      
      // Sub-divisions
      if (n > 0.4) {
        vec2 gv2 = fract(gv * 4.0);
        mask += step(0.9, max(gv2.x, gv2.y)) * 0.5;
      }
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Wafer Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Etched Metal', type: 'color', default: [0.7, 0.7, 0.75, 1.0] },
    { id: 'u_secondary_color', name: 'Silicon', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

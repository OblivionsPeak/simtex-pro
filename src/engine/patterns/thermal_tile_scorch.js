export default {
  id: 'thermal_tile_scorch_artisan',
  name: 'Thermal Tile Scorch',
  category: 'Industrial',
  added: '2026-05-13',
  description: 'Heat-ablated spacecraft tiles showing directional plasma scorch marks and edge wear.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000 * noise(p); p *= 2.02;
      f += 0.2500 * noise(p); p *= 2.03;
      f += 0.1250 * noise(p); p *= 2.01;
      f += 0.0625 * noise(p);
      return f;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv);
      
      // Tile borders
      float border = smoothstep(0.95, 1.0, gv.x) + smoothstep(0.05, 0.0, gv.x) + 
                     smoothstep(0.95, 1.0, gv.y) + smoothstep(0.05, 0.0, gv.y);
      border = clamp(border, 0.0, 1.0);
      
      // Directional Scorch (stretched noise along Y)
      vec2 scorchUV = vec2(v_uv.x * u_scale * 0.5, v_uv.y * u_scale * 5.0);
      float scorchNoise = fbm(scorchUV + vec2(hash(id)*5.0, 0.0)); // offset per tile
      
      // Focus scorch on trailing edge of tile (top edge)
      float scorchMask = scorchNoise * smoothstep(0.3, 1.0, gv.y);
      
      // Micro-fractures
      float crack = smoothstep(0.6, 0.8, fbm(uv * 5.0)) * border;
      
      vec4 tileColor = mix(u_tile_color, u_scorch_color, scorchMask * 1.5);
      vec4 finalColor = mix(tileColor, vec4(0.0,0.0,0.0,1.0), border); // Dark grout
      return mix(finalColor, u_scorch_color, crack); // Wear on edges
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tile Scale', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_tile_color', name: 'Clean Tile', type: 'color', default: [0.85, 0.85, 0.8, 1.0] },
    { id: 'u_scorch_color', name: 'Plasma Scorch', type: 'color', default: [0.15, 0.1, 0.08, 1.0] }
  ]
};

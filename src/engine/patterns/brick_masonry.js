export default {
  id: 'brick_masonry_artisan',
  name: 'Classic Bricks',
  category: 'Industrial',
  description: 'Staggered rectangular masonry with structural mortar joints.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      
      vec2 gv = fract(uv);
      float mask = step(0.05, gv.x) * step(gv.x, 0.95) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rows', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Brick', type: 'color', default: [0.7, 0.2, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Mortar', type: 'color', default: [0.4, 0.4, 0.4, 1.0] }
  ]
};

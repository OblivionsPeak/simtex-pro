export default {
  id: 'herringbone_weave_pro',
  name: 'Herringbone',
  category: 'Geometric',
  description: 'Pro-grade chevron-style herringbone weave pattern.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      // Staggered grid for herringbone
      if (mod(floor(uv.x), 2.0) == 0.0) uv.y += 0.5;
      
      vec2 gv = fract(uv);
      float mask = step(0.5, abs(gv.x - gv.y));
      
      vec3 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec3(0.0, 0.0, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Size', type: 'float', min: 2.0, max: 100.0, default: 20.0 }
  ]
};

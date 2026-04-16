export default {
  id: 'headliner_mesh_artisan',
  name: 'Headliner Mesh',
  category: 'Racing',
  description: 'Breathable ceiling textile with hexagonal micro-pores found in modern automotive interiors.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pore Density', type: 'float', min: 20.0, max: 200.0, default: 100.0 },
    { id: 'u_primary_color', name: 'Textile Surface', type: 'color', default: [0.2, 0.2, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Pore Shade', type: 'color', default: [0.05, 0.05, 0.1, 1.0] }
  ]
};

export default {
  id: 'nanotech_cells_artisan',
  name: 'Nano Plating',
  category: 'Technology',
  description: 'Microscopic hexagonal active plating designed for dynamic aerodynamic surfaces.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Nano Zoom', type: 'float', min: 10.0, max: 100.0, default: 60.0 },
    { id: 'u_primary_color', name: 'Plate Surface', type: 'color', default: [0.15, 0.15, 0.18, 1.0] },
    { id: 'u_secondary_color', name: 'Nano Joint', type: 'color', default: [0.0, 0.8, 1.0, 1.0] }
  ]
};

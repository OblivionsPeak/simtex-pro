export default {
  id: 'server_rack_mesh_artisan',
  name: 'Server Mesh',
  category: 'Industrial',
  description: 'Industrial perforated metal mesh found on high-density enterprise server racks.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.45, 0.42, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Mesh Zoom', type: 'float', min: 10.0, max: 100.0, default: 50.0 },
    { id: 'u_primary_color', name: 'Steel Rack', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Internal Shadow', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

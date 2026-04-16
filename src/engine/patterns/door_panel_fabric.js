export default {
  id: 'door_panel_fabric_artisan',
  name: 'Panel Fabric',
  category: 'Racing',
  description: 'Coarse interior textile weave found in lightweight door cards and racing interiors.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x * 2.0) * sin(uv.y * 2.0);
      float mask = smoothstep(-0.2, 0.2, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Size', type: 'float', min: 50.0, max: 300.0, default: 150.0 },
    { id: 'u_primary_color', name: 'Fiber Grain', type: 'color', default: [0.3, 0.3, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Fabric Base', type: 'color', default: [0.15, 0.15, 0.2, 1.0] }
  ]
};

export default {
  id: 'mushroom_gills_artisan',
  name: 'Fungi Gills',
  category: 'Nature',
  description: 'Radiant organic ridges found on the underside of exotic fungal caps.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float gills = sin(angle * u_scale);
      float mask = step(0.0, gills);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Gill Count', type: 'float', min: 20.0, max: 200.0, default: 80.0 },
    { id: 'u_primary_color', name: 'Gill Ridge', type: 'color', default: [0.8, 0.75, 0.7, 1.0] },
    { id: 'u_secondary_color', name: 'Cap Depth', type: 'color', default: [0.4, 0.35, 0.3, 1.0] }
  ]
};

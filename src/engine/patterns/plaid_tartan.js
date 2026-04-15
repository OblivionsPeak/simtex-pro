export default {
  id: 'plaid_tartan_artisan',
  name: 'Plaid Tartan',
  category: 'Abstract',
  description: 'Multi-colored interlocking textile grid found in classic Scottish kilts.',
  shader: `
    vec4 generate() {
      float hor = step(0.7, fract(v_uv.x * u_scale)) * 0.5;
      float ver = step(0.7, fract(v_uv.y * u_scale)) * 0.5;
      return mix(u_secondary_color, u_primary_color, hor + ver);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grid Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Stripe', type: 'color', default: [1.0, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Base Wool', type: 'color', default: [0.0, 0.2, 0.1, 1.0] }
  ]
};

export default {
  id: 'piston_top_artisan',
  name: 'Piston Head',
  category: 'Utility',
  description: 'Concentric rings of machined high-performance aluminum with heat seasoning.',
  shader: `
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Ring Density', type: 'float', min: 100.0, max: 1000.0, default: 500.0 },
    { id: 'u_primary_color', name: 'Alloy High', type: 'color', default: [0.8, 0.8, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Alloy Deep', type: 'color', default: [0.6, 0.6, 0.65, 1.0] }
  ]
};

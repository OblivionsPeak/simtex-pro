export default {
  id: 'quantum_foam_artisan',
  name: 'Quantum Foam',
  category: 'Experimental',
  description: 'Abstract probability interference and grain noise mimicking fluctuations at the Planck scale.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 1.1);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Planck Resolution', type: 'float', min: 100.0, max: 1000.0, default: 500.0 },
    { id: 'u_primary_color', name: 'Fluctuation', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Vacuum', type: 'color', default: [0.0, 0.0, 0.05, 1.0] }
  ]
};

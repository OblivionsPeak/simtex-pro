export default {
  id: 'peat_moss_artisan',
  name: 'Peat Moss',
  category: 'Natural',
  added: '2026-04-16',
  description: 'Dense organic clumpy sprawl mimicking professional landscape and high-fidelity vegetation.',
  shader: `
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Moss Density', type: 'float', min: 20.0, max: 200.0, default: 80.0 },
    { id: 'u_primary_color', name: 'Moss High', type: 'color', default: [0.3, 0.4, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Moss Deep', type: 'color', default: [0.1, 0.15, 0.05, 1.0] }
  ]
};

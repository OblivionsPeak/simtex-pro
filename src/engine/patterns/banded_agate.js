export default {
  id: 'banded_agate_artisan',
  name: 'Banded Agate',
  category: 'Geology',
  description: 'Concentric mineral rings and gemstone strata found in polished agate slices.',
  shader: `
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Band Density', type: 'float', min: 20.0, max: 200.0, default: 80.0 },
    { id: 'u_primary_color', name: 'Gemstone Top', type: 'color', default: [0.4, 0.2, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Mineral Deep', type: 'color', default: [0.2, 0.1, 0.3, 1.0] }
  ]
};

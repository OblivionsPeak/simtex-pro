export default {
  id: 'volcanic_basalt_artisan',
  name: 'Basalt Pillar',
  category: 'Geology',
  description: 'Pitted, geometric volcanic rock found in hexagonal basalt formations.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pillar Scale', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Rock Face', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Pillar Joint', type: 'color', default: [0.0, 0.0, 0.05, 1.0] }
  ]
};

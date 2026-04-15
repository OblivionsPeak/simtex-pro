export default {
  id: 'twill_carbon_pro',
  name: 'Pro Twill Carbon',
  category: 'Racing',
  description: 'Classic high-detail 2x2 carbon fiber weave.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      float checker = mod(id.x + id.y, 2.0);
      float pattern = step(0.5, abs(gv.x - gv.y));
      if (checker > 0.5) pattern = 1.0 - pattern;
      return mix(u_secondary_color, u_primary_color, pattern);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Size', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.12, 0.12, 0.12, 1.0] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

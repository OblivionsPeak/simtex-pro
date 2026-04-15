export default {
  id: 'twill_carbon_2x2',
  name: 'Twill Carbon 2x2',
  category: 'Racing',
  description: 'Classic 2x2 weave carbon fiber pattern.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      float checker = mod(id.x + id.y, 2.0);
      float pattern = step(0.5, abs(gv.x - gv.y));
      if (checker > 0.5) pattern = 1.0 - pattern;
      vec3 color = mix(u_secondary_color, u_primary_color, pattern);
      if (u_is_spec > 0.5) return vec3(1.0, 0.3, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale', type: 'float', min: 5.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Primary', type: 'color', default: [0.15, 0.15, 0.15] },
    { id: 'u_secondary_color', name: 'Secondary', type: 'color', default: [0.08, 0.08, 0.08] }
  ]
};

export default {
  id: 'circuit_path_ultra',
  name: 'Ultra Circuitry',
  category: 'Technology',
  description: 'Complex micro-electronics logic gates.',
  shader: `
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 g = fract(uv);
      vec2 id = floor(uv);
      float n = fract(sin(id.x * 12.3 + id.y * 45.6) * 78.9);
      float lines = step(0.48, g.x) + step(0.48, g.y);
      if (n > 0.5) lines += step(0.2, length(g-0.5));
      vec3 color = mix(u_secondary_color, u_primary_color, clamp(lines,0.0,1.0));
      if (u_is_spec > 0.5) return vec3(0.3, 0.1, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Complexity', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Trace', type: 'color', default: [0.0, 1.0, 0.8] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.01, 0.02, 0.05] }
  ]
};

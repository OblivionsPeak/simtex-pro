export default {
  id: 'topographic_pro',
  name: 'Topographic Map',
  category: 'Abstract',
  added: '2026-04-15',
  description: 'Technical contour lines mimicking elevation mapping.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float line = fract(n * u_layers);
      float mask = step(0.9, line);
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.1, 0.4, 1.0, 1.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Territory Size', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_layers', name: 'Contour Detail', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Line Color', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Land Color', type: 'color', default: [0.1, 0.1, 0.1, 1.0] }
  ]
};

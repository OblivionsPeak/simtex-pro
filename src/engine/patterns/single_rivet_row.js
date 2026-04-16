export default {
  id: 'single_rivet_line_artisan',
  name: 'Single Rivet Row',
  category: 'Industrial',
  description: 'A single linear row of industrial rivets for precision panel seams.',
  shader: `
    vec4 generate() {
      // Create a vertical center mask
      float rowMask = step(0.45, v_uv.y) * step(v_uv.y, 0.55);
      
      // Spacing on X axis
      vec2 g = fract(v_uv * vec2(u_scale, 1.0)) - 0.5;
      float d = length(vec2(g.x, (v_uv.y - 0.5) * 10.0)); // Adjusted vertical scale for roundness
      
      float rivet = smoothstep(0.4, 0.35, d);
      float shadow = smoothstep(0.45, 0.4, d);
      
      vec4 col = mix(u_secondary_color, u_primary_color, rivet);
      return mix(col, vec4(0.0, 0.0, 0.0, 1.0), (shadow - rivet) * 0.5);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rivet Count', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Rivet Head', type: 'color', default: [0.7, 0.7, 0.75, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.3, 0.3, 0.32, 1.0] }
  ]
};

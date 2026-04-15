export default {
  id: 'infinite_spiral_pro',
  name: 'Infinite Spiral',
  category: 'Abstract',
  description: 'Mathematical spirograph with static interlocking floral loops.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float r = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Removed time from spiral function
      float spiral = sin(r * 10.0 - a * 5.0);
      float mask = smoothstep(0.0, 0.1, abs(spiral) - 0.1);
      
      return mix(u_secondary_color, u_primary_color, 1.0 - mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Spiral Power', type: 'float', min: 1.0, max: 10.0, default: 5.0 },
    { id: 'u_primary_color', name: 'Ink Color', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

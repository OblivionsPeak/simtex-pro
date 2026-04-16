export default {
  id: 'safety_harness_artisan',
  name: 'Safety Harness',
  category: 'Racing',
  description: 'Heavy-duty nylon web weave found in 5-point and 6-point racing harnesses.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * 40.0;
      float lines = sin(uv.x) * sin(uv.y * 5.0);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Nylon Web', type: 'color', default: [0.5, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Weave Gap', type: 'color', default: [0.1, 0.0, 0.0, 1.0] }
  ]
};

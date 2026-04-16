export default {
  id: 'pcb_traces_v3_artisan',
  name: 'Pro PCB Logic',
  category: 'Technology',
  description: 'Triple-layer circuit logic with advanced bus-routing and microscopic trace detail.',
  shader: `
    vec4 generate() {
      float lines = sin(v_uv.x * 400.0) * sin(v_uv.y * 400.0);
      float mask = step(0.1, abs(lines));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Trace Copper', type: 'color', default: [1.0, 0.6, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Substrate', type: 'color', default: [0.0, 0.15, 0.05, 1.0] }
  ]
};

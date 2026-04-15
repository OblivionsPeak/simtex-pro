export default {
  id: 'circuit_traces_pro',
  name: 'Circuit Traces',
  category: 'Technology',
  description: 'Pro-grade PCB layout with branching traces and circular nodes.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float n = hash(id);
      float mask = 0.0;
      
      // Horizontal traces
      if (n > 0.5) mask += step(0.45, gv.y) * step(gv.y, 0.55);
      // Vertical traces
      if (hash(id + 1.0) > 0.5) mask += step(0.45, gv.x) * step(gv.x, 0.55);
      
      // Nodes
      float d = length(gv - 0.5);
      if (n > 0.8) mask += smoothstep(0.2, 0.15, d);
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Logic Density', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_primary_color', name: 'Trace Color', type: 'color', default: [0.0, 0.8, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Substrate', type: 'color', default: [0.02, 0.05, 0.02, 1.0] }
  ]
};

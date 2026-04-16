export default {
  id: 'cyber_twill_artisan',
  name: 'Cyber Twill',
  category: 'Technology',
  description: 'Advanced glowing-edge carbon fiber weave for high-performance cybernetic components.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Weave Zoom', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Glow Edge', type: 'color', default: [0.0, 1.0, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Carbon Body', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

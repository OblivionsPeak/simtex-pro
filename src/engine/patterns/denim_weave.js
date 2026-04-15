export default {
  id: 'denim_weave_artisan',
  name: 'Denim Fabric',
  category: 'Abstract',
  description: 'Iconic indigo-stained twill weave with micro-directional thread noise.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float twill = sin((uv.x + uv.y) * 20.0);
      float noise = hash(v_uv * 500.0) * 0.2;
      float mask = step(0.0, twill + noise);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Twill Zoom', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Fade Blue', type: 'color', default: [0.3, 0.4, 0.6, 1.0] },
    { id: 'u_secondary_color', name: 'Indigo Deep', type: 'color', default: [0.1, 0.15, 0.3, 1.0] }
  ]
};

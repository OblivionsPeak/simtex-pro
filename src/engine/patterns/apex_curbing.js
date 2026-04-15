export default {
  id: 'apex_curbing_artisan',
  name: 'Track Curbing',
  category: 'Racing',
  description: 'Classic circuit apex curbing with tire wear marks.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x));
      float wear = hash(v_uv * 10.0) * 0.2;
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= wear;
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Curb Count', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Color A', type: 'color', default: [0.8, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Color B', type: 'color', default: [1.0, 1.0, 1.0, 1.0] }
  ]
};

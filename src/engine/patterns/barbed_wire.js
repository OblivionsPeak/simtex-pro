export default {
  id: 'barbed_wire_artisan',
  name: 'Barbed Wire',
  category: 'Industrial',
  description: 'Twisted metal strands and sharp interlocking barbs for security motifs.',
  shader: `
    vec4 generate() {
      float wire = abs(sin(v_uv.y * 50.0 + v_uv.x * 10.0));
      float barb = step(0.95, fract(v_uv.x * 10.0)) * step(0.9, wire);
      float mask = smoothstep(0.1, 0.0, wire - 0.1) + barb;
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Steel', type: 'color', default: [0.6, 0.6, 0.65, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.1, 0.1, 0.1, 0.0] }
  ]
};

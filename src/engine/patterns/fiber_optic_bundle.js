export default {
  id: 'fiber_optic_bundle_artisan',
  name: 'Fiber Bundle',
  category: 'Technology',
  description: 'Glowing bundles of light-conducting strands found in high-speed data transmission systems.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float n = hash(vec2(y, y));
      float strand = step(0.1, fract(v_uv.x * 5.0 + n));
      return mix(u_secondary_color, u_primary_color, strand);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Strand Density', type: 'float', min: 20.0, max: 200.0, default: 80.0 },
    { id: 'u_primary_color', name: 'Optic Glow', type: 'color', default: [0.2, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Dark Cladding', type: 'color', default: [0.0, 0.05, 0.1, 1.0] }
  ]
};

export default {
  id: 'digital_camo_v2_artisan',
  name: 'Ghost Camo',
  category: 'Racing',
  description: 'Advanced multi-scale digital camouflage with low-visibility spectral patterns.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      float n = hash(floor(v_uv * 10.0)) + hash(floor(v_uv * 40.0)) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Camo High', type: 'color', default: [0.3, 0.3, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Camo Deep', type: 'color', default: [0.1, 0.1, 0.12, 1.0] }
  ]
};

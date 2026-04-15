export default {
  id: 'forest_litter_artisan',
  name: 'Forest Litter',
  category: 'Natural',
  description: 'Dense organic debris and varying leaf shapes found on a forest floor.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float d = length(fract(uv) - 0.5);
      float mask = smoothstep(0.4, 0.1, d * (0.8 + n * 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Debris Density', type: 'float', min: 2.0, max: 20.0, default: 12.0 },
    { id: 'u_primary_color', name: 'Leaf Dust', type: 'color', default: [0.4, 0.3, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Soil', type: 'color', default: [0.1, 0.08, 0.05, 1.0] }
  ]
};

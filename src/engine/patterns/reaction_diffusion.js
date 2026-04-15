export default {
  id: 'reaction_diffusion_artisan',
  name: 'Reaction Diffusion',
  category: 'Experimental',
  description: 'Organic biological growth and coral-like patterns mimicking chemical morphogenesis.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      n = abs(sin(n * 20.0));
      float mask = smoothstep(0.4, 0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Growth Scale', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_primary_color', name: 'Organism', type: 'color', default: [0.8, 0.4, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Substrate', type: 'color', default: [0.1, 0.05, 0.0, 1.0] }
  ]
};

export default {
  id: 'nebula_dust_artisan',
  name: 'Nebula Dust',
  category: 'Natural',
  description: 'Soft, colored organic dust clouds found in interstellar gas formations.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      n += noise(v_uv * u_scale * 2.0) * 0.5;
      float mask = smoothstep(0.2, 0.8, n / 1.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Gas Density', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_primary_color', name: 'Ionized Gas', type: 'color', default: [0.6, 0.1, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Vacuum', type: 'color', default: [0.0, 0.0, 0.05, 1.0] }
  ]
};

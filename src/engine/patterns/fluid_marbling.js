export default {
  id: 'fluid_marbling_pro',
  name: 'Fluid Marbling',
  category: 'Abstract',
  description: 'Organic static liquid flow with colorful mineral-like marbling.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offsets
      float n = noise(uv);
      float n2 = noise(uv * 2.0 - n);
      float mask = smoothstep(0.3, 0.7, n * 0.5 + n2 * 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flow Scale', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_primary_color', name: 'Mineral A', type: 'color', default: [0.4, 0.1, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Mineral B', type: 'color', default: [0.1, 0.4, 0.5, 1.0] }
  ]
};

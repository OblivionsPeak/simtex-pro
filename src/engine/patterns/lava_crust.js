export default {
  id: 'lava_crust_pro',
  name: 'Lava Crust',
  category: 'Natural',
  description: 'Static volcanic cooling patterns with high-heat emission cracks.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offset
      float n = noise(uv);
      float mask = smoothstep(0.4, 0.6, n);
      
      vec4 heat = vec4(1.0, 0.2, 0.0, 1.0);
      vec4 rock = vec4(0.1, 0.1, 0.12, 1.0);
      
      return mix(heat, rock, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Flow Intensity', type: 'float', min: 1.0, max: 10.0, default: 4.0 }
  ]
};

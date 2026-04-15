export default {
  id: 'marble_vein_pro',
  name: 'Marbled Stone',
  category: 'Natural',
  description: 'Elegant polished stone with organic mineral veining.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv + noise(uv * 2.0));
      float vein = smoothstep(0.45, 0.5, abs(n - 0.5));
      
      vec3 base = vec3(0.9, 0.9, 0.92);
      vec3 veinColor = vec3(0.2, 0.2, 0.25);
      
      vec3 color = mix(base, veinColor, 1.0 - vein);
      if (u_is_spec > 0.5) return vec3(0.0, 0.1, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Vein Complexity', type: 'float', min: 1.0, max: 10.0, default: 3.0 }
  ]
};

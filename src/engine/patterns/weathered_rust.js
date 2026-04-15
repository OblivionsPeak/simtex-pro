export default {
  id: 'weathered_rust_pro',
  name: 'Weathered Rust',
  category: 'Industrial',
  description: 'Pro-grade oxidizing metallic surface with realistic pitting and oxidation layers.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f*f*(3.0-2.0*f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv);
      float n2 = noise(uv * 2.5 + n1);
      float mask = smoothstep(0.4, 0.6, n1 * 0.5 + n2 * 0.3);
      
      vec4 steel = vec4(0.4, 0.4, 0.42, 1.0);
      vec4 rust = vec4(0.5, 0.2, 0.1, 1.0);
      
      return mix(steel, rust, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rust Intensity', type: 'float', min: 1.0, max: 20.0, default: 5.0 }
  ]
};

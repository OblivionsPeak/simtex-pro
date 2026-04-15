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
    
    vec3 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Multi-layer noise for rust pitting
      float n1 = noise(uv);
      float n2 = noise(uv * 2.5 + n1);
      float n3 = noise(uv * 5.0 + n2);
      
      float rustMask = smoothstep(0.4, 0.6, n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
      float pitting = step(0.8, n3) * 0.2;
      
      vec3 steel = vec3(0.4, 0.4, 0.42);
      vec3 rustBase = vec3(0.4, 0.15, 0.05);
      vec3 rustHighlight = vec3(0.6, 0.3, 0.1);
      
      vec3 rustColor = mix(rustBase, rustHighlight, n2);
      vec3 finalColor = mix(steel, rustColor, rustMask);
      finalColor -= pitting; // Add depth to pitting
      
      if (u_is_spec > 0.5) return vec3(0.1, 0.9, 0.0);
      return finalColor;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rust Intensity', type: 'float', min: 1.0, max: 20.0, default: 5.0 }
  ]
};

export default {
  id: 'bioluminescent_mycelium_artisan',
  name: 'Bioluminescent Mycelium',
  category: 'Organic',
  description: 'Glowing fungal networks pulsing with neon light against a dark, porous substrate.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Background substrate
        float subNoise = noise(uv * 3.0) * 0.5 + noise(uv * 10.0) * 0.25;
        vec4 substrate = mix(u_bg_dark, u_bg_light, subNoise);
        
        // Mycelium network using ridge noise
        float n1 = noise(uv);
        float n2 = noise(uv * 2.0 + vec2(5.2, 1.3));
        float n3 = noise(uv * 4.0 + vec2(1.1, 9.8));
        
        float ridge1 = 1.0 - abs(n1 * 2.0 - 1.0);
        float ridge2 = 1.0 - abs(n2 * 2.0 - 1.0);
        float ridge3 = 1.0 - abs(n3 * 2.0 - 1.0);
        
        float network = pow(ridge1 * ridge2 * ridge3, 2.0) * 5.0;
        
        // Pulse effect
        float pulse = 0.5 + 0.5 * sin(u_time * 2.0 + uv.x + uv.y);
        float glowMask = smoothstep(0.4, 0.8, network) * pulse;
        float coreMask = smoothstep(0.8, 1.0, network);
        
        vec4 finalColor = substrate;
        finalColor = mix(finalColor, u_glow_color, glowMask * 0.8);
        finalColor = mix(finalColor, vec4(1.0,1.0,1.0,1.0), coreMask); // White core
        
        return finalColor;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Network Scale', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_bg_dark', name: 'Substrate Deep', type: 'color', default: [0.05, 0.08, 0.05, 1.0] },
    { id: 'u_bg_light', name: 'Substrate Surface', type: 'color', default: [0.15, 0.2, 0.15, 1.0] },
    { id: 'u_glow_color', name: 'Bioluminescence', type: 'color', default: [0.2, 1.0, 0.5, 1.0] },
    { id: 'u_time', name: 'Pulse Animate', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

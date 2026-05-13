export default {
  id: 'aero_ablative_coating_artisan',
  name: 'Aero-Ablative Coating',
  category: 'Racing',
  description: 'A smooth surface that sheds layers under high velocity, showing directional wind streak lines and gradient wear.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // High frequency stretched noise for streak lines
        vec2 streakUV = vec2(uv.x * 10.0, uv.y * 0.2); 
        float streaks = noise(streakUV);
        streaks += 0.5 * noise(streakUV * 2.0);
        streaks += 0.25 * noise(streakUV * 4.0);
        streaks = streaks / 1.75;
        
        // Macro wear gradient
        float wear = noise(uv * 0.5 + vec2(0.0, u_wear_offset*0.1));
        
        // Combine streaks and wear
        float ablation = smoothstep(0.3, 0.7, streaks * wear);
        
        return mix(u_base_color, u_ablated_color, ablation);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Streak Scale', type: 'float', min: 1.0, max: 20.0, default: 5.0 },
    { id: 'u_base_color', name: 'Pristine Coating', type: 'color', default: [0.9, 0.9, 0.95, 1.0] },
    { id: 'u_ablated_color', name: 'Ablated Core', type: 'color', default: [0.2, 0.2, 0.25, 1.0] },
    { id: 'u_wear_offset', name: 'Wear Offset', type: 'float', min: 0.0, max: 10.0, default: 0.0 }
  ]
};

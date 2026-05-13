export default {
  id: 'molten_tungsten_artisan',
  name: 'Molten Tungsten',
  category: 'Industrial',
  description: 'Superheated, cracked metal surface glowing intensely white-hot in the deep fissures.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    // Cellular noise for cracks
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float res = 8.0;
        for(int j=-1; j<=1; j++)
        for(int i=-1; i<=1; i++) {
            vec2 b = vec2(i, j);
            vec2 r = vec2(b) - f + random2(n + b);
            float d = dot(r, r);
            res = min(res, d);
        }
        return sqrt(res);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Warped uv for organic cracks
        vec2 warpUV = uv + vec2(noise(uv*2.0), noise(uv*2.0 + 5.2)) * 0.5;
        float v = voronoi(warpUV);
        
        // Crisp cracks
        float crack = smoothstep(0.0, 0.05, v);
        
        // Surface cooling noise
        float surfaceNoise = noise(uv * 5.0) * 0.5 + noise(uv * 10.0) * 0.5;
        vec4 coolSurface = mix(u_cool_metal, u_hot_metal, surfaceNoise * 0.5);
        
        // Add glow bloom around cracks
        float bloom = smoothstep(0.3, 0.0, v);
        
        // Heat animation
        float heatPulse = 0.5 + 0.5 * sin(u_time * 2.0 + warpUV.x * 2.0);
        
        vec4 crackGlow = mix(u_heat_core, vec4(1.0, 1.0, 1.0, 1.0), heatPulse * 0.5); // White hot core
        crackGlow += bloom * u_heat_core * 0.5;
        
        return mix(crackGlow, coolSurface, crack);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Crack Scale', type: 'float', min: 2.0, max: 15.0, default: 5.0 },
    { id: 'u_cool_metal', name: 'Cooled Surface', type: 'color', default: [0.1, 0.1, 0.12, 1.0] },
    { id: 'u_hot_metal', name: 'Warm Surface', type: 'color', default: [0.4, 0.1, 0.05, 1.0] },
    { id: 'u_heat_core', name: 'Fissure Core', type: 'color', default: [1.0, 0.4, 0.0, 1.0] },
    { id: 'u_time', name: 'Heat Pulse', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

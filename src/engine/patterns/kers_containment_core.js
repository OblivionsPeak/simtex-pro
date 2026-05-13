export default {
  id: 'kers_containment_core_artisan',
  name: 'KERS Containment Core',
  category: 'Technology',
  description: 'Glowing, high-energy plasma cells wrapped in intricate copper coiling.',
  shader: `
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
        
        // Plasma core using inverted voronoi
        float v = voronoi(uv + vec2(u_time * 0.1, u_time * 0.15));
        float plasma = smoothstep(0.4, 0.0, v);
        
        // Copper coils (horizontal lines)
        float coilFreq = u_scale * 4.0;
        float coil = sin(v_uv.y * 3.14159 * coilFreq);
        float coilMask = smoothstep(0.8, 0.9, coil);
        
        // Add subtle offset to coils based on voronoi underlying pressure
        coilMask += smoothstep(0.85, 0.95, sin(v_uv.y * 3.14159 * coilFreq + v*2.0)) * 0.5;
        coilMask = clamp(coilMask, 0.0, 1.0);
        
        vec4 plasmaLayer = mix(u_bg_color, u_plasma_color, plasma);
        vec4 coilLayer = mix(u_copper_dark, u_copper_light, smoothstep(-1.0, 1.0, coil));
        
        return mix(plasmaLayer, coilLayer, coilMask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Core Scale', type: 'float', min: 2.0, max: 20.0, default: 5.0 },
    { id: 'u_bg_color', name: 'Housing', type: 'color', default: [0.05, 0.05, 0.08, 1.0] },
    { id: 'u_plasma_color', name: 'Plasma Energy', type: 'color', default: [0.0, 0.8, 1.0, 1.0] },
    { id: 'u_copper_light', name: 'Copper Coil Highlight', type: 'color', default: [0.8, 0.4, 0.2, 1.0] },
    { id: 'u_copper_dark', name: 'Copper Coil Shadow', type: 'color', default: [0.3, 0.1, 0.05, 1.0] },
    { id: 'u_time', name: 'Energy Flow', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

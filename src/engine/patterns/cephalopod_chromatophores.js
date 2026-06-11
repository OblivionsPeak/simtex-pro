export default {
  id: 'cephalopod_chromatophores_artisan',
  name: 'Cephalopod Chromatophores',
  category: 'Organic',
  added: '2026-05-13',
  description: 'Dynamic, cellular color-changing spots that vary in size and density over a fleshy base layer.',
  shader: `
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 id = floor(uv);
        vec2 gv = fract(uv);
        
        float minDist = 1.0;
        vec2 closestPoint;
        
        for(int y=-1; y<=1; y++) {
            for(int x=-1; x<=1; x++) {
                vec2 offset = vec2(x, y);
                vec2 pt = random2(id + offset);
                
                // Animate points expanding/contracting
                float radius = 0.1 + 0.3 * (0.5 + 0.5 * sin(u_pulse + pt.x * 6.28));
                
                float dist = length(gv - (offset + pt));
                
                if(dist < radius) {
                    minDist = min(minDist, dist/radius);
                }
            }
        }
        
        float spotMask = smoothstep(1.0, 0.8, minDist);
        // Flesh variation
        float fleshNoise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;
        vec4 fleshColor = u_base_color + vec4(fleshNoise, fleshNoise, fleshNoise, 0.0);
        
        return mix(fleshColor, u_spot_color, spotMask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cell Scale', type: 'float', min: 2.0, max: 30.0, default: 12.0 },
    { id: 'u_base_color', name: 'Fleshy Base', type: 'color', default: [0.7, 0.3, 0.3, 1.0] },
    { id: 'u_spot_color', name: 'Chromatophore', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_pulse', name: 'Pulse Phase', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

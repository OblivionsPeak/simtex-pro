export default {
  id: 'optical_fiber_bundle_artisan',
  name: 'Optical Fiber Bundle',
  category: 'Technology',
  description: 'Glowing fiber optic cables of varying diameters, bleeding light into a dark resin matrix.',
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
        float fiberType = 0.0;
        
        for(int y=-1; y<=1; y++) {
            for(int x=-1; x<=1; x++) {
                vec2 offset = vec2(x, y);
                vec2 pt = random2(id + offset);
                
                // Variable fiber radius
                float radius = 0.2 + 0.3 * fract(pt.x * 13.45);
                
                float dist = length(gv - (offset + pt));
                
                if(dist < radius && dist < minDist) {
                    minDist = dist / radius;
                    fiberType = fract(pt.y * 7.89);
                }
            }
        }
        
        // Fiber core vs cladding
        float core = smoothstep(0.9, 0.7, minDist);
        float cladding = smoothstep(1.0, 0.9, minDist) - core;
        
        // Resin matrix
        float matrix = smoothstep(1.0, 1.2, minDist);
        
        // Fiber light transmission animation
        float lightPulse = 0.5 + 0.5 * sin(u_time * 5.0 + fiberType * 6.28);
        
        vec4 coreColor = mix(u_fiber_dark, u_fiber_glow, lightPulse);
        
        vec4 finalColor = mix(u_resin_matrix, u_cladding, cladding);
        finalColor = mix(finalColor, coreColor, core);
        
        // Light bleed into resin
        finalColor += u_fiber_glow * smoothstep(1.5, 0.8, minDist) * 0.2 * lightPulse;
        
        return finalColor;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Bundle Scale', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_resin_matrix', name: 'Resin Base', type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_cladding', name: 'Fiber Cladding', type: 'color', default: [0.2, 0.2, 0.25, 1.0] },
    { id: 'u_fiber_glow', name: 'Light Transmission', type: 'color', default: [0.0, 0.8, 1.0, 1.0] },
    { id: 'u_fiber_dark', name: 'Inactive Fiber', type: 'color', default: [0.1, 0.1, 0.2, 1.0] },
    { id: 'u_time', name: 'Data Flow', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

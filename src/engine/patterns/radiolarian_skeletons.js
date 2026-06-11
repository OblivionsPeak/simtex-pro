export default {
  id: 'radiolarian_skeletons_artisan',
  name: 'Radiolarian Skeletons',
  category: 'Organic',
  added: '2026-05-13',
  description: 'Intricate, symmetrical, perforated silica shells based on microscopic marine zooplankton.',
  shader: `
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 id = floor(uv);
        vec2 gv = fract(uv) - 0.5;
        
        // Create repeating circular structures
        float dist = length(gv);
        
        // Main silica shell
        float shell = smoothstep(0.45, 0.4, dist) - smoothstep(0.35, 0.3, dist);
        
        // Radiating spines
        float angle = atan(gv.y, gv.x);
        float spines = 0.5 + 0.5 * sin(angle * 12.0); // 12-fold symmetry
        float spineMask = smoothstep(0.8, 1.0, spines) * smoothstep(0.6, 0.4, dist) * smoothstep(0.1, 0.2, dist);
        
        // Internal perforated mesh
        float innerDist = length(gv);
        float meshMask = smoothstep(0.35, 0.3, innerDist);
        float perforations = sin(gv.x * 40.0) * sin(gv.y * 40.0);
        meshMask *= smoothstep(0.2, 0.4, perforations); // punch holes
        
        // Combine features
        float silicaMask = clamp(shell + spineMask + meshMask, 0.0, 1.0);
        
        // Depth shading
        float depth = 1.0 - dist;
        vec4 silicaColor = mix(u_silica_shadow, u_silica_highlight, silicaMask * depth);
        
        return mix(u_fluid_bg, silicaColor, silicaMask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Plankton Scale', type: 'float', min: 2.0, max: 20.0, default: 5.0 },
    { id: 'u_fluid_bg', name: 'Marine Fluid', type: 'color', default: [0.05, 0.15, 0.2, 1.0] },
    { id: 'u_silica_shadow', name: 'Silica Core', type: 'color', default: [0.7, 0.75, 0.8, 1.0] },
    { id: 'u_silica_highlight', name: 'Silica Edge', type: 'color', default: [0.95, 0.95, 1.0, 1.0] }
  ]
};

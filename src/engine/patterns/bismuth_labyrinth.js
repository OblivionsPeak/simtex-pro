export default {
  id: 'bismuth_labyrinth_artisan',
  name: 'Bismuth Labyrinth',
  category: 'Natural',
  added: '2026-05-13',
  description: 'Right-angled, stair-step crystal growth with extreme iridescent oxide layer coloring.',
  shader: `
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Stair step quantization for right angles
        vec2 id = floor(uv);
        vec2 gv = fract(uv);
        
        // Layer depth based on distance to center of pseudo-crystal
        float dist = max(abs(gv.x - 0.5), abs(gv.y - 0.5)) * 2.0;
        
        // Step it
        float steps = 5.0;
        float steppedDist = floor(dist * steps) / steps;
        
        // Create labyrinth blocks
        float mazeNoise = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
        
        // Calculate iridescence based on depth and noise
        float iridPhase = steppedDist + mazeNoise + u_phase * 0.1;
        iridPhase = fract(iridPhase);
        
        vec4 color1 = u_color_a;
        vec4 color2 = u_color_b;
        vec4 color3 = u_color_c;
        
        vec4 finalColor;
        if(iridPhase < 0.33) {
            finalColor = mix(color1, color2, iridPhase * 3.0);
        } else if(iridPhase < 0.66) {
            finalColor = mix(color2, color3, (iridPhase - 0.33) * 3.0);
        } else {
            finalColor = mix(color3, color1, (iridPhase - 0.66) * 3.0);
        }
        
        // Add edge lines to emphasize stair-steps
        float edge = fract(dist * steps);
        float edgeHighlight = smoothstep(0.9, 1.0, edge) + smoothstep(0.1, 0.0, edge);
        
        return finalColor + vec4(edgeHighlight * 0.2);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Crystal Size', type: 'float', min: 2.0, max: 30.0, default: 10.0 },
    { id: 'u_color_a', name: 'Oxide Pink', type: 'color', default: [0.9, 0.2, 0.6, 1.0] },
    { id: 'u_color_b', name: 'Oxide Gold', type: 'color', default: [0.8, 0.7, 0.1, 1.0] },
    { id: 'u_color_c', name: 'Oxide Blue', type: 'color', default: [0.1, 0.4, 0.9, 1.0] },
    { id: 'u_phase', name: 'Growth Phase', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

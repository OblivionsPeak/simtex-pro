export default {
  id: 'holographic_foil_artisan',
  name: 'Holographic Foil',
  category: 'Abstract',
  description: 'Multi-layered, shifting prismatic gradients reminiscent of rare trading cards.',
  shader: `
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Base spectral gradient shifting with view angle/uv.y
        float angle = v_uv.y + u_time * 0.1;
        float spectrum = fract(angle * 3.0);
        
        vec3 col;
        col.r = abs(spectrum * 6.0 - 3.0) - 1.0;
        col.g = 2.0 - abs(spectrum * 6.0 - 2.0);
        col.b = 2.0 - abs(spectrum * 6.0 - 4.0);
        col = clamp(col, 0.0, 1.0);
        
        // Overlay geometric patterns (hex or diamond)
        vec2 p = abs(fract(uv) - 0.5);
        float d = max(p.x + p.y * 0.57735, p.y); // hex distance
        float pattern = smoothstep(0.4, 0.5, d) - smoothstep(0.5, 0.6, d);
        
        // Combine foil spectrum with pattern reflection
        vec4 baseFoil = vec4(col, 1.0) * u_foil_intensity;
        
        // Prismatic scatter noise
        float scatter = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        
        return baseFoil + pattern * scatter * u_pattern_brightness;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pattern Density', type: 'float', min: 5.0, max: 50.0, default: 20.0 },
    { id: 'u_foil_intensity', name: 'Spectral Saturation', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_pattern_brightness', name: 'Foil Glint', type: 'float', min: 0.0, max: 2.0, default: 1.2 },
    { id: 'u_time', name: 'Angle Shift', type: 'float', min: 0.0, max: 10.0, default: 0.0 }
  ]
};

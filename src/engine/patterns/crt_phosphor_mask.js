export default {
  id: 'crt_phosphor_mask_artisan',
  name: 'CRT Phosphor Mask',
  category: 'Technology',
  description: 'Macro view of an old tube monitor featuring RGB sub-pixels and scanlines.',
  shader: `
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Phosphor grid (aperture grille style)
        vec2 subuv = fract(uv);
        
        // X defines the R, G, B stripes
        float xStep = subuv.x * 3.0;
        float r = smoothstep(0.1, 0.9, 1.0 - abs(xStep - 0.5));
        float g = smoothstep(0.1, 0.9, 1.0 - abs(xStep - 1.5));
        float b = smoothstep(0.1, 0.9, 1.0 - abs(xStep - 2.5));
        
        // Scanlines on Y axis
        float scanline = 0.5 + 0.5 * sin(v_uv.y * u_scale * 3.14159 * 2.0);
        scanline = mix(0.7, 1.0, scanline);
        
        // Simulated glowing content behind the mask (low freq noise)
        float contentNoise = fract(sin(dot(floor(uv*0.1), vec2(12.9898, 78.233))) * 43758.5453);
        float content = smoothstep(0.3, 0.7, contentNoise + sin(u_phase + v_uv.x * 5.0) * 0.5);
        
        vec3 phosphor = vec3(r, g, b) * scanline * u_brightness;
        
        // Mix active content glow
        vec4 screen = vec4(phosphor * content, 1.0);
        
        // Add ambient reflection
        return screen + u_ambient_glare * 0.1;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grille Scale', type: 'float', min: 10.0, max: 200.0, default: 80.0 },
    { id: 'u_brightness', name: 'Phosphor Brightness', type: 'float', min: 0.5, max: 3.0, default: 1.5 },
    { id: 'u_ambient_glare', name: 'Screen Glass', type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_phase', name: 'Signal Phase', type: 'float', min: 0.0, max: 100.0, default: 0.0 }
  ]
};

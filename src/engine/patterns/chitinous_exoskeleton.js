export default {
  id: 'chitinous_exoskeleton_artisan',
  name: 'Chitinous Exoskeleton',
  category: 'Organic',
  description: 'Iridescent, segmented insectoid armor plating with deep, structural color shifting.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Segments
        float segmentBase = fract(uv.y + noise(uv * 0.5) * 0.5);
        float segmentEdge = smoothstep(0.9, 1.0, segmentBase);
        float segmentDepth = smoothstep(0.0, 0.2, segmentBase);
        
        // Micro-structure (iridescence driver)
        float micro = noise(uv * 10.0);
        
        // Iridescence color shift based on angle (simulated by v_uv.y and micro noise)
        float iridescenceMix = fract(v_uv.y * 2.0 + micro * 0.2 + segmentBase * 0.5);
        
        vec4 color1 = u_color_a;
        vec4 color2 = u_color_b;
        vec4 color3 = u_color_c;
        
        vec4 iridColor;
        if(iridescenceMix < 0.5) {
            iridColor = mix(color1, color2, iridescenceMix * 2.0);
        } else {
            iridColor = mix(color2, color3, (iridescenceMix - 0.5) * 2.0);
        }
        
        // Add specular highlight on segments
        float spec = smoothstep(0.4, 0.5, segmentBase) - smoothstep(0.5, 0.6, segmentBase);
        iridColor += vec4(spec * 0.3 * micro);
        
        // Apply segment depth/edges
        iridColor = mix(iridColor, vec4(0.05, 0.05, 0.05, 1.0), segmentEdge);
        iridColor *= (0.5 + 0.5 * segmentDepth);
        
        return iridColor;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Plate Scale', type: 'float', min: 2.0, max: 20.0, default: 6.0 },
    { id: 'u_color_a', name: 'Iridescence Base', type: 'color', default: [0.1, 0.2, 0.5, 1.0] },
    { id: 'u_color_b', name: 'Iridescence Mid', type: 'color', default: [0.5, 0.1, 0.6, 1.0] },
    { id: 'u_color_c', name: 'Iridescence High', type: 'color', default: [0.1, 0.8, 0.4, 1.0] }
  ]
};

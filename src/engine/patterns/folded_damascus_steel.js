export default {
  id: 'folded_damascus_steel_artisan',
  name: 'Folded Damascus Steel',
  category: 'Industrial',
  added: '2026-05-13',
  description: 'Swirling, wavy folded steel patterns with high-contrast acid bath etching.',
  shader: `
    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000 * noise(p); p *= 2.02;
      f += 0.2500 * noise(p); p *= 2.03;
      f += 0.1250 * noise(p); p *= 2.01;
      f += 0.0625 * noise(p);
      return f;
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Domain warping for folded look
        vec2 q = vec2(fbm(uv), fbm(uv + vec2(5.2, 1.3)));
        vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2)), fbm(uv + 4.0 * q + vec2(8.3, 2.8)));
        
        float n = fbm(uv + 4.0 * r);
        
        // High frequency folding lines
        float lines = sin(n * u_fold_density * 3.14159);
        
        // Etch depth based on folded lines
        float etch = smoothstep(0.4, 0.6, lines);
        
        vec4 darkLayer = u_dark_steel;
        vec4 lightLayer = mix(u_light_steel, vec4(1.0, 1.0, 1.0, 1.0), n * 0.5); // specular
        
        return mix(darkLayer, lightLayer, etch);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Scale', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_fold_density', name: 'Fold Density', type: 'float', min: 5.0, max: 30.0, default: 15.0 },
    { id: 'u_dark_steel', name: 'Etched Layer', type: 'color', default: [0.15, 0.15, 0.16, 1.0] },
    { id: 'u_light_steel', name: 'Polished Layer', type: 'color', default: [0.6, 0.6, 0.65, 1.0] }
  ]
};

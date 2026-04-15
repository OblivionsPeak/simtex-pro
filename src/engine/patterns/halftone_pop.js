export default {
  id: 'halftone_pop_artisan',
  name: 'Halftone Pop-Art',
  category: 'Abstract',
  description: 'Classic CMYK-style dot matrix textures found in pop-art and comic books.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float intensity = sin(v_uv.x * 5.0) * 0.5 + 0.5;
      float d = length(gv);
      float mask = smoothstep(intensity * 0.5, intensity * 0.45, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Dot Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Dot Color', type: 'color', default: [0.0, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Paper Base', type: 'color', default: [1.0, 1.0, 0.95, 1.0] }
  ]
};

export default {
  id: 'julia_fractal',
  name: 'Julia Set',
  category: 'Abstract',
  description: 'High-symmetry mathematical fractal based on complex number seeds.',
  shader: `
    vec4 generate() {
      vec2 z = (v_uv - 0.5) * 4.0 / u_scale;
      vec2 c = vec2(-0.7, 0.27015);
      float iter = 0.0;
      const float max_iter = 64.0;
      
      for(float i=0.0; i<max_iter; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(length(z) > 2.0) break;
        iter++;
      }
      
      float mask = iter / max_iter;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fractal Size', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_primary_color', name: 'Core Color', type: 'color', default: [0.0, 0.8, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Outer Space', type: 'color', default: [0.0, 0.0, 0.1, 1.0] }
  ]
};

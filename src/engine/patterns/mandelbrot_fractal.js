export default {
  id: 'mandelbrot_fractal',
  name: 'Mandelbrot Explorer',
  category: 'Abstract',
  description: 'Pure mathematical fractal boundary with high-precision iteration.',
  shader: `
    vec4 generate() {
      vec2 c = (v_uv - 0.5) * 4.0 / u_scale - vec2(0.5, 0.0);
      vec2 z = vec2(0.0);
      float iter = 0.0;
      const float max_iter = 100.0;
      
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
    { id: 'u_scale', name: 'Zoom Level', type: 'float', min: 1.0, max: 20.0, default: 2.0 },
    { id: 'u_primary_color', name: 'Inner Glow', type: 'color', default: [1.0, 0.4, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Void Depth', type: 'color', default: [0.05, 0.0, 0.05, 1.0] }
  ]
};

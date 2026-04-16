export default {
  id: 'sierpinski_carpet_artisan',
  name: 'Fractal Carpet',
  category: 'Abstract',
  description: 'Recursive square fractal grid structures found in high-performance digital logic layouts.',
  shader: `
    vec4 generate() {
        vec2 uv = v_uv;
        float mask = 0.0;
        for (int i=0; i<4; i++) {
            vec2 gv = fract(uv * 3.0);
            if (gv.x > 1.0/3.0 && gv.x < 2.0/3.0 && gv.y > 1.0/3.0 && gv.y < 2.0/3.0) {
                mask = 1.0;
                break;
            }
            uv = gv;
        }
        return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Logic High', type: 'color', default: [0.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Deep Silicon', type: 'color', default: [0.0, 0.05, 0.1, 1.0] }
  ]
};

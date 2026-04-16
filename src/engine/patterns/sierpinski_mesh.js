export default {
  id: 'sierpinski_mesh_artisan',
  name: 'Fractal Mesh',
  category: 'Abstract',
  description: 'Recursive Sierpinski triangle fractal structures found in high-performance lightweight parts.',
  shader: `
    vec4 generate() {
        vec2 uv = v_uv;
        float mask = 0.0;
        for (int i=0; i<4; i++) {
            if (uv.x + uv.y > 1.0) {
                mask = 1.0;
                break;
            }
            uv *= 2.0;
            uv = fract(uv);
        }
        return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Fractal Web', type: 'color', default: [0.0, 1.0, 0.5, 1.0] },
    { id: 'u_secondary_color', name: 'Fractal Hole', type: 'color', default: [0.0, 0.1, 0.05, 1.0] }
  ]
};

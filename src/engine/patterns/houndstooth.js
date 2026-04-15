export default {
  id: 'houndstooth',
  name: 'Houndstooth',
  category: 'Geometric',
  description: 'Pro-grade textile pattern for classic racing interiors.',
  shader: `
    float houndstooth(vec2 p) {
      vec2 gv = fract(p);
      float mask = step(gv.x, 0.5) * step(gv.y, 0.5);
      mask += step(0.5, gv.x) * step(0.5, gv.y);
      float diag = step(gv.x + gv.y, 0.5);
      float diag2 = step(1.5, gv.x + gv.y);
      return abs(mask - (diag + diag2));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = houndstooth(uv);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pattern Size', type: 'float', min: 5.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Primary Thread', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Secondary Thread', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

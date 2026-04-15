export default {
  id: 'palm_fronds_artisan',
  name: 'Palm Fronds',
  category: 'Natural',
  description: 'Fan-like radial leaf structures found in tropical palm trees.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = atan(uv.y, uv.x);
      float r = length(uv);
      
      float frond = sin(a * 15.0) * step(r, 1.0) * step(0.1, r);
      float mask = smoothstep(0.0, 0.1, frond);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Frond Length', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Palm Leaf', type: 'color', default: [0.1, 0.6, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Shadow', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

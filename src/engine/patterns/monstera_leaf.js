export default {
  id: 'monstera_leaf_artisan',
  name: 'Monstera Split-Leaf',
  category: 'Natural',
  description: 'The iconic tropical split-leaf silhouette with decorative voids.',
  shader: `
    float circle(vec2 p, float r) { return length(p) - r; }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Heart shape base
      float heart = d - (sin(a) * sqrt(abs(cos(a))) / (sin(a) + 1.4) - 2.0 * sin(a) + 2.0);
      float mask = smoothstep(0.1, 0.0, heart);
      
      // Secondary holes
      vec2 gv = fract(v_uv * u_scale * 2.0) - 0.5;
      if (length(gv) < 0.2) mask = 0.0;
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Leaf Size', type: 'float', min: 1.0, max: 10.0, default: 3.0 },
    { id: 'u_primary_color', name: 'Foliage Color', type: 'color', default: [0.0, 0.5, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Negative Space', type: 'color', default: [0.0, 0.0, 0.0, 0.0] }
  ]
};

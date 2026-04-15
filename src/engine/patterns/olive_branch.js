export default {
  id: 'olive_branch_artisan',
  name: 'Olive Branch',
  category: 'Natural',
  description: 'Symmetrical leaf layering along a spine, symbolizing peace and precision.',
  shader: `
    float leaf(vec2 p) {
      p = abs(p);
      return max(length(p - vec2(0.0, 0.2)), length(p + vec2(0.0, 0.2))) - 0.3;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float spine = step(abs(uv.x - 0.5), 0.005);
      
      float leafMask = 0.0;
      for(float i=0.0; i<10.0; i++) {
        vec2 p = uv - vec2(0.5, i * 0.1);
        if (mod(i, 2.0) == 0.0) p.x += 0.1; else p.x -= 0.1;
        leafMask = max(leafMask, smoothstep(0.1, 0.05, leaf(p * 15.0)));
      }
      
      float mask = max(spine, leafMask);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Branch Length', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Branch Color', type: 'color', default: [0.4, 0.5, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.05, 0.05, 0.02, 1.0] }
  ]
};

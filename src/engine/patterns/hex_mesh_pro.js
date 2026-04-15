export default {
  id: 'hex_mesh_pro',
  name: 'Pro Hex Mesh',
  category: 'Technology',
  description: 'Technical aerodynamic hexagonal mesh.',
  shader: `
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec3 generate() {
      vec2 r = vec2(1, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;
      float d = hexDist(gv);
      float mask = step(0.05, 0.5 - d);
      vec3 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec3(1.0, 0.8, 0.0);
      return color;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 5.0, max: 100.0, default: 30.0 },
    { id: 'u_primary_color', name: 'Mesh', type: 'color', default: [0.4, 0.4, 0.45] },
    { id: 'u_secondary_color', name: 'Space', type: 'color', default: [0.02, 0.02, 0.02] }
  ]
};

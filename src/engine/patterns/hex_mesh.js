export default {
  id: 'hex_mesh_pro',
  name: 'Aerodynamic Hex',
  category: 'Technology',
  description: 'Technical high-airflow hexagonal mesh grid.',
  shader: `
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec4 generate() {
      vec2 r = vec2(1, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;
      float mask = step(0.05, 0.48 - hexDist(gv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Mesh', type: 'color', default: [0.35, 0.35, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.02, 0.02, 0.02, 1.0] }
  ]
};

export default {
  id: 'honeycomb_bio',
  name: 'HoneyComb Bio',
  category: 'Natural',
  description: 'Precise hexagonal organic cell wall structure.',
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
      
      float d = hexDist(gv);
      float mask = smoothstep(0.4, 0.45, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cell Count', type: 'float', min: 2.0, max: 40.0, default: 12.0 },
    { id: 'u_primary_color', name: 'Honey Fill', type: 'color', default: [1.0, 0.7, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Wax Wall', type: 'color', default: [0.2, 0.1, 0.0, 1.0] }
  ]
};

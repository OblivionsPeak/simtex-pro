export default {
  id: 'graphene_nanotubes_artisan',
  name: 'Graphene Nanotubes',
  category: 'Industrial',
  added: '2026-05-13',
  description: 'Hexagonal carbon lattices at a molecular scale with metallic glowing points.',
  shader: `
    // Hexagonal grid function
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1.0, 1.732)));
      return max(c, p.x);
    }
    vec4 hexGrid(vec2 uv) {
      vec2 r = vec2(1.0, 1.732);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      vec2 gv = dot(a, a) < dot(b,b) ? a : b;
      float d = hexDist(gv);
      // Edge
      float edge = smoothstep(0.4, 0.45, d) - smoothstep(0.45, 0.5, d);
      // Vertices (points)
      float points = smoothstep(0.15, 0.05, length(gv - vec2(0.0, 0.577))) + 
                     smoothstep(0.15, 0.05, length(gv - vec2(0.5, 0.288))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(0.5, -0.288))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(0.0, -0.577))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(-0.5, -0.288))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(-0.5, 0.288)));
      return vec4(edge, points, 0.0, 0.0);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 hex = hexGrid(uv);
      vec4 baseColor = mix(u_bg_color, u_line_color, hex.x);
      return mix(baseColor, u_glow_color, hex.y);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Lattice Scale', type: 'float', min: 2.0, max: 40.0, default: 15.0 },
    { id: 'u_bg_color', name: 'Background', type: 'color', default: [0.05, 0.05, 0.05, 1.0] },
    { id: 'u_line_color', name: 'Bond Lines', type: 'color', default: [0.3, 0.3, 0.35, 1.0] },
    { id: 'u_glow_color', name: 'Node Glow', type: 'color', default: [0.0, 0.8, 1.0, 1.0] }
  ]
};

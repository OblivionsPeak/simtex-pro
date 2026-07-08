export default {
  id: 'tumbling_blocks',
  name: 'Tumbling Blocks',
  category: 'Geometric',
  added: '2026-07-07',
  description: 'Isometric cubes in three-tone rhombille tiling — the classic impossible stack illusion.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      // hexagonal lattice: find nearest hex center over two offset grids
      vec2 s = vec2(1.7320508, 1.5);
      vec2 c1 = (floor(uv / s) + 0.5) * s;
      vec2 c2 = (floor((uv - s * 0.5) / s) + 0.5) * s + s * 0.5;
      vec2 hc = dot(uv - c1, uv - c1) < dot(uv - c2, uv - c2) ? c1 : c2;
      vec2 rel = uv - hc;
      // three 120-degree faces by angle sector
      float ang = atan(rel.y, rel.x) + 3.14159 / 6.0 + 6.28318;
      float face = mod(floor(ang / (6.28318 / 3.0)), 3.0);
      vec3 c = u_primary_color.rgb;              // top face
      if (face < 0.5) c = u_secondary_color.rgb; // right face
      else if (face < 1.5) c = u_accent_color.rgb; // left face
      // subtle per-cube tone shift
      c *= 0.94 + 0.12 * hash(hc);
      // crisp edges between faces
      float sector = fract(ang / (6.28318 / 3.0));
      float edge = smoothstep(0.03, 0.0, min(sector, 1.0 - sector) * length(rel));
      c *= 1.0 - edge * u_edges * 0.5;
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cube Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 60.0, default: 0.0 },
    { id: 'u_edges', name: 'Edge Lines', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Top Face', type: 'color', default: [0.92, 0.9, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Light Side', type: 'color', default: [0.62, 0.55, 0.45, 1.0] },
    { id: 'u_accent_color', name: 'Dark Side', type: 'color', default: [0.25, 0.2, 0.16, 1.0] }
  ],
  variants: [
    { name: 'Quilt Classic', uniforms: { u_primary_color: [0.92, 0.9, 0.85, 1.0], u_secondary_color: [0.62, 0.55, 0.45, 1.0], u_accent_color: [0.25, 0.2, 0.16, 1.0], u_edges: 0.5 } },
    { name: 'Vasarely Blue', uniforms: { u_primary_color: [0.65, 0.8, 0.95, 1.0], u_secondary_color: [0.2, 0.4, 0.75, 1.0], u_accent_color: [0.07, 0.12, 0.3, 1.0], u_edges: 0.2 } },
    { name: 'Racing Slate', uniforms: { u_primary_color: [0.75, 0.75, 0.78, 1.0], u_secondary_color: [0.4, 0.42, 0.46, 1.0], u_accent_color: [0.12, 0.13, 0.15, 1.0], u_edges: 0.8 } }
  ]
};

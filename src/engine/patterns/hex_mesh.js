export default {
  id: 'hex_mesh_pro',
  name: 'Aerodynamic Hex',
  category: 'Technology',
  description: 'Technical high-airflow hexagonal mesh grid.',
  shader: `
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1.0, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec4 generate() {
      vec2 r = vec2(1.0, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;

      float hd = hexDist(gv);
      float s = max(u_softness, 0.0005);
      float mask = smoothstep(u_inset + s, u_inset - s, hd);
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Optional bevel shading toward each cell border
      float bevel = smoothstep(u_inset - 0.12, u_inset, hd) * mask * u_bevel;
      color.rgb = mix(color.rgb, color.rgb * 0.55, bevel);
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.35, 0.35, 0.4, 1.0],
        u_secondary_color: [0.02, 0.02, 0.02, 1.0],
        u_inset: 0.43,
        u_bevel: 0.0
      }
    },
    {
      name: 'Stealth Mesh',
      uniforms: {
        u_primary_color: [0.08, 0.08, 0.09, 1.0],
        u_secondary_color: [0.0, 0.0, 0.0, 1.0],
        u_inset: 0.43,
        u_bevel: 0.5
      }
    },
    {
      name: 'Radiator Brass',
      uniforms: {
        u_primary_color: [0.72, 0.55, 0.25, 1.0],
        u_secondary_color: [0.06, 0.04, 0.02, 1.0],
        u_inset: 0.4,
        u_bevel: 0.6
      }
    },
    {
      name: 'Tron Grid',
      uniforms: {
        u_primary_color: [0.04, 0.05, 0.07, 1.0],
        u_secondary_color: [0.1, 0.9, 1.0, 1.0],
        u_inset: 0.45,
        u_bevel: 0.0
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_inset', name: 'Cell Size', type: 'float', min: 0.2, max: 0.49, default: 0.43 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.08, default: 0.008 },
    { id: 'u_bevel', name: 'Bevel Shading', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Mesh', type: 'color', default: [0.35, 0.35, 0.4, 1.0] },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.02, 0.02, 0.02, 1.0] }
  ]
};

export default {
  id: 'houndstooth',
  name: 'Houndstooth',
  category: 'Geometric',
  description: 'Pro-grade textile pattern for classic racing interiors.',
  shader: `
    float ht_edge(float edge, float x, float s) {
      return smoothstep(edge - s, edge + s, x);
    }
    float houndstooth(vec2 p, float s) {
      vec2 gv = fract(p);
      float mask = (1.0 - ht_edge(0.5, gv.x, s)) * (1.0 - ht_edge(0.5, gv.y, s));
      mask += ht_edge(0.5, gv.x, s) * ht_edge(0.5, gv.y, s);
      float diag = 1.0 - ht_edge(0.5, gv.x + gv.y, s);
      float diag2 = ht_edge(1.5, gv.x + gv.y, s);
      return abs(mask - (diag + diag2));
    }
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = (p + 0.5) * u_scale;

      float s = max(u_softness, 0.0005);
      float mask = houndstooth(uv, s);
      vec4 color = mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));

      // Optional woven thread texture
      float weave = sin(uv.x * 60.0) * sin(uv.y * 60.0) * 0.5 + 0.5;
      color.rgb = mix(color.rgb, color.rgb * (0.85 + weave * 0.3), u_weave);
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [1.0, 1.0, 1.0, 1.0],
        u_secondary_color: [0.05, 0.05, 0.05, 1.0],
        u_rotate: 0.0,
        u_weave: 0.0
      }
    },
    {
      name: 'Camel Coat',
      uniforms: {
        u_primary_color: [0.82, 0.66, 0.45, 1.0],
        u_secondary_color: [0.25, 0.16, 0.1, 1.0],
        u_rotate: 0.0,
        u_weave: 0.5
      }
    },
    {
      name: 'Grey Tweed',
      uniforms: {
        u_primary_color: [0.75, 0.75, 0.78, 1.0],
        u_secondary_color: [0.12, 0.12, 0.14, 1.0],
        u_rotate: 0.0,
        u_weave: 0.35
      }
    },
    {
      name: 'Speed Punch',
      uniforms: {
        u_primary_color: [0.95, 0.25, 0.1, 1.0],
        u_secondary_color: [0.05, 0.05, 0.06, 1.0],
        u_rotate: 45.0,
        u_weave: 0.0
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Pattern Size', type: 'float', min: 5.0, max: 100.0, default: 40.0 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.05, default: 0.004 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_weave', name: 'Thread Texture', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Primary Thread', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Secondary Thread', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

export default {
  id: 'harlequin_diamond',
  name: 'Harlequin Diamond',
  category: 'Geometric',
  description: 'Classic high-contrast diagonal diamond pattern.',
  shader: `
    vec4 generate() {
      float a = u_angle * 0.01745329;
      mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
      vec2 uv = rot * (v_uv - 0.5) * u_scale;
      uv.y *= u_aspect;

      // Anti-aliased checker via soft-XOR of triangle waves
      float s = max(u_softness, 0.0005);
      float tx = abs(fract((uv.x + 0.5) * 0.5) * 2.0 - 1.0);
      float ty = abs(fract((uv.y + 0.5) * 0.5) * 2.0 - 1.0);
      float mx = smoothstep(0.5 - s, 0.5 + s, tx);
      float my = smoothstep(0.5 - s, 0.5 + s, ty);
      float mask = mx + my - 2.0 * mx * my;

      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Optional diamond outline
      vec2 gv = abs(fract(uv) - 0.5);
      float line = smoothstep(0.44 - s, 0.44 + s, max(gv.x, gv.y)) * u_outline;
      color = mix(color, u_accent_color, line);

      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [1.0, 0.1, 0.1, 1.0],
        u_secondary_color: [0.1, 0.1, 0.1, 1.0],
        u_accent_color: [0.95, 0.85, 0.4, 1.0],
        u_angle: 45.0,
        u_aspect: 1.0,
        u_outline: 0.0
      }
    },
    {
      name: 'Jester',
      uniforms: {
        u_primary_color: [0.5, 0.12, 0.6, 1.0],
        u_secondary_color: [0.08, 0.08, 0.1, 1.0],
        u_accent_color: [0.95, 0.78, 0.2, 1.0],
        u_angle: 45.0,
        u_aspect: 1.4,
        u_outline: 0.9
      }
    },
    {
      name: 'Carnival',
      uniforms: {
        u_primary_color: [0.85, 0.1, 0.15, 1.0],
        u_secondary_color: [0.95, 0.92, 0.85, 1.0],
        u_accent_color: [0.95, 0.85, 0.4, 1.0],
        u_angle: 45.0,
        u_aspect: 1.0,
        u_outline: 0.0
      }
    },
    {
      name: 'Ivory Lattice',
      uniforms: {
        u_primary_color: [0.92, 0.9, 0.85, 1.0],
        u_secondary_color: [0.85, 0.82, 0.75, 1.0],
        u_accent_color: [0.4, 0.3, 0.2, 1.0],
        u_angle: 45.0,
        u_aspect: 1.8,
        u_outline: 1.0
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Density', type: 'float', min: 2.0, max: 50.0, default: 12.0 },
    { id: 'u_angle', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 45.0 },
    { id: 'u_aspect', name: 'Diamond Stretch', type: 'float', min: 0.4, max: 2.5, default: 1.0 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.1, default: 0.008 },
    { id: 'u_outline', name: 'Outline Strength', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Color A', type: 'color', default: [1.0, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Color B', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_accent_color', name: 'Outline', type: 'color', default: [0.95, 0.85, 0.4, 1.0] }
  ]
};

export default {
  id: 'checker_fade',
  name: 'Checker Fade',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Checkerboard dissolving into solid color — the classic livery flank graphic.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5) + 0.5;
      vec2 uv = p * u_scale;
      vec2 cell = floor(uv);
      float checker = mod(cell.x + cell.y, 2.0);
      // survival probability ramps along the fade axis
      float t = p.x;
      float prob = 1.0 - smoothstep(u_fade_start, u_fade_start + max(u_fade_width, 0.01), t);
      float alive = step(hash(cell + 0.37), prob);
      float m = checker * alive;
      return mix(u_secondary_color, u_primary_color, m);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Checker Size', type: 'float', min: 4.0, max: 48.0, default: 14.0 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_fade_start', name: 'Fade Start', type: 'float', min: 0.0, max: 1.0, default: 0.25 },
    { id: 'u_fade_width', name: 'Fade Width', type: 'float', min: 0.05, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Checker', type: 'color', default: [0.05, 0.05, 0.06, 1.0] },
    { id: 'u_secondary_color', name: 'Base', type: 'color', default: [0.95, 0.95, 0.93, 1.0] }
  ],
  variants: [
    { name: 'Finish Line', uniforms: { u_primary_color: [0.05, 0.05, 0.06, 1.0], u_secondary_color: [0.95, 0.95, 0.93, 1.0], u_fade_start: 0.25, u_fade_width: 0.5, u_rotate: 0.0 } },
    { name: 'Red Rush', uniforms: { u_primary_color: [0.85, 0.08, 0.1, 1.0], u_secondary_color: [0.98, 0.97, 0.95, 1.0], u_fade_start: 0.15, u_fade_width: 0.65, u_rotate: 15.0 } },
    { name: 'Midnight', uniforms: { u_primary_color: [0.1, 0.65, 0.95, 1.0], u_secondary_color: [0.04, 0.05, 0.09, 1.0], u_fade_start: 0.3, u_fade_width: 0.45, u_rotate: 45.0 } }
  ]
};

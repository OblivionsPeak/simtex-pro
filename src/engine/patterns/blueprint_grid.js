export default {
  id: 'blueprint_grid_tech',
  name: 'Blueprint Grid',
  category: 'Technology',
  added: '2026-04-15',
  description: 'Technical structural alignment grid.',
  shader: `
    vec4 generate() {
      float aa = 0.004;
      float w = u_line_width;

      vec2 g = fract(v_uv * u_scale);
      float major = smoothstep(1.0 - w - aa, 1.0 - w + aa, max(g.x, g.y));

      vec2 gm = fract(v_uv * u_scale * u_minor_div);
      float minor = smoothstep(1.0 - w - aa, 1.0 - w + aa, max(gm.x, gm.y)) * u_minor_strength * 0.45;

      float mask = clamp(max(major, minor), 0.0, 1.0);
      return mix(u_paper_color, u_line_color, mask);
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_line_color: [0.0, 0.8, 1.0, 1.0],
        u_paper_color: [0.02, 0.05, 0.15, 1.0],
        u_line_width: 0.02,
        u_minor_strength: 0.0
      }
    },
    {
      name: 'Drafting White',
      uniforms: {
        u_line_color: [0.25, 0.35, 0.55, 1.0],
        u_paper_color: [0.93, 0.94, 0.96, 1.0],
        u_line_width: 0.015,
        u_minor_strength: 0.6
      }
    },
    {
      name: 'Redline',
      uniforms: {
        u_line_color: [0.78, 0.12, 0.1, 1.0],
        u_paper_color: [0.96, 0.93, 0.86, 1.0],
        u_line_width: 0.018,
        u_minor_strength: 0.45
      }
    },
    {
      name: 'Phosphor',
      uniforms: {
        u_line_color: [0.2, 1.0, 0.4, 1.0],
        u_paper_color: [0.01, 0.03, 0.01, 1.0],
        u_line_width: 0.025,
        u_minor_strength: 0.7
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Grid Count', type: 'float', min: 5.0, max: 100.0, default: 20.0 },
    { id: 'u_line_width', name: 'Line Width', type: 'float', min: 0.005, max: 0.1, default: 0.02 },
    { id: 'u_minor_div', name: 'Minor Subdivisions', type: 'float', min: 2.0, max: 10.0, default: 5.0 },
    { id: 'u_minor_strength', name: 'Minor Grid Strength', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_line_color', name: 'Grid Line', type: 'color', default: [0.0, 0.8, 1.0, 1.0] },
    { id: 'u_paper_color', name: 'Paper', type: 'color', default: [0.02, 0.05, 0.15, 1.0] }
  ]
};

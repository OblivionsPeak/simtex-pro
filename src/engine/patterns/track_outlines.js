export default {
  id: 'track_outlines',
  name: 'Track Outlines',
  category: 'Racing',
  added: '2026-07-07',
  description: 'A field of wobbly closed circuit maps — every cell its own fantasy race track outline.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float seed = hash(cell) * 40.0;
      float ang = atan(f.y, f.x);
      float r = length(f);
      // track radius wobbles around the loop — corners and straights
      float wob = snoise(vec2(cos(ang) * 1.4 + seed, sin(ang) * 1.4 + seed * 0.7));
      float radius = 0.3 + wob * 0.1;
      float d = abs(r - radius);
      float w = max(u_width, 0.005);
      float line = smoothstep(w, w * 0.5, d);
      // start/finish tick
      float tick = step(abs(ang - (hash(cell + 3.1) - 0.5) * 6.28), 0.09) * smoothstep(w * 2.2, w, d);
      vec4 col = mix(u_secondary_color, u_primary_color, line);
      col = mix(col, u_accent_color, tick);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Track Density', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_width', name: 'Line Width', type: 'float', min: 0.005, max: 0.08, default: 0.025 },
    { id: 'u_primary_color', name: 'Track Line', type: 'color', default: [0.92, 0.92, 0.9, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.08, 0.09, 0.12, 1.0] },
    { id: 'u_accent_color', name: 'Start Line', type: 'color', default: [0.9, 0.15, 0.15, 1.0] }
  ],
  variants: [
    { name: 'Night Stage', uniforms: { u_primary_color: [0.92, 0.92, 0.9, 1.0], u_secondary_color: [0.08, 0.09, 0.12, 1.0], u_accent_color: [0.9, 0.15, 0.15, 1.0], u_width: 0.025 } },
    { name: 'Blueprint', uniforms: { u_primary_color: [0.85, 0.92, 1.0, 1.0], u_secondary_color: [0.07, 0.2, 0.45, 1.0], u_accent_color: [1.0, 0.8, 0.2, 1.0], u_width: 0.018 } },
    { name: 'Paper Maps', uniforms: { u_primary_color: [0.2, 0.2, 0.22, 1.0], u_secondary_color: [0.94, 0.92, 0.86, 1.0], u_accent_color: [0.8, 0.2, 0.2, 1.0], u_width: 0.03 } }
  ]
};

export default {
  id: 'atomic_starburst',
  name: 'Atomic Starburst',
  category: 'Retro',
  added: '2026-07-07',
  description: 'Googie diner sparkle — spoke starbursts with ball tips scattered over a mid-century field.',
  shader: `
    float burst(vec2 p, float seed) {
      float r = length(p);
      float ang = atan(p.y, p.x);
      float spokes = 4.0 + floor(seed * 3.0) * 2.0;
      // thin rays that taper with radius
      float ray = abs(sin(ang * spokes * 0.5 + seed * 6.28));
      float len = 0.32 + seed * 0.1;
      float m = smoothstep(0.12 * (r / len + 0.25), 0.0, ray) * step(r, len);
      // ball tips at the end of each ray
      float tipR = fract(ang * spokes * 0.5 / 3.14159 + seed);
      float onRay = smoothstep(0.1, 0.0, ray);
      m = max(m, smoothstep(0.045, 0.02, abs(r - len)) * onRay);
      // center dot
      m = max(m, step(r, 0.035));
      return m;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          float seed = hash(cell + 0.4);
          if (seed < 0.3) continue; // breathing room
          vec2 ctr = cell + vec2(hash(cell + 1.1), hash(cell + 2.2)) * 0.7 + 0.15;
          float m = burst(uv - ctr, seed);
          vec3 c = mix(u_primary_color.rgb, u_accent_color.rgb, step(0.6, hash(cell + 5.0)));
          col.rgb = mix(col.rgb, c, m);
        }
      }
      // tiny satellite dots between bursts
      float dot_ = step(0.992, hash(floor(uv * 7.0)));
      col.rgb = mix(col.rgb, u_accent_color.rgb, dot_);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Burst Density', type: 'float', min: 1.5, max: 10.0, default: 4.0 },
    { id: 'u_secondary_color', name: 'Field', type: 'color', default: [0.93, 0.9, 0.82, 1.0] },
    { id: 'u_primary_color', name: 'Starburst', type: 'color', default: [0.85, 0.55, 0.15, 1.0] },
    { id: 'u_accent_color', name: 'Accent Burst', type: 'color', default: [0.2, 0.45, 0.45, 1.0] }
  ],
  variants: [
    { name: 'Diner Formica', uniforms: { u_secondary_color: [0.93, 0.9, 0.82, 1.0], u_primary_color: [0.85, 0.55, 0.15, 1.0], u_accent_color: [0.2, 0.45, 0.45, 1.0] } },
    { name: 'Motel Sign Night', uniforms: { u_secondary_color: [0.08, 0.09, 0.14, 1.0], u_primary_color: [0.95, 0.75, 0.2, 1.0], u_accent_color: [0.85, 0.3, 0.5, 1.0] } },
    { name: 'Atomic Mint', uniforms: { u_secondary_color: [0.75, 0.88, 0.82, 1.0], u_primary_color: [0.85, 0.35, 0.25, 1.0], u_accent_color: [0.25, 0.3, 0.35, 1.0] } }
  ]
};

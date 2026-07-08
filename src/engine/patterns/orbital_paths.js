export default {
  id: 'orbital_paths',
  name: 'Orbital Paths',
  category: 'Cosmos',
  added: '2026-07-07',
  description: 'A star chart of concentric orbits — rings, planet dots, and dashed transfer arcs.',
  shader: `
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      // tile the solar systems
      vec2 cell = floor(uv / 4.0);
      vec2 p = mod(uv, 4.0) - 2.0;
      float seed = hash(cell) * 10.0;
      float r = length(p);
      float ang = atan(p.y, p.x);
      vec4 col = u_secondary_color;
      // faint grid graticule
      float grid = max(smoothstep(0.02, 0.0, abs(fract(uv.x) - 0.5) - 0.48), smoothstep(0.02, 0.0, abs(fract(uv.y) - 0.5) - 0.48));
      col.rgb += u_primary_color.rgb * grid * 0.08;
      // central star
      col.rgb += u_accent_color.rgb * exp(-r * r * 40.0) * 1.5;
      float lines = 0.0;
      float planets = 0.0;
      for (int i = 1; i <= 5; i++) {
        float fi = float(i);
        float orbit = 0.28 * fi + hash(vec2(fi, seed)) * 0.1;
        float d = abs(r - orbit);
        // dashed ring
        float dashes = step(0.35, fract(ang * (6.0 + fi * 2.0) / 6.28318 + seed));
        lines = max(lines, smoothstep(u_width, u_width * 0.4, d) * mix(1.0, dashes, u_dash));
        // planet on this orbit
        float pa = hash(vec2(fi, seed + 2.0)) * 6.28318;
        vec2 pp = vec2(cos(pa), sin(pa)) * orbit;
        float pd = length(p - pp);
        planets = max(planets, smoothstep(0.06 + fi * 0.008, 0.02, pd));
      }
      col.rgb = mix(col.rgb, u_primary_color.rgb, lines * 0.8);
      col.rgb = mix(col.rgb, u_accent_color.rgb, planets);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Chart Scale', type: 'float', min: 4.0, max: 24.0, default: 8.0 },
    { id: 'u_width', name: 'Orbit Line', type: 'float', min: 0.005, max: 0.05, default: 0.015 },
    { id: 'u_dash', name: 'Dashing', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_secondary_color', name: 'Chart', type: 'color', default: [0.05, 0.07, 0.12, 1.0] },
    { id: 'u_primary_color', name: 'Orbit Lines', type: 'color', default: [0.6, 0.75, 0.9, 1.0] },
    { id: 'u_accent_color', name: 'Bodies', type: 'color', default: [1.0, 0.8, 0.35, 1.0] }
  ],
  variants: [
    { name: 'Star Chart', uniforms: { u_secondary_color: [0.05, 0.07, 0.12, 1.0], u_primary_color: [0.6, 0.75, 0.9, 1.0], u_accent_color: [1.0, 0.8, 0.35, 1.0], u_dash: 0.5 } },
    { name: 'Mission Control', uniforms: { u_secondary_color: [0.02, 0.04, 0.03, 1.0], u_primary_color: [0.25, 0.9, 0.45, 1.0], u_accent_color: [0.95, 0.95, 0.9, 1.0], u_dash: 0.8 } },
    { name: 'Antique Almanac', uniforms: { u_secondary_color: [0.9, 0.85, 0.72, 1.0], u_primary_color: [0.35, 0.28, 0.2, 1.0], u_accent_color: [0.6, 0.15, 0.1, 1.0], u_dash: 0.2 } }
  ]
};

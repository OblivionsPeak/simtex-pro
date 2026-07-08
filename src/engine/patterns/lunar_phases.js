export default {
  id: 'lunar_phases',
  name: 'Lunar Phases',
  category: 'Cosmos',
  added: '2026-07-07',
  description: 'The moon cycling through its phases — cratered discs from new to full on a starlit field.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 p = (fract(uv) - 0.5) * 2.2;
      vec4 col = u_secondary_color;
      // sparse stars
      float star = step(0.995, hash(floor(uv * 9.0))) * hash(floor(uv * 9.0) + 4.0);
      col.rgb += star * 0.8;
      float r = length(p);
      float disc = smoothstep(1.0, 0.97, r);
      // phase index marches across the grid
      float idx = mod(cell.x + cell.y * 3.0, 8.0);
      float phase = idx / 8.0 * 6.28318; // 0..2pi
      // terminator: ellipse whose width follows cos(phase)
      float termX = cos(phase);
      float onLit = 0.0;
      if (r < 1.0) {
        float sphereX = p.x / max(sqrt(max(1.0 - p.y * p.y, 0.001)), 0.001);
        // waxing: light from the right
        float lit = step(termX, sphereX);
        // second half of cycle flips
        onLit = mix(lit, 1.0 - lit, step(3.14159, phase));
      }
      // crater texture on the lit surface
      float craters = 0.85 + 0.15 * snoise(p * 4.0 + cell * 7.0);
      float maria = smoothstep(0.1, 0.5, snoise(p * 1.6 + cell * 3.0)) * 0.25;
      vec3 moon = u_primary_color.rgb * craters * (1.0 - maria);
      vec3 dark = u_primary_color.rgb * 0.08;
      col.rgb = mix(col.rgb, mix(dark, moon, onLit), disc);
      // earthshine rim
      col.rgb += disc * (1.0 - onLit) * smoothstep(0.9, 1.0, r) * 0.06;
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Moon Density', type: 'float', min: 2.0, max: 12.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Moon', type: 'color', default: [0.85, 0.84, 0.8, 1.0] },
    { id: 'u_secondary_color', name: 'Night Sky', type: 'color', default: [0.03, 0.04, 0.08, 1.0] }
  ],
  variants: [
    { name: 'Silver Moon', uniforms: { u_primary_color: [0.85, 0.84, 0.8, 1.0], u_secondary_color: [0.03, 0.04, 0.08, 1.0] } },
    { name: 'Harvest', uniforms: { u_primary_color: [0.95, 0.7, 0.4, 1.0], u_secondary_color: [0.06, 0.03, 0.05, 1.0] } },
    { name: 'Blue Hour', uniforms: { u_primary_color: [0.75, 0.82, 0.95, 1.0], u_secondary_color: [0.05, 0.08, 0.16, 1.0] } }
  ]
};

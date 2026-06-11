export default {
  id: 'sonar_ping',
  name: 'Sonar Ping',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'A submarine sonar scope mid-sweep: phosphor range rings, bearing spokes, a fading sweep wedge, and hot contact blips.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float r = length(uv) * 2.0;          // 0 centre → 1 scope edge
      float ang = atan(uv.y, uv.x);        // -pi..pi
      float bearing = fract(ang / 6.28318 + 0.5); // 0..1 around the dial

      vec3 phos = u_screen_color.rgb;

      // --- CRT base: dark green glass with phosphor grain ---
      vec3 col = phos * 0.045;
      col += phos * (noise(v_uv * 300.0) * 0.04);          // phosphor grain
      col += phos * 0.05 * exp(-r * r * 2.0);              // centre glow
      // faint horizontal raster lines
      col += phos * 0.025 * step(0.5, fract(v_uv.y * 180.0));

      // --- range rings ---
      float ringf = fract(r * u_rings);
      float ring = smoothstep(0.06, 0.0, abs(ringf - 0.5) - 0.44);
      col += phos * ring * 0.30 * step(r, 1.0);
      // bold outer bezel ring
      col += phos * smoothstep(0.02, 0.0, abs(r - 0.98)) * 0.8;

      // --- bearing spokes every 30 degrees ---
      float spoke = fract(bearing * 12.0);
      float spoke_l = smoothstep(0.035, 0.0, min(spoke, 1.0 - spoke)) * 0.14;
      col += phos * spoke_l * step(r, 0.98);
      // crosshair main axes brighter
      float axis = min(abs(uv.x), abs(uv.y));
      col += phos * smoothstep(0.004, 0.0, axis) * 0.20 * step(r, 0.98);

      // --- rotating sweep wedge with phosphor decay trail ---
      float sweep_pos = fract(u_sweep);
      float behind = fract(sweep_pos - bearing);   // 0 at the sweep line
      float trail = exp(-behind * 9.0);            // decays around the dial
      col += phos * trail * 0.35 * step(r, 0.97) * smoothstep(0.0, 0.08, r);
      // the sweep line itself, hot
      col += phos * 1.6 * smoothstep(0.012, 0.0, behind) * step(r, 0.97);

      // --- contact blips: lit when the sweep has recently passed ---
      float blip = 0.0;
      for (int j = 0; j < 3; j++) {
        for (int i = 0; i < 3; i++) {
          vec2 cell = vec2(float(i), float(j));
          float h = hash(cell * 17.3 + 5.1);
          if (h > u_contacts) continue;
          vec2 bp = vec2(hash(cell + 31.7), hash(cell + 57.2)) - 0.5;
          bp *= 1.6;
          float br = length(bp);
          if (br > 0.85 || br < 0.12) continue;
          float bb = fract(atan(bp.y, bp.x) / 6.28318 + 0.5);
          float fade = exp(-fract(sweep_pos - bb) * 5.0);
          vec2 d = uv - bp * 0.5;
          blip += exp(-dot(d, d) * 6000.0) * (0.4 + fade);
        }
      }
      col += mix(phos, vec3(1.0, 0.9, 0.5), 0.4) * blip * 1.4;

      // glass vignette and outside-the-scope falloff
      col *= 1.0 - smoothstep(0.98, 1.15, r) * 0.85;
      col += phos * 0.012; // ambient glass tint

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rings',        name: 'Range Rings',   type: 'float', min: 2.0, max: 10.0, default: 5.0 },
    { id: 'u_sweep',        name: 'Sweep Bearing', type: 'float', min: 0.0, max: 1.0,  default: 0.62 },
    { id: 'u_contacts',     name: 'Contact Density', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_screen_color', name: 'Phosphor Color', type: 'color', default: [0.20, 1.0, 0.45, 1.0] }
  ]
};

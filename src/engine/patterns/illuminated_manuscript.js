export default {
  id: 'illuminated_manuscript',
  name: 'Illuminated Manuscript',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'Aged parchment banded with gold-leaf diamond lattice, vine flourishes in gilt ink, and lapis-and-crimson berries — the gold catches sharp specular glints.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float row = floor(uv.y);
      float fy = fract(uv.y);
      // parchment: mottled fbm, fiber streaks, age staining
      float mote = fbm(uv * 2.7 + row * 0.31);
      float fiber = noise(vec2(uv.x * 30.0, uv.y * 4.0));
      vec3 parch = u_secondary_color.rgb * (0.86 + 0.2 * mote);
      parch *= 1.0 - u_age * 0.28 * smoothstep(0.45, 0.85, fbm(uv * 1.3 + 7.0));
      parch *= 0.96 + 0.07 * fiber;
      vec3 col = parch;
      // gold leaf: broad sheen plus pinpoint specular sparkle
      float sheen = 0.72 + 0.5 * noise(uv * 5.0);
      float glint = step(0.975, hash(floor(v_uv * 900.0)));
      vec3 gold = u_primary_color.rgb * sheen + vec3(1.0, 0.95, 0.8) * glint * 0.85;
      gold *= 1.0 - u_age * 0.18 * noise(uv * 9.0 + 3.0);
      vec3 crimson = vec3(0.52, 0.10, 0.14) * (0.85 + 0.3 * mote);
      float band = u_band;
      if (fy < band) {
        // gold diamond lattice with alternating lapis / crimson fills
        float cs = band * 0.5;
        vec2 dpv = vec2(uv.x, fy) / cs;
        vec2 dc = floor(dpv);
        vec2 df = fract(dpv) - 0.5;
        float dd = abs(df.x) + abs(df.y);
        float checker = mod(dc.x + dc.y, 2.0);
        vec3 fill = mix(u_accent_color.rgb, crimson, checker);
        fill *= 0.78 + 0.38 * hash(dc + 3.7);
        float inside = smoothstep(0.015, 0.05, fy) * smoothstep(0.015, 0.05, band - fy);
        col = mix(col, fill, inside * smoothstep(0.42, 0.33, dd));
        float lat = smoothstep(0.10, 0.045, abs(dd - 0.5));
        col = mix(col, gold, inside * lat);
      } else {
        // vine flourish field between the bands
        float mid = band + (1.0 - band) * 0.5;
        float amp = (1.0 - band) * 0.2;
        float vy = fy - mid;
        float d1 = abs(vy - amp * sin(uv.x * 2.0943951));
        float vine = smoothstep(0.022, 0.009, d1);
        float d2 = abs(vy + amp * 0.7 * sin(uv.x * 4.1887902 + 1.6));
        float vine2 = smoothstep(0.014, 0.005, d2);
        col = mix(col, gold * 0.55, vine2 * 0.7);
        col = mix(col, gold, vine);
        // berries riding the vine, lapis or crimson, with a gold companion dot
        float bcx = floor(uv.x * 1.5 + 0.5);
        float bxc = bcx / 1.5;
        vec2 bp = vec2(uv.x - bxc, vy - amp * sin(bxc * 2.0943951) - 0.07);
        float rnd = hash(vec2(bcx, row));
        float berry = smoothstep(0.012, -0.012, length(bp) - 0.035) * step(0.25, rnd);
        vec3 bcol = mix(u_accent_color.rgb, crimson, step(0.6, rnd));
        col = mix(col, bcol * (0.85 + 0.3 * hash(vec2(bcx, row + 7.0))), berry);
        float dotd = length(bp - vec2(0.0, 0.095)) - 0.013;
        col = mix(col, gold, smoothstep(0.009, -0.009, dotd) * step(0.25, rnd));
      }
      // gold rule lines framing each band
      float rule = smoothstep(0.014, 0.006, min(abs(fy - 0.02), abs(fy - band - 0.025)));
      col = mix(col, gold, rule);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Band Count', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_band', name: 'Band Width', type: 'float', min: 0.2, max: 0.5, default: 0.32 },
    { id: 'u_age', name: 'Aging', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_primary_color', name: 'Gold Leaf', type: 'color', default: [0.85, 0.66, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Parchment', type: 'color', default: [0.87, 0.80, 0.64, 1.0] },
    { id: 'u_accent_color', name: 'Lapis', type: 'color', default: [0.12, 0.20, 0.50, 1.0] }
  ],
  variants: [
    { name: 'Gilded Lapis', uniforms: { u_scale: 3.0, u_band: 0.32, u_age: 0.6, u_primary_color: [0.85, 0.66, 0.25, 1.0], u_secondary_color: [0.87, 0.80, 0.64, 1.0], u_accent_color: [0.12, 0.20, 0.50, 1.0] } },
    { name: 'Crimson Vellum', uniforms: { u_scale: 4.0, u_band: 0.4, u_age: 0.9, u_primary_color: [0.88, 0.70, 0.30, 1.0], u_secondary_color: [0.80, 0.68, 0.52, 1.0], u_accent_color: [0.45, 0.08, 0.10, 1.0] } },
    { name: 'Midnight Gospel', uniforms: { u_scale: 3.0, u_band: 0.32, u_age: 0.4, u_primary_color: [0.90, 0.75, 0.35, 1.0], u_secondary_color: [0.09, 0.09, 0.14, 1.0], u_accent_color: [0.60, 0.68, 0.80, 1.0] } }
  ]
};

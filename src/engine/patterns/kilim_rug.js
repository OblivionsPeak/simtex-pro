export default {
  id: 'kilim_rug',
  name: 'Kilim Rug',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Anatolian flatweave kilim: hooked geometric medallions in madder red and indigo with abrash — the horizontal colour shifts of hand-dyed wool lots — over a tight weft-faced rib.',
  shader: `
    float tri_klm(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    // stepped (slit-weave) value: kilims build curves from discrete weft steps
    float steps_klm(float x, float n) {
      return floor(x * n + 0.5) / n;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Vegetable-dye palette ---
      vec3 madder  = u_field_color.rgb;            // red field
      vec3 indigo  = vec3(0.13, 0.17, 0.34);
      vec3 cream   = vec3(0.88, 0.82, 0.68);
      vec3 ochre   = vec3(0.72, 0.52, 0.18);
      vec3 brown   = vec3(0.22, 0.14, 0.10);

      // --- Medallion lattice ---
      float reps = u_medallions;
      vec2 g = vec2(uv.x * reps, uv.y * reps * 1.2);
      g.x += mod(floor(g.y), 2.0) * 0.5;
      vec2 f = fract(g) - 0.5;

      // stepped diamond distance — slit-tapestry steps, not smooth lines
      float sx = steps_klm(abs(f.x), 9.0);
      float sy = steps_klm(abs(f.y), 9.0);
      float dia = (sx + sy) * 2.0;

      // hooks (ram's horn) on the medallion shoulders
      float ang = atan(f.y, f.x);
      float hook = step(0.42, tri_klm(ang / 6.28318 * 8.0)) * step(abs(dia - 0.62), 0.10);

      vec3 col = madder;
      if (dia < 0.18)      col = brown;     // eye
      else if (dia < 0.34) col = cream;
      else if (dia < 0.52) col = indigo;
      else if (dia < 0.72) col = ochre;
      else if (dia < 0.86) col = indigo * 0.8 + madder * 0.2;
      col = mix(col, brown, hook);

      // diamond outline accents
      float outline = step(abs(dia - 0.34), 0.035) + step(abs(dia - 0.72), 0.035);
      col = mix(col, brown, clamp(outline, 0.0, 1.0) * 0.8);

      // small filler stars between medallions
      float filler = step(1.55, dia) * step(tri_klm(g.x * 3.0) + tri_klm(g.y * 3.0), 0.35);
      col = mix(col, cream, filler);

      // --- Abrash: horizontal dye-lot shifts ---
      float lot = floor(uv.y * 40.0);
      float ab = noise(vec2(lot * 0.23, 3.7)) - 0.5;
      float ab2 = fbm(vec2(uv.y * 6.0, 1.0)) * 0.5;
      col *= 1.0 + (ab * 0.55 + ab2 * 0.3) * u_abrash;
      col = mix(col, col * vec3(1.06, 0.97, 0.90), (ab + 0.5) * u_abrash * 0.4);

      // --- Flatweave structure: dominant weft ribs, hidden warp ---
      float rib = sin(uv.y * 3.14159 * 200.0) * 0.5 + 0.5;
      col *= 0.84 + 0.16 * rib;
      // warp shows as faint vertical valleys
      float warp = tri_klm(uv.x * 80.0);
      col *= 0.95 + 0.05 * warp;

      // slit shadows where colours meet vertically
      float slit = smoothstep(0.04, 0.0, abs(f.x) - 0.02) * step(0.3, dia) * step(dia, 1.0);
      col *= 1.0 - slit * 0.10;

      // wool grain
      col *= 0.93 + 0.11 * noise(uv * 170.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_medallions',  name: 'Medallion Repeats', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_abrash',      name: 'Abrash Shift',      type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_field_color', name: 'Field Color',       type: 'color', default: [0.58, 0.16, 0.13, 1.0] }
  ]
};

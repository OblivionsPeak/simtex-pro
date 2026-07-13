export default {
  id: 'tearoff_stack',
  name: 'Tear-Off Stack',
  category: 'Racing',
  added: '2026-07-13',
  description: 'Dense shingled stack of visor tear-off films — overlapping translucent sheets that deepen where layers pile up, with bright edges, curled corners and grime on the buried layers.',
  shader: `
    mat2 rotT(float a) { return mat2(cos(a), -sin(a), sin(a), cos(a)); }
    float sheetSDF(vec2 p, vec2 b, float r) {
      vec2 d = abs(p) - b + r;
      return length(max(d, 0.0)) - r;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // deepest buried films — never a void, always reads as bottom of the stack
      float dust = fbm(uv * 3.0);
      vec3 deep = mix(u_primary_color.rgb * 0.28, u_accent_color.rgb, 0.35 + 0.35 * u_grime);
      deep = mix(deep, u_secondary_color.rgb, 0.45);
      vec3 col = deep * (0.80 + 0.20 * dust);
      // four shingle layers, oldest (grimiest) first, freshest film on top
      for (int L = 0; L < 4; L++) {
        float fl = float(L);
        float age = 1.0 - fl / 3.0;
        // each layer gets its own drifted, slightly re-scaled grid
        vec2 g = uv * (1.0 + fl * 0.07) + vec2(fl * 3.71, fl * 1.93);
        vec2 cell = floor(g);
        vec2 f = fract(g);
        // 3x3 neighborhood so films spill across cell borders and overlap
        for (int j = -1; j <= 1; j++) {
          for (int i = -1; i <= 1; i++) {
            vec2 o = vec2(float(i), float(j));
            vec2 id = cell + o;
            float r1 = hash(id + fl * 17.13 + 3.0);
            float r2 = hash(id + fl * 29.71 + 7.0);
            float r3 = hash(id + fl * 41.37 + 11.0);
            vec2 ctr = o + vec2(0.5) + (vec2(r1, r2) - 0.5) * 0.36;
            float ang = (r3 - 0.5) * (0.22 + 0.34 * age);
            vec2 p = rotT(ang) * (f - ctr);
            vec2 b = vec2(0.74, 0.56);
            float d = sheetSDF(p, b, 0.10);
            float m = 1.0 - smoothstep(-0.010, 0.010, d);
            // soft cast shadow just outside each film, sells the stacking
            float sh = (1.0 - smoothstep(0.0, 0.055, d)) * (1.0 - m);
            col *= 1.0 - 0.28 * sh;
            if (m > 0.001) {
              float gr = age * u_grime;
              float smudge = noise(p * 5.0 + id * 4.7);
              // blue-gray film tint drifting toward grime on old layers
              vec3 tint = mix(u_primary_color.rgb, u_accent_color.rgb, gr * (0.40 + 0.60 * smudge));
              // translucent: lower stack shows through, so overlaps deepen
              float density = u_film * (0.45 + 0.55 * gr);
              vec3 sheet = mix(col, tint, density);
              // dust motes settling on the older films
              float speck = step(0.94 - 0.05 * gr, hash(floor((p + id) * 46.0)));
              sheet = mix(sheet, u_accent_color.rgb * 0.7, speck * gr * 0.6);
              // bright thin highlight along the film edge
              float rim = smoothstep(-0.040, -0.012, d) * m;
              sheet += vec3(0.85, 0.92, 1.0) * rim * rim * 0.38 * (1.0 - 0.55 * gr);
              // occasional curled corner catching the light
              if (r3 < 0.35) {
                vec2 cs = vec2(step(0.5, r1), step(0.5, r2)) * 2.0 - 1.0;
                vec2 q = p - cs * (b - vec2(0.13));
                float qd = length(q);
                float curl = 1.0 - smoothstep(0.03, 0.12, qd);
                sheet += vec3(0.95, 0.98, 1.0) * curl * (0.30 + 0.25 * (1.0 - gr));
                float crease = smoothstep(0.10, 0.14, qd) * (1.0 - smoothstep(0.15, 0.21, qd));
                sheet *= 1.0 - 0.22 * crease;
              }
              col = mix(col, sheet, m);
            }
          }
        }
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stack Tiling', type: 'float', min: 1.5, max: 8.0, default: 3.0 },
    { id: 'u_grime', name: 'Grime Buildup', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_film', name: 'Film Opacity', type: 'float', min: 0.15, max: 0.85, default: 0.45 },
    { id: 'u_primary_color', name: 'Fresh Film', type: 'color', default: [0.62, 0.78, 0.88, 1.0] },
    { id: 'u_accent_color', name: 'Grime Tint', type: 'color', default: [0.42, 0.33, 0.18, 1.0] },
    { id: 'u_secondary_color', name: 'Undertone', type: 'color', default: [0.09, 0.09, 0.10, 1.0] }
  ],
  variants: [
    { name: 'Fresh Stack', uniforms: { u_scale: 3.0, u_grime: 0.25, u_film: 0.35, u_primary_color: [0.66, 0.82, 0.92, 1.0], u_accent_color: [0.45, 0.42, 0.32, 1.0], u_secondary_color: [0.08, 0.09, 0.11, 1.0] } },
    { name: 'End of Stint', uniforms: { u_scale: 3.5, u_grime: 0.85, u_film: 0.55, u_primary_color: [0.70, 0.72, 0.68, 1.0], u_accent_color: [0.36, 0.26, 0.12, 1.0], u_secondary_color: [0.10, 0.09, 0.08, 1.0] } },
    { name: 'Smoke Tint', uniforms: { u_scale: 2.0, u_grime: 0.5, u_film: 0.6, u_primary_color: [0.38, 0.42, 0.48, 1.0], u_accent_color: [0.14, 0.13, 0.12, 1.0], u_secondary_color: [0.16, 0.16, 0.18, 1.0] } }
  ]
};

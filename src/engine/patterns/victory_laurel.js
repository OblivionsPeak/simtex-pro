export default {
  id: 'victory_laurel',
  name: 'Victory Laurel',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Laurel wreath rings repeated across the panel — paired leaves climbing two arcs to a crossed-ribbon base, gold-leaf print over felt green with plate misregistration.',
  shader: `
    // distance to a single laurel leaf: a lens shape, length L, half-width W
    float leaf_hrt6(vec2 p, float L, float W) {
      float t = clamp(p.x / L, 0.0, 1.0);
      float prof = sin(t * 3.14159) * W;
      return abs(p.y) - prof + step(p.x, 0.0) + step(L, p.x);
    }

    vec4 generate() {
      vec2 guv = v_uv * u_grid_scale;
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- palette: felt green field, gold-leaf wreath, blush misprint ---
      vec3 field  = u_field_color.rgb;
      vec3 gold   = u_wreath_color.rgb;
      vec3 gold_d = gold * 0.62;                       // shaded leaf half
      vec3 misreg = vec3(0.80, 0.35, 0.30);            // off-plate red ghost

      // felt texture: matte fibre + pressing marks
      vec3 col = field;
      col *= 0.95 + noise(v_uv * 380.0) * 0.07;
      col *= 0.985 + 0.03 * (fbm(v_uv * 6.0) * 0.5 + 0.5);

      float R = 0.34;                                  // wreath radius in cell
      float r = length(f);
      float ang = atan(f.y, f.x);                      // -pi..pi, 0 at right

      // wreath occupies two arcs, open at the top (the victory gap)
      float wreath = 0.0;
      float ghost = 0.0;

      // leaves march along the ring; 9 leaf pairs per side
      for (int i = 0; i < 9; i++) {
        float fi = float(i);
        // arc parameter: from bottom (-90 deg) up each side, stopping short of the top
        float a = -1.5708 + (0.30 + fi * 0.28);        // right side angles
        for (int s = 0; s < 2; s++) {
          float side = (s == 0) ? 1.0 : -1.0;
          float aa2 = (s == 0) ? a : 3.14159 - a;      // mirror to the left side
          vec2 c = vec2(cos(aa2), sin(aa2)) * R;
          // leaf points along the ring tangent, tipped outward
          float tip = aa2 + side * 1.45;
          vec2 lp = f - c;
          lp = mat2(cos(tip), sin(tip), -sin(tip), cos(tip)) * lp;
          float ld = leaf_hrt6(lp, 0.085, 0.026);
          wreath = max(wreath, smoothstep(0.012, -0.012, ld));
          // misregistered ghost plate, nudged down-right
          float gd = leaf_hrt6(lp - vec2(0.008, -0.006), 0.085, 0.026);
          ghost = max(ghost, smoothstep(0.012, -0.012, gd));
        }
      }

      // stem arcs beneath the leaves
      float stem = smoothstep(0.006, 0.0, abs(r - R) - 0.004) *
                   step(sin(ang), 0.86);               // fades out at the top gap
      wreath = max(wreath, stem * 0.9);

      // crossed ribbon at the base: two short angled bars
      vec2 rb = f - vec2(0.0, -R);
      float rib1 = step(abs(rb.x * 0.86 + rb.y * 0.5), 0.018) * step(length(rb), 0.10);
      float rib2 = step(abs(rb.x * 0.86 - rb.y * 0.5), 0.018) * step(length(rb), 0.10);
      wreath = max(wreath, max(rib1, rib2));

      // print the ghost plate first (only where the gold misses it)
      col = mix(col, misreg, ghost * (1.0 - wreath) * 0.45);

      // gold leaf: alternating light/dark leaf halves via angle banding
      vec3 leaf_c = mix(gold_d, gold, step(0.0, sin(ang * 18.0 + cell.x)));
      // gold pickout glints
      leaf_c += step(0.93, hash(floor((f + cell) * 90.0))) * 0.25;
      col = mix(col, leaf_c, wreath);

      // ink starvation: print fades where the felt texture is deepest
      col = mix(col, field, wreath * smoothstep(0.65, 0.95, noise((f + cell) * 50.0)) * 0.5);

      // soft emboss shadow under the whole wreath
      col *= 1.0 - smoothstep(R + 0.10, R - 0.05, r) * (1.0 - wreath) * 0.06;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grid_scale', name: 'Wreaths Per Tile', type: 'float', min: 1.0, max: 5.0, default: 2.0 },
    { id: 'u_field_color', name: 'Field Colour', type: 'color', default: [0.10, 0.25, 0.16, 1.0] },
    { id: 'u_wreath_color', name: 'Wreath Colour', type: 'color', default: [0.85, 0.68, 0.28, 1.0] }
  ]
};

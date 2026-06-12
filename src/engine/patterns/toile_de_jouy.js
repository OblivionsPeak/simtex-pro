export default {
  id: 'toile_de_jouy',
  name: 'Toile de Jouy',
  category: 'Textile',
  added: '2026-06-12',
  description: 'French toile: one-colour pastoral vignettes — tree, cottage and grounds — copper-plate printed in fine engraved hatching on cream cotton, repeated in offset drops.',
  shader: `
    // soft ellipse mask
    float ell_tdj(vec2 p, vec2 c, vec2 r) {
      return 1.0 - smoothstep(0.85, 1.05, length((p - c) / r));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Cream cotton ground ---
      vec3 cream = vec3(0.94, 0.90, 0.81);
      vec3 ink   = u_ink_color.rgb;
      float weave_x = sin(uv.x * 3.14159 * 320.0) * 0.5 + 0.5;
      float weave_y = sin(uv.y * 3.14159 * 320.0) * 0.5 + 0.5;
      vec3 col = cream * (0.96 + 0.02 * weave_x + 0.02 * weave_y);
      col *= 0.96 + 0.06 * fbm(uv * 3.0);

      // --- Vignette cell, half-drop repeat ---
      float reps = u_repeats;
      vec2 g = uv * reps;
      float colm = floor(g.x);
      g.y += mod(colm, 2.0) * 0.5;
      vec2 f = fract(g);
      // hand-engraved wobble
      f += (vec2(noise(g * 7.0), noise(g * 7.0 + 31.0)) - 0.5) * 0.012;

      // --- Build the pastoral scene as a density field (0..1) ---
      float dens = 0.0;

      // ground line: gentle hill arcs
      float hill = 0.26 + 0.05 * sin(f.x * 6.28318) + 0.02 * sin(f.x * 18.85);
      float ground_band = smoothstep(hill, hill - 0.015, f.y) * smoothstep(hill - 0.10, hill - 0.04, f.y);
      dens = max(dens, ground_band * 0.55);

      // tree: trunk + foliage blobs
      float trunk = (1.0 - smoothstep(0.012, 0.026, abs(f.x - 0.30 + (f.y - 0.3) * 0.06)))
                  * step(hill - 0.02, f.y) * step(f.y, 0.52);
      dens = max(dens, trunk * 0.95);
      float fol = ell_tdj(f, vec2(0.30, 0.60), vec2(0.14, 0.12));
      fol = max(fol, ell_tdj(f, vec2(0.21, 0.52), vec2(0.09, 0.08)));
      fol = max(fol, ell_tdj(f, vec2(0.39, 0.53), vec2(0.09, 0.08)));
      // foliage is stippled, denser at the underside
      float stipple = noise(f * 60.0);
      dens = max(dens, fol * (0.45 + 0.35 * stipple) * (1.2 - f.y));

      // cottage: box body, triangle roof, door
      float body = step(0.58, f.x) * step(f.x, 0.80) * step(hill - 0.01, f.y) * step(f.y, 0.42);
      float roof_h = 0.42 + 0.14 * (1.0 - abs((f.x - 0.69) / 0.13));
      float roof = step(0.55, f.x) * step(f.x, 0.83) * step(0.42, f.y) * step(f.y, roof_h);
      float door = step(0.66, f.x) * step(f.x, 0.72) * step(hill - 0.01, f.y) * step(f.y, 0.34);
      dens = max(dens, body * 0.45 + roof * 0.85);
      dens = max(dens, door * 0.95);

      // bird: two small arcs in the sky
      vec2 bp = f - vec2(0.52, 0.80);
      float wing = 1.0 - smoothstep(0.010, 0.020, abs(length(vec2(abs(bp.x) - 0.022, bp.y * 1.6)) - 0.022));
      dens = max(dens, wing * step(abs(bp.x), 0.05) * step(abs(bp.y), 0.04));

      // floral spray filler in the opposite corner
      vec2 sp = f - vec2(0.82, 0.78);
      float spray = 1.0 - smoothstep(0.05, 0.09, abs(length(sp) - 0.10) - 0.02 * cos(atan(sp.y, sp.x) * 6.0));
      dens = max(dens, spray * 0.30 * step(length(sp), 0.16));

      // --- Copper-plate hatching: density renders as engraved line screen ---
      // hatch lines follow one diagonal; line width grows with density
      float hatch_t = fract((f.x + f.y) * u_hatch);
      float line_w = dens * 0.62;
      float hatch = smoothstep(line_w + 0.10, line_w - 0.05, abs(hatch_t - 0.5) * 2.0);
      // cross-hatch in the darkest areas
      float cross_t = fract((f.x - f.y) * u_hatch);
      float crossh = smoothstep(0.30, 0.05, abs(cross_t - 0.5) * 2.0) * smoothstep(0.6, 0.9, dens);
      float print = clamp(hatch * step(0.06, dens) + crossh, 0.0, 1.0);

      // plate tone: faint overall ink veil inside the vignette
      print = max(print, dens * 0.12);

      // ink sits into the weave; slight bleed
      print *= 0.85 + 0.15 * weave_x * weave_y;
      col = mix(col, ink, print * 0.92);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',   name: 'Vignette Repeats', type: 'float', min: 1.0,  max: 6.0,   default: 2.0 },
    { id: 'u_hatch',     name: 'Hatch Fineness',   type: 'float', min: 30.0, max: 160.0, default: 80.0 },
    { id: 'u_ink_color', name: 'Ink Color',        type: 'color', default: [0.20, 0.30, 0.55, 1.0] }
  ]
};

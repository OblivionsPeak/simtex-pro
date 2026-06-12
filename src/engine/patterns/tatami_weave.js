export default {
  id: 'tatami_weave',
  name: 'Tatami Weave',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Japanese tatami: tightly woven igusa rush straw in alternating panel directions, each strand subtly colour-shifted, panels bordered by dark brocade heri edge bands.',
  shader: `
    float tri_ttm(float x) {
      return abs(fract(x) - 0.5) * 2.0;
    }

    // straw matting running along axis t (length) and across axis s
    vec3 straw_ttm(float t, float s, vec2 seed, vec3 fresh, vec3 aged, float age_mix) {
      // individual rush strands across the weave
      float strand_id = floor(s * 90.0);
      float strand_f  = fract(s * 90.0);
      // every strand is its own plant: colour varies strand to strand
      float tone = hash(vec2(strand_id, seed.x));
      vec3 col = mix(fresh, aged, age_mix * (0.4 + 0.6 * tone));
      col *= 0.85 + 0.30 * tone;

      // rounded strand profile with sharp gulley between strands
      float prof = sin(strand_f * 3.14159);
      col *= 0.70 + 0.30 * prof;

      // weft binding: the rush bends over hidden warp at fine intervals
      float bind = tri_ttm(t * 60.0 + hash(vec2(strand_id, seed.y)) * 0.5);
      col *= 0.90 + 0.10 * smoothstep(0.0, 0.5, bind);

      // node marks along each strand (igusa stem joints)
      float node = smoothstep(0.93, 1.0, hash(vec2(strand_id, floor(t * 60.0))));
      col = mix(col, col * 0.72, node);

      // lengthwise fibre striations
      col *= 0.95 + 0.05 * sin(t * 900.0 + tone * 6.28);
      return col;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      vec3 fresh = vec3(0.55, 0.62, 0.38);   // new green igusa
      vec3 aged  = vec3(0.78, 0.68, 0.42);   // sun-yellowed straw

      // --- Panel grid: mats alternate orientation like a real room ---
      float panels = u_panels;
      vec2 pg = uv * panels;
      vec2 pid = floor(pg);
      vec2 pf = fract(pg);
      float flip = mod(pid.x + pid.y, 2.0);

      // straw runs horizontal on even panels, vertical on odd
      float t = mix(pf.x, pf.y, flip);
      float s = mix(pf.y, pf.x, flip);

      vec3 col = straw_ttm(t + pid.x * 0.31, s + pid.y * 0.17, pid + 1.0, fresh, aged, u_age);

      // panel-wide sheen: light catches each mat differently by direction
      float gloss = mix(
        pow(max(sin(pf.y * 3.14159), 0.0), 2.0),
        pow(max(sin(pf.x * 3.14159), 0.0), 2.0),
        flip);
      col *= 0.92 + 0.10 * gloss;
      // gentle wear toward panel centres
      col *= 0.96 + 0.07 * fbm(pg * 2.0 + pid);

      // --- Heri: dark cloth edge bands along the long sides of each mat ---
      float edge_s = min(s, 1.0 - s);
      float heri_w = 0.045;
      float heri = 1.0 - smoothstep(heri_w, heri_w + 0.012, edge_s);

      vec3 heri_col = u_heri_color.rgb;
      // brocade diamond figure woven into the heri band
      float hx = t * 26.0;
      float hy = (edge_s / heri_w) * 2.0;
      float fig = step(tri_ttm(hx) + tri_ttm(hy * 0.5), 0.55);
      vec3 heri_fig = mix(heri_col, heri_col * 1.8 + vec3(0.10, 0.08, 0.02), fig);
      // cloth weave on the band
      heri_fig *= 0.92 + 0.08 * sin(t * 800.0);
      // stitch line where heri meets straw
      float stitchline = 1.0 - smoothstep(0.004, 0.012, abs(edge_s - heri_w));

      col = mix(col, heri_fig, heri);
      col = mix(col, col * 0.6, stitchline * 0.7);

      // seam shadow between panels
      float seam = smoothstep(0.0, 0.015, pf.x) * smoothstep(1.0, 0.985, pf.x)
                 * smoothstep(0.0, 0.015, pf.y) * smoothstep(1.0, 0.985, pf.y);
      col *= 0.62 + 0.38 * seam;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_panels',     name: 'Mat Panels', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_age',        name: 'Straw Aging', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_heri_color', name: 'Edge Band',   type: 'color', default: [0.12, 0.10, 0.18, 1.0] }
  ]
};

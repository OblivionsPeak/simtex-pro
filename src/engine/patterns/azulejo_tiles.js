export default {
  id: 'azulejo_tiles',
  name: 'Azulejo Tiles',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Portuguese glazed tile quartets — cobalt ornament hand-painted on tin-white ground, fourfold mirrored motifs, fine crazing in the glaze and shadowed grout between tiles.',
  shader: `
    float hash_azu(vec2 p) {
      return fract(sin(dot(p, vec2(113.5, 271.9))) * 43141.5926);
    }

    // cobalt motif intensity at a point in mirrored quarter-tile space (0..0.5)
    float motif_azu(vec2 m, vec2 seed) {
      vec2 p = m - 0.5;            // centre of the full tile
      float r = length(p);
      float ang = atan(p.y, p.x);

      // central medallion: scalloped rosette
      float lobes = 0.16 + 0.05 * cos(ang * 8.0);
      float medal = smoothstep(0.035, 0.0, abs(r - lobes));
      medal += smoothstep(0.06, 0.0, r) * 0.9;

      // corner quarter-fans (these join into full rosettes across tiles)
      float rc = length(m);
      float fan = smoothstep(0.03, 0.0, abs(rc - 0.22))
                + smoothstep(0.025, 0.0, abs(rc - 0.30)) * 0.8;
      float fanAng = atan(m.y, m.x + 0.0001);
      fan *= 0.55 + 0.45 * cos(fanAng * 12.0);
      fan *= smoothstep(0.36, 0.30, rc);

      // foliate scroll connecting medallion to corners along the diagonal
      float diag = abs(m.x - m.y);
      float vine = smoothstep(0.035, 0.0, abs(diag - 0.06 * sin((m.x + m.y) * 9.0 + seed.x)))
                 * smoothstep(0.30, 0.36, rc) * smoothstep(0.62, 0.50, rc);

      // small dot accents
      vec2 dotP = m - vec2(0.34, 0.12);
      float dots = smoothstep(0.030, 0.012, length(dotP));
      dotP = m - vec2(0.12, 0.34);
      dots = max(dots, smoothstep(0.030, 0.012, length(dotP)));

      // edge border stripe framing each tile
      float edge = max(abs(p.x), abs(p.y));
      float border = smoothstep(0.012, 0.0, abs(edge - 0.42));

      return clamp(medal + fan * 0.9 + vine * 0.85 + dots + border * 0.8, 0.0, 1.0);
    }

    vec4 generate() {
      float n = floor(u_tile_count + 0.5) * 2.0; // quartets need an even grid
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv);

      // grout between tiles
      float groutW = 0.035;
      float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      float grout = smoothstep(groutW, groutW * 0.4, edge);

      // fourfold symmetry: mirror into the quarter so quartets compose
      vec2 m = f;
      if (m.x > 0.5) m.x = 1.0 - m.x;
      if (m.y > 0.5) m.y = 1.0 - m.y;

      vec2 quartet = floor(cell * 0.5);
      float ink = motif_azu(m, quartet * 0.61);

      // hand-painted wobble: brush edges bleed slightly into the glaze
      ink *= 0.82 + noise(uv * 26.0) * 0.30;
      ink = clamp(ink, 0.0, 1.0);

      // --- glaze colours ---
      vec3 white  = vec3(0.93, 0.94, 0.92);             // tin-glaze, faintly warm
      vec3 cobalt = u_blue_color.rgb;
      // pigment pools darker where strokes overlap
      vec3 paint = mix(cobalt * 1.15, cobalt * 0.55, smoothstep(0.4, 1.0, ink));
      vec3 tile = mix(white, paint, smoothstep(0.12, 0.45, ink));

      // glaze undulation: soft tonal waves where the glaze ran in the kiln
      float glaze = snoise(uv * 3.0 + cell * 7.3) * 0.5 + 0.5;
      tile *= 0.94 + glaze * 0.10;

      // crazing: fine crackle lines through the glaze
      float cr = noise(uv * 17.0 + 31.7);
      float craze = smoothstep(0.015, 0.0, abs(fract(cr * 4.0) - 0.5) * 0.5 - 0.23);
      craze *= u_crazing;
      tile = mix(tile, tile * 0.72, craze * 0.6);

      // specular sheen: each tile catches the light slightly differently
      float tilt = hash_azu(cell) * 2.0 - 1.0;
      float sheen = exp(-9.0 * pow(f.x - 0.5 - tilt * 0.18 + (f.y - 0.5) * 0.4, 2.0));
      tile += vec3(1.0) * sheen * 0.13;

      // grout: shadowed sand-grey mortar
      vec3 groutCol = vec3(0.62, 0.59, 0.55) * (0.85 + noise(uv * 60.0) * 0.2);
      groutCol *= smoothstep(0.0, groutW, edge) * 0.4 + 0.6;  // recessed shadow

      vec3 col = mix(groutCol, tile, grout);
      // tile edge casts a thin shade onto the grout line
      col *= 1.0 - (1.0 - grout) * 0.18;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_tile_count', name: 'Quartets', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_crazing',    name: 'Crazing',  type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_blue_color', name: 'Cobalt',   type: 'color', default: [0.12, 0.26, 0.58, 1.0] }
  ]
};

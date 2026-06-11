export default {
  id: 'bayer_dither',
  name: 'Bayer Dither',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Classic Macintosh ordered dithering — rolling dune gradients crushed to four inks through a hard 4×4 Bayer matrix, every cell a deliberate crosshatch.',
  shader: `
    // 4x4 Bayer threshold (0..1) without bitwise ops:
    // M4 = 4 * M2(fine) + M2(coarse), where M2(x,y) = 2x + 3y - 4xy
    float bayer4_bd(vec2 ip) {
      vec2 a = mod(ip, 2.0);
      vec2 b = mod(floor(ip * 0.5), 2.0);
      float qa = 2.0 * a.x + 3.0 * a.y - 4.0 * a.x * a.y;
      float qb = 2.0 * b.x + 3.0 * b.y - 4.0 * b.x * b.y;
      return (qa * 4.0 + qb + 0.5) / 16.0;
    }

    vec4 generate() {
      float cells = u_cell_count;
      vec2 ip = floor(v_uv * cells);
      vec2 cuv = (ip + 0.5) / cells;   // sample the image at cell centres -> crisp dither

      // the "photograph" being dithered: dunes under a hazy sky
      float field = cuv.y * 1.15 - 0.10;
      field += fbm(cuv * u_pattern_scale) * 0.45;
      field += sin(cuv.x * 6.2831 + fbm(cuv * 3.0 + 7.7) * 4.0) * 0.09;
      // a low sun disc burned into the field
      vec2 sun = cuv - vec2(0.68, 0.72);
      field += exp(-dot(sun, sun) * 40.0) * 0.55;
      field = clamp(field, 0.0, 1.0);

      // ordered dither down to 4 tone levels between ink and paper
      float t = bayer4_bd(ip);
      float q = floor(min(field, 0.9999) * 3.0 + t);
      q = clamp(q, 0.0, 3.0) / 3.0;
      vec3 col = mix(u_ink.rgb, u_paper.rgb, q);

      // aged-paper warmth creeping into the lightest cells
      float age = noise(cuv * 5.0) * 0.05;
      col = mix(col, col * vec3(1.0, 0.97, 0.90), q * age * 12.0);

      // subtle screen-photograph vignette so big tiles don't read flat
      vec2 vc = fract(v_uv) - 0.5;
      col *= 1.0 - dot(vc, vc) * 0.18;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cell_count', name: 'Dither Cells', type: 'float', min: 64.0, max: 400.0, default: 180.0 },
    { id: 'u_pattern_scale', name: 'Dune Scale', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_ink', name: 'Ink', type: 'color', default: [0.07, 0.07, 0.10, 1.0] },
    { id: 'u_paper', name: 'Paper', type: 'color', default: [0.93, 0.91, 0.85, 1.0] }
  ]
};

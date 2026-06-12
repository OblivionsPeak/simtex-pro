export default {
  id: 'widmanstatten_etch',
  name: 'Widmanstätten Etch',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Acid-etched iron meteorite — interlocking kamacite lamellae crossing at fixed angles, each band catching light differently, with taenite seams between.',
  shader: `
    // Triangle-wave band distance for one lamella direction:
    // 0 at band centre, 1 at band edge
    float band_wid(vec2 p, vec2 dir, float phase) {
      float t = dot(p, dir) + phase;
      return abs(fract(t) - 0.5) * 2.0;
    }

    vec4 generate() {
      vec2 uv = v_uv;
      vec2 p = uv * u_lattice_scale;

      // Octahedral structure: lamellae run in three directions ~60 deg apart,
      // with slight per-direction frequency differences so widths vary
      vec2 d0 = vec2(cos(0.20), sin(0.20)) * 1.00;
      vec2 d1 = vec2(cos(1.25), sin(1.25)) * 1.22;
      vec2 d2 = vec2(cos(2.30), sin(2.30)) * 0.86;

      // Slight waviness: real lamellae aren't laser-straight
      float wob = snoise(uv * 3.0) * 0.06;

      float b0 = band_wid(p, d0, 0.13 + wob);
      float b1 = band_wid(p, d1, 0.57 - wob);
      float b2 = band_wid(p, d2, 0.31 + wob * 0.5);

      // The winning lamella at this point = direction whose band centre
      // is closest. Track which direction won for orientation shading.
      float m = b0;
      float which = 0.0;
      if (b1 < m) { m = b1; which = 1.0; }
      if (b2 < m) { m = b2; which = 2.0; }

      // Band interior mask: inside a lamella vs in the taenite seam
      float interior = smoothstep(0.5 + u_seam_width * 0.2, 0.4, m);

      // --- Kamacite lamellae: brightness depends on crystal orientation ---
      // (the etched faces reflect differently — the defining look)
      vec3 metal = u_metal_color.rgb;
      float orient = which == 0.0 ? 0.55 : (which == 1.0 ? 0.95 : 0.75);
      // Plus coarse plate-to-plate variation within one direction
      float plate = floor(dot(p, which == 0.0 ? d0 : (which == 1.0 ? d1 : d2)) + 0.5);
      float ph = hash(vec2(plate, which * 17.0));
      orient *= 0.8 + ph * 0.4;

      vec3 lamella = metal * orient;

      // Fine etch striations running ALONG the winning lamella
      vec2 along = which == 0.0 ? vec2(-d0.y, d0.x) : (which == 1.0 ? vec2(-d1.y, d1.x) : vec2(-d2.y, d2.x));
      float stria = sin(dot(p, along) * 55.0 + ph * 30.0) * 0.5 + 0.5;
      lamella *= 0.90 + stria * 0.16;

      // Schreibersite glints: sparse bright metallic inclusions
      float glint = pow(hash(floor(p * 6.0) + which), 18.0);
      lamella += vec3(1.0, 0.97, 0.85) * glint * 0.7;

      // --- Taenite seams: bright nickel-rich ribbons between lamellae ---
      vec3 taenite = metal * 1.45 + 0.12;
      vec3 col = mix(taenite, lamella, interior);

      // Plessite fields: where all three bands are far from centre,
      // fill with fine-grained dark mottle
      float openness = min(min(1.0 - b0, 1.0 - b1), 1.0 - b2);
      float plessite = smoothstep(0.42, 0.30, openness);
      float grain = noise(p * 18.0);
      vec3 plessCol = metal * (0.35 + grain * 0.35);
      col = mix(col, plessCol, plessite * 0.8);

      // Etch contrast control
      col = mix(vec3(dot(col, vec3(0.333))), col, 0.85);
      col = (col - 0.45) * u_etch_contrast + 0.45;

      // Brushed metallic sheen sweeping the whole face
      float sheen = pow(clamp(1.0 - abs(uv.x * 0.8 + uv.y - 0.85) * 1.6, 0.0, 1.0), 3.0);
      col += sheen * 0.10;

      col += (hash(uv * 850.0) - 0.5) * 0.02;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_lattice_scale', name: 'Lattice Scale', type: 'float', min: 2.0, max: 18.0, default: 7.0 },
    { id: 'u_seam_width',    name: 'Taenite Seams', type: 'float', min: 0.0, max: 1.0,  default: 0.4 },
    { id: 'u_etch_contrast', name: 'Etch Contrast', type: 'float', min: 0.4, max: 2.0,  default: 1.0 },
    { id: 'u_metal_color',   name: 'Iron Tone',     type: 'color', default: [0.62, 0.60, 0.58, 1.0] }
  ]
};

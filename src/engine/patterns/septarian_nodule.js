export default {
  id: 'septarian_nodule',
  name: 'Septarian Nodule',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Dragon stone — brown mudstone polygons split by wide yellow calcite veins with bright crystalline cores and a fine secondary crack web.',
  shader: `
    vec2 hash2_sep(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Voronoi returning (F1, F2, cellHash)
    vec3 voro_sep(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float f1 = 8.0;
      float f2 = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_sep(i + g);
          float d = length(g + o - f);
          if (d < f1) { f2 = f1; f1 = d; id = fract(o.x * 29.3 + o.y * 13.7); }
          else if (d < f2) { f2 = d; }
        }
      }
      return vec3(f1, f2, id);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Slightly warped cell space so shrinkage polygons aren't too regular
      vec2 warped = uv + vec2(snoise(uv * 2.5), snoise(uv * 2.5 + 9.0)) * 0.05;
      vec3 v = voro_sep(warped * u_cell_scale);
      float edge = v.y - v.x;
      float id = v.z;

      // --- Mudstone polygon interiors ---
      vec3 mudA = vec3(0.32, 0.22, 0.14);
      vec3 mudB = vec3(0.45, 0.32, 0.20);
      vec3 mud = mix(mudA, mudB, fract(id * 7.7));
      // Sedimentary mottling
      float mottle = fbm(uv * 9.0 + id * 5.0) * 0.5 + 0.5;
      mud *= 0.75 + mottle * 0.45;
      // Interiors darken slightly toward vein contact (alteration halo)
      mud *= 0.7 + 0.3 * smoothstep(0.0, 0.35, edge);

      // --- Calcite veins (cell borders) ---
      float vw = u_vein_width * 0.16;
      float vein = smoothstep(vw, vw * 0.5, edge);
      float core = smoothstep(vw * 0.45, 0.0, edge);

      vec3 calcite = u_vein_color.rgb;            // honey yellow rim
      vec3 calcCore = calcite * 1.25 + 0.15;      // bright crystalline centre

      // Crystalline texture inside the veins: blocky sparkle
      float crystal = noise(uv * u_cell_scale * 30.0);
      float glint = pow(hash(floor(uv * u_cell_scale * 18.0)), 16.0);

      vec3 veinCol = calcite * (0.8 + crystal * 0.4);
      veinCol = mix(veinCol, calcCore, core);
      veinCol += glint * 0.6 * core;

      vec3 col = mix(veinCol, mud, 1.0 - vein);

      // Dark aragonite contact line where calcite meets mudstone
      float contact = exp(-pow((edge - vw) * 50.0, 2.0));
      col = mix(col, vec3(0.10, 0.07, 0.05), contact * 0.65);

      // --- Secondary fine crack web inside the polygons ---
      vec3 v2 = voro_sep(warped * u_cell_scale * 3.3 + 41.0);
      float crack2 = smoothstep(0.03, 0.0, v2.y - v2.x);
      col = mix(col, calcite * 0.6, crack2 * 0.4 * (1.0 - vein));

      // Polished-slab gloss
      float gloss = pow(clamp(1.0 - abs(uv.x - uv.y + 0.1) * 1.6, 0.0, 1.0), 4.0);
      col += gloss * 0.06;

      col += (hash(uv * 650.0) - 0.5) * 0.025;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cell_scale', name: 'Polygon Scale', type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_vein_width', name: 'Vein Width',    type: 'float', min: 0.1, max: 1.0,  default: 0.45 },
    { id: 'u_vein_color', name: 'Calcite Color', type: 'color', default: [0.88, 0.68, 0.22, 1.0] }
  ]
};

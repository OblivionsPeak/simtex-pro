export default {
  id: 'terracotta_roof',
  name: 'Terracotta Roof',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Overlapping barrel pantile courses — sun-fired clay cylinders with kiln-varied tone, deep shadow under each overlap, lichen blooms and dust washed into the troughs.',
  shader: `
    float hash_ter(vec2 p) {
      return fract(sin(dot(p, vec2(251.7, 113.3))) * 42371.8123);
    }

    vec4 generate() {
      float colsN = floor(u_columns + 0.5);
      float rowsN = floor(u_columns * 1.4 + 0.5);

      vec2 uv = v_uv * vec2(colsN, rowsN);
      float course = floor(uv.y);
      // every course staggers half a tile, like real laid pantiles
      uv.x += mod(course, 2.0) * 0.5;
      float colIdx = floor(uv.x);
      vec2 tile = vec2(mod(colIdx, colsN), mod(course, rowsN));
      vec2 f = fract(uv);

      // --- barrel profile across each tile (cylinder shading) ---
      float barrel = cos((f.x - 0.5) * 3.14159265);     // 1 at crown, 0 at troughs
      float crownLight = pow(max(barrel, 0.0), 1.6);

      // light comes from upper-left: crown highlight offset off-centre
      float hi = exp(-14.0 * pow(f.x - 0.38, 2.0));

      // --- course overlap: each row's tail tucks under the row above ---
      float lap = smoothstep(0.0, u_overlap, f.y);       // dark under the overlap
      float lapShadow = 1.0 - (1.0 - lap) * 0.55;
      // crisp cast-shadow line right at the butt edge
      float buttLine = smoothstep(0.0, 0.02, f.y) * 0.5 + 0.5;

      // slight downslope taper: tiles brighten toward their exposed end
      float taper = 0.92 + f.y * 0.10;

      // --- clay colour, varied per tile by kiln position ---
      float kiln = hash_ter(tile);
      vec3 clayA = u_clay_color.rgb;                     // standard fired orange
      vec3 clayB = clayA * vec3(0.72, 0.60, 0.55);       // over-fired, browner
      vec3 clayC = clayA * vec3(1.10, 1.02, 0.92);       // pale sandy batch
      vec3 clay = mix(clayA, clayB, smoothstep(0.55, 0.95, kiln));
      clay = mix(clay, clayC, smoothstep(0.45, 0.05, kiln) * 0.6);

      // fired-surface mottling and drag lines from extrusion
      float mottle = fbm(uv * 5.0 + tile * 3.1) * 0.5 + 0.5;
      clay *= 0.88 + mottle * 0.20;
      clay *= 0.96 + noise(vec2(uv.x * 90.0, uv.y * 14.0)) * 0.07; // along-tile drag

      // --- weathering ---
      float wn = fbm(v_uv * 6.0 + 17.3);
      // lichen: pale green-grey blooms favouring crowns and lower tile ends
      float lichen = smoothstep(0.45, 0.75, wn + crownLight * 0.15 + f.y * 0.1 - 0.2);
      lichen *= u_weathering;
      clay = mix(clay, vec3(0.62, 0.64, 0.52), lichen * 0.55);
      // dark dust and water staining settles in the troughs
      float trough = 1.0 - barrel;
      clay = mix(clay, clay * vec3(0.55, 0.50, 0.48),
                 trough * trough * u_weathering * (0.4 + wn * 0.4));

      // --- assemble shading ---
      vec3 col = clay;
      col *= 0.45 + crownLight * 0.65;        // cylinder form
      col += clay * hi * 0.30;                // sun highlight stripe
      col *= lapShadow * buttLine * taper;    // course shadows

      // trough gap: thin dark seam where adjacent barrels meet
      float seam = smoothstep(0.045, 0.0, min(f.x, 1.0 - f.x));
      col *= 1.0 - seam * 0.5;

      // chipped tile corners: occasional pale fracture at the exposed edge
      float chip = step(0.93, hash_ter(tile + 7.0)) *
                   smoothstep(0.12, 0.0, length(f - vec2(hash_ter(tile + 3.0), 0.97)));
      col = mix(col, clayC * 1.05, chip * 0.7);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_columns',    name: 'Tile Columns', type: 'float', min: 3.0,  max: 16.0, default: 7.0 },
    { id: 'u_overlap',    name: 'Overlap Shadow', type: 'float', min: 0.1, max: 0.5, default: 0.28 },
    { id: 'u_weathering', name: 'Weathering',   type: 'float', min: 0.0,  max: 1.0,  default: 0.5 },
    { id: 'u_clay_color', name: 'Clay',         type: 'color', default: [0.78, 0.42, 0.26, 1.0] }
  ]
};

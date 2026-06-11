export default {
  id: 'satellite_array',
  name: 'Satellite Array',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Orbital hardware skin — deep-blue photovoltaic cells in gridded panels, silver bus bars, kapton gold foil seams, and the odd sun-flash glint.',
  shader: `
    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Panel layout: large panels separated by structural rails ---
      float panels = u_panel_count;
      vec2 puv = uv * panels;
      vec2 pid = floor(puv);
      vec2 pf = fract(puv);

      // Rail gap between panels
      float railW = 0.045;
      float rail = step(pf.x, railW) + step(1.0 - railW, pf.x)
                 + step(pf.y, railW) + step(1.0 - railW, pf.y);
      rail = clamp(rail, 0.0, 1.0);

      // --- Cell grid inside each panel ---
      float cellsPer = 6.0;
      vec2 cuv = pf * cellsPer;
      vec2 cid = floor(cuv);
      vec2 cf = fract(cuv);
      vec2 cellKey = mod(pid * cellsPer + cid, panels * cellsPer);

      // Cell border (silver interconnect fingers)
      float borderW = 0.07;
      float border = step(cf.x, borderW) + step(1.0 - borderW, cf.x)
                   + step(cf.y, borderW) + step(1.0 - borderW, cf.y);
      border = clamp(border, 0.0, 1.0);

      // Bus bars: two vertical conductor stripes crossing each cell
      float bus = smoothstep(0.030, 0.012, abs(cf.x - 0.33))
                + smoothstep(0.030, 0.012, abs(cf.x - 0.67));
      bus = clamp(bus, 0.0, 1.0);

      // --- Cell face: anti-reflective blue with crystalline mottling ---
      vec3 cellBlue = u_cell_color.rgb;
      float crystal = noise(uv * 90.0 + hash(cellKey) * 13.0);
      float facets  = noise(uv * 28.0 + 41.0);
      vec3 face = cellBlue * (0.80 + 0.25 * crystal);
      face = mix(face, cellBlue * vec3(0.85, 1.05, 1.25), smoothstep(0.6, 0.85, facets) * 0.35);

      // Per-cell tint variance: manufacturing batch differences
      float batch = hash(cellKey + 7.7);
      face *= 0.92 + 0.14 * batch;

      // Dead cell: rare darkened failure
      float dead = step(0.97, hash(cellKey + 33.0));
      face = mix(face, vec3(0.05, 0.06, 0.09), dead * 0.8);

      // --- Sun glint: a moving-feel diagonal sheen across the array ---
      float sheen = pow(max(sin((uv.x + uv.y) * 3.14159265 * 1.0 + 0.6), 0.0), 6.0);
      face += vec3(0.85, 0.90, 1.0) * sheen * u_glint * 0.35;
      // Hard specular flash on a few lucky cells aligned with the sun
      float flash = step(0.985, hash(cellKey + 61.0)) * sheen;
      face += vec3(1.0, 0.98, 0.92) * flash * u_glint * 1.4;

      // --- Compose layers ---
      vec3 silver = vec3(0.72, 0.74, 0.78);
      vec3 col = face;
      col = mix(col, silver * (0.8 + 0.2 * crystal), border * 0.85);
      col = mix(col, silver * 1.05, bus * (1.0 - border) * 0.7);

      // Structural rails: dark anodized frame with rivet dots
      vec3 frame = vec3(0.13, 0.14, 0.17);
      float rivetPh = fract((pf.x + pf.y) * 14.0);
      float rivet = smoothstep(0.12, 0.05, abs(rivetPh - 0.5)) * rail;
      col = mix(col, frame * (0.9 + 0.2 * crystal), rail);
      col = mix(col, silver * 0.9, rivet * 0.5);

      // --- Kapton gold foil strip: one wrapped seam band per tile ---
      float foilBand = smoothstep(0.035, 0.020, abs(uv.y - 0.5));
      float crinkle = fbm(uv * vec2(40.0, 14.0)) * 0.5 + 0.5;
      vec3 kapton = vec3(0.85, 0.55, 0.12) * (0.7 + 0.6 * crinkle);
      kapton += vec3(1.0, 0.85, 0.4) * pow(crinkle, 4.0) * 0.8;
      col = mix(col, kapton, foilBand * u_foil);

      // Subtle panel-level lighting falloff (sun from upper-left)
      col *= 0.92 + 0.10 * (1.0 - (pf.x + pf.y) * 0.25);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_panel_count', name: 'Panel Count',  type: 'float', min: 1.0, max: 6.0, default: 3.0 },
    { id: 'u_glint',       name: 'Sun Glint',    type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_foil',        name: 'Kapton Seam',  type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_cell_color',  name: 'Cell Colour',  type: 'color', default: [0.07, 0.14, 0.38, 1.0] }
  ]
};

export default {
  id: 'rocket_plume',
  name: 'Rocket Plume',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A roaring engine exhaust column stacked with glowing mach diamonds — violet-blue core, white shock discs, and ragged orange combustion fringe.',
  shader: `
    vec4 generate() {
      vec2 uv = fract(v_uv);
      // Plume axis runs vertically down the tile centre
      float along = uv.y;                  // 0 = nozzle (top), 1 = downstream
      float across = (uv.x - 0.5) * 2.0;   // -1..1 across the plume

      // --- Plume envelope: necks in and flares out with distance ---
      float width = u_plume_width * (0.45 + 0.25 * sin(along * 9.0) * exp(-along * 1.2) + along * 0.55);
      // Turbulent edge raggedness grows downstream
      float edgeNoise = fbm(vec2(across * 3.0, along * 9.0)) * (0.15 + along * 0.5);
      float xa = abs(across) / max(width, 0.001) + edgeNoise * 0.45;

      float body = smoothstep(1.0, 0.55, xa);
      float coreMask = smoothstep(0.55, 0.0, xa);

      // --- Mach diamonds: periodic shock cells along the axis ---
      float cells = u_diamond_count;
      float ph = fract(along * cells);
      // Diamond shape: bright where the axial phase peak meets the centreline
      float diaAxial = exp(-pow((ph - 0.5) / 0.16, 2.0));
      float diaShape = exp(-pow(abs(across) / (width * 0.28 * (1.0 - abs(ph - 0.5))), 2.0));
      float diamonds = diaAxial * diaShape * exp(-along * 0.9);
      // Crossing oblique shock lines forming the X between diamonds
      float shockX = exp(-pow((abs(across) / max(width, 0.001) - abs(ph - 0.5) * 1.6) / 0.10, 2.0));
      shockX *= body * exp(-along * 1.1) * 0.5;

      // --- Combustion texture: streaming turbulence drawn downstream ---
      float streamTex = fbm(vec2(across * 7.0, along * 3.0 - fbm(vec2(across * 4.0, along * 6.0)))) * 0.5 + 0.5;
      float fineStreaks = noise(vec2(across * 30.0, along * 8.0));

      // --- Palette ---
      vec3 space    = vec3(0.012, 0.012, 0.025);
      vec3 coreCol  = u_core_color.rgb;            // violet-blue inner jet
      vec3 white    = vec3(1.0, 0.99, 0.95);
      vec3 flameOr  = vec3(1.0, 0.55, 0.15);       // outer combustion
      vec3 emberRed = vec3(0.70, 0.18, 0.05);

      vec3 col = space;

      // Outer fringe: orange fading to red embers downstream
      vec3 fringe = mix(flameOr, emberRed, smoothstep(0.2, 0.9, along));
      col += fringe * body * (0.4 + 0.6 * streamTex) * (1.0 - coreMask * 0.7);

      // Inner core column: hot blue, brightest near the nozzle
      float coreHeat = exp(-along * 1.6);
      col += coreCol * coreMask * (0.7 + 0.9 * coreHeat) * (0.75 + 0.35 * fineStreaks);

      // Mach diamonds blaze white over everything
      col += white * diamonds * u_diamond_glow * 2.2;
      col += coreCol * shockX * u_diamond_glow;

      // Nozzle-exit flash at the very top
      float exitFlash = exp(-along * 18.0) * coreMask;
      col += white * exitFlash * 1.2;

      // Sparse incandescent sparks swept downstream
      vec2 sg = floor(vec2(uv.x * 80.0, uv.y * 26.0));
      float spark = smoothstep(0.975, 1.0, hash(sg + 3.0)) * body;
      col += flameOr * spark * (0.6 + 0.4 * hash(sg + 9.0));

      // Soft ambient glow lighting the surrounding space
      col += fringe * exp(-pow(abs(across) / (width * 2.6), 2.0)) * 0.18;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_plume_width',   name: 'Plume Width',   type: 'float', min: 0.10, max: 0.50, default: 0.22 },
    { id: 'u_diamond_count', name: 'Mach Diamonds', type: 'float', min: 2.0,  max: 10.0, default: 5.0 },
    { id: 'u_diamond_glow',  name: 'Diamond Glow',  type: 'float', min: 0.2,  max: 2.0,  default: 1.0 },
    { id: 'u_core_color',    name: 'Core Colour',   type: 'color', default: [0.45, 0.55, 1.0, 1.0] }
  ]
};

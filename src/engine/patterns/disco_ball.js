export default {
  id: 'disco_ball',
  name: 'Disco Ball',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Mirror-tile skin of a spinning glitter ball — silvered facets each angled at a different light, coloured spots washing across them and four-point flares spiking off the hottest.',
  shader: `
    vec4 generate() {
      float facets = u_facets;
      vec2 uv = v_uv * facets;
      // alternate rows shift half a tile, like real glued mirror courses
      float row = floor(uv.y);
      uv.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;

      // --- each facet aims somewhere different ---
      float aim = hash(cell) * 6.2831;
      vec2 ndir = vec2(cos(aim), sin(aim));
      float catchlight = hash(cell + 17.0);
      catchlight = catchlight * catchlight;          // few bright, many dim

      // mirror base: cool silver with a gradient across the facet
      float grad = dot(f, ndir);
      vec3 silver = vec3(0.52, 0.55, 0.60);
      vec3 mirror = silver * (0.30 + catchlight * 1.1 + grad * 0.55);

      // each facet reflects one of the room's coloured lights
      float pick = hash(cell + 43.0);
      vec3 lightc = u_light_color.rgb;
      if (pick < 0.25)      lightc = vec3(0.30, 0.85, 1.00);   // cyan spot
      else if (pick < 0.5)  lightc = vec3(1.00, 0.75, 0.35);   // amber spot
      else if (pick < 0.7)  lightc = vec3(0.65, 0.40, 1.00);   // violet spot
      mirror = mix(mirror, mirror * (lightc * 1.6), 0.25 + catchlight * 0.45);

      // fine scratch swirl in the silvering
      mirror *= 0.94 + noise(uv * 60.0) * 0.12;

      // --- whole-sheet coloured washes sweeping across the ball ---
      vec2 s1 = v_uv - vec2(0.25, 0.70);
      vec2 s2 = v_uv - vec2(0.78, 0.30);
      mirror += u_light_color.rgb * exp(-dot(s1, s1) * 9.0) * 0.30;
      mirror += vec3(0.30, 0.85, 1.00) * exp(-dot(s2, s2) * 11.0) * 0.22;

      // --- grout gaps between tiles: dark adhesive with a glint ---
      float gap = min(min(f.x + 0.5, 0.5 - f.x), min(f.y + 0.5, 0.5 - f.y));
      float grout = 1.0 - smoothstep(0.025, 0.05, gap);
      vec3 col = mix(mirror, vec3(0.04, 0.04, 0.05), grout);
      // bevel: facet edge catches light opposite the grout
      float bevel = smoothstep(0.05, 0.025, gap) - smoothstep(0.025, 0.0, gap);
      col += silver * bevel * catchlight * 0.5;

      // --- four-point star flares off the hottest facets ---
      if (catchlight > 0.80) {
        float flare = exp(-abs(f.x) * 26.0) * exp(-f.y * f.y * 60.0)
                    + exp(-abs(f.y) * 26.0) * exp(-f.x * f.x * 60.0);
        flare *= exp(-length(f) * 3.0) * u_sparkle;
        col += (vec3(1.0) * 0.7 + lightc * 0.5) * flare * (catchlight - 0.6) * 3.0;
        // hot core
        col += vec3(1.0) * exp(-dot(f, f) * 700.0) * u_sparkle * 1.2;
      }

      // micro-glitter scattered across everything
      float micro = step(0.992, hash(floor(v_uv * facets * 6.0) + 3.0));
      col += lightc * micro * 0.6 * u_sparkle;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_facets', name: 'Facet Count', type: 'float', min: 8.0, max: 48.0, default: 18.0 },
    { id: 'u_sparkle', name: 'Flare Intensity', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_light_color', name: 'Spot Light', type: 'color', default: [1.0, 0.40, 0.80, 1.0] }
  ]
};

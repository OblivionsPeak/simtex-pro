export default {
  id: 'cratered_moon',
  name: 'Cratered Moon',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A battered lunar regolith plain — overlapping impact craters with sunlit rims and inky floor shadows, dusted with fine grey soil.',
  shader: `
    // Crater field at one scale: jittered grid of bowl-shaped depressions.
    // Returns height contribution (negative = bowl, positive = rim).
    float craters_clm(vec2 uv, float density, float seed) {
      float h = 0.0;
      vec2 g = floor(uv * density);
      vec2 f = fract(uv * density);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 cell = g + vec2(float(x), float(y));
          vec2 c = mod(cell, density); // wrap so the field tiles
          float exists = step(0.35, hash(c + seed));
          vec2 cp = vec2(hash(c + seed + 7.1), hash(c + seed + 19.3));
          float rad = 0.18 + 0.30 * hash(c + seed + 3.3);
          float d = length(f - vec2(float(x), float(y)) - cp) / rad;
          // Bowl with raised rim: -1 at centre, +rim bump near d=1
          float bowl = -(1.0 - smoothstep(0.0, 0.95, d));
          float rim = exp(-pow((d - 1.0) / 0.22, 2.0)) * 0.45;
          h += exists * (bowl + rim) * rad;
        }
      }
      return h;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Multi-scale crater height field ---
      float h = 0.0;
      h += craters_clm(uv, 4.0, 0.0) * 1.0;
      h += craters_clm(uv, 9.0, 41.0) * 0.55;
      h += craters_clm(uv, 21.0, 97.0) * 0.28;
      h *= u_crater_depth;

      // Rolling regolith undulation + fine soil grain
      h += fbm(uv * 6.0) * 0.10;
      float soil = noise(uv * 220.0) * 0.5 + noise(uv * 90.0 + 31.0) * 0.5;

      // --- Lighting: finite-difference normal, low raking sun ---
      float e = 0.004;
      float hx = craters_clm(uv + vec2(e, 0.0), 4.0, 0.0)
               + craters_clm(uv + vec2(e, 0.0), 9.0, 41.0) * 0.55
               + craters_clm(uv + vec2(e, 0.0), 21.0, 97.0) * 0.28;
      float hy = craters_clm(uv + vec2(0.0, e), 4.0, 0.0)
               + craters_clm(uv + vec2(0.0, e), 9.0, 41.0) * 0.55
               + craters_clm(uv + vec2(0.0, e), 21.0, 97.0) * 0.28;
      hx = (hx * u_crater_depth + fbm((uv + vec2(e, 0.0)) * 6.0) * 0.10 - h) / e;
      hy = (hy * u_crater_depth + fbm((uv + vec2(0.0, e)) * 6.0) * 0.10 - h) / e;

      vec2 sun = normalize(vec2(cos(u_sun_angle), sin(u_sun_angle)));
      float slope = -(hx * sun.x + hy * sun.y);
      float light = clamp(0.55 + slope * 0.85, 0.0, 1.4);

      // Crater floors fall into deep shadow
      float floorShade = smoothstep(-0.05, -0.30, h);
      light *= 1.0 - floorShade * 0.75;

      // --- Maria: large darker basalt patches ---
      float maria = smoothstep(0.55, 0.8, fbm(uv * 2.2 + 7.0) * 0.5 + 0.5);

      // --- Palette ---
      vec3 highland = u_surface_color.rgb;          // warm pale grey
      vec3 mariaCol = highland * vec3(0.52, 0.54, 0.60);
      vec3 col = mix(highland, mariaCol, maria * 0.8);

      // Soil grain and bright ray ejecta around fresh craters
      col *= 0.88 + 0.14 * soil;
      float rays = smoothstep(0.30, 0.55, h) * (0.5 + 0.5 * soil);
      col = mix(col, highland * 1.18, rays * 0.5);

      col *= light;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_crater_depth',  name: 'Crater Depth', type: 'float', min: 0.3, max: 2.0, default: 1.0 },
    { id: 'u_sun_angle',     name: 'Sun Angle',    type: 'float', min: 0.0, max: 6.28, default: 0.8 },
    { id: 'u_surface_color', name: 'Regolith',     type: 'color', default: [0.72, 0.71, 0.68, 1.0] }
  ]
};

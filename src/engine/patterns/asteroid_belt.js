export default {
  id: 'asteroid_belt',
  name: 'Asteroid Belt',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A drifting rubble field of tumbling grey asteroids — lumpy silhouettes, sun-struck facets, and fine dust motes strewn between them.',
  shader: `
    // One layer of asteroids on a wrapped jittered grid.
    // Returns vec2(rockMask, litShade)
    vec2 rocks_abl(vec2 uv, float density, float seed, float sizeMul) {
      float mask = 0.0;
      float shade = 0.0;
      vec2 g = floor(uv * density);
      vec2 f = fract(uv * density);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 cell = mod(g + vec2(float(x), float(y)), density);
          float exists = step(0.45, hash(cell + seed));
          vec2 cp = vec2(hash(cell + seed + 5.7), hash(cell + seed + 13.1));
          vec2 rel = f - vec2(float(x), float(y)) - cp;
          float rad = (0.10 + 0.16 * hash(cell + seed + 29.0)) * sizeMul;
          // Lumpy outline: perturb radius by angular noise per-rock
          float ang = atan(rel.y, rel.x);
          float lump = 1.0
            + 0.28 * sin(ang * 3.0 + hash(cell + seed + 3.0) * 6.28)
            + 0.16 * sin(ang * 7.0 + hash(cell + seed + 8.0) * 6.28)
            + 0.08 * sin(ang * 13.0 + hash(cell + seed + 21.0) * 6.28);
          float d = length(rel) / max(rad * lump, 0.001);
          float m = exists * smoothstep(1.0, 0.92, d);
          // Sun from upper-left: shade by position across the rock
          float s = clamp(0.5 - (rel.x + rel.y) / max(rad * 1.6, 0.001) * 0.5, 0.0, 1.0);
          // Terminator: dark limb on the far side
          s = mix(s, s * 0.25, smoothstep(0.55, 0.95, d));
          if (m > mask) { mask = m; shade = s; }
        }
      }
      return vec2(mask, shade);
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      vec3 space = vec3(0.010, 0.011, 0.022);
      vec3 col = space;

      // Faint zodiacal dust haze drifting through the belt
      float haze = fbm(uv * 3.0) * 0.5 + 0.5;
      col += vec3(0.06, 0.055, 0.05) * haze * 0.5;

      // Distant star pinpricks
      vec2 sg = floor(v_uv * 85.0);
      float star = smoothstep(0.965, 1.0, hash(sg + 3.3)) *
                   smoothstep(0.09, 0.0, length(fract(v_uv * 85.0) - vec2(hash(sg), hash(sg + 17.0))));
      col += vec3(0.8, 0.85, 1.0) * star * 0.9;

      // --- Three depth layers of rocks: far (small, dim) to near (large) ---
      vec3 rockBase = u_rock_color.rgb;
      float rough = noise(uv * 160.0) * 0.5 + noise(uv * 55.0 + 9.0) * 0.5;

      vec2 far = rocks_abl(uv, 14.0, 61.0, u_rock_size * 0.8);
      vec3 farCol = rockBase * (0.18 + 0.30 * far.y) * (0.85 + 0.15 * rough);
      col = mix(col, farCol, far.x);

      vec2 mid = rocks_abl(uv, 7.0, 23.0, u_rock_size);
      vec3 midCol = rockBase * (0.22 + 0.55 * mid.y) * (0.82 + 0.22 * rough);
      col = mix(col, midCol, mid.x);

      vec2 near = rocks_abl(uv, 3.0, 5.0, u_rock_size * 1.15);
      // Near rocks get crater pocks and a crisp specular facet
      float pocks = smoothstep(0.6, 0.85, noise(uv * 28.0 + 71.0));
      vec3 nearCol = rockBase * (0.25 + 0.75 * near.y);
      nearCol *= 0.80 + 0.25 * rough;
      nearCol = mix(nearCol, nearCol * 0.55, pocks * 0.6);
      nearCol += vec3(0.9, 0.88, 0.82) * pow(near.y, 4.0) * 0.30;
      col = mix(col, nearCol, near.x);

      // Tiny dust motes glinting between rocks
      vec2 dg = floor(uv * 200.0);
      float mote = smoothstep(0.985, 1.0, hash(dg + 47.0)) * u_dust;
      col += vec3(0.55, 0.52, 0.48) * mote * (1.0 - near.x);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rock_size',  name: 'Rock Size',   type: 'float', min: 0.5, max: 1.8, default: 1.0 },
    { id: 'u_dust',       name: 'Dust Motes',  type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_rock_color', name: 'Rock Colour', type: 'color', default: [0.58, 0.55, 0.52, 1.0] }
  ]
};

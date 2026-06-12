export default {
  id: 'brick_pavers',
  name: 'Brick Pavers',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Herringbone street pavers — clay brick laid in interlocking 2:1 herringbone, sanded joints sunk dark and damp, traffic-polished crowns and the odd spalled or sunken brick.',
  shader: `
    float hash_bpv(vec2 p) {
      return fract(sin(dot(p, vec2(283.1, 191.7))) * 41117.6173);
    }

    vec4 generate() {
      // herringbone period is 4 unit cells — keep the grid a multiple of 4
      float n = 4.0 * floor(u_scale + 0.5);
      vec2 uv = v_uv * n;
      vec2 cellF = floor(uv);
      vec2 p = uv;

      // --- herringbone decomposition: k = (x+y) mod 4 picks the brick ---
      float k = mod(cellF.x + cellF.y, 4.0);
      vec2 origin; vec2 bsize;
      if (k < 0.5)      { origin = cellF;                  bsize = vec2(2.0, 1.0); }
      else if (k < 1.5) { origin = cellF - vec2(1.0, 0.0); bsize = vec2(2.0, 1.0); }
      else if (k < 2.5) { origin = cellF;                  bsize = vec2(1.0, 2.0); }
      else              { origin = cellF - vec2(0.0, 1.0); bsize = vec2(1.0, 2.0); }

      vec2 brickId = mod(origin, n);
      vec2 lp = (p - origin) / bsize;       // 0..1 within the brick
      float horizontal = step(1.5, bsize.x); // 1 = long axis along x

      // distance to brick edge in even units
      vec2 ed = min(lp, 1.0 - lp) * bsize;
      float edge = min(ed.x, ed.y);
      float jointW = 0.055;
      float inBrick = smoothstep(jointW, jointW * 1.7, edge);

      // --- clay body, fired range per brick ---
      float fire = hash_bpv(brickId);
      vec3 base = u_brick_color.rgb;
      vec3 clay = base * (0.80 + fire * 0.40);
      // flashed ends: darker burn at one end of some bricks
      float endT = horizontal > 0.5 ? lp.x : lp.y;
      float flashed = step(0.6, hash_bpv(brickId + 9.0));
      clay = mix(clay, clay * vec3(0.62, 0.55, 0.55),
                 flashed * smoothstep(0.55, 0.95, endT) * 0.6);
      // wire-cut drag texture along the long axis
      vec2 dragUV = horizontal > 0.5 ? vec2(lp.x * 9.0, lp.y * 70.0)
                                     : vec2(lp.x * 70.0, lp.y * 9.0);
      clay *= 0.94 + noise(dragUV + brickId * 3.0) * 0.11;
      // gritty fired-surface speckle
      clay *= 0.96 + hash_bpv(floor(uv * 30.0)) * 0.07;

      // --- wear ---
      // crown polish: traffic burnishes the middle of every brick pale
      float crown = smoothstep(jointW, 0.42, edge);
      crown = crown * crown;
      float wearMap = fbm(v_uv * 5.0 + 11.0) * 0.5 + 0.5;   // wear is patchy
      clay = mix(clay, clay * 1.22 + vec3(0.04), crown * u_wear * (0.3 + wearMap * 0.7) * 0.5);
      // rounded arris: edges knocked down and lightened
      float arris = smoothstep(jointW * 1.7, jointW * 3.2, edge)
                  * smoothstep(jointW * 4.5, jointW * 3.2, edge);
      clay += clay * arris * 0.12 * u_wear;
      // scuff streaks dragged along the traffic direction
      float scuff = smoothstep(0.75, 0.95, noise(vec2(v_uv.x * 6.0, v_uv.y * 90.0)));
      clay = mix(clay, clay * 0.80, scuff * u_wear * crown * 0.5);

      // spalled bricks: frost-popped faces showing rough pale interior
      float spalled = step(0.93, hash_bpv(brickId + 21.0));
      float spall = spalled * smoothstep(0.45, 0.20,
        length((lp - vec2(0.5)) * bsize - (vec2(hash_bpv(brickId + 3.0), hash_bpv(brickId + 4.0)) - 0.5) * 0.5));
      vec3 spallCol = base * vec3(1.15, 1.05, 0.92) * (0.8 + noise(uv * 40.0) * 0.4);
      clay = mix(clay, spallCol, spall * 0.85);

      // sunken bricks sit a shade darker and damper
      float sunken = step(0.90, hash_bpv(brickId + 33.0)) * (1.0 - spalled);
      clay *= 1.0 - sunken * 0.16;

      // --- sand joints ---
      vec3 sand = vec3(0.45, 0.41, 0.36);
      sand *= 0.80 + noise(uv * 60.0) * 0.35;
      // joints hold damp: darkest at the centre line
      sand *= 0.55 + smoothstep(0.0, jointW, edge) * 0.45;
      // moss film in the dampest joints
      float moss = smoothstep(0.6, 0.85, fbm(v_uv * 7.0 + 29.0) * 0.5 + 0.5) * u_wear;
      sand = mix(sand, vec3(0.30, 0.36, 0.22), moss * 0.5);

      vec3 col = mix(sand, clay, inBrick);
      // brick shoulder drops a hairline shadow into the joint
      col *= 1.0 - (1.0 - inBrick) * smoothstep(jointW * 1.7, jointW * 0.8, edge) * 0.18;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',       name: 'Paver Scale', type: 'float', min: 1.0, max: 6.0, default: 3.0 },
    { id: 'u_wear',        name: 'Traffic Wear', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_brick_color', name: 'Clay',         type: 'color', default: [0.62, 0.33, 0.24, 1.0] }
  ]
};

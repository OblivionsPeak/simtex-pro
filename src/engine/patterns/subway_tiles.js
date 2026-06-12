export default {
  id: 'subway_tiles',
  name: 'Subway Tiles',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Running-bond glazed subway brick — 2:1 tiles with pillowed bevel edges, dark recessed grout, a tall ceramic reflection sliding across each tile and the odd off-batch tile in the field.',
  shader: `
    float hash_sub(vec2 p) {
      return fract(sin(dot(p, vec2(311.7, 137.1))) * 43017.3571);
    }

    vec4 generate() {
      float rows = floor(u_rows + 0.5);
      float cols = rows;                       // 2:1 tiles -> square overall grid

      vec2 uv = v_uv * vec2(cols, rows);
      float row = floor(uv.y);
      uv.x += mod(row, 2.0) * 0.5;             // running bond offset
      vec2 tile = vec2(mod(floor(uv.x), cols), mod(row, rows));
      vec2 f = fract(uv);

      float groutW = u_grout_width;

      // distance to tile edge, scaled so x and y read equally on a 2:1 tile
      vec2 d = min(f, 1.0 - f) * vec2(2.0, 1.0);
      float edge = min(d.x, d.y);

      float inTile = smoothstep(groutW, groutW * 1.6, edge);

      // --- pillowed bevel: glazed tiles bulge gently toward the middle ---
      float dome = smoothstep(groutW, 0.45, edge);
      dome = dome * dome * (3.0 - 2.0 * dome);

      // directional bevel light: top & left edges bright, bottom & right shaded
      float bev = smoothstep(groutW, groutW * 3.2, edge);
      float lightTL = (1.0 - bev) * (step(f.y, 0.5) * 0.5 + step(0.5, 1.0 - f.x) * 0.5);
      float shadeBR = (1.0 - bev) * (step(0.5, f.y) * 0.5 + step(0.5, f.x) * 0.5);

      // --- glaze colour ---
      vec3 glaze = u_tile_color.rgb;

      // batch variation: most tiles match, a few run warm or grey
      float batch = hash_sub(tile);
      glaze *= 0.96 + batch * 0.07;
      float odd = step(0.93, hash_sub(tile + 41.0));
      glaze = mix(glaze, glaze * vec3(0.93, 0.96, 1.04), odd * 0.8);

      // subtle glaze-thickness waves from the dip line
      glaze *= 0.96 + snoise(uv * vec2(2.0, 5.0) + tile * 3.3) * 0.04;

      // crazing-free but not sterile: faint kiln freckles
      glaze *= 0.985 + noise(uv * vec2(30.0, 60.0)) * 0.03;

      vec3 col = glaze;
      col *= 0.88 + dome * 0.16;                  // pillow form shading
      col += glaze * lightTL * 0.35;              // lit bevel
      col *= 1.0 - shadeBR * 0.22;                // shaded bevel

      // --- ceramic reflection: a tall soft window glare per tile ---
      // position drifts slightly per tile because none hang perfectly flat
      float rx = 0.36 + (hash_sub(tile + 7.0) - 0.5) * 0.10;
      float glare = exp(-26.0 * pow(f.x - rx, 2.0)) * (0.55 + 0.45 * dome);
      float glare2 = exp(-60.0 * pow(f.x - rx - 0.13, 2.0)) * 0.5;
      col += vec3(1.0) * (glare * 0.22 + glare2 * 0.10);

      // --- grout ---
      vec3 grout = u_grout_color.rgb;
      grout *= 0.85 + noise(uv * 70.0) * 0.25;        // sanded grout grain
      // grout sits recessed: darkest at the centre line of the joint
      grout *= 0.6 + smoothstep(0.0, groutW, edge) * 0.4;
      // soiling builds where joints intersect
      float cross = smoothstep(groutW * 2.0, 0.0, d.x) * smoothstep(groutW * 2.0, 0.0, d.y);
      grout *= 1.0 - cross * 0.25;

      col = mix(grout, col, inTile);
      // tile edge drops a hairline shadow onto the grout
      col *= 1.0 - (1.0 - inTile) * smoothstep(groutW * 1.6, groutW, edge) * 0.15;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rows',        name: 'Tile Rows',   type: 'float', min: 4.0,  max: 24.0, default: 10.0 },
    { id: 'u_grout_width', name: 'Grout Width', type: 'float', min: 0.02, max: 0.10, default: 0.045 },
    { id: 'u_tile_color',  name: 'Glaze',       type: 'color', default: [0.92, 0.93, 0.91, 1.0] },
    { id: 'u_grout_color', name: 'Grout',       type: 'color', default: [0.22, 0.21, 0.20, 1.0] }
  ]
};

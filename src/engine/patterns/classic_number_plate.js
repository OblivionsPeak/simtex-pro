export default {
  id: 'classic_number_plate',
  name: 'Classic Number Plate',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'Rounded competition number-plate rectangles repeating over body colour — painted white panels with keyline border, corner mounting rivets, and oversprayed edges.',
  shader: `
    // rounded-rectangle signed distance
    float rrect_hrt8(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec4 generate() {
      // staggered grid of plates
      vec2 guv = v_uv * u_grid_scale;
      float row = floor(guv.y);
      guv.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- palette: BRG body, ivory plate, black keyline ---
      vec3 body  = u_body_color.rgb;
      vec3 plate = u_plate_color.rgb;
      vec3 keyl  = vec3(0.08, 0.08, 0.09);
      vec3 rivet = vec3(0.70, 0.70, 0.72);

      // body paint: deep gloss with flake and a soft panel highlight
      vec3 col = body;
      col *= 0.965 + noise(v_uv * 540.0) * 0.05;
      col += smoothstep(0.6, 0.0, length(v_uv - vec2(0.3, 0.75))) * 0.04;

      vec2 half_pl = vec2(0.36, 0.27) * u_plate_size;
      float rad = min(half_pl.x, half_pl.y) * 0.5;

      // plate placement wanders a touch per cell — bolted on by hand
      vec2 off = (vec2(hash(cell + 3.0), hash(cell + 17.0)) - 0.5) * 0.05;
      vec2 p = f - off;

      float d = rrect_hrt8(p, half_pl, rad);
      float aa = 0.012;

      // overspray halo: body colour dusted lighter just outside the plate
      col = mix(col, mix(body, plate, 0.18),
                smoothstep(0.10, 0.0, d) * step(0.0, d) * 0.5);
      // mounting shadow below the plate
      col *= 1.0 - smoothstep(0.05, 0.0, rrect_hrt8(p + vec2(0.0, 0.025), half_pl, rad))
                 * step(0.0, d) * 0.15;

      // --- ivory plate ---
      float in_p = smoothstep(aa, -aa, d);
      vec3 p_col = plate;
      p_col *= 0.97 + noise((cell + p) * 260.0) * 0.05;          // brush-painted surface
      p_col *= 0.985 + 0.03 * noise(vec2(p.x * 70.0, p.y * 6.0)); // lateral brush striae
      // yellowing toward the plate edges, scrubbed cleaner in the middle
      p_col = mix(p_col, p_col * vec3(1.0, 0.97, 0.86),
                  smoothstep(-0.12, 0.0, d) * 0.4);
      col = mix(col, p_col, in_p);

      // --- black keyline border just inside the plate edge ---
      float key = smoothstep(aa, 0.0, abs(d + 0.035) - 0.012);
      col = mix(col, keyl, key * 0.92 * in_p);

      // chips along the keyline where stones have struck
      float chip = step(0.975, hash(floor((cell + p) * 150.0))) *
                   smoothstep(0.05, 0.0, abs(d + 0.035));
      col = mix(col, plate, chip * in_p * 0.85);

      // --- corner mounting rivets ---
      vec2 rp = abs(p) - half_pl + vec2(rad * 1.1);
      float rd = length(rp) - 0.022;
      float riv = smoothstep(0.008, -0.008, rd) * in_p;
      vec3 r_col = rivet * (0.85 + 0.3 * smoothstep(0.02, -0.02, length(rp + vec2(0.008))));
      col = mix(col, r_col, riv);
      // rivet dimple shadow
      col *= 1.0 - smoothstep(0.012, 0.0, abs(rd)) * in_p * 0.18;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grid_scale', name: 'Plates Per Tile', type: 'float', min: 1.0, max: 5.0, default: 2.0 },
    { id: 'u_plate_size', name: 'Plate Size', type: 'float', min: 0.5, max: 1.2, default: 0.95 },
    { id: 'u_body_color', name: 'Body Colour', type: 'color', default: [0.07, 0.23, 0.14, 1.0] },
    { id: 'u_plate_color', name: 'Plate Colour', type: 'color', default: [0.94, 0.92, 0.84, 1.0] }
  ]
};

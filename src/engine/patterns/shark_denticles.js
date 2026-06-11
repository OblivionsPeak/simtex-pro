export default {
  id: 'shark_denticles',
  name: 'Shark Denticles',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Overlapping rows of ridged dermal denticles — microscopic shark-skin armor combed in one drag-cutting direction.',
  shader: `
    // Signed shape of one denticle: tri-ridged teardrop pointing +x
    // Returns vec2(mask, ridge_height)
    vec2 denticle_shd(vec2 p, float ridge_amt) {
      // teardrop: wide head at x=-0.5 tapering to a point at x=+0.5
      float taper = smoothstep(0.55, -0.45, p.x);     // 1 head → 0 tip
      float half_w = 0.32 * taper + 0.04;
      float body = smoothstep(half_w, half_w - 0.10, abs(p.y))
                 * smoothstep(-0.52, -0.42, p.x)
                 * smoothstep(0.55, 0.40, p.x);

      // three longitudinal ridges across the crown
      float ridge = cos(clamp(p.y / max(half_w, 0.001), -1.0, 1.0) * 9.42477);
      ridge = ridge * 0.5 + 0.5;
      // crown height: domed along x, scalloped across y
      float dome = sin(clamp((p.x + 0.45) / 1.0, 0.0, 1.0) * 3.14159);
      float h = dome * (0.55 + ridge_amt * 0.45 * ridge);
      return vec2(body, h * body);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      vec3 base = u_skin_color.rgb;
      // skin between denticles: darker, slightly mottled
      float mottle = fbm(v_uv * 7.0) * 0.5 + 0.5;
      vec3 col = base * (0.35 + 0.15 * mottle);

      // staggered rows: each row offset half a cell, denticles overlap rows
      float best_h = 0.0;
      float best_m = 0.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 row_uv = uv;
          row_uv.x += mod(floor(uv.y + o.y), 2.0) * 0.5; // brick stagger
          vec2 id = floor(row_uv) + o;
          id.y = floor(uv.y) + o.y;
          id.x = floor(uv.x + mod(id.y, 2.0) * 0.5) + o.x;
          vec2 cuv = vec2(uv.x + mod(id.y, 2.0) * 0.5, uv.y);
          vec2 p = cuv - id - 0.5;
          // slight per-denticle jitter and size variance
          float hsh = hash(id);
          p += (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.10;
          p *= 1.0 / (0.95 + 0.25 * hsh);
          p.x *= 0.85; // elongate along flow direction

          vec2 dm = denticle_shd(p, u_ridges);
          if (dm.y > best_h) { best_h = dm.y; best_m = dm.x; }
          best_m = max(best_m, dm.x * 0.999);
        }
      }

      // shade the crown: height → lightness, plus front-lit gradient
      vec3 crown_lo = base * 0.55;
      vec3 crown_hi = base * 1.25 + vec3(0.06, 0.08, 0.10);
      vec3 dent_col = mix(crown_lo, crown_hi, clamp(best_h, 0.0, 1.0));

      // specular glint along ridge crests
      float glint = smoothstep(0.75, 0.95, best_h);
      dent_col += vec3(0.30, 0.34, 0.38) * glint;

      // ambient occlusion shadow in the gaps where denticles meet
      float gap = best_m * (1.0 - smoothstep(0.0, 0.25, best_h));
      dent_col = mix(dent_col, base * 0.30, gap * 0.5);

      col = mix(col, dent_col, best_m);

      // fine micro-texture over everything
      col += (noise(v_uv * 260.0) - 0.5) * 0.04;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',      name: 'Denticle Density', type: 'float', min: 6.0, max: 40.0, default: 18.0 },
    { id: 'u_ridges',     name: 'Ridge Strength',   type: 'float', min: 0.0, max: 1.0,  default: 0.7 },
    { id: 'u_skin_color', name: 'Skin Color',       type: 'color', default: [0.42, 0.50, 0.58, 1.0] }
  ]
};

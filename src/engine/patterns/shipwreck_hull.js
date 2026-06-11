export default {
  id: 'shipwreck_hull',
  name: 'Shipwreck Hull',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Riveted wreck plating decades under salt water — weeping rust streaks, blistered paint and creeping barnacle colonies.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- plate grid: staggered courses of hull plating ---
      float py = uv.y * u_plates;
      float row = floor(py);
      float stag = mod(row, 2.0) * 0.5;
      float px = uv.x * u_plates * 1.6 + stag;
      vec2 plate_id = vec2(floor(px), row);
      vec2 pf = vec2(fract(px), fract(py));

      float ph = hash(plate_id);

      // --- base hull paint: per-plate tonal shift, blistered ---
      vec3 hull = u_hull_color.rgb;
      vec3 col = hull * (0.82 + ph * 0.30);
      float blister = fbm(uv * 14.0 + ph * 9.0) * 0.5 + 0.5;
      col *= 0.85 + blister * 0.25;
      col += (noise(uv * 260.0) - 0.5) * 0.05;          // surface grit

      // --- rust: blooms eating through the paint ---
      vec3 rust_dk = vec3(0.30, 0.13, 0.06);
      vec3 rust_lt = vec3(0.62, 0.32, 0.12);
      float bloom = fbm(uv * 6.0 + 31.0) * 0.5 + 0.5;
      float rust_mask = smoothstep(1.0 - u_rust, 1.0 - u_rust + 0.30, bloom);
      vec3 rust_col = mix(rust_dk, rust_lt, fbm(uv * 18.0) * 0.5 + 0.5);
      col = mix(col, rust_col, rust_mask * 0.9);

      // --- plate seams: dark recessed joints with rust bleeding out ---
      float seam_x = min(pf.x, 1.0 - pf.x);
      float seam_y = min(pf.y, 1.0 - pf.y);
      float seam = smoothstep(0.030, 0.0, min(seam_x, seam_y));
      col = mix(col, vec3(0.05, 0.04, 0.04), seam * 0.8);
      // rust halo along the seams
      float seam_halo = smoothstep(0.10, 0.0, min(seam_x, seam_y)) * (1.0 - seam);
      col = mix(col, rust_dk, seam_halo * 0.4 * u_rust);

      // --- rivets along the seams + weeping streaks below each ---
      float riv_n = 6.0;
      float rvx = fract(pf.x * riv_n) - 0.5;
      float rvy = pf.y - 0.06;                            // rivet line near plate top
      float riv_d = length(vec2(rvx / riv_n * 1.6, rvy) * u_plates);
      float rivet = smoothstep(0.10, 0.06, riv_d);
      // domed rivet shading: lit top-left, shadowed bottom-right
      float riv_lit = smoothstep(0.10, 0.02, length(vec2(rvx / riv_n * 1.6, rvy) * u_plates + 0.025));
      col = mix(col, vec3(0.16, 0.15, 0.14), rivet);
      col += vec3(0.18) * riv_lit * rivet;
      // weeping rust streak running down from the rivet
      float below = pf.y - 0.06;
      float streak_w = 0.018 + 0.02 * hash(plate_id + floor(pf.x * riv_n));
      float streak = exp(-rvx * rvx / (streak_w * streak_w * riv_n * riv_n * 0.08))
                   * step(0.0, below) * exp(-below * 3.0);
      streak *= 0.5 + 0.5 * noise(vec2(pf.x * 40.0, uv.y * 30.0));
      col = mix(col, rust_lt * 0.85, clamp(streak, 0.0, 1.0) * 0.7 * u_rust);

      // --- barnacle colonies: clustered pale domes ---
      float colony = smoothstep(0.70, 0.92, fbm(uv * 3.5 + 77.0) * 0.5 + 0.5) * u_growth;
      vec2 bg = uv * 70.0;
      vec2 bid = floor(bg);
      vec2 bf2 = fract(bg) - 0.5;
      float bd = length(bf2 - (vec2(hash(bid), hash(bid + 9.0)) - 0.5) * 0.5);
      float barn = smoothstep(0.30, 0.18, bd) * step(hash(bid + 4.0), colony);
      vec3 barn_col = mix(vec3(0.58, 0.56, 0.50), vec3(0.78, 0.76, 0.70),
                          smoothstep(0.25, 0.0, bd));
      barn_col *= 1.0 - smoothstep(0.10, 0.0, bd) * 0.5;  // dark aperture
      col = mix(col, barn_col, barn);

      // green slime sheen in damp lower areas of each plate
      float slime = smoothstep(0.5, 1.0, pf.y) * (fbm(uv * 9.0 + 13.0) * 0.5 + 0.5);
      col = mix(col, col * vec3(0.7, 0.95, 0.6), slime * 0.25 * u_growth);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_plates',     name: 'Plate Scale',    type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_rust',       name: 'Rust Amount',    type: 'float', min: 0.0, max: 1.0,  default: 0.55 },
    { id: 'u_growth',     name: 'Marine Growth',  type: 'float', min: 0.0, max: 1.0,  default: 0.5 },
    { id: 'u_hull_color', name: 'Hull Paint',     type: 'color', default: [0.13, 0.20, 0.24, 1.0] }
  ]
};

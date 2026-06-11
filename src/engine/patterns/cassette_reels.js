export default {
  id: 'cassette_reels',
  name: 'Cassette Reels',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Mixtape faces tiled edge to edge — smoked windows, toothed white hubs winding chocolate-brown tape, cream labels with hand-ruled lines and a hot accent stripe.',
  shader: `
    // rounded-rectangle signed distance
    float rrect_cr(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_tiles;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      float seed = hash(cell);

      // --- shell: injection-moulded plastic with mould-flow noise ---
      vec3 shell = u_shell_color.rgb;
      shell *= 0.92 + noise(uv * 90.0) * 0.16;
      // bevelled tile edge: highlight top, shadow bottom
      shell *= 1.0 + (smoothstep(0.94, 1.0, f.y) - smoothstep(0.06, 0.0, f.y)) * 0.18;
      vec3 col = shell;

      vec3 keyline = vec3(0.05, 0.05, 0.06);

      // --- label card ---
      float labd = rrect_cr(f - vec2(0.5, 0.62), vec2(0.42, 0.31), 0.03);
      float label = 1.0 - smoothstep(0.0, 0.012, labd);
      vec3 labelc = u_label_color.rgb * (0.96 + noise(uv * 240.0) * 0.07);
      // accent stripe band across the top of the label
      float stripe = step(0.855, f.y) * step(f.y, 0.915);
      labelc = mix(labelc, u_accent_color.rgb, stripe);
      float stripe2 = step(0.825, f.y) * step(f.y, 0.85);
      labelc = mix(labelc, u_accent_color.rgb * 0.55, stripe2);
      // ruled writing lines on the lower label (faded ballpoint)
      float rule = step(0.965, fract(f.y * 28.0)) * step(f.y, 0.42) * step(0.34, f.y);
      labelc = mix(labelc, vec3(0.45, 0.48, 0.62), rule * 0.7);
      col = mix(col, labelc, label);

      // --- smoked tape window ---
      float wind = rrect_cr(f - vec2(0.5, 0.575), vec2(0.29, 0.135), 0.10);
      float inwin = 1.0 - smoothstep(0.0, 0.008, wind);
      vec3 winc = vec3(0.10, 0.09, 0.10) * (0.9 + noise(uv * 60.0) * 0.2);
      // glass glare diagonal
      winc += vec3(0.10) * smoothstep(0.08, 0.0, abs(f.x + f.y * 0.5 - 0.95));
      col = mix(col, winc, inwin);
      col = mix(col, keyline, 1.0 - smoothstep(0.004, 0.014, abs(wind)));

      // --- tape packs + hubs (two reels, supply wound fat, take-up thin) ---
      float wound = 0.075 + seed * 0.065;
      for (int i = 0; i < 2; i++) {
        float fi = float(i);
        vec2 c = vec2(mix(0.345, 0.655, fi), 0.575);
        float r = length(f - c);
        float tr = mix(wound, 0.215 - wound, fi);   // complementary tape radii
        // tape pack: dark brown with winding sheen rings
        float pack = (1.0 - smoothstep(tr, tr + 0.008, r)) * inwin;
        vec3 tape = vec3(0.16, 0.10, 0.07);
        tape += vec3(0.10, 0.06, 0.03) * (0.5 + 0.5 * sin(r * 480.0));
        col = mix(col, tape, pack);
        // white hub with six toothed notches
        float an = atan(f.y - c.y, f.x - c.x);
        float tooth = step(0.62, fract(an * 0.9549297));   // 6 teeth around
        float hubr = 0.052 - tooth * 0.016;
        float hub = 1.0 - smoothstep(hubr, hubr + 0.006, r);
        vec3 hubc = vec3(0.94, 0.94, 0.92) * (0.85 + 0.15 * cos(an * 2.0));
        col = mix(col, hubc, hub);
        col = mix(col, keyline, 1.0 - smoothstep(0.010, 0.018, r)); // spindle hole
      }

      // --- capstan / pinch-roller holes along the bottom skirt ---
      for (int k = 0; k < 4; k++) {
        vec2 hc = vec2(0.26 + float(k) * 0.16, 0.115);
        float hd = length(f - hc) - 0.022;
        col = mix(col, keyline, 1.0 - smoothstep(0.0, 0.010, hd));
      }

      // --- corner screws (mirrored to all four corners) ---
      vec2 sp = abs(f - 0.5);
      float sd = length(sp - vec2(0.44, 0.42));
      float screw = 1.0 - smoothstep(0.016, 0.026, sd);
      col = mix(col, vec3(0.55, 0.55, 0.58), screw);
      // phillips cross slot
      vec2 sc = sp - vec2(0.44, 0.42);
      float cross = min(abs(sc.x), abs(sc.y));
      col = mix(col, keyline * 1.6, screw * (1.0 - smoothstep(0.003, 0.007, cross)));

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_tiles', name: 'Cassettes Across', type: 'float', min: 1.0, max: 6.0, default: 2.0 },
    { id: 'u_shell_color', name: 'Shell Plastic', type: 'color', default: [0.16, 0.16, 0.18, 1.0] },
    { id: 'u_label_color', name: 'Label Card', type: 'color', default: [0.92, 0.88, 0.78, 1.0] },
    { id: 'u_accent_color', name: 'Label Stripe', type: 'color', default: [0.90, 0.35, 0.10, 1.0] }
  ]
};

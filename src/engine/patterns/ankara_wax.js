export default {
  id: 'ankara_wax',
  name: 'Ankara Wax Print',
  category: 'Textile',
  added: '2026-06-12',
  description: 'West-African ankara wax print: bold alternating fan and bullseye geometry in saturated two-tone colour, with dotted halos and the roller-wax crackle that marks true wax cloth.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- Bold two-tone palette ---
      vec3 col_a = u_color_a.rgb;   // dominant
      vec3 col_b = u_color_b.rgb;   // accent
      vec3 deep  = col_a * 0.30 + vec3(0.02);
      vec3 pale  = vec3(0.93, 0.88, 0.72);

      // --- Checkerboard of two big motifs ---
      float reps = u_repeats;
      vec2 g = uv * reps;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;
      float pick = mod(cell.x + cell.y, 2.0);
      float a = atan(f.y, f.x);
      float r = length(f);

      vec3 col = pale;

      if (pick < 1.0) {
        // Bullseye: thick concentric rings with a dotted halo
        float ring = fract(r * 4.4);
        float band = step(0.5, ring);
        col = mix(col_a, pale, band);
        col = mix(col, col_b, 1.0 - smoothstep(0.10, 0.13, r)); // hot centre
        // dotted halo orbiting the bullseye
        float dot_a = fract(a / 6.28318 * 16.0) - 0.5;
        float dot_r = r - 0.40;
        float halo = 1.0 - smoothstep(0.025, 0.045, length(vec2(dot_a * 0.16, dot_r)));
        col = mix(col, deep, halo);
      } else {
        // Fan blades radiating from cell corner-ish point
        vec2 q = f + vec2(0.5);
        float fa = atan(q.y, q.x);
        float blades = fract(fa / 1.5708 * 5.0);
        float blade = step(0.5, blades);
        float fr = length(q);
        col = mix(col_b, pale, blade);
        col = mix(col, col_a, smoothstep(0.85, 1.05, fr));
        // scalloped rim
        float scallop = step(abs(fract(fr * 5.0) - 0.5), 0.12);
        col = mix(col, deep, scallop * step(0.35, fr) * step(fr, 1.0));
      }

      // cell frame line
      float frame = min(min(abs(f.x), abs(f.y)), min(0.5 - abs(f.x), 0.5 - abs(f.y)));
      col = mix(deep, col, smoothstep(0.012, 0.030, frame));

      // --- Wax crackle: dark dye veins through everything ---
      float v1 = abs(snoise(uv * 8.0 + 5.0));
      float v2 = abs(snoise(uv * 19.0 + 47.0));
      float crack = (1.0 - smoothstep(0.0, 0.05, v1)) * 0.9
                  + (1.0 - smoothstep(0.0, 0.035, v2)) * 0.6;
      col = mix(col, deep, clamp(crack, 0.0, 1.0) * u_crackle * 0.8);

      // roller misregistration: colour slips slightly off its outline
      float slip = noise(uv * 3.0) - 0.5;
      col = mix(col, col.brg * 0.9 + col * 0.4, abs(slip) * 0.12);

      // --- Cotton texture + waxy sheen ---
      float warp = sin(uv.x * 3.14159 * 250.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 250.0) * 0.5 + 0.5;
      col *= 0.94 + 0.035 * warp + 0.035 * weft;
      col *= 0.95 + 0.09 * fbm(uv * 3.5);
      col += vec3(0.04) * smoothstep(0.6, 0.95, fbm(uv * 2.0 + 9.0)); // wax sheen

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats', name: 'Motif Repeats', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_crackle', name: 'Wax Crackle',   type: 'float', min: 0.0, max: 1.0, default: 0.65 },
    { id: 'u_color_a', name: 'Color A',       type: 'color', default: [0.85, 0.42, 0.05, 1.0] },
    { id: 'u_color_b', name: 'Color B',       type: 'color', default: [0.05, 0.35, 0.40, 1.0] }
  ]
};

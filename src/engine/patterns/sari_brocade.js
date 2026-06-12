export default {
  id: 'sari_brocade',
  name: 'Sari Zari Brocade',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Banarasi sari brocade: gold zari paisleys and floral buti woven into lustrous silk, with metallic thread glints, supplementary-weft ridges and anisotropic silk sheen.',
  shader: `
    // teardrop / paisley distance: circle pulled into a curved tail
    float paisley_sar(vec2 p) {
      // bend space so the drop curls
      float bend = p.x * p.x * 1.6;
      vec2 q = vec2(p.x, p.y + bend * sign(p.x) * 0.4);
      float body = length(q * vec2(1.0, 0.78)) - 0.26;
      // tail: thin curl off the top
      vec2 t = q - vec2(0.16, 0.26);
      float tail = length(t * vec2(1.6, 1.0)) - 0.10;
      return min(body, tail);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Silk ground with anisotropic sheen ---
      vec3 silk = u_silk_color.rgb;
      // warp-direction sheen: bands of light following thread direction
      float sheen = sin((uv.x * 0.4 + uv.y) * 6.28318 * 2.0 + fbm(uv * 3.0) * 2.0);
      vec3 ground = silk * (0.78 + 0.22 * (sheen * 0.5 + 0.5));
      ground += silk * 0.35 * pow(max(sheen, 0.0), 6.0);
      // fine silk thread lines
      ground *= 0.95 + 0.05 * sin(uv.y * 3.14159 * 420.0);

      // --- Paisley buti lattice (offset grid) ---
      float reps = u_repeats;
      vec2 g = uv * reps;
      float row = floor(g.y);
      g.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(g);
      vec2 f = fract(g) - 0.5;
      // alternate paisley orientation per row
      float flip = mod(row, 2.0) * 2.0 - 1.0;
      vec2 p = vec2(f.x * flip, f.y) * 1.7;

      float d = paisley_sar(p);
      float body = 1.0 - smoothstep(-0.01, 0.02, d);
      float outline = 1.0 - smoothstep(0.015, 0.045, abs(d));
      // inner floral details: dotted spine and petal notches
      float spine = 1.0 - smoothstep(0.02, 0.05, abs(length(p * vec2(1.0, 0.78)) - 0.14));
      float dots = 1.0 - smoothstep(0.035, 0.06, length(fract(p * 5.0) - 0.5));
      float inner = max(spine, dots * body);

      // small gold dot between paisleys
      float buti = 1.0 - smoothstep(0.04, 0.07, length(fract(g + 0.5) - 0.5));

      // zari coverage: outline + inner work + buti, body filled at half density
      float zari = clamp(outline + inner * 0.9 + body * 0.30 + buti, 0.0, 1.0);

      // --- Gold zari thread: metallic, direction-woven ---
      // supplementary weft runs horizontally: glint depends on x
      float wind = sin(uv.x * 3.14159 * 480.0 + cell.y * 1.7);
      vec3 gold_lo = vec3(0.48, 0.34, 0.10);
      vec3 gold_hi = vec3(1.00, 0.85, 0.45);
      vec3 gold = mix(gold_lo, gold_hi, wind * 0.5 + 0.5);
      // sparkle: random facets of the metal-wrapped thread
      float sparkle = smoothstep(0.93, 1.0, hash(floor(uv * 480.0) + cell));
      gold += vec3(0.8, 0.7, 0.4) * sparkle * u_glint;

      // brocade relief: zari floats sit above the silk, casting a lower shadow
      float shadow = clamp(outline + inner, 0.0, 1.0);
      vec3 col = ground * (1.0 - 0.25 * smoothstep(0.0, 0.06, abs(d)) * (1.0 - smoothstep(0.06, 0.12, abs(d))));
      col = mix(col, gold, zari);
      // thread ridge highlight on top edge of zari
      col += gold_hi * 0.15 * zari * smoothstep(0.0, 0.03, -d + 0.01);

      // silk slub flecks
      float slub = smoothstep(0.97, 1.0, noise(uv * vec2(60.0, 300.0)));
      col = mix(col, col * 1.2 + 0.03, slub * (1.0 - zari));

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_repeats',    name: 'Paisley Repeats', type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_glint',      name: 'Zari Glint',      type: 'float', min: 0.0, max: 1.0,  default: 0.6 },
    { id: 'u_silk_color', name: 'Silk Color',      type: 'color', default: [0.45, 0.06, 0.14, 1.0] }
  ]
};

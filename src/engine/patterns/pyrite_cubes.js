export default {
  id: 'pyrite_cubes',
  name: 'Pyrite Cubes',
  category: 'Geology',
  added: '2026-06-12',
  description: "Fool's gold — interlocked brassy pyrite cubes with mirror-flat striated faces, jammed into a dark slate matrix.",
  shader: `
    vec2 hash2_pyr(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Chebyshev voronoi: square cells = cubic crystal habit.
    // Returns (F1, F2, cellHash).
    vec3 cubes_pyr(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float f1 = 8.0;
      float f2 = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_pyr(i + g);
          vec2 r = g + o - f;
          float d = max(abs(r.x), abs(r.y)); // chebyshev -> square crystals
          if (d < f1) { f2 = f1; f1 = d; id = fract(o.x * 37.7 + o.y * 17.3); }
          else if (d < f2) { f2 = d; }
        }
      }
      return vec3(f1, f2, id);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Slight rotation per region so cube clusters sit at different angles
      float regions = floor(fbm(uv * 1.5) * 3.0 + 2.0);
      float ra = regions * 0.5;
      mat2 rot = mat2(cos(ra), -sin(ra), sin(ra), cos(ra));
      vec2 p = rot * (uv - 0.5) * u_cube_scale;

      vec3 v = cubes_pyr(p);
      float edge = v.y - v.x;
      float id = v.z;

      // Matrix gap: wide borders become dark host rock
      float matrixW = u_matrix_width * 0.12;
      float inCube = smoothstep(matrixW, matrixW + 0.05, edge);

      // --- Brass faces ---
      vec3 brass = u_brass_color.rgb;
      // Each cube face reflects at its own angle: strong per-cell brightness
      float face = 0.35 + 0.85 * fract(id * 13.91);
      vec3 cube = brass * face;

      // Striations: pyrite faces carry fine parallel growth lines, direction
      // alternating per crystal (the classic look)
      float sdir = step(0.5, fract(id * 7.3));
      vec2 sv = mix(vec2(1.0, 0.0), vec2(0.0, 1.0), sdir);
      float stria = sin(dot(p, sv) * 90.0 + id * 40.0) * 0.5 + 0.5;
      cube *= 0.88 + stria * 0.20;

      // Bevel: faces brighten toward their centre, darken at crystal edges
      float bevel = smoothstep(0.0, 0.18, v.x);
      cube *= 1.25 - bevel * 0.45;

      // Mirror glints on the brightest faces
      float glint = pow(fract(id * 23.7), 12.0);
      cube += vec3(1.0, 0.95, 0.7) * glint * stria * 0.8;

      // Subtle tarnish patches
      float tarnish = smoothstep(0.4, 0.8, fbm(uv * 6.0 + id));
      cube = mix(cube, cube * vec3(0.55, 0.5, 0.6), tarnish * 0.35);

      // --- Dark matrix ---
      float mN = fbm(uv * 12.0) * 0.5 + 0.5;
      vec3 matrix = vec3(0.07, 0.07, 0.08) * (0.6 + mN * 0.8);
      matrix += (hash(uv * 600.0) - 0.5) * 0.03;
      // Tiny brass dust in the matrix
      float dust = step(0.985, hash(floor(uv * 300.0)));
      matrix += brass * dust * 0.5;

      vec3 col = mix(matrix, cube, inCube);

      // Contact shadow where cube meets matrix
      float contact = smoothstep(matrixW + 0.10, matrixW, edge) * inCube;
      col *= 1.0 - contact * 0.35;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cube_scale',   name: 'Cube Scale',    type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_matrix_width', name: 'Matrix Width',  type: 'float', min: 0.0, max: 1.0,  default: 0.35 },
    { id: 'u_brass_color',  name: 'Brass Color',   type: 'color', default: [0.83, 0.65, 0.28, 1.0] }
  ]
};

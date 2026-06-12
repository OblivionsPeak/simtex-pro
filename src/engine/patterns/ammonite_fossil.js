export default {
  id: 'ammonite_fossil',
  name: 'Ammonite Fossil',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Polished ammonite cross-section — logarithmic spiral whorls divided into chambers by curved septa, lined with iridescent nacre.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      vec2 c = uv - vec2(0.5, 0.5);
      float r = max(length(c), 0.0015);
      float a = atan(c.y, c.x);

      // Logarithmic spiral coordinate: s increases by 1 per whorl
      float k = u_spiral_tightness * 0.35;
      float s = log(r) / k - a / 6.28318;

      float whorl = fract(s);
      float whorlId = floor(s);

      // --- Shell wall between whorls ---
      float wall = smoothstep(0.10, 0.02, whorl) + smoothstep(0.90, 0.98, whorl);
      wall = clamp(wall, 0.0, 1.0);

      // --- Septa: curved chamber dividers along each whorl ---
      // Chamber count grows with the spiral; septa curve backwards
      float septaCoord = (a / 6.28318 + whorlId) * u_chamber_count + whorl * 1.8;
      float septa = abs(fract(septaCoord) - 0.5) * 2.0;
      float septaLine = smoothstep(0.92, 1.0, septa);

      // Suture wiggle: real septa are frilled
      float frill = snoise(vec2(septaCoord * 3.0, s * 4.0)) * 0.05;
      septaLine = smoothstep(0.90, 0.99, septa + frill);

      // --- Nacre iridescence inside the chambers ---
      // Hue cycles along the spiral and across each chamber
      float hue = s * 0.35 + fract(septaCoord) * 0.15 + fbm(uv * 6.0) * 0.12;
      vec3 nacre = 0.5 + 0.5 * cos(6.28318 * (hue + vec3(0.0, 0.33, 0.67)));

      // Base fossil shell tones: amber brown to deep bronze
      vec3 shellA = u_shell_color.rgb;
      vec3 shellB = shellA * vec3(0.45, 0.35, 0.30);
      float tone = fract(whorlId * 0.37 + fract(septaCoord) * 0.5);
      vec3 col = mix(shellB, shellA, tone * 0.6 + whorl * 0.4);

      // Blend iridescent nacre over the shell
      col = mix(col, nacre * (0.55 + 0.45 * shellA), u_nacre_intensity * 0.65);

      // Pearly shimmer: fine concentric growth lines within chambers
      float growth = sin(s * 60.0) * 0.5 + 0.5;
      col *= 0.92 + growth * 0.12;

      // Apply walls and septa as dark fossilized divisions
      vec3 wallCol = vec3(0.12, 0.08, 0.05);
      col = mix(col, wallCol, wall * 0.85);
      col = mix(col, wallCol, septaLine * 0.7 * (1.0 - wall));

      // Bright nacre lip alongside the walls (light catches the ridge)
      float lip = smoothstep(0.10, 0.16, whorl) * smoothstep(0.22, 0.16, whorl);
      col += nacre * lip * u_nacre_intensity * 0.3;

      // Centre fades into the tiny innermost whorls -> matrix stone
      float matrixFade = smoothstep(0.045, 0.015, r);
      vec3 matrix = vec3(0.35, 0.30, 0.25) * (0.7 + noise(uv * 60.0) * 0.5);
      col = mix(col, matrix, matrixFade);

      // Outside the shell (beyond ~last whorl) -> host rock
      float outer = smoothstep(0.43, 0.49, r);
      vec3 rock = vec3(0.28, 0.24, 0.20) * (0.7 + fbm(uv * 9.0) * 0.4);
      rock += (hash(uv * 500.0) - 0.5) * 0.04;
      col = mix(col, rock, outer);

      // Polished dome gloss
      float gloss = pow(clamp(1.0 - length(uv - vec2(0.38, 0.62)) * 1.6, 0.0, 1.0), 3.0);
      col += gloss * 0.08 * (1.0 - outer);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_spiral_tightness', name: 'Spiral Tightness', type: 'float', min: 0.3, max: 2.5,  default: 1.0 },
    { id: 'u_chamber_count',    name: 'Chambers / Whorl', type: 'float', min: 6.0, max: 36.0, default: 18.0 },
    { id: 'u_nacre_intensity',  name: 'Nacre Shimmer',    type: 'float', min: 0.0, max: 1.5,  default: 0.8 },
    { id: 'u_shell_color',      name: 'Shell Amber',      type: 'color', default: [0.72, 0.45, 0.22, 1.0] }
  ]
};

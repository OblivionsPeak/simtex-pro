export default {
  id: 'comet_tail',
  name: 'Comet Tail',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'A dazzling comet nucleus dragging twin tails — a straight blue ion stream and a curved cream dust fan — through a quiet starfield.',
  shader: `
    vec2 rot_cmt(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    }

    float stars_cmt(vec2 uv) {
      vec2 g = floor(uv * 75.0);
      vec2 f = fract(uv * 75.0);
      vec2 p = vec2(hash(g + 11.3), hash(g + 27.9));
      return smoothstep(0.96, 1.0, hash(g)) * smoothstep(0.10, 0.0, length(f - p));
    }

    vec4 generate() {
      // Nucleus sits low-left in the tile; tail streams up-right
      vec2 uv = fract(v_uv);
      vec2 head = vec2(0.24, 0.30);
      vec2 d = uv - head;

      // Rotate into tail-aligned frame: +x is along the tail
      vec2 td = rot_cmt(d, -0.65);
      float along = td.x;            // distance down the tail
      float across = td.y;           // perpendicular offset

      vec3 space = vec3(0.012, 0.014, 0.030);
      vec3 col = space;

      // --- Background stars ---
      col += vec3(0.8, 0.85, 1.0) * stars_cmt(v_uv + 4.2) * 0.8;

      // --- Ion tail: straight, narrow, electric blue, rippled streamers ---
      float ionWidth = 0.018 + along * 0.07 * u_tail_spread;
      float ionWiggle = snoise(vec2(along * 9.0, 3.7)) * ionWidth * 0.8;
      float ion = exp(-pow((across - ionWiggle) / max(ionWidth, 0.001), 2.0));
      // Internal streamer filaments
      float ionFil = 0.5 + 0.5 * snoise(vec2(along * 22.0, across * 90.0));
      ion *= smoothstep(-0.02, 0.06, along) * exp(-along * (2.6 / u_tail_length));
      col += u_ion_color.rgb * ion * (0.55 + 0.65 * ionFil) * 1.3;

      // --- Dust tail: broader, curved, warm cream, grainy ---
      float curve = along * along * 1.3;     // dust lags and curves away
      float dustAcross = across + curve * 0.35;
      float dustWidth = 0.035 + along * 0.16 * u_tail_spread;
      float dust = exp(-pow(dustAcross / max(dustWidth, 0.001), 2.0));
      float dustGrain = fbm(vec2(along * 14.0, dustAcross * 40.0) + 31.0) * 0.5 + 0.5;
      float dustStria = 0.6 + 0.4 * sin(dustAcross / max(dustWidth, 0.001) * 6.0 + along * 8.0);
      dust *= smoothstep(-0.01, 0.08, along) * exp(-along * (2.0 / u_tail_length));
      col += vec3(0.92, 0.85, 0.70) * dust * dustGrain * dustStria * 0.85;

      // --- Coma: glowing envelope around the nucleus ---
      float rc = length(d);
      float coma = exp(-rc * rc * 240.0) * 1.4 + exp(-rc * 9.0) * 0.30;
      // Sunward fan: coma compressed on the side facing the sun (down-left)
      float sunside = smoothstep(0.1, -0.25, td.x);
      coma *= 1.0 - sunside * 0.35;
      col += vec3(0.65, 0.85, 0.95) * coma;

      // --- Nucleus: tiny white-hot core ---
      float core = exp(-rc * rc * 5000.0);
      col += vec3(1.0, 0.98, 0.92) * core * 2.0;

      // Jets venting off the nucleus toward the sun
      float jetAng = atan(d.y, d.x);
      float jets = pow(max(cos((jetAng + 2.6) * 3.0), 0.0), 8.0);
      col += vec3(0.8, 0.9, 1.0) * jets * exp(-rc * 28.0) * 0.5;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_tail_length', name: 'Tail Length', type: 'float', min: 0.3, max: 2.5, default: 1.0 },
    { id: 'u_tail_spread', name: 'Tail Spread', type: 'float', min: 0.3, max: 2.5, default: 1.0 },
    { id: 'u_ion_color',   name: 'Ion Tail',    type: 'color', default: [0.30, 0.60, 1.0, 1.0] }
  ]
};

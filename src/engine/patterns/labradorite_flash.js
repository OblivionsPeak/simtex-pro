export default {
  id: 'labradorite_flash',
  name: 'Labradorite Flash',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Grey feldspar with labradorescence — electric blue and gold schiller flashes confined to angular cleavage domains, with fine lamellar striations.',
  shader: `
    vec2 hash2_lab(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Voronoi returning (F1, F2, cellHash) — angular cleavage domains
    vec3 voro_lab(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float f1 = 8.0;
      float f2 = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_lab(i + g);
          float d = length(g + o - f);
          if (d < f1) { f2 = f1; f1 = d; id = fract(o.x * 23.1 + o.y * 9.7); }
          else if (d < f2) { f2 = d; }
        }
      }
      return vec3(f1, f2, id);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Dark grey feldspar host with smoky variation
      float smoke = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 grey = vec3(0.16, 0.17, 0.19);
      vec3 col = grey * (0.7 + smoke * 0.5);

      // Faint twinning striations across the whole stone
      float twin = sin((uv.x * 0.6 + uv.y) * 180.0 + snoise(uv * 6.0) * 3.0);
      col *= 0.96 + twin * 0.035;

      // Cleavage domains
      vec3 v = voro_lab(uv * u_domain_scale);
      float domHash = v.z;
      float edge = v.y - v.x;

      // Only some domains catch the light
      float gate = step(1.0 - u_flash_coverage, fract(domHash * 5.77));

      // Schiller flash: hard-edged within the domain (labradorescence cuts
      // off sharply at twin boundaries)
      float flashMask = smoothstep(0.01, 0.05, edge) * gate;

      // Hue per domain: sweep from electric blue through teal to gold
      float hueT = fract(domHash * 3.17);
      vec3 blue = u_flash_color.rgb;
      vec3 teal = vec3(0.1, 0.75, 0.65);
      vec3 gold = vec3(0.95, 0.65, 0.15);
      vec3 schiller = hueT < 0.5 ? mix(blue, teal, hueT * 2.0) : mix(teal, gold, hueT * 2.0 - 1.0);

      // Flash brightness varies across the domain like an angled mirror:
      // a directional gradient per domain
      vec2 dir = normalize(hash2_lab(vec2(domHash * 91.0, 7.0)) - 0.5);
      float angleGrad = dot(uv, dir) * 6.0 + domHash * 20.0;
      float glint = pow(0.5 + 0.5 * sin(angleGrad), 2.0);

      col = mix(col, schiller * (0.45 + glint * 0.8), flashMask * u_flash_strength * 0.85);

      // Fine lamellar striations inside flashing domains (parallel needles)
      float lam = sin(dot(uv, dir) * 350.0 + domHash * 50.0) * 0.5 + 0.5;
      col += schiller * lam * flashMask * glint * u_flash_strength * 0.25;

      // Dark cleavage seams between domains
      col *= 1.0 - smoothstep(0.04, 0.0, edge) * 0.5;

      // Wet-polish gloss
      float gloss = pow(clamp(1.0 - abs(uv.x + uv.y * 0.6 - 0.8) * 1.8, 0.0, 1.0), 4.0);
      col += gloss * 0.06;

      col += (hash(uv * 750.0) - 0.5) * 0.02;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_domain_scale',   name: 'Domain Scale',   type: 'float', min: 1.5, max: 12.0, default: 4.5 },
    { id: 'u_flash_coverage', name: 'Flash Coverage', type: 'float', min: 0.1, max: 1.0,  default: 0.5 },
    { id: 'u_flash_strength', name: 'Schiller',       type: 'float', min: 0.0, max: 1.5,  default: 1.0 },
    { id: 'u_flash_color',    name: 'Flash Blue',     type: 'color', default: [0.1, 0.4, 0.95, 1.0] }
  ]
};

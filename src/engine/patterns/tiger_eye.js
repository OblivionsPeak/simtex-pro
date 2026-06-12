export default {
  id: 'tiger_eye',
  name: 'Tiger Eye',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Golden tiger eye gemstone — wavy chatoyant fiber bands of gold and chocolate brown with a bright moving sheen stripe and fine silky striations.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // Wavy band coordinate: horizontal bands distorted by fbm so the
      // fibrous layers undulate and pinch
      float wave = fbm(uv * vec2(2.0, 5.0)) * 0.18 + snoise(uv * vec2(7.0, 2.0)) * 0.03;
      float bandCoord = uv.y + wave;
      float band = fract(bandCoord * u_band_scale);
      float bandId = floor(bandCoord * u_band_scale);
      float bandHash = hash(vec2(bandId, 3.7));

      // Alternate gold / brown layers with per-band tonal shift
      float layer = smoothstep(0.1, 0.42, band) * smoothstep(0.95, 0.55, band);

      vec3 gold  = u_gold_color.rgb;
      vec3 brown = gold * vec3(0.26, 0.18, 0.12);
      vec3 honey = gold * vec3(1.05, 0.85, 0.55);

      vec3 col = mix(brown, gold, layer);
      col = mix(col, honey, layer * bandHash * 0.5);

      // Fine parallel fiber striations running along the bands — the
      // signature silky structure of crocidolite fibers
      float fiber = noise(vec2(uv.x * 6.0, bandCoord * 280.0));
      fiber += noise(vec2(uv.x * 13.0, bandCoord * 620.0)) * 0.5;
      col *= 0.82 + fiber * 0.24;

      // Chatoyant sheen stripe: a vertical "cat's eye" reflection that the
      // user can sweep across the stone. It brightens fibers near the stripe
      // with a hot core and warm falloff.
      float sx = uv.x - u_sheen_pos;
      float sheenEnv = exp(-sx * sx * 60.0);
      float sheenCore = exp(-sx * sx * 400.0);
      // The sheen only ignites the reflective gold layers, modulated by fiber
      float ignite = (0.35 + 0.65 * layer) * (0.6 + 0.8 * fiber);
      col += gold * sheenEnv * ignite * u_sheen_strength * 0.45;
      col += vec3(1.0, 0.93, 0.7) * sheenCore * ignite * u_sheen_strength * 0.5;

      // Dark fracture seams between some bands
      float seam = smoothstep(0.04, 0.0, band) + smoothstep(0.96, 1.0, band);
      col *= 1.0 - seam * 0.45 * step(0.45, bandHash);

      // Polish gloss: broad diagonal highlight
      float gloss = pow(clamp(1.0 - abs(uv.x - uv.y + 0.15) * 1.6, 0.0, 1.0), 4.0);
      col += gloss * 0.07;

      // Micro grain
      col += (hash(uv * 800.0) - 0.5) * 0.025;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_band_scale',     name: 'Band Density',   type: 'float', min: 3.0, max: 30.0, default: 10.0 },
    { id: 'u_sheen_pos',      name: 'Sheen Position', type: 'float', min: 0.0, max: 1.0,  default: 0.45 },
    { id: 'u_sheen_strength', name: 'Chatoyancy',     type: 'float', min: 0.0, max: 2.0,  default: 1.0 },
    { id: 'u_gold_color',     name: 'Gold Tone',      type: 'color', default: [0.78, 0.52, 0.18, 1.0] }
  ]
};

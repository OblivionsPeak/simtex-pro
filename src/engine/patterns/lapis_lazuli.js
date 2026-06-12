export default {
  id: 'lapis_lazuli',
  name: 'Lapis Lazuli',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Deep ultramarine lapis with glittering gold pyrite flecks and soft white calcite swirls — the classic royal stone.',
  shader: `
    vec2 hash2_lap(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Ultramarine body with tonal depth ---
      vec3 ultra = u_base_color.rgb;
      float depth = fbm(uv * 4.0) * 0.5 + 0.5;
      vec3 deep = ultra * vec3(0.45, 0.4, 0.7);
      vec3 col = mix(deep, ultra, depth);

      // Violet-shifted patches (lazurite zoning)
      float violet = smoothstep(0.55, 0.85, fbm(uv * 7.0 + 23.0) * 0.5 + 0.5);
      col = mix(col, ultra * vec3(0.9, 0.6, 1.1), violet * 0.3);

      // --- Calcite swirls: white veined wisps flowing through the blue ---
      vec2 flow = uv + vec2(fbm(uv * 3.0), fbm(uv * 3.0 + 41.0)) * 0.25;
      float swirlBand = snoise(flow * 5.0);
      float swirl = smoothstep(0.45, 0.75, swirlBand) * u_calcite_amount;
      vec3 calcite = vec3(0.88, 0.89, 0.86);
      col = mix(col, calcite, swirl * 0.75);
      // Calcite edges blend grey-blue where they meet lazurite
      float swirlEdge = smoothstep(0.3, 0.45, swirlBand) - smoothstep(0.45, 0.6, swirlBand);
      col = mix(col, mix(ultra, calcite, 0.5), clamp(swirlEdge, 0.0, 1.0) * u_calcite_amount * 0.5);

      // --- Pyrite flecks: gold glitter scattered in the blue ---
      // Cell-based flecks with random size, brightness, and slight offset
      vec2 cell = floor(uv * u_fleck_density);
      vec2 cuv = fract(uv * u_fleck_density);
      vec2 h = hash2_lap(cell);
      float fh = hash(cell + 7.0);

      // Fleck exists in ~30% of cells, sits at a random spot in the cell
      float exists = step(0.7, fh);
      float fr = 0.08 + fract(fh * 9.7) * 0.18;         // fleck radius
      float fd = length(cuv - (0.25 + h * 0.5));
      float fleck = smoothstep(fr, fr * 0.4, fd) * exists;

      // Flecks avoid calcite zones (pyrite grows in the lazurite)
      fleck *= 1.0 - swirl * 0.8;

      vec3 gold = vec3(0.92, 0.74, 0.32);
      float facet = 0.5 + 0.5 * fract(h.x * 13.7);       // per-fleck brilliance
      col = mix(col, gold * facet, fleck * 0.95);
      // Sparkle: a few flecks blaze
      float blaze = pow(fract(h.y * 17.3), 10.0);
      col += vec3(1.0, 0.9, 0.6) * fleck * blaze * 0.9;

      // Micro pyrite dust
      float dust = step(0.992, hash(floor(uv * 420.0)));
      col = mix(col, gold, dust * 0.6 * (1.0 - swirl));

      // Polished gloss
      float gloss = pow(clamp(1.0 - abs(uv.x + uv.y - 1.05) * 1.5, 0.0, 1.0), 3.5);
      col += gloss * 0.08;

      col += (hash(uv * 800.0) - 0.5) * 0.018;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_fleck_density',  name: 'Pyrite Flecks',  type: 'float', min: 10.0, max: 80.0, default: 35.0 },
    { id: 'u_calcite_amount', name: 'Calcite Swirls', type: 'float', min: 0.0,  max: 1.5,  default: 0.7 },
    { id: 'u_base_color',     name: 'Ultramarine',    type: 'color', default: [0.10, 0.18, 0.55, 1.0] }
  ]
};

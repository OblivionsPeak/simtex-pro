export default {
  id: 'mosaic_tesserae',
  name: 'Mosaic Tesserae',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Hand-set glass tesserae — small irregular squares each tilted in its mortar bed, colours flowing through a smalti gradient across the field, glassy sparks where facets catch the light.',
  shader: `
    float hash_mts(vec2 p) {
      return fract(sin(dot(p, vec2(167.1, 253.9))) * 45137.7919);
    }
    vec2 hash2_mts(vec2 p) {
      return vec2(hash_mts(p), hash_mts(p + 19.19));
    }

    vec4 generate() {
      float n = floor(u_density + 0.5);
      vec2 uv = v_uv * n;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);

      // --- irregular tesserae: each cell's square is jittered, rotated and shrunk ---
      vec2 id = mod(cell, n);
      vec2 jit = (hash2_mts(id) - 0.5) * 0.18;
      float rot = (hash_mts(id + 7.0) - 0.5) * 0.5;     // up to ~14 deg
      float size = 0.40 + hash_mts(id + 13.0) * 0.06;   // half-extent

      vec2 p = f - 0.5 - jit;
      float cr = cos(rot); float sr = sin(rot);
      p = mat2(cr, -sr, sr, cr) * p;

      // chipped-square distance: square softened by a touch of roundness
      vec2 a = abs(p);
      float dSquare = max(a.x, a.y) - size;
      float dRound  = length(a) - size * 1.30;
      float d = mix(dSquare, dRound, 0.25);
      // nicked edges — hand-cut glass is never clean
      d += (noise(p * 40.0 + id * 3.0) - 0.5) * 0.03;

      float inTess = smoothstep(0.012, -0.012, d);

      // --- smalti colour: flowing gradient across the whole field ---
      // tesserae take their colour from where their CENTRE sits in the flow,
      // so each piece is one solid colour — like real mosaic work
      vec2 centre = (cell + 0.5 + jit) / n;
      float flow = fbm(centre * 2.5) * 0.5 + 0.5;
      flow = clamp(flow + (centre.x + centre.y) * 0.15 - 0.15, 0.0, 1.0);

      vec3 cA = u_color_a.rgb;
      vec3 cB = u_color_b.rgb;
      // three-stop ramp: A -> deepened midtone -> B
      vec3 mid = mix(cA, cB, 0.5) * 0.75;
      vec3 glass = (flow < 0.5)
        ? mix(cA, mid, flow * 2.0)
        : mix(mid, cB, flow * 2.0 - 1.0);

      // per-piece batch variation: hand-poured glass shifts hue piece to piece
      float batch = hash_mts(id + 29.0);
      glass *= 0.82 + batch * 0.36;
      glass = mix(glass, glass.gbr, (batch - 0.5) * 0.10); // tiny hue drift

      // --- glass material ---
      // colour deepens toward the slab centre (thicker glass)
      float depth = clamp(-d * 9.0, 0.0, 1.0);
      glass *= 0.85 + depth * 0.22;
      // internal streaks frozen into the smalti
      glass *= 0.93 + noise(p * vec2(26.0, 7.0) + id * 5.0) * 0.13;

      // tilt lighting: each piece leans in the mortar, one edge catches sky
      float tiltA = hash_mts(id + 43.0) * 6.2831853;
      vec2 tilt = vec2(cos(tiltA), sin(tiltA));
      float facet = dot(p, tilt) * 2.2;
      glass *= 0.92 + clamp(facet, -0.5, 0.5) * 0.28;
      // sharp glassy spark on a minority of pieces
      float sparky = step(0.78, hash_mts(id + 57.0));
      float spark = exp(-90.0 * pow(length(p - tilt * 0.16), 2.0)) * sparky;
      glass += vec3(1.0) * spark * 0.55;

      // --- mortar bed ---
      vec3 mortar = vec3(0.52, 0.49, 0.45);
      mortar *= 0.82 + noise(uv * 50.0) * 0.30;          // sandy grain
      // mortar darkens right at each tessera's foot (contact shadow)
      float foot = smoothstep(0.07, 0.0, d) * (1.0 - inTess);
      mortar *= 1.0 - foot * 0.38;
      // mortar carries a ghost of the field gradient (grout picks up pigment)
      mortar = mix(mortar, mortar * (0.6 + glass * 0.5), 0.20);

      vec3 col = mix(mortar, glass, inTess);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_density', name: 'Tesserae',  type: 'float', min: 8.0, max: 40.0, default: 18.0 },
    { id: 'u_color_a', name: 'Colour A',  type: 'color', default: [0.10, 0.25, 0.50, 1.0] },
    { id: 'u_color_b', name: 'Colour B',  type: 'color', default: [0.90, 0.78, 0.35, 1.0] }
  ]
};

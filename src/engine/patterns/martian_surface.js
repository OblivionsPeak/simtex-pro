export default {
  id: 'martian_surface',
  name: 'Martian Surface',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Rust-red Martian terrain — wind-combed dune ripples, scattered dark basalt cobbles, and pale dust pooling in the hollows.',
  shader: `
    // Wind ripples: asymmetric sawtooth ridges warped along the wind
    float ripples_mts(vec2 uv, float freq) {
      // Ripple crests run perpendicular to the wind (wind blows +x-ish)
      float bend = fbm(uv * 2.5) * 0.5;
      float ph = (uv.y + bend * 0.25 + uv.x * 0.18) * freq;
      float saw = fract(ph);
      // Asymmetric profile: shallow stoss slope, steep lee face
      float crest = smoothstep(0.0, 0.72, saw) * smoothstep(1.0, 0.78, saw);
      return crest;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Base terrain height: broad undulations + dune field ---
      float terrain = fbm(uv * 3.5) * 0.5 + 0.5;
      float rip = ripples_mts(uv, u_ripple_freq);
      float ripFine = ripples_mts(uv * 2.0 + 13.0, u_ripple_freq * 2.3);
      float height = terrain * 0.5 + rip * 0.35 + ripFine * 0.12;

      // --- Palette ---
      vec3 rust   = u_soil_color.rgb;                  // oxide red base
      vec3 ochre  = rust * vec3(1.22, 1.08, 0.85);     // sunlit crests
      vec3 maroon = rust * vec3(0.55, 0.42, 0.40);     // shadowed lee faces
      vec3 dust   = vec3(0.85, 0.66, 0.48);            // pale settled dust
      vec3 basalt = vec3(0.16, 0.12, 0.11);            // dark volcanic rock

      // Shade ripple field: crests catch light, lee faces shadow
      vec3 col = mix(maroon, rust, terrain);
      col = mix(col, ochre, rip * 0.65);
      col = mix(col, maroon, smoothstep(0.78, 0.95, fract((uv.y + fbm(uv * 2.5) * 0.125 + uv.x * 0.18) * u_ripple_freq)) * 0.6);
      col = mix(col, ochre, ripFine * 0.25);

      // --- Dust pooling in hollows ---
      float hollow = smoothstep(0.55, 0.25, height);
      float dustPatch = smoothstep(0.45, 0.75, fbm(uv * 5.0 + 41.0) * 0.5 + 0.5);
      col = mix(col, dust, hollow * dustPatch * u_dust_cover * 0.7);

      // --- Scattered basalt cobbles (two sizes, wrapped grid) ---
      for (int layer = 0; layer < 2; layer++) {
        float dens = layer == 0 ? 16.0 : 34.0;
        float seed = layer == 0 ? 7.0 : 77.0;
        vec2 g = floor(uv * dens);
        vec2 f = fract(uv * dens);
        for (int y = -1; y <= 1; y++) {
          for (int x = -1; x <= 1; x++) {
            vec2 cell = mod(g + vec2(float(x), float(y)), dens);
            float exists = step(0.80, hash(cell + seed));
            vec2 cp = vec2(hash(cell + seed + 5.0), hash(cell + seed + 17.0));
            vec2 rel = f - vec2(float(x), float(y)) - cp;
            float rad = 0.10 + 0.14 * hash(cell + seed + 29.0);
            float ang = atan(rel.y, rel.x);
            float lump = 1.0 + 0.25 * sin(ang * 4.0 + hash(cell + seed) * 6.28);
            float d = length(rel) / max(rad * lump, 0.001);
            float m = exists * smoothstep(1.0, 0.85, d);
            // Lit top-left, dust skirt at the base
            float lit = clamp(0.5 - (rel.x + rel.y) * 3.0, 0.1, 1.0);
            vec3 rockCol = mix(basalt, basalt * 2.2, lit);
            rockCol = mix(rockCol, rust * 0.8, smoothstep(0.7, 1.0, d) * 0.4);
            col = mix(col, rockCol, m);
            // Tiny windward shadow tail
            float tail = exists * exp(-pow(length(rel - vec2(rad * 1.3, 0.0)) / (rad * 0.9), 2.0));
            col = mix(col, maroon * 0.8, tail * 0.25);
          }
        }
      }

      // Fine regolith grain + soft sky-light vignette
      float grain = noise(uv * 240.0);
      col *= 0.93 + 0.10 * grain;
      col *= 0.96 + 0.06 * terrain;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_ripple_freq', name: 'Dune Ripples', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_dust_cover',  name: 'Dust Cover',   type: 'float', min: 0.0, max: 1.5,  default: 0.8 },
    { id: 'u_soil_color',  name: 'Soil Colour',  type: 'color', default: [0.66, 0.32, 0.18, 1.0] }
  ]
};

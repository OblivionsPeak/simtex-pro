export default {
  id: 'palazzo_checker',
  name: 'Palazzo Checker',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Worn palazzo floor — alternating marble slabs, every slab carrying its own veining at its own angle, centuries of footfall dulling the traffic lanes and hairline joints catching the dirt.',
  shader: `
    float hash_pcz(vec2 p) {
      return fract(sin(dot(p, vec2(269.3, 151.9))) * 43913.7331);
    }

    // marble veining in a slab-local frame
    float veins_pcz(vec2 p, vec2 seed) {
      vec2 q = p + seed * 17.0;
      // primary veins: ridged turbulence
      float v = abs(snoise(q * 2.2));
      v = 1.0 - smoothstep(0.0, 0.16, v);
      // secondary hairlines
      float v2 = abs(snoise(q * 6.5 + 31.0));
      v2 = 1.0 - smoothstep(0.0, 0.05, v2);
      return clamp(v + v2 * 0.5, 0.0, 1.0);
    }

    vec4 generate() {
      float n = floor(u_slabs + 0.5) * 2.0;    // even count keeps the checker tiling
      vec2 uv = v_uv * n;
      vec2 cell = mod(floor(uv), n);
      vec2 f = fract(uv);

      float darkSlab = mod(cell.x + cell.y, 2.0);

      // --- per-slab vein frame: each block was sawn at its own angle ---
      float ang = hash_pcz(cell) * 3.14159265;
      float ca = cos(ang); float sa = sin(ang);
      vec2 vp = mat2(ca, -sa, sa, ca) * (f - 0.5);
      float vein = veins_pcz(vp, cell);

      // --- slab body colours ---
      vec3 light = u_light_color.rgb;
      vec3 dark  = u_dark_color.rgb;

      // cloudy body tone inside each slab
      float cloud = fbm(vp * 3.0 + cell * 7.7) * 0.5 + 0.5;

      vec3 slab;
      if (darkSlab > 0.5) {
        slab = dark * (0.82 + cloud * 0.30);
        // pale veins through the dark marble
        slab = mix(slab, mix(dark, light, 0.75), vein * 0.65);
        // golden mineral seams in some dark slabs
        float gilt = step(0.7, hash_pcz(cell + 9.0));
        slab = mix(slab, vec3(0.62, 0.50, 0.30), vein * gilt * 0.25);
      } else {
        slab = light * (0.88 + cloud * 0.16);
        // grey-violet veins through the pale marble
        slab = mix(slab, mix(light, dark, 0.55), vein * 0.45);
        // warm blush patches in the white
        slab = mix(slab, light * vec3(1.02, 0.96, 0.90), smoothstep(0.6, 0.9, cloud) * 0.4);
      }

      // crystalline sugar-sparkle of polished marble
      slab *= 0.975 + hash_pcz(floor(uv * 110.0)) * 0.05;

      // --- wear ---
      // traffic dulling: a soft lane of wear flowing through the floor
      float lane = snoise(v_uv * 2.0 + 5.0) * 0.5 + 0.5;
      float traffic = smoothstep(0.35, 0.75, lane) * u_wear;
      // worn marble loses its depth: veins fade, tone flattens and greys
      vec3 wornTone = mix(slab, vec3(dot(slab, vec3(0.333))) * 0.92, 0.5);
      slab = mix(slab, wornTone, traffic * 0.55);
      // slab centres hollow slightly with wear — broad dim toward middle
      float dish = smoothstep(0.5, 0.15, length(f - 0.5));
      slab *= 1.0 - dish * traffic * 0.10;
      // chipped slab corners filled with old dark mastic
      float chip = step(0.92, hash_pcz(cell + 19.0)) *
        smoothstep(0.13, 0.05, length(f - vec2(step(0.5, hash_pcz(cell + 3.0)),
                                               step(0.5, hash_pcz(cell + 4.0)))));
      slab = mix(slab, vec3(0.20, 0.18, 0.16), chip * 0.7);

      // --- joints: hairline, dirt-darkened ---
      float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      float joint = smoothstep(0.014, 0.004, edge);
      vec3 jCol = vec3(0.30, 0.28, 0.25) * (0.8 + noise(uv * 90.0) * 0.3);
      // joints in the traffic lane are ground pale instead
      jCol = mix(jCol, slab * 0.85, traffic * 0.5);
      vec3 col = mix(slab, jCol, joint);

      // polish sheen: long soft reflection sweeping the polished areas only
      float sheen = exp(-7.0 * pow(f.x + f.y - 1.05, 2.0));
      col += vec3(1.0) * sheen * 0.10 * (1.0 - traffic);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_slabs',       name: 'Checker Scale', type: 'float', min: 1.0, max: 6.0, default: 3.0 },
    { id: 'u_wear',        name: 'Foot Wear',     type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_light_color', name: 'Light Marble',  type: 'color', default: [0.88, 0.86, 0.81, 1.0] },
    { id: 'u_dark_color',  name: 'Dark Marble',   type: 'color', default: [0.16, 0.17, 0.18, 1.0] }
  ]
};

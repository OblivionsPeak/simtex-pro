export default {
  id: 'opalized_wood',
  name: 'Opalized Wood',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Fossil wood replaced by precious opal — brown growth rings interrupted by glassy patches blazing with spectral play-of-color.',
  shader: `
    vec2 hash2_opw(vec2 p) {
      return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
    }

    // Voronoi (F1, F2, cellHash) for the opal replacement patches
    vec3 voro_opw(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float f1 = 8.0;
      float f2 = 8.0;
      float id = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 g = vec2(float(x), float(y));
          vec2 o = hash2_opw(i + g);
          float d = length(g + o - f);
          if (d < f1) { f2 = f1; f1 = d; id = fract(o.x * 27.1 + o.y * 15.3); }
          else if (d < f2) { f2 = d; }
        }
      }
      return vec3(f1, f2, id);
    }

    vec3 spectral_opw(float h) {
      return 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Wood growth rings ---
      // Off-canvas pith with fbm distortion -> arcs of grain
      vec2 pith = uv - vec2(0.15, 0.75);
      float rd = length(pith) + fbm(uv * 4.0) * 0.10 + snoise(uv * vec2(2.0, 14.0)) * 0.015;
      float ring = fract(rd * u_grain_scale);
      float ringId = floor(rd * u_grain_scale);
      float rh = hash(vec2(ringId, 5.1));

      vec3 woodA = u_wood_color.rgb;                  // warm brown
      vec3 woodB = woodA * vec3(0.42, 0.36, 0.34);    // dark latewood
      float grainBand = smoothstep(0.0, 0.4, ring) * smoothstep(1.0, 0.55, ring);
      vec3 wood = mix(woodB, woodA, grainBand * (0.7 + rh * 0.5));

      // Fine cellular wood texture along the grain
      float cells = noise(vec2(rd * 300.0, atan(pith.y, pith.x) * 30.0));
      wood *= 0.88 + cells * 0.2;

      // --- Opal replacement patches ---
      vec2 warped = uv + vec2(snoise(uv * 2.8), snoise(uv * 2.8 + 17.0)) * 0.07;
      vec3 v = voro_opw(warped * u_patch_scale);
      float edge = v.y - v.x;
      float id = v.z;

      // Coverage gate: which cells have opalized
      float gate = step(1.0 - u_opal_amount, fract(id * 7.91));
      float patch = smoothstep(0.02, 0.14, edge) * gate;

      // --- Play-of-color inside the opal ---
      // Hue from the patch, shimmered by a finer inner voronoi
      vec3 v2 = voro_opw(warped * u_patch_scale * 3.7 + 61.0);
      float hue = id * 1.7 + v2.z * 0.35 + snoise(uv * 20.0) * 0.05;
      vec3 fire = spectral_opw(hue);

      // Milky potch base with the fire floating in it
      vec3 potch = vec3(0.80, 0.84, 0.86);
      float fireGate = step(0.35, fract(v2.z * 5.3)); // some grains stay milky
      float fireAmt = (0.45 + 0.55 * fract(v2.z * 9.1)) * fireGate;
      vec3 opal = mix(potch, fire, fireAmt * 0.85);
      // Hot saturated sparks
      opal += fire * pow(fract(v2.z * 11.7), 14.0) * 1.2;

      // Ghost of the wood grain persists faintly through the opal
      opal *= 0.88 + grainBand * 0.16;

      vec3 col = mix(wood, opal, patch);

      // Dark silicified contact line around each opal patch
      float contact = exp(-pow((edge - 0.06) * 70.0, 2.0)) * gate;
      col = mix(col, woodB * 0.5, contact * 0.5);

      // Glassy polish: opal zones gleam harder than the wood
      float band = dot(uv - 0.5, normalize(vec2(0.75, 0.65)));
      float gloss = exp(-band * band * 16.0);
      col += gloss * (0.05 + patch * 0.10);

      col += (hash(uv * 700.0) - 0.5) * 0.018;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grain_scale', name: 'Grain Rings',   type: 'float', min: 6.0, max: 50.0, default: 22.0 },
    { id: 'u_patch_scale', name: 'Opal Patches',  type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_opal_amount', name: 'Opal Coverage', type: 'float', min: 0.1, max: 1.0,  default: 0.5 },
    { id: 'u_wood_color',  name: 'Wood Brown',    type: 'color', default: [0.52, 0.34, 0.20, 1.0] }
  ]
};

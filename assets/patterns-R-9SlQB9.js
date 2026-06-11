import{n as e}from"./rolldown-runtime-Dw2cE7zH.js";var t=e({default:()=>n}),n={id:`abyssal_silt`,name:`Abyssal Silt`,category:`Ocean`,added:`2026-06-11`,description:`A hadal sediment plain — fine grey-brown ooze combed into faint current ripples, pocked with burrow holes and feeding trails.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      // --- base ooze: soft tonal drifts ---
      vec3 silt = u_silt_color.rgb;
      float drift = fbm(uv * 3.0) * 0.5 + 0.5;
      vec3 col = mix(silt * 0.75, silt * 1.12, drift);

      // --- current ripples: long ridges combed horizontally ---
      // anisotropic noise (stretched in x) gives sinuous ridge crests
      float rip = snoise(vec2(uv.x * 2.5, uv.y * 16.0));
      rip += snoise(vec2(uv.x * 5.0 + 7.0, uv.y * 32.0)) * 0.4;
      float crest = smoothstep(-0.2, 0.8, rip);
      // crests catch the light, troughs hold shadow
      col *= 0.88 + crest * 0.22 * u_ripples;
      // crisp shadow line just under each crest
      float shadow_line = smoothstep(0.15, 0.0, abs(rip - 0.45)) * u_ripples;
      col *= 1.0 - shadow_line * 0.10;

      // --- fine sediment grain, two scales ---
      col += (noise(uv * 220.0) - 0.5) * 0.07 * u_grain;
      col += (noise(uv * 70.0 + 31.0) - 0.5) * 0.05 * u_grain;

      // --- burrow holes: sparse dark pits with raised rims ---
      vec2 g = uv * 9.0;
      vec2 id = floor(g);
      vec2 f = fract(g) - 0.5;
      float bh = hash(id + 13.1);
      if (bh > 0.72) {
        vec2 bp = f - (vec2(hash(id + 1.1), hash(id + 2.2)) - 0.5) * 0.6;
        float d = length(bp);
        float r = 0.05 + 0.05 * hash(id + 5.5);
        // dark pit
        col = mix(col, silt * 0.30, smoothstep(r, r * 0.4, d));
        // pale excavated rim ring
        col = mix(col, silt * 1.25, smoothstep(0.04, 0.0, abs(d - r * 1.4)) * 0.6);
      }

      // --- feeding trails: meandering grooves pressed into the ooze ---
      float trail = 1.0 - abs(snoise(uv * 2.0 + vec2(57.0, 23.0)));
      trail = pow(trail, 14.0);
      float trail2 = 1.0 - abs(snoise(uv * 3.3 + vec2(5.0, 91.0)));
      trail = max(trail, pow(trail2, 16.0) * 0.8);
      // a groove: dark centre, faint bright pushed-up edges
      col *= 1.0 - trail * 0.18;
      col += silt * 0.18 * smoothstep(0.35, 0.55, trail) * (1.0 - smoothstep(0.65, 0.9, trail));

      // scattered detritus flecks (marine snow that has landed)
      float fleck = step(0.988, hash(floor(uv * 130.0) + 77.0));
      col = mix(col, silt * 1.35 + vec3(0.04), fleck * 0.7);
      float dark_fleck = step(0.992, hash(floor(uv * 95.0) + 41.0));
      col = mix(col, silt * 0.45, dark_fleck * 0.6);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_ripples`,name:`Ripple Relief`,type:`float`,min:0,max:1.5,default:.8},{id:`u_grain`,name:`Grain Amount`,type:`float`,min:0,max:2,default:1},{id:`u_silt_color`,name:`Silt Color`,type:`color`,default:[.45,.41,.36,1]}]},r=e({default:()=>i}),i={id:`accretion_disk`,name:`Accretion Disk`,category:`Cosmos`,added:`2026-06-11`,description:`Superheated matter spiralling into a black hole — Doppler-boosted orbital streaks, a white-hot inner edge, and a pitch-black event horizon.`,shader:`
    vec2 rot_acd(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    }

    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      float horizon = u_horizon;       // event-horizon radius
      float inner   = horizon * 1.45;  // innermost stable orbit
      float outer   = 1.05;            // disk outer edge

      // --- Orbital streak coordinate ---
      // Matter shears faster near the centre: differential rotation
      float orbitPhase = theta + (1.0 / max(r, 0.05)) * u_shear;
      // Streaks: high-frequency noise stretched along the orbit direction
      vec2 streakUv = vec2(orbitPhase * 2.2, r * 14.0);
      float streaks = fbm(streakUv) * 0.5 + 0.5;
      float fine = noise(streakUv * vec2(3.0, 2.5) + 53.0);
      streaks = streaks * 0.7 + fine * 0.3;

      // --- Disk radial profile ---
      float inEdge  = smoothstep(inner * 0.92, inner * 1.15, r);
      float outFade = smoothstep(outer, outer * 0.55, r);
      float disk = inEdge * outFade;

      // Temperature falls with radius: white-hot rim to deep red fringe
      float temp = clamp(1.0 - (r - inner) / (outer - inner), 0.0, 1.0);
      temp = pow(temp, 1.6);

      // --- Doppler beaming: approaching side dramatically brighter ---
      float beam = 0.45 + 0.55 * cos(theta - 1.05);
      beam = pow(max(beam, 0.0), 1.5) * u_beaming + (1.0 - u_beaming) * 0.6;

      // --- Palette: blackbody-ish ramp ---
      vec3 emberRed = vec3(0.45, 0.06, 0.02);
      vec3 hotOrange = vec3(1.0, 0.45, 0.10);
      vec3 furnace = vec3(1.0, 0.85, 0.55);
      vec3 whiteHot = vec3(1.0, 0.98, 0.94);

      vec3 diskCol = mix(emberRed, hotOrange, smoothstep(0.0, 0.45, temp));
      diskCol = mix(diskCol, furnace, smoothstep(0.45, 0.8, temp));
      diskCol = mix(diskCol, whiteHot, smoothstep(0.8, 1.0, temp));

      // Streak modulation: bright filaments and dark shear gaps
      float fil = 0.45 + 0.9 * streaks;
      vec3 col = diskCol * disk * fil * beam;

      // White-hot ring at the inner edge, photon-ring sharp
      float rim = exp(-pow((r - inner) / (inner * 0.10), 2.0));
      col += whiteHot * rim * beam * 1.3;

      // Thin gravitationally-lensed photon ring hugging the horizon
      float photon = exp(-pow((r - horizon * 1.12) / (horizon * 0.045), 2.0));
      col += vec3(1.0, 0.9, 0.7) * photon * 0.9;

      // --- Event horizon: absolute black ---
      float hole = smoothstep(horizon * 1.04, horizon * 0.96, r);
      col *= 1.0 - hole;

      // Ambient deep space + faint outer glow haze
      vec3 space = vec3(0.008, 0.006, 0.014);
      float haze = exp(-r * 2.0) * (1.0 - hole) * 0.18;
      col += space + vec3(0.6, 0.25, 0.08) * haze * beam;

      // Sparse hot sparks flung off the disk
      vec2 g = floor((rot_acd(uv, r * 2.0)) * 60.0 + 100.0);
      float spark = smoothstep(0.985, 1.0, hash(g)) * disk;
      col += hotOrange * spark * 1.5;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_horizon`,name:`Horizon Size`,type:`float`,min:.05,max:.35,default:.16},{id:`u_shear`,name:`Orbital Shear`,type:`float`,min:.2,max:3,default:1.1},{id:`u_beaming`,name:`Doppler Beaming`,type:`float`,min:0,max:1,default:.7}]},a=e({default:()=>o}),o={id:`acid_etch_artisan`,name:`Acid Etch`,category:`Industrial`,added:`2026-04-15`,description:`High-contrast stylized chemical erosion patterns found in weathered metals.`,shader:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Acid Detail`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Etch Deep`,type:`color`,default:[.15,.12,.1,1]},{id:`u_secondary_color`,name:`Original Plane`,type:`color`,default:[.4,.4,.45,1]}]},s=e({default:()=>c}),c={id:`aero_ablative_coating_artisan`,name:`Aero-Ablative Coating`,category:`Racing`,added:`2026-05-13`,description:`A smooth surface that sheds layers under high velocity, showing directional wind streak lines and gradient wear.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // High frequency stretched noise for streak lines
        vec2 streakUV = vec2(uv.x * 10.0, uv.y * 0.2); 
        float streaks = noise(streakUV);
        streaks += 0.5 * noise(streakUV * 2.0);
        streaks += 0.25 * noise(streakUV * 4.0);
        streaks = streaks / 1.75;
        
        // Macro wear gradient
        float wear = noise(uv * 0.5 + vec2(0.0, u_wear_offset*0.1));
        
        // Combine streaks and wear
        float ablation = smoothstep(0.3, 0.7, streaks * wear);
        
        return mix(u_base_color, u_ablated_color, ablation);
    }
  `,uniforms:[{id:`u_scale`,name:`Streak Scale`,type:`float`,min:1,max:20,default:5},{id:`u_base_color`,name:`Pristine Coating`,type:`color`,default:[.9,.9,.95,1]},{id:`u_ablated_color`,name:`Ablated Core`,type:`color`,default:[.2,.2,.25,1]},{id:`u_wear_offset`,name:`Wear Offset`,type:`float`,min:0,max:10,default:0}]},l=e({default:()=>u}),u={id:`aero_riblets`,name:`Aerodynamic Riblets`,category:`Racing`,added:`2026-05-13`,description:`Microscale V-groove riblets machined into aerodynamic surfaces to reduce turbulent drag — as used on F1 cars, aircraft, and high-performance bodywork.`,shader:`
    float hash_ar(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_ar(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_ar(i), hash_ar(i+vec2(1,0)), f.x),
                 mix(hash_ar(i+vec2(0,1)), hash_ar(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Rotate UV to riblet direction
      float ang = u_angle * 3.14159;
      float ca = cos(ang), sa = sin(ang);
      vec2 ruv = mat2(ca, -sa, sa, ca) * (uv - 0.5) + 0.5;

      // Primary riblet axis: V-groove profile along ruv.y, repeating along ruv.x
      float ribX = fract(ruv.x * u_density);

      // V-groove: triangle wave gives sharp valley, bright ridge
      // 0 at centre = deepest valley, 1 at edge = ridge
      float groove = abs(ribX - 0.5) * 2.0; // 0 = valley, 1 = ridge

      // Shadow in valley, specular on ridge
      float shadow = 1.0 - groove;                   // deep in valley
      float ridge  = smoothstep(0.72, 1.0, groove);  // highlight at peak

      // Secondary micro-groove for realism (every 4th riblet is slightly wider)
      float macroGroove = abs(fract(ruv.x * u_density / 4.0) - 0.5) * 2.0;
      float macroAccent = (1.0 - macroGroove) * 0.12;

      // Slight surface imperfection along the riblet length
      float imperfect = noise_ar(vec2(ruv.x * u_density * 0.5, ruv.y * 3.0)) * 0.04;

      // Light from top-left hitting the angled V faces
      float face = groove; // how much this face points toward light
      float diffuse = face * 0.7 + 0.3;

      // Compose
      vec3 base  = u_surface_color.rgb;
      vec3 col   = base * diffuse;
      col -= shadow * base * 0.35;          // darken valley
      col += vec3(ridge * u_sharpness * 0.35); // bright ridge line
      col -= vec3(macroAccent);              // deeper macro groove shadow
      col += vec3(imperfect);               // micro surface noise

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_surface_color`,name:`Surface Colour`,type:`color`,default:[.72,.72,.74,1]},{id:`u_density`,name:`Riblet Density`,type:`float`,default:120,min:20,max:400},{id:`u_angle`,name:`Direction`,type:`float`,default:0,min:-.5,max:.5},{id:`u_sharpness`,name:`Ridge Sharpness`,type:`float`,default:.7,min:.1,max:1}]},d=e({default:()=>f}),f={id:`alcantara_suede_artisan`,name:`Alcantara Suede`,category:`Racing`,added:`2026-04-16`,description:`Soft, directional fiber nap mimicking professional racing steering wheels and seats.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 0.5);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Fiber Density`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Fiber Top`,type:`color`,default:[.2,.2,.22,1]},{id:`u_secondary_color`,name:`Fiber Base`,type:`color`,default:[.1,.1,.1,1]}]},p=e({default:()=>m}),m={id:`amethyst_natural`,name:`Amethyst Crystal`,category:`Natural`,added:`2026-05-01`,description:`Amethyst crystal cluster cross-section with elongated Voronoi cells, anisotropic face shading, and lavender-to-violet color range.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Elongated Voronoi — stretch UV in Y to make crystals columnar
    vec3 voronoiElong(vec2 uv) {
      // Stretch vertically: crystals are taller than wide
      vec2 suv = vec2(uv.x, uv.y * 0.45);
      vec2 i   = floor(suv);
      vec2 f   = fract(suv);
      float minD1 = 8.0; float minD2 = 8.0;
      float cellID = 0.0;
      vec2 minPt = vec2(0.0);
      for (int y = -1; y <= 2; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 n  = vec2(float(x), float(y));
          // Jitter point, tightly packed horizontally
          vec2 rnd = vec2(hash21(i + n), hash21(i + n + vec2(37.0, 71.0)));
          vec2 pt  = n + rnd * vec2(0.85, 0.92);
          float d  = length(f - pt);
          if (d < minD1) {
            minD2  = minD1;
            minD1  = d;
            cellID = hash21(i + n + 0.5);
            minPt  = pt;
          } else if (d < minD2) {
            minD2  = d;
          }
        }
      }
      return vec3(minD1, minD2, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec3 vor = voronoiElong(uv);

      float d1     = vor.x;
      float d2     = vor.y;
      float cellID = vor.z;

      // Crystal face: anisotropic shading — vary brightness with X position
      // within the cell (simulates light reflecting off a tilted face)
      float faceAngle = hash11(cellID) * 3.14159;
      // Directional light hitting at an angle across v_uv
      float lightDir  = cos(faceAngle) * v_uv.x + sin(faceAngle) * v_uv.y;
      float faceBright = 0.55 + 0.45 * (lightDir - floor(lightDir));

      // Depth-based color blend: deeper crystals are more saturated/dark
      float depth = hash11(cellID + 0.7);  // 0=shallow 1=deep
      vec3 crystalCol = mix(u_color_light.rgb, u_color_deep.rgb, depth);

      // Apply face brightness (anisotropic glint)
      crystalCol *= (0.7 + 0.3 * faceBright);

      // Internal facet line: second nearest distance creates face boundaries
      float facetEdge = d2 - d1;
      float edgeMask  = 1.0 - smoothstep(0.0, 0.04, facetEdge);
      crystalCol      = mix(crystalCol, u_color_deep.rgb * 0.3, edgeMask * 0.7);

      // Cell boundary — dark gap / matrix between crystals
      float boundary = 1.0 - smoothstep(0.02, 0.06, d1);
      vec3 matrixCol = u_color_deep.rgb * 0.15;
      vec3 col       = mix(crystalCol, matrixCol, boundary);

      // Top-end facet highlight: near v_uv.y == 0 the crystal tip catches light
      float tipGlow = (1.0 - v_uv.y) * hash11(cellID + 0.2) * 0.25;
      col += u_color_light.rgb * tipGlow * (1.0 - boundary);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Density`,type:`float`,min:2,max:12,default:6},{id:`u_color_light`,name:`Pale Amethyst`,type:`color`,default:[.78,.55,.9,1]},{id:`u_color_deep`,name:`Deep Violet`,type:`color`,default:[.32,.08,.55,1]}]},h=e({default:()=>g}),g={id:`anodized_blue`,name:`Anodized Blue`,category:`Industrial`,added:`2026-04-30`,description:`Anodized aluminum in deep cobalt/sapphire blue with subtle directional streaking from the anodizing bath.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv;

      // Anodizing streaks run along the Y axis (dip direction)
      // Low-frequency X variation + high-frequency micro lines
      float streakLow  = noise(vec2(uv.x * u_streak, uv.y * 0.5));
      float streakHigh = noise(vec2(uv.x * u_streak * 8.0, uv.y * 1.5));
      float streak = streakLow * 0.7 + streakHigh * 0.3;

      // Dark vs light shade from u_shade
      // u_shade 0 = very dark navy, 1 = lighter sapphire
      vec3 darkBlue   = vec3(0.04, 0.07, 0.22);
      vec3 lightBlue  = vec3(0.14, 0.28, 0.62);
      vec3 baseColor  = mix(darkBlue, lightBlue, u_shade);

      // Streak modulates luminance slightly
      float streakMod = mix(0.85, 1.1, streak);
      vec3 col = baseColor * streakMod;

      // Interference / thin-film edge shimmer — slight violet/cyan highlight
      float shimmer = noise(vec2(uv.x * 30.0, uv.y * 5.0 + 1.5708));
      shimmer = pow(shimmer, 3.0) * 0.12;
      col += vec3(shimmer * 0.3, shimmer * 0.5, shimmer * 1.0);

      // Gloss band across the middle
      float gloss = exp(-pow((uv.y - 0.5) * 4.0, 2.0)) * 0.12;
      col += vec3(gloss * 0.4, gloss * 0.6, gloss);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_shade`,name:`Shade`,type:`float`,min:0,max:1,default:.5},{id:`u_streak`,name:`Streak Frequency`,type:`float`,min:1,max:10,default:4}]},_=e({default:()=>v}),v={id:`anodized_bronze`,name:`Anodized Bronze`,category:`Industrial`,added:`2026-04-30`,description:`Anodized aluminum in a warm bronze/gold tone with micro-grain texture and subtle colour banding from bath imperfections.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Micro-grain along the extrusion direction (vertical streaks)
      float grain = noise(vec2(uv.x * u_grain * 120.0, uv.y * u_grain * 4.0));
      grain = grain * 0.5 + 0.5 * noise(vec2(uv.x * u_grain * 240.0, uv.y * u_grain * 2.0));

      // Anodizing bath colour bands — slow horizontal variation
      float band = fbm(vec2(uv.x * 2.0, uv.y * 0.3));
      band = smoothstep(0.3, 0.7, band) * 0.12;

      // Base bronze colour — warm amber/gold, shifted by u_tone
      // u_tone 0 = cooler (greenish bronze), 1 = warmer (gold)
      vec3 coolBronze = vec3(0.45, 0.35, 0.18);
      vec3 warmGold   = vec3(0.65, 0.50, 0.22);
      vec3 baseColor  = mix(coolBronze, warmGold, u_tone);

      // Slight surface lightness variation from grain
      float grainLight = mix(0.78, 1.08, grain);
      vec3 col = baseColor * grainLight;

      // Band overlay — slight orange-gold tinge
      col += vec3(0.12, 0.07, 0.0) * band;

      // Subtle gloss sheen — brightest at uv.y centre
      float sheen = pow(1.0 - abs(uv.y - 0.5) * 2.0, 3.0) * 0.18;
      col += vec3(sheen * 0.9, sheen * 0.7, sheen * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_tone`,name:`Tone`,type:`float`,min:0,max:1,default:.6},{id:`u_grain`,name:`Micro Grain`,type:`float`,min:.5,max:8,default:3}]},y=e({default:()=>b}),b={id:`anodized_red`,name:`Anodized Red`,category:`Industrial`,added:`2026-05-01`,description:`Red anodized aluminum in cherry/crimson with a smooth satin finish and subtle micro-streaks from the anodizing bath process.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Anodizing streaks along Y (dip direction)
      // Low-frequency large variation + high-frequency fine streaks
      float streakLow  = noise(vec2(uv.x * u_streak,        uv.y * 0.4));
      float streakHigh = noise(vec2(uv.x * u_streak * 7.5,  uv.y * 2.0));
      float streak = streakLow * 0.65 + streakHigh * 0.35;

      // u_shade 0 = very dark maroon, 1 = bright cherry
      vec3 darkRed   = vec3(0.22, 0.02, 0.02);
      vec3 brightRed = u_red_tone.rgb;
      vec3 baseColor = mix(darkRed, brightRed, u_shade);

      // Streak modulates lightness
      float streakMod = mix(0.82, 1.12, streak);
      vec3 col = baseColor * streakMod;

      // Thin-film interference shimmer — red anodize shows orange/pink shimmer at edges
      float shimmer = noise(vec2(uv.x * 28.0, uv.y * 4.5 + 0.9));
      shimmer = pow(shimmer, 3.5) * 0.10;
      // Orange-pink tint
      col += vec3(shimmer * 1.0, shimmer * 0.35, shimmer * 0.25);

      // Translucency depth — slightly darker band toward centre as dye pools
      float depth = fbm(vec2(uv.x * 1.5, uv.y * 0.8));
      float depthMod = mix(0.92, 1.0, depth);
      col *= depthMod;

      // Gloss band — soft specular across U
      float gloss = exp(-pow((uv.x - 0.5) * 4.5, 2.0)) * 0.10;
      col += vec3(gloss * 1.0, gloss * 0.5, gloss * 0.5);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_shade`,name:`Shade`,type:`float`,min:0,max:1,default:.5},{id:`u_streak`,name:`Streak`,type:`float`,min:1,max:10,default:4},{id:`u_red_tone`,name:`Red Tone`,type:`color`,default:[.78,.06,.06,1]}]},x=e({default:()=>S}),S={id:`anodized_titanium_artisan`,name:`Anodized Titanium`,category:`Industrial`,added:`2026-04-16`,description:`Multi-colored prismatic heat distribution and electrochemical finish for high-performance components.`,shader:`
    vec4 generate() {
      float n = v_uv.x + v_uv.y;
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      return vec4(col, 1.0);
    }
  `,uniforms:[]},C=e({default:()=>w}),w={id:`apex_curbing_artisan`,name:`Track Curbing`,category:`Racing`,added:`2026-04-15`,description:`Classic circuit apex curbing with tire wear marks.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x));
      float wear = hash(v_uv * 10.0) * 0.2;
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= wear;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Curb Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Color A`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Color B`,type:`color`,default:[1,1,1,1]}]},T=e({default:()=>E}),E={id:`arcade_carpet`,name:`Arcade Carpet`,category:`Retro`,added:`2026-06-11`,description:`Blacklight bowling-alley carpet circa 1992 — neon confetti triangles, squiggles, rings and zigzag bolts glowing out of a deep ultraviolet pile.`,shader:`
    mat2 rot2_ac(float a) {
      float c = cos(a); float s = sin(a);
      return mat2(c, -s, s, c);
    }

    vec3 neon_ac(float h) {
      if (h < 0.2) return vec3(0.05, 1.00, 0.95);  // electric cyan
      if (h < 0.4) return vec3(1.00, 0.12, 0.85);  // hot magenta
      if (h < 0.6) return vec3(0.55, 1.00, 0.10);  // toxic lime
      if (h < 0.8) return vec3(1.00, 0.55, 0.05);  // blaze orange
      return vec3(0.60, 0.30, 1.00);               // ultraviolet purple
    }

    // signed distance to one confetti glyph, selected by 'pick'
    float glyph_ac(vec2 p, float pick) {
      if (pick < 0.25) {
        // hollow triangle
        float an = atan(p.y, p.x);
        float seg = 2.0943951; // 2*pi/3
        float tri = cos(floor(0.5 + an / seg) * seg - an) * length(p);
        return abs(tri - 0.22) - 0.05;
      } else if (pick < 0.5) {
        // squiggle stroke
        float w = sin(p.x * 14.0) * 0.12;
        float d = abs(p.y - w) - 0.045;
        return max(d, abs(p.x) - 0.32);
      } else if (pick < 0.75) {
        // ring
        return abs(length(p) - 0.22) - 0.055;
      }
      // zigzag bolt
      float zx = fract(p.x * 3.2) - 0.5;
      float zig = (abs(zx) * 2.0 - 0.5) * 0.20;
      float d = abs(p.y - zig) - 0.05;
      return max(d, abs(p.x) - 0.30);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_density;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;

      // UV-soaked carpet pile: mottled near-black with faint purple fibre noise
      vec3 base = u_bg_color.rgb;
      float pile = noise(v_uv * 220.0) * 0.5 + noise(v_uv * 47.0) * 0.5;
      base *= 0.75 + pile * 0.5;
      base += vec3(0.02, 0.0, 0.05) * noise(v_uv * 9.0);

      vec3 col = base;

      // one confetti glyph per cell with random spin / size / jitter / hue
      float h1 = hash(cell);
      float h2 = hash(cell + 19.7);
      float h3 = hash(cell + 53.1);
      vec2 jitter = vec2(hash(cell + 7.3), hash(cell + 91.4)) * 0.3 - 0.15;
      vec2 p = rot2_ac(h2 * 6.2831) * ((f - jitter) / (0.7 + h3 * 0.6));
      float d = glyph_ac(p, h1);

      vec3 ink = neon_ac(hash(cell + 37.7));
      float body = 1.0 - smoothstep(0.0, 0.025, d);
      float halo = exp(-max(d, 0.0) * 14.0) * u_glow * 0.55;

      // the pile eats a little of the print — fibre-level fade
      float fade = 0.78 + 0.22 * noise(v_uv * 160.0);
      col = mix(col, ink * fade, body);
      col += ink * halo * fade;

      // scattered micro-flecks between the big glyphs
      vec2 fuv = v_uv * u_density * 4.0;
      vec2 fc = floor(fuv);
      vec2 ff = fract(fuv) - 0.5;
      float fh = hash(fc + 311.0);
      if (fh > 0.86) {
        float fd = length(ff) - 0.07;
        float fleck = 1.0 - smoothstep(0.0, 0.05, fd);
        col += neon_ac(hash(fc + 77.0)) * fleck * 0.8 * fade;
      }

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_density`,name:`Confetti Density`,type:`float`,min:3,max:12,default:6},{id:`u_glow`,name:`Blacklight Glow`,type:`float`,min:0,max:2,default:1},{id:`u_bg_color`,name:`Carpet Pile`,type:`color`,default:[.05,.01,.1,1]}]},D=e({default:()=>O}),O={id:`argyle_knit_artisan`,name:`Argyle Knit`,category:`Abstract`,added:`2026-04-15`,description:`Classic diamond-checkered textile pattern with structural crossing threads.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Diamond Zoom`,type:`float`,min:2,max:20,default:6},{id:`u_primary_color`,name:`Primary Knit`,type:`color`,default:[.1,.2,.4,1]},{id:`u_secondary_color`,name:`Secondary Knit`,type:`color`,default:[.15,.25,.5,1]}]},k=e({default:()=>A}),A={id:`armco_barrier`,name:`Armco Barrier`,category:`Racing`,added:`2026-05-13`,description:`Corrugated W-beam steel Armco safety barrier as found lining every racing circuit — with bolt holes, panel seams, and galvanized steel surface.`,shader:`
    float hash_ab(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_ab(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_ab(i), hash_ab(i+vec2(1,0)), f.x),
                 mix(hash_ab(i+vec2(0,1)), hash_ab(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- W-beam corrugation profile ----
      // The W cross-section creates two valleys and a central ridge
      // Repeat horizontally to tile the barrier face
      float beamY = uv.y * u_beam_scale;
      // W-profile: two sine waves create the W shape
      float wProfile = sin(beamY * 6.28318) * 0.5
                     + sin(beamY * 12.5664) * 0.25;
      wProfile = (wProfile + 0.75) / 1.5; // normalise 0-1

      // ---- Surface normal for lighting (derivate of W profile) ----
      float dwdy = cos(beamY * 6.28318) * 3.14159
                 + cos(beamY * 12.5664) * 3.14159;
      vec3 normal   = normalize(vec3(0.0, -dwdy * 0.3, 1.0));
      vec3 lightDir = normalize(vec3(0.5, 0.8, 1.0));
      float diffuse = max(0.0, dot(normal, lightDir));

      // ---- Panel horizontal seams ----
      float panelX = fract(uv.x * u_panel_repeat);
      float seam   = smoothstep(0.008, 0.0, panelX) + smoothstep(0.992, 1.0, panelX);
      seam        += smoothstep(0.004, 0.0, abs(panelX - 0.5)) * 0.3; // faint mid-panel lap joint

      // ---- Bolt holes — two rows per panel ----
      float boltX = fract(panelX * 4.0);          // 4 bolts per half-panel
      float boltY = fract(uv.y * u_beam_scale * 2.0 + 0.5); // centred vertically
      float boltDist = length(vec2(boltX - 0.5, boltY - 0.5) * vec2(1.0, 0.6));
      float boltHole = smoothstep(0.18, 0.14, boltDist);      // darker = hole
      float boltRim  = smoothstep(0.22, 0.18, boltDist) * (1.0 - boltHole) * 0.4;

      // ---- Galvanized steel surface ----
      // Spangles: the crystalline pattern of hot-dip galvanizing
      float spangle = noise_ab(uv * 18.0) * 0.5 + noise_ab(uv * 5.0) * 0.5;
      float crystalEdge = smoothstep(0.45, 0.5, spangle) * 0.08;

      // Weathering/rust streaks
      float rust = max(0.0, noise_ab(uv * vec2(60.0, 3.0)) - 0.55) * u_weathering;
      vec3 rustCol = vec3(0.55, 0.28, 0.10);

      // ---- Compose ----
      vec3 steelBase = u_paint_color.rgb;
      vec3 col       = steelBase * (0.3 + diffuse * 0.7);

      // Spangle sheen on galvanized surface
      col += vec3(crystalEdge * (1.0 - rust));

      // Seams darker
      col *= 1.0 - seam * 0.4;

      // Bolt holes — dark recessed
      col *= 1.0 - boltHole * 0.75;
      col += vec3(boltRim);

      // Rust patches
      col = mix(col, rustCol * (0.4 + diffuse * 0.4), rust);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_paint_color`,name:`Steel Colour`,type:`color`,default:[.75,.77,.74,1]},{id:`u_beam_scale`,name:`Beam Scale`,type:`float`,default:3.5,min:1,max:8},{id:`u_panel_repeat`,name:`Panel Width`,type:`float`,default:2.5,min:1,max:6},{id:`u_weathering`,name:`Weathering`,type:`float`,default:.2,min:0,max:1}]},j=e({default:()=>M}),M={id:`asphalt_pro_artisan`,name:`Asphalt Pro`,category:`Racing`,added:`2026-04-15`,description:`High-detail granular road surface noise found on professional track layouts.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Detail`,type:`float`,min:100,max:1e3,default:400},{id:`u_primary_color`,name:`Stone Grey`,type:`color`,default:[.3,.3,.32,1]},{id:`u_secondary_color`,name:`Tar Base`,type:`color`,default:[.1,.1,.12,1]}]},N=e({default:()=>P}),P={id:`asteroid_belt`,name:`Asteroid Belt`,category:`Cosmos`,added:`2026-06-11`,description:`A drifting rubble field of tumbling grey asteroids — lumpy silhouettes, sun-struck facets, and fine dust motes strewn between them.`,shader:`
    // One layer of asteroids on a wrapped jittered grid.
    // Returns vec2(rockMask, litShade)
    vec2 rocks_abl(vec2 uv, float density, float seed, float sizeMul) {
      float mask = 0.0;
      float shade = 0.0;
      vec2 g = floor(uv * density);
      vec2 f = fract(uv * density);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 cell = mod(g + vec2(float(x), float(y)), density);
          float exists = step(0.45, hash(cell + seed));
          vec2 cp = vec2(hash(cell + seed + 5.7), hash(cell + seed + 13.1));
          vec2 rel = f - vec2(float(x), float(y)) - cp;
          float rad = (0.10 + 0.16 * hash(cell + seed + 29.0)) * sizeMul;
          // Lumpy outline: perturb radius by angular noise per-rock
          float ang = atan(rel.y, rel.x);
          float lump = 1.0
            + 0.28 * sin(ang * 3.0 + hash(cell + seed + 3.0) * 6.28)
            + 0.16 * sin(ang * 7.0 + hash(cell + seed + 8.0) * 6.28)
            + 0.08 * sin(ang * 13.0 + hash(cell + seed + 21.0) * 6.28);
          float d = length(rel) / max(rad * lump, 0.001);
          float m = exists * smoothstep(1.0, 0.92, d);
          // Sun from upper-left: shade by position across the rock
          float s = clamp(0.5 - (rel.x + rel.y) / max(rad * 1.6, 0.001) * 0.5, 0.0, 1.0);
          // Terminator: dark limb on the far side
          s = mix(s, s * 0.25, smoothstep(0.55, 0.95, d));
          if (m > mask) { mask = m; shade = s; }
        }
      }
      return vec2(mask, shade);
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      vec3 space = vec3(0.010, 0.011, 0.022);
      vec3 col = space;

      // Faint zodiacal dust haze drifting through the belt
      float haze = fbm(uv * 3.0) * 0.5 + 0.5;
      col += vec3(0.06, 0.055, 0.05) * haze * 0.5;

      // Distant star pinpricks
      vec2 sg = floor(v_uv * 85.0);
      float star = smoothstep(0.965, 1.0, hash(sg + 3.3)) *
                   smoothstep(0.09, 0.0, length(fract(v_uv * 85.0) - vec2(hash(sg), hash(sg + 17.0))));
      col += vec3(0.8, 0.85, 1.0) * star * 0.9;

      // --- Three depth layers of rocks: far (small, dim) to near (large) ---
      vec3 rockBase = u_rock_color.rgb;
      float rough = noise(uv * 160.0) * 0.5 + noise(uv * 55.0 + 9.0) * 0.5;

      vec2 far = rocks_abl(uv, 14.0, 61.0, u_rock_size * 0.8);
      vec3 farCol = rockBase * (0.18 + 0.30 * far.y) * (0.85 + 0.15 * rough);
      col = mix(col, farCol, far.x);

      vec2 mid = rocks_abl(uv, 7.0, 23.0, u_rock_size);
      vec3 midCol = rockBase * (0.22 + 0.55 * mid.y) * (0.82 + 0.22 * rough);
      col = mix(col, midCol, mid.x);

      vec2 near = rocks_abl(uv, 3.0, 5.0, u_rock_size * 1.15);
      // Near rocks get crater pocks and a crisp specular facet
      float pocks = smoothstep(0.6, 0.85, noise(uv * 28.0 + 71.0));
      vec3 nearCol = rockBase * (0.25 + 0.75 * near.y);
      nearCol *= 0.80 + 0.25 * rough;
      nearCol = mix(nearCol, nearCol * 0.55, pocks * 0.6);
      nearCol += vec3(0.9, 0.88, 0.82) * pow(near.y, 4.0) * 0.30;
      col = mix(col, nearCol, near.x);

      // Tiny dust motes glinting between rocks
      vec2 dg = floor(uv * 200.0);
      float mote = smoothstep(0.985, 1.0, hash(dg + 47.0)) * u_dust;
      col += vec3(0.55, 0.52, 0.48) * mote * (1.0 - near.x);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_rock_size`,name:`Rock Size`,type:`float`,min:.5,max:1.8,default:1},{id:`u_dust`,name:`Dust Motes`,type:`float`,min:0,max:2,default:1},{id:`u_rock_color`,name:`Rock Colour`,type:`color`,default:[.58,.55,.52,1]}]},F=e({default:()=>I}),I={id:`aurora_borealis`,name:`Aurora Borealis`,category:`Cosmos`,added:`2026-06-11`,description:`Shimmering polar light curtains rippling in folded ribbons of green and violet over a star-pricked arctic night.`,shader:`
    // Single curtain ribbon: a folded vertical sheet of light
    float curtain_abr(vec2 uv, float seed, float foldFreq) {
      // Horizontal fold path of the curtain, warped by layered noise
      float fold = snoise(vec2(uv.x * foldFreq + seed, seed * 3.1)) * 0.22
                 + snoise(vec2(uv.x * foldFreq * 2.7 + seed * 1.7, seed)) * 0.09
                 + snoise(vec2(uv.x * foldFreq * 6.1, seed * 5.3)) * 0.035;
      float center = 0.5 + fold;
      float d = uv.y - center;
      // Curtains glow brightest at the lower edge and fade upward
      float lower = smoothstep(0.02, -0.015, d);
      float body  = exp(-max(d, 0.0) * 5.5) * step(0.0, d) * 0.0
                  + exp(-abs(d) * (d > 0.0 ? 3.2 : 18.0));
      return body * (0.55 + 0.45 * lower);
    }

    float stars_abr(vec2 uv) {
      vec2 g = floor(uv * 70.0);
      vec2 f = fract(uv * 70.0);
      vec2 p = vec2(hash(g + 5.1), hash(g + 23.7));
      float tw = smoothstep(0.955, 1.0, hash(g));
      return tw * smoothstep(0.10, 0.0, length(f - p));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Night sky gradient ---
      vec3 skyTop = vec3(0.010, 0.014, 0.045);
      vec3 skyBot = vec3(0.030, 0.045, 0.085);
      vec3 col = mix(skyBot, skyTop, uv.y);

      // --- Three overlapping curtains at different depths ---
      // fract on x keeps the fold path periodic-ish across tiles
      vec2 cuv = vec2(fract(uv.x), uv.y);
      float c1 = curtain_abr(vec2(cuv.x, cuv.y - 0.08), 2.3, u_ripple);
      float c2 = curtain_abr(cuv, 7.9, u_ripple * 1.6);
      float c3 = curtain_abr(vec2(cuv.x, cuv.y + 0.13), 13.4, u_ripple * 0.8);

      // --- Vertical ray striations inside the curtains ---
      float rays = 0.65 + 0.35 * snoise(vec2(uv.x * 60.0 + fbm(uv * 3.0) * 4.0, 0.5));
      float raysFine = 0.8 + 0.2 * snoise(vec2(uv.x * 140.0, 1.7));

      // --- Colour: green base shading to violet at the top edge ---
      vec3 green  = u_aurora_color.rgb;
      vec3 violet = u_fringe_color.rgb;
      float altitude = smoothstep(0.35, 0.85, uv.y);

      vec3 aurora = vec3(0.0);
      aurora += mix(green, violet, altitude) * c2 * 1.15;
      aurora += mix(green * 0.8, violet, altitude + 0.15) * c1 * 0.7;
      aurora += mix(green * 0.55, violet * 0.8, altitude) * c3 * 0.45;
      aurora *= rays * raysFine * u_intensity;

      // Faint red crown at very high altitude (oxygen line)
      float crown = c2 * smoothstep(0.6, 0.95, uv.y);
      aurora += vec3(0.55, 0.10, 0.18) * crown * 0.35 * u_intensity;

      col += aurora;

      // --- Stars showing through the dimmer sky ---
      float starMask = 1.0 - clamp((c1 + c2 + c3) * 0.8, 0.0, 1.0);
      col += vec3(0.85, 0.9, 1.0) * stars_abr(uv) * starMask;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_ripple`,name:`Curtain Ripple`,type:`float`,min:1,max:8,default:3},{id:`u_intensity`,name:`Glow Intensity`,type:`float`,min:.3,max:2.5,default:1.2},{id:`u_aurora_color`,name:`Aurora Green`,type:`color`,default:[.1,.95,.45,1]},{id:`u_fringe_color`,name:`Upper Fringe`,type:`color`,default:[.55,.2,.85,1]}]},L=e({default:()=>R}),R={id:`autumn_leaves_artisan`,name:`Fallen Leaves`,category:`Natural`,added:`2026-04-16`,description:`Clumped organic leaf-like shapes mimicking a forest floor in autumn.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Leaf Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Maple Red`,type:`color`,default:[.8,.2,.1,1]},{id:`u_secondary_color`,name:`Damp Soil`,type:`color`,default:[.2,.1,.05,1]}]},z=e({default:()=>B}),B={id:`banded_agate_artisan`,name:`Banded Agate`,category:`Geology`,added:`2026-04-16`,description:`Concentric mineral rings and gemstone strata found in polished agate slices.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Band Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Gemstone Top`,type:`color`,default:[.4,.2,.5,1]},{id:`u_secondary_color`,name:`Mineral Deep`,type:`color`,default:[.2,.1,.3,1]}]},V=e({default:()=>H}),H={id:`barbed_wire_artisan`,name:`Barbed Wire`,category:`Industrial`,added:`2026-04-15`,description:`Twisted metal strands and sharp interlocking barbs for security motifs.`,shader:`
    vec4 generate() {
      float wire = abs(sin(v_uv.y * 50.0 + v_uv.x * 10.0));
      float barb = step(0.95, fract(v_uv.x * 10.0)) * step(0.9, wire);
      float mask = smoothstep(0.1, 0.0, wire - 0.1) + barb;
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Steel`,type:`color`,default:[.6,.6,.65,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.1,.1,.1,0]}]},U=e({default:()=>W}),W={id:`bayer_dither`,name:`Bayer Dither`,category:`Retro`,added:`2026-06-11`,description:`Classic Macintosh ordered dithering — rolling dune gradients crushed to four inks through a hard 4×4 Bayer matrix, every cell a deliberate crosshatch.`,shader:`
    // 4x4 Bayer threshold (0..1) without bitwise ops:
    // M4 = 4 * M2(fine) + M2(coarse), where M2(x,y) = 2x + 3y - 4xy
    float bayer4_bd(vec2 ip) {
      vec2 a = mod(ip, 2.0);
      vec2 b = mod(floor(ip * 0.5), 2.0);
      float qa = 2.0 * a.x + 3.0 * a.y - 4.0 * a.x * a.y;
      float qb = 2.0 * b.x + 3.0 * b.y - 4.0 * b.x * b.y;
      return (qa * 4.0 + qb + 0.5) / 16.0;
    }

    vec4 generate() {
      float cells = u_cell_count;
      vec2 ip = floor(v_uv * cells);
      vec2 cuv = (ip + 0.5) / cells;   // sample the image at cell centres -> crisp dither

      // the "photograph" being dithered: dunes under a hazy sky
      float field = cuv.y * 1.15 - 0.10;
      field += fbm(cuv * u_pattern_scale) * 0.45;
      field += sin(cuv.x * 6.2831 + fbm(cuv * 3.0 + 7.7) * 4.0) * 0.09;
      // a low sun disc burned into the field
      vec2 sun = cuv - vec2(0.68, 0.72);
      field += exp(-dot(sun, sun) * 40.0) * 0.55;
      field = clamp(field, 0.0, 1.0);

      // ordered dither down to 4 tone levels between ink and paper
      float t = bayer4_bd(ip);
      float q = floor(min(field, 0.9999) * 3.0 + t);
      q = clamp(q, 0.0, 3.0) / 3.0;
      vec3 col = mix(u_ink.rgb, u_paper.rgb, q);

      // aged-paper warmth creeping into the lightest cells
      float age = noise(cuv * 5.0) * 0.05;
      col = mix(col, col * vec3(1.0, 0.97, 0.90), q * age * 12.0);

      // subtle screen-photograph vignette so big tiles don't read flat
      vec2 vc = fract(v_uv) - 0.5;
      col *= 1.0 - dot(vc, vc) * 0.18;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_cell_count`,name:`Dither Cells`,type:`float`,min:64,max:400,default:180},{id:`u_pattern_scale`,name:`Dune Scale`,type:`float`,min:1,max:8,default:3},{id:`u_ink`,name:`Ink`,type:`color`,default:[.07,.07,.1,1]},{id:`u_paper`,name:`Paper`,type:`color`,default:[.93,.91,.85,1]}]},G=e({default:()=>K}),K={id:`binary_stars`,name:`Binary Stars`,category:`Cosmos`,added:`2026-06-11`,description:`A close stellar pair locked in orbit — a fat amber giant and a fierce blue dwarf trading a glowing mass-transfer stream, each crowned with diffraction spikes.`,shader:`
    float segDist_bns(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
      return length(pa - ba * h);
    }

    // Star with limb-darkened disc, corona, and 4-point diffraction spikes
    vec3 star_bns(vec2 d, float radius, vec3 coreCol, vec3 coronaCol) {
      float r = length(d);
      vec3 c = vec3(0.0);
      // Limb-darkened disc
      float disc = smoothstep(radius, radius * 0.55, r);
      float limb = 1.0 - 0.45 * pow(clamp(r / radius, 0.0, 1.0), 2.0);
      c += coreCol * disc * limb * 1.4;
      // Granulation boiling on the surface
      float gran = noise(d * (28.0 / radius)) * 0.5 + 0.5;
      c *= 0.88 + 0.18 * gran * disc;
      // Corona glow
      c += coronaCol * exp(-(r - radius) * (5.5 / radius)) * step(radius, r) * 0.55;
      c += coronaCol * exp(-r * (1.4 / radius)) * 0.10;
      // Diffraction spikes (+ shape)
      float spike = exp(-abs(d.x) * 90.0) + exp(-abs(d.y) * 90.0);
      c += coreCol * spike * exp(-r * (2.2 / radius)) * 0.5;
      return c;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;

      // Orbit axis tilted across the tile
      float ca = cos(0.5); float sa = sin(0.5);
      vec2 axis = vec2(ca, sa);
      float sep = u_separation * 0.5;

      vec2 posA = -axis * sep;          // primary: amber giant
      vec2 posB =  axis * sep;          // secondary: blue dwarf
      float radA = u_size_ratio * 0.16;
      float radB = 0.07;

      vec3 space = vec3(0.010, 0.010, 0.024);
      vec3 col = space;

      // Background stars
      vec2 sg = floor(v_uv * 90.0);
      float bgs = smoothstep(0.965, 1.0, hash(sg + 12.0)) *
                  smoothstep(0.09, 0.0, length(fract(v_uv * 90.0) - vec2(hash(sg), hash(sg + 33.0))));
      col += vec3(0.8, 0.85, 1.0) * bgs;

      // --- Mass-transfer stream: a glowing arc sagging between the pair ---
      // Approximate with segments along a curved path
      float streamGlow = 0.0;
      vec2 prev = posA + axis * radA * 0.8;
      for (int i = 1; i <= 6; i++) {
        float t = float(i) / 6.0;
        vec2 p = mix(posA + axis * radA * 0.8, posB - axis * radB * 0.9, t);
        // Sag perpendicular to the axis (orbital trailing curve)
        p += vec2(-axis.y, axis.x) * sin(t * 3.14159265) * sep * 0.35;
        float d = segDist_bns(uv, prev, p);
        streamGlow = max(streamGlow, exp(-d * d * 2200.0));
        prev = p;
      }
      float streamTex = 0.6 + 0.4 * noise(uv * 40.0 + 7.0);
      col += vec3(0.95, 0.55, 0.25) * streamGlow * streamTex * u_stream * 1.2;

      // Hot impact spot where the stream strikes the dwarf
      vec2 impact = posB - axis * radB * 0.9;
      col += vec3(1.0, 0.85, 0.6) * exp(-pow(length(uv - impact) / 0.03, 2.0)) * u_stream;

      // --- The two stars ---
      vec3 amberCore   = u_primary_color.rgb;
      vec3 amberCorona = amberCore * vec3(1.0, 0.75, 0.45);
      col += star_bns(uv - posA, radA, amberCore, amberCorona);

      vec3 blueCore   = vec3(0.72, 0.84, 1.0);
      vec3 blueCorona = vec3(0.35, 0.55, 1.0);
      col += star_bns(uv - posB, radB, blueCore, blueCorona);

      // Shared envelope: faint figure-eight haze around both
      float envA = exp(-pow(length(uv - posA) / (radA * 3.5), 2.0));
      float envB = exp(-pow(length(uv - posB) / (radB * 5.0), 2.0));
      col += vec3(0.30, 0.22, 0.30) * clamp(envA + envB, 0.0, 1.0) * 0.30;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_separation`,name:`Separation`,type:`float`,min:.25,max:.85,default:.5},{id:`u_size_ratio`,name:`Giant Size`,type:`float`,min:.6,max:2,default:1},{id:`u_stream`,name:`Mass Stream`,type:`float`,min:0,max:2,default:1},{id:`u_primary_color`,name:`Giant Tint`,type:`color`,default:[1,.7,.35,1]}]},q=e({default:()=>J}),J={id:`bioluminescent_mycelium_artisan`,name:`Bioluminescent Mycelium`,category:`Organic`,added:`2026-05-13`,description:`Glowing fungal networks pulsing with neon light against a dark, porous substrate.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Background substrate
        float subNoise = noise(uv * 3.0) * 0.5 + noise(uv * 10.0) * 0.25;
        vec4 substrate = mix(u_bg_dark, u_bg_light, subNoise);
        
        // Mycelium network using ridge noise
        float n1 = noise(uv);
        float n2 = noise(uv * 2.0 + vec2(5.2, 1.3));
        float n3 = noise(uv * 4.0 + vec2(1.1, 9.8));
        
        float ridge1 = 1.0 - abs(n1 * 2.0 - 1.0);
        float ridge2 = 1.0 - abs(n2 * 2.0 - 1.0);
        float ridge3 = 1.0 - abs(n3 * 2.0 - 1.0);
        
        float network = pow(ridge1 * ridge2 * ridge3, 2.0) * 5.0;
        
        // Pulse effect
        float pulse = 0.5 + 0.5 * sin(u_pulse * 2.0 + uv.x + uv.y);
        float glowMask = smoothstep(0.4, 0.8, network) * pulse;
        float coreMask = smoothstep(0.8, 1.0, network);
        
        vec4 finalColor = substrate;
        finalColor = mix(finalColor, u_glow_color, glowMask * 0.8);
        finalColor = mix(finalColor, vec4(1.0,1.0,1.0,1.0), coreMask); // White core
        
        return finalColor;
    }
  `,uniforms:[{id:`u_scale`,name:`Network Scale`,type:`float`,min:2,max:20,default:8},{id:`u_bg_dark`,name:`Substrate Deep`,type:`color`,default:[.05,.08,.05,1]},{id:`u_bg_light`,name:`Substrate Surface`,type:`color`,default:[.15,.2,.15,1]},{id:`u_glow_color`,name:`Bioluminescence`,type:`color`,default:[.2,1,.5,1]},{id:`u_pulse`,name:`Pulse Animate`,type:`float`,min:0,max:100,default:0}]},Y=e({default:()=>X}),X={id:`bioluminescent_plankton`,name:`Bioluminescent Plankton`,category:`Ocean`,added:`2026-06-11`,description:`Glowing cyan plankton motes trailing comet wakes through deep blue-black night water stirred by faint currents.`,shader:`
    // Cell-based glowing motes with directional wake trails
    float plankton_blp(vec2 uv, float scale, float density, float wake_len) {
      vec2 g = uv * scale;
      vec2 id = floor(g);
      vec2 f = fract(g);
      float glow = 0.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 cid = id + o;
          float h = hash(cid);
          if (h > density) continue;
          vec2 p = o + vec2(hash(cid + 1.37), hash(cid + 2.71)) - f;
          // each mote drifts on its own heading
          float ang = hash(cid + 4.13) * 6.28318;
          vec2 dir = vec2(cos(ang), sin(ang));
          float along  = dot(p, dir);
          float across = dot(p, vec2(-dir.y, dir.x));
          // hot core
          float size = 30.0 + 90.0 * hash(cid + 7.7);
          glow += exp(-dot(p, p) * size) * (0.5 + 0.9 * h);
          // fading wake streak trailing behind the mote
          float wk = exp(-across * across * 140.0)
                   * exp(-along * along * (9.0 / max(wake_len, 0.05)))
                   * step(0.0, along);
          glow += wk * 0.30 * h;
        }
      }
      return glow;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- deep water base: near-black blue with slow current swirls ---
      vec3 abyss   = u_water_color.rgb;
      vec3 current = abyss * 1.8 + vec3(0.00, 0.02, 0.05);
      float cur = fbm(uv * 3.0 + vec2(11.7, 4.3)) * 0.5 + 0.5;
      vec3 col = mix(abyss * 0.55, current, cur * 0.45);

      // suspended murk — barely-lit particulate haze
      float murk = fbm(uv * 9.0) * 0.5 + 0.5;
      col += vec3(0.005, 0.015, 0.030) * murk;

      // --- plankton field at three scales ---
      float dens = u_density;
      float g = 0.0;
      g += plankton_blp(uv, 7.0,  dens * 0.55, u_wake_length) * 1.00; // big foreground motes
      g += plankton_blp(uv + vec2(3.7, 9.1), 16.0, dens, u_wake_length * 0.6) * 0.65;
      g += plankton_blp(uv + vec2(8.2, 1.4), 34.0, dens, u_wake_length * 0.3) * 0.35;

      // dim background dust of unlit plankton
      float dust = step(0.985, hash(floor(uv * 220.0))) * 0.12;
      g += dust;

      // bioluminescence: hot core whitens, halo stays in glow color
      vec3 glow_col = u_glow_color.rgb;
      col += glow_col * g * 1.2;
      col += vec3(0.9, 1.0, 1.0) * smoothstep(0.8, 1.6, g) * 0.8;

      // gentle vignette of light scatter around dense patches
      float patch = fbm(uv * 2.2 + 50.0) * 0.5 + 0.5;
      col += glow_col * patch * patch * 0.05;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_density`,name:`Plankton Density`,type:`float`,min:.1,max:.9,default:.45},{id:`u_wake_length`,name:`Wake Length`,type:`float`,min:.05,max:1,default:.4},{id:`u_glow_color`,name:`Glow Color`,type:`color`,default:[.15,.95,.85,1]},{id:`u_water_color`,name:`Water Color`,type:`color`,default:[.01,.03,.09,1]}]},Z=e({default:()=>Q}),Q={id:`bird_plumage_artisan`,name:`Bird Plumage`,category:`Natural`,added:`2026-04-15`,description:`Soft, overlapping organic feather vane shapes found in avian wings.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 0.8));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Feather Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Feather Vane`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Shaft`,type:`color`,default:[.05,.05,.05,1]}]},$=e({default:()=>ee}),ee={id:`bismuth_crystal_natural`,name:`Bismuth Crystal`,category:`Natural`,added:`2026-05-01`,description:`Iridescent metallic bismuth hopper crystals with staircase terraced surfaces and rainbow oxide interference colors.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Hue to RGB
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    // Voronoi returning nearest distance and cell ID
    vec2 voronoi(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float minDist = 8.0;
      float cellID  = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 n  = vec2(float(x), float(y));
          vec2 pt = vec2(hash21(i + n), hash21(i + n + vec2(53.1, 97.3)));
          float d = length(f - n - pt);
          if (d < minDist) { minDist = d; cellID = hash21(i + n + 0.5); }
        }
      }
      return vec2(minDist, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Hopper staircase: quantise UV into stepped terraces
      // Each Voronoi cell is a crystal; within that cell use Manhattan-distance
      // concentric squares to create stair steps inward
      vec2 vor     = voronoi(uv);
      float cellID = vor.y;
      float dist   = vor.x;

      // Staircase terrace level — more steps toward cell interior
      float terraceFreq  = 6.0 + hash11(cellID) * 4.0;
      float terraceLevel = floor(dist * terraceFreq) / terraceFreq;

      // Tilt / rotation of the crystal (45-deg multiples for cubic bismuth)
      float crystalAngle = floor(hash11(cellID + 0.3) * 4.0) * 1.5708;
      // Rotate local UV for anisotropy
      vec2 localUV = uv - floor(uv + 0.5);  // approx cell-relative
      float cosA = cos(crystalAngle); float sinA = sin(crystalAngle);
      vec2 rotUV = vec2(localUV.x * cosA - localUV.y * sinA,
                        localUV.x * sinA + localUV.y * cosA);

      // Iridescence hue from terrace level + cell identity
      // Each terrace gets a different oxide hue: pink→gold→teal→violet
      float hueBase = cellID + terraceLevel * 1.3 * u_iridescence;
      vec3 iriCol   = hue2rgb(hueBase);

      // Metallic base mixed with iridescence (metallic base stronger in brighter terraces)
      float metalFactor = 0.35 + terraceLevel * 0.4;
      vec3  col         = mix(iriCol, u_metal_base.rgb, metalFactor);

      // Edge darkening between terraces (step shadow)
      float stepEdge = smoothstep(0.0, 0.06, fract(dist * terraceFreq));
      col *= (0.55 + 0.45 * stepEdge);

      // Cell boundary — dark gap between crystals
      float boundary = 1.0 - smoothstep(0.04, 0.10, dist);
      col = mix(col, u_metal_base.rgb * 0.08, boundary);

      // Anisotropic glint along rotated axis
      float glint = abs(sin(rotUV.x * 18.0)) * 0.12;
      col += glint * iriCol * (1.0 - metalFactor);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Scale`,type:`float`,min:1,max:10,default:4},{id:`u_iridescence`,name:`Iridescence`,type:`float`,min:.5,max:2,default:1.4},{id:`u_metal_base`,name:`Metal Base Color`,type:`color`,default:[.68,.62,.58,1]}]},te=e({default:()=>ne}),ne={id:`bismuth_labyrinth_artisan`,name:`Bismuth Labyrinth`,category:`Natural`,added:`2026-05-13`,description:`Right-angled, stair-step crystal growth with extreme iridescent oxide layer coloring.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Stair step quantization for right angles
        vec2 id = floor(uv);
        vec2 gv = fract(uv);
        
        // Layer depth based on distance to center of pseudo-crystal
        float dist = max(abs(gv.x - 0.5), abs(gv.y - 0.5)) * 2.0;
        
        // Step it
        float steps = 5.0;
        float steppedDist = floor(dist * steps) / steps;
        
        // Create labyrinth blocks
        float mazeNoise = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
        
        // Calculate iridescence based on depth and noise
        float iridPhase = steppedDist + mazeNoise + u_phase * 0.1;
        iridPhase = fract(iridPhase);
        
        vec4 color1 = u_color_a;
        vec4 color2 = u_color_b;
        vec4 color3 = u_color_c;
        
        vec4 finalColor;
        if(iridPhase < 0.33) {
            finalColor = mix(color1, color2, iridPhase * 3.0);
        } else if(iridPhase < 0.66) {
            finalColor = mix(color2, color3, (iridPhase - 0.33) * 3.0);
        } else {
            finalColor = mix(color3, color1, (iridPhase - 0.66) * 3.0);
        }
        
        // Add edge lines to emphasize stair-steps
        float edge = fract(dist * steps);
        float edgeHighlight = smoothstep(0.9, 1.0, edge) + smoothstep(0.1, 0.0, edge);
        
        return finalColor + vec4(edgeHighlight * 0.2);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Size`,type:`float`,min:2,max:30,default:10},{id:`u_color_a`,name:`Oxide Pink`,type:`color`,default:[.9,.2,.6,1]},{id:`u_color_b`,name:`Oxide Gold`,type:`color`,default:[.8,.7,.1,1]},{id:`u_color_c`,name:`Oxide Blue`,type:`color`,default:[.1,.4,.9,1]},{id:`u_phase`,name:`Growth Phase`,type:`float`,min:0,max:100,default:0}]},re=e({default:()=>ie}),ie={id:`blueprint_grid_tech`,name:`Blueprint Grid`,category:`Technology`,added:`2026-04-15`,description:`Technical structural alignment grid.`,shader:`
    vec4 generate() {
      float aa = 0.004;
      float w = u_line_width;

      vec2 g = fract(v_uv * u_scale);
      float major = smoothstep(1.0 - w - aa, 1.0 - w + aa, max(g.x, g.y));

      vec2 gm = fract(v_uv * u_scale * u_minor_div);
      float minor = smoothstep(1.0 - w - aa, 1.0 - w + aa, max(gm.x, gm.y)) * u_minor_strength * 0.45;

      float mask = clamp(max(major, minor), 0.0, 1.0);
      return mix(u_paper_color, u_line_color, mask);
    }
  `,variants:[{name:`Classic`,uniforms:{u_line_color:[0,.8,1,1],u_paper_color:[.02,.05,.15,1],u_line_width:.02,u_minor_strength:0}},{name:`Drafting White`,uniforms:{u_line_color:[.25,.35,.55,1],u_paper_color:[.93,.94,.96,1],u_line_width:.015,u_minor_strength:.6}},{name:`Redline`,uniforms:{u_line_color:[.78,.12,.1,1],u_paper_color:[.96,.93,.86,1],u_line_width:.018,u_minor_strength:.45}},{name:`Phosphor`,uniforms:{u_line_color:[.2,1,.4,1],u_paper_color:[.01,.03,.01,1],u_line_width:.025,u_minor_strength:.7}}],uniforms:[{id:`u_scale`,name:`Grid Count`,type:`float`,min:5,max:100,default:20},{id:`u_line_width`,name:`Line Width`,type:`float`,min:.005,max:.1,default:.02},{id:`u_minor_div`,name:`Minor Subdivisions`,type:`float`,min:2,max:10,default:5},{id:`u_minor_strength`,name:`Minor Grid Strength`,type:`float`,min:0,max:1,default:0},{id:`u_line_color`,name:`Grid Line`,type:`color`,default:[0,.8,1,1]},{id:`u_paper_color`,name:`Paper`,type:`color`,default:[.02,.05,.15,1]}]},ae=e({default:()=>oe}),oe={id:`bone_pores_artisan`,name:`Bone Pores`,category:`Natural`,added:`2026-04-15`,description:`Porous trabecular organic network found in skeletal sections.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.3, 0.4, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Porosity Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Bone White`,type:`color`,default:[.95,.95,.9,1]},{id:`u_secondary_color`,name:`Pore Void`,type:`color`,default:[.1,.05,0,1]}]},se=e({default:()=>ce}),ce={id:`boombox_grille`,name:`Boombox Grille`,category:`Retro`,added:`2026-06-11`,description:`Ghetto-blaster speaker grille — staggered punched perforations in brushed gunmetal, the paper cone and dust cap glimpsed dimly through every hole.`,shader:`
    // the speaker cone seen through the holes, in whole-sheet coordinates
    vec3 cone_bg(vec2 uv) {
      vec2 c = uv - 0.5;
      float rc = length(c) * 2.0;
      // paper cone: radial weave shading toward the dust cap
      vec3 cone = mix(vec3(0.07, 0.06, 0.055), vec3(0.16, 0.14, 0.12), smoothstep(1.0, 0.25, rc));
      cone *= 0.85 + 0.15 * sin(atan(c.y, c.x) * 60.0) * smoothstep(0.25, 0.5, rc);
      // dust cap: domed highlight
      float cap = 1.0 - smoothstep(0.20, 0.26, rc);
      vec3 capc = vec3(0.05) + vec3(0.12) * exp(-pow((rc - 0.10) * 9.0, 2.0));
      cone = mix(cone, capc, cap);
      // rubber surround ring near the rim
      cone = mix(cone, vec3(0.03), smoothstep(0.86, 0.92, rc) * smoothstep(1.04, 0.98, rc));
      return cone;
    }

    vec4 generate() {
      // --- staggered perforation lattice ---
      vec2 p = v_uv * u_hole_density;
      float row = floor(p.y);
      p.x += mod(row, 2.0) * 0.5;
      vec2 cellf = fract(p) - 0.5;
      float d = length(cellf);
      float hr = u_hole_size * 0.42;

      // --- brushed metal face ---
      vec3 metal = u_metal_color.rgb;
      float brush = noise(vec2(v_uv.x * 7.0, v_uv.y * 900.0));
      metal *= 0.82 + brush * 0.34;
      // broad diagonal showroom glare
      float glare = exp(-pow((v_uv.x + v_uv.y - 1.05) * 2.6, 2.0));
      metal += vec3(0.10, 0.10, 0.11) * glare;
      // fingerprint smudges
      metal *= 1.0 - smoothstep(0.55, 0.95, fbm(v_uv * 5.0) * 0.5 + 0.5) * 0.10;

      vec3 col = metal;

      // --- holes: countersunk, dark interior showing the cone ---
      float hole = 1.0 - smoothstep(hr, hr + 0.045, d);
      vec3 through = cone_bg(v_uv) * 0.85;
      // interior shadow biased to the top of each hole (light from above)
      through *= 0.55 + 0.45 * smoothstep(0.5, -0.5, cellf.y / max(hr, 0.001));
      col = mix(col, through, hole);

      // punched rim: bright lower-right lip, dark upper-left cut
      float rim = smoothstep(hr + 0.10, hr + 0.02, d) - hole;
      float lip = dot(normalize(cellf + 0.0001), vec2(0.6, -0.8));
      col += vec3(0.16) * rim * max(lip, 0.0) * 1.4;
      col -= vec3(0.10) * rim * max(-lip, 0.0);

      // occasional dead-sharp specular glint between holes
      vec2 gcell = floor(p);
      if (hash(gcell + 41.3) > 0.93) {
        float gd = length(fract(p) - vec2(0.18, 0.80));
        col += vec3(0.5, 0.5, 0.55) * exp(-gd * gd * 320.0) * glare * 2.0;
      }

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_hole_density`,name:`Perforation Pitch`,type:`float`,min:10,max:60,default:26},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.3,max:1,default:.65},{id:`u_metal_color`,name:`Grille Metal`,type:`color`,default:[.16,.17,.19,1]}]},le=e({default:()=>ue}),ue={id:`braided_cord_artisan`,name:`Braided Cord`,category:`Industrial`,added:`2026-04-15`,description:`Overlapping thick strands of woven tactical rope found in automotive and maritime gear.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Braid Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Strand Top`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Seam Shadow`,type:`color`,default:[.05,.05,.1,1]}]},de=e({default:()=>fe}),fe={id:`brain_coral_pro`,name:`Brain Coral`,category:`Natural`,added:`2026-04-15`,description:`Labyrinthine organic structure mimicking undersea brain coral.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv);
      float maze = abs(sin(n * 20.0 + uv.x * 2.0));
      float mask = smoothstep(0.4, 0.5, maze);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Folding Size`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Ridge`,type:`color`,default:[1,.8,.8,1]},{id:`u_secondary_color`,name:`Deep Crevice`,type:`color`,default:[.4,.1,.2,1]}]},pe=e({default:()=>me}),me={id:`brake_dust_artisan`,name:`Brake Dust`,category:`Racing`,added:`2026-04-16`,description:`Fine anisotropic dark grit and metallic shavings found on race-worn wheel rims.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Dust Fleck`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Base Rim`,type:`color`,default:[.3,.3,.32,1]}]},he=e({default:()=>ge}),ge={id:`brake_rotor_wear_artisan`,name:`Brake Rotor Wear`,category:`Racing`,added:`2026-04-16`,description:`Circular friction streaks and heat scarring found on high-performance ceramic and steel rotors.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float streaks = hash(floor(d * u_scale));
      return mix(u_secondary_color, u_primary_color, streaks);
    }
  `,uniforms:[{id:`u_scale`,name:`Wear Density`,type:`float`,min:200,max:2e3,default:1e3},{id:`u_primary_color`,name:`Metal Body`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Scuff Mark`,type:`color`,default:[.5,.5,.55,1]}]},_e=e({default:()=>ve}),ve={id:`brake_rotors_artisan`,name:`Brake Rotors`,category:`Industrial`,added:`2026-04-15`,description:`Concentric heat-etched metal grooves found on high-performance brake discs.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float r = length(uv);
      float mask = sin(r * 100.0 * (1.0 + u_intensity)) * 0.5 + 0.5;
      mask *= step(0.1, r) * step(r, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_intensity`,name:`Groove Density`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Etched Steel`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Burnish`,type:`color`,default:[.2,.2,.25,1]}]},ye=e({default:()=>be}),be={id:`breaking_wave_curl`,name:`Breaking Wave Curl`,category:`Ocean`,added:`2026-06-11`,description:`Inside the barrel — a curling wave lip wrapping over glassy aquamarine, with streaked spiral flow lines, foam crest and flying spray.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 deep = u_water_color.rgb;
      vec3 lip  = u_lip_color.rgb;
      vec3 foam = vec3(0.96, 0.98, 0.99);

      // one barrel per horizontal repeat, eye of the curl above centre
      vec2 c = vec2(fract(uv.x) - 0.5, uv.y - 0.58);
      c.x *= 1.25;                                   // slightly squashed barrel
      float r = max(length(c), 0.001);
      float th = atan(c.y, c.x);

      // --- spiral coordinate: how deep into the curl we are ---
      // sp counts turns inward; the lip wraps over from the top
      float sp = log(r * 3.2) / u_curl - th / 6.28318;
      float band = fract(sp);

      // --- base water: deep outside, jade inside the pocket ---
      float depth_mix = smoothstep(0.9, 0.15, r);
      vec3 col = mix(deep * 0.8, mix(deep, lip, 0.55), depth_mix);
      // sunlight burning through the thin upper lip
      float backlight = smoothstep(0.2, 0.75, c.y / max(r, 0.05)) * smoothstep(0.7, 0.25, r);
      col += lip * backlight * 0.8;
      col += vec3(0.45, 0.65, 0.55) * backlight * backlight * 0.5;

      // --- spiral flow streaks following the curl ---
      float streak = sin(sp * 40.0 + snoise(vec2(sp * 6.0, th * 2.0)) * 2.0);
      streak = streak * 0.5 + 0.5;
      col *= 0.90 + streak * 0.18 * smoothstep(0.85, 0.2, r);
      // glassy highlight band on the wave face
      float face_gl = exp(-pow((band - 0.55) * 5.0, 2.0));
      col += lip * face_gl * 0.20 * smoothstep(0.8, 0.3, r);

      // --- the lip itself: thick white edge wrapping the spiral seam ---
      float seam = min(band, 1.0 - band);
      float lip_edge = smoothstep(0.10, 0.02, seam) * smoothstep(0.75, 0.35, r);
      // foam texture chews into the lip edge
      float chew = fbm(vec2(sp * 14.0, th * 5.0)) * 0.5 + 0.5;
      lip_edge *= smoothstep(0.25, 0.6, chew + 0.25);
      col = mix(col, foam, lip_edge * 0.9);
      // shadow tucked under the falling lip
      float under = smoothstep(0.02, 0.12, seam) * smoothstep(0.20, 0.10, seam);
      col *= 1.0 - under * 0.25 * smoothstep(0.7, 0.3, r);

      // --- crest foam: churned whitewater along the top of the wave ---
      float crest_y = 0.78 + snoise(vec2(uv.x * 6.0, 3.0)) * 0.04;
      float crest = smoothstep(crest_y - 0.04, crest_y + 0.06, uv.y);
      float churn = fbm(uv * vec2(10.0, 18.0) + 41.0) * 0.5 + 0.5;
      crest *= smoothstep(0.3, 0.7, churn + u_foam_amt * 0.3);
      col = mix(col, foam * (0.75 + churn * 0.3), crest * 0.95);

      // --- flying spray: wind-torn droplets above and ahead of the lip ---
      vec2 sg = uv * 60.0;
      float spray = step(0.90, hash(floor(sg)))
                  * smoothstep(0.5, 0.85, uv.y)
                  * u_foam_amt;
      // droplets streak with the offshore wind
      float drift = step(0.94, hash(floor(uv * vec2(28.0, 70.0)) + 9.0))
                  * smoothstep(0.55, 0.9, uv.y) * u_foam_amt;
      col = mix(col, foam, clamp(spray + drift * 0.7, 0.0, 1.0) * 0.8);

      // --- trough: darker churning water along the bottom ---
      float trough = smoothstep(0.25, 0.0, uv.y);
      col = mix(col, deep * 0.55, trough * 0.7);
      // residual foam lines sliding down the face into the trough
      float wash = pow(1.0 - abs(snoise(uv * vec2(7.0, 3.0) + 19.0)), 8.0);
      col = mix(col, foam * 0.8, wash * trough * 0.35 * u_foam_amt);

      // caustic sparkle inside the barrel pocket
      float spark = pow(1.0 - abs(snoise(c * 14.0 + 7.0)), 10.0);
      col += lip * spark * depth_mix * 0.25;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_curl`,name:`Curl Tightness`,type:`float`,min:.3,max:1.2,default:.6},{id:`u_foam_amt`,name:`Foam & Spray`,type:`float`,min:0,max:1.5,default:.9},{id:`u_water_color`,name:`Deep Water`,type:`color`,default:[.02,.18,.28,1]},{id:`u_lip_color`,name:`Barrel Glow`,type:`color`,default:[.25,.75,.7,1]}]},xe=e({default:()=>Se}),Se={id:`brick_masonry_artisan`,name:`Classic Bricks`,category:`Industrial`,added:`2026-04-15`,description:`Staggered rectangular masonry with structural mortar joints.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      
      vec2 gv = fract(uv);
      float mask = step(0.05, gv.x) * step(gv.x, 0.95) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rows`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Brick`,type:`color`,default:[.7,.2,.1,1]},{id:`u_secondary_color`,name:`Mortar`,type:`color`,default:[.4,.4,.4,1]}]},Ce=e({default:()=>we}),we={id:`brushed_aluminum_artisan`,name:`Brushed Metal`,category:`Industrial`,added:`2026-04-15`,description:`High-frequency linear streaks mimicking professional metal brushing and finishing.`,shader:`
    vec4 generate() {
      float n = hash(vec2(v_uv.y * 1000.0, 0.0));
      vec4 col = mix(u_secondary_color, u_primary_color, n);
      if (u_is_spec > 0.5) {
        // Brushed metal: fully metallic, anisotropic-feel roughness following streak intensity
        return vec4(0.9, mix(0.3, 0.5, n), 0.0, col.a);
      }
      return col;
    }
  `,uniforms:[{id:`u_primary_color`,name:`Grain`,type:`color`,default:[.8,.8,.82,1]},{id:`u_secondary_color`,name:`Base Metal`,type:`color`,default:[.6,.6,.65,1]}]},Te=e({default:()=>Ee}),Ee={id:`brushed_gold`,name:`Brushed Gold`,category:`Industrial`,added:`2026-05-01`,description:`Directional brushed gold metal with fine horizontal linear grain and a subtle specular sheen, as found on machined jewelry and trim.`,shader:`

    // High-frequency grain running horizontally — sample noise at fixed X, vary Y
    float grainLine(vec2 uv, float freq) {
      float n1 = noise(vec2(0.5, uv.y * freq));
      float n2 = noise(vec2(0.5, uv.y * freq * 2.3 + 17.3));
      return n1 * 0.65 + n2 * 0.35;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Fine horizontal brushing scratches — vary frequency with u_grain
      float coarse = grainLine(uv, u_grain * 0.8);
      float fine   = grainLine(uv, u_grain * 3.5);
      float grain  = coarse * 0.6 + fine * 0.4;

      // Slight cross-grain variation so it doesn't look perfectly flat
      float crossVar = noise(vec2(uv.x * 6.0, uv.y * 1.5)) * 0.08;

      // Base colour from uniform, modulate brightness by grain
      float grainMod = mix(0.80, 1.18, grain) + crossVar;
      vec3 col = u_base_color.rgb * grainMod;

      // Specular band — a soft highlight stripe along U (v_uv.x centre)
      float specBand = exp(-pow((uv.x - 0.5) * 5.0, 2.0));
      specBand *= u_sheen * 0.35;
      // Gold specular is warm — add more red/green than blue
      col += vec3(specBand * 1.0, specBand * 0.88, specBand * 0.35);

      // Micro-glint — rare bright scratches catching light
      float glint = pow(noise(vec2(uv.x * 2.0, uv.y * u_grain * 5.0)), 8.0) * u_sheen * 0.5;
      col += vec3(glint, glint * 0.85, glint * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain Frequency`,type:`float`,min:10,max:150,default:60},{id:`u_base_color`,name:`Base Gold`,type:`color`,default:[.85,.68,.18,1]},{id:`u_sheen`,name:`Sheen`,type:`float`,min:0,max:1,default:.5}]},De=e({default:()=>Oe}),Oe={id:`bubblewrap`,name:`Bubble Wrap`,category:`Abstract`,added:`2026-05-01`,description:`Air-filled plastic bubble wrap with hemispherical highlights, rim Fresnel, and clear film between bubbles.`,shader:`
    // Offset hexagonal grid â€” bubbles in a brick layout for efficiency
    vec2 bubbleCell(vec2 uv, out vec2 cellId) {
      // Brick offset: every other row shifts by 0.5
      float row = floor(uv.y);
      float xOffset = mod(row, 2.0) * 0.5;
      vec2 shifted = vec2(uv.x + xOffset, uv.y);
      cellId = floor(shifted);
      return fract(shifted) - 0.5;
    }

    // Sphere highlight from a single light source
    float sphereHighlight(vec2 p, float r, vec2 lightDir) {
      float dist = length(p);
      if (dist > r) return 0.0;
      // Reconstruct Z on sphere surface
      float z = sqrt(max(0.0, r * r - dist * dist));
      vec3 normal = normalize(vec3(p, z));
      vec3 light  = normalize(vec3(lightDir, 1.5));
      float diff = max(0.0, dot(normal, light));
      return diff;
    }

    // Fresnel-like rim (brightest at grazing angle â€” edge of bubble)
    float rimFresnel(vec2 p, float r) {
      float dist = length(p);
      float rim = dist / r;
      return pow(clamp(rim, 0.0, 1.0), 3.0);
    }

    vec4 generate() {
      float scale = u_bubble_size;
      vec2 uv = v_uv * scale;

      vec2 cellId;
      vec2 local = bubbleCell(uv, cellId);

      // Bubble radius (leave ~15% for film between bubbles)
      float bubbleR = 0.40;
      float dist    = length(local);

      // Inside or outside bubble
      float inside   = 1.0 - smoothstep(bubbleR - 0.01, bubbleR + 0.01, dist);

      // Film colour (clear plastic, faint yellowish)
      vec3 film = u_film_color.rgb;

      // Bubble tint from sky/environment
      vec3 tint = u_tint.rgb;

      // Diffuse shading of the hemisphere â€” light from top-left
      float diff = sphereHighlight(local, bubbleR, vec2(-0.3, 0.5));
      diff = pow(diff, 0.7);

      // Sharp specular glint at top of bubble
      vec2  specCenter = vec2(-0.10, 0.12) * bubbleR;
      float specDist   = length(local - specCenter);
      float specGlint  = smoothstep(0.08, 0.0, specDist) * 0.95;

      // Secondary smaller glint
      vec2  spec2 = vec2(0.12, -0.08) * bubbleR;
      float spec2d = length(local - spec2);
      float specGlint2 = smoothstep(0.04, 0.0, spec2d) * 0.4;

      // Fresnel rim brightening at bubble edge
      float rim = rimFresnel(local, bubbleR) * inside;
      vec3 rimCol = mix(tint, vec3(1.0), 0.5);

      // Shadow at base of bubble (contact shadow on film)
      float shadow = 1.0 - smoothstep(0.36, bubbleR + 0.04, dist) * 0.4;

      // Compose bubble colour
      vec3 bubbleCol = mix(tint * 0.55, tint, diff);
      bubbleCol += specGlint + specGlint2;
      bubbleCol  = mix(bubbleCol, rimCol, rim * 0.6);
      bubbleCol  = clamp(bubbleCol, 0.0, 1.0);

      // Film between bubbles â€” slight shadow where bubbles press down
      vec3 filmCol = film * shadow;

      vec3 col = mix(filmCol, bubbleCol, inside);

      return vec4(clamp(col, 0.0, 1.0), 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_bubble_size`,type:`float`,default:14,min:4,max:30,name:`Bubble Scale`},{id:`u_film_color`,type:`color`,default:[.88,.9,.82,1],name:`Plastic Film`},{id:`u_tint`,type:`color`,default:[.75,.85,.92,1],name:`Bubble Tint`}]},ke=e({default:()=>Ae}),Ae={id:`burlap_sack_artisan`,name:`Burlap Sack`,category:`Abstract`,added:`2026-04-15`,description:`Coarse, wide-gap organic woven fibers used in heavy storage bags.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float h = step(0.7, fract(uv.x)) + step(0.7, fract(uv.y));
      float mask = clamp(h, 0.0, 1.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fibre Size`,type:`float`,min:5,max:40,default:15},{id:`u_primary_color`,name:`Fibre`,type:`color`,default:[.6,.5,.35,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[.15,.1,.05,1]}]},je=e({default:()=>Me}),Me={id:`butterfly_wing_artisan`,name:`Chitin Scale`,category:`Natural`,added:`2026-04-16`,description:`Microscopic chitinous scales mimicking the vibrant iridescent patterns of exotic lepidoptera.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.1, f_uv.x) * step(f_uv.x, 0.9) * step(0.1, f_uv.y) * step(f_uv.y, 0.9);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (v_uv.x + v_uv.y + vec3(0, 0.33, 0.67)));
      return vec4(col * mask, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:20,max:200,default:80}]},Ne=e({default:()=>Pe}),Pe={id:`cactus_needles_artisan`,name:`Cactus Spine`,category:`Natural`,added:`2026-04-16`,description:`Geometric star-cluster spines found on high-fidelity xerophytic vegetation.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 gv = fract(uv) - 0.5;
      float angle = atan(gv.y, gv.x);
      float star = step(0.9, sin(angle * 8.0));
      float d = length(gv);
      float mask = star * step(d, 0.4) * step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Spine Clusters`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Sharp Needle`,type:`color`,default:[.9,.9,.8,1]},{id:`u_secondary_color`,name:`Cactus Base`,type:`color`,default:[.2,.4,.1,1]}]},Fe=e({default:()=>Ie}),Ie={id:`candy_paint`,name:`Candy Paint`,category:`Racing`,added:`2026-04-30`,description:`Deep glossy candy-coat automotive paint with a saturated translucent hue over a dark metallic base.`,shader:`

    // Convert hue [0-1] to RGB
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Dark metallic flake base — micro noise sparkle
      float flake = noise(uv * 400.0);
      float flake2 = noise(uv * 600.0 + 1.3);
      float baseMetallic = 0.06 + 0.09 * flake * flake2;

      vec3 baseColor = vec3(baseMetallic);

      // Candy coat colour — saturated HSL from u_hue
      vec3 candyRGB = hue2rgb(u_hue);
      // Saturate: push to vivid by mixing toward pure hue
      vec3 candy = mix(vec3(0.0), candyRGB, u_depth * 0.6);

      // Simulate viewing-angle gloss gradient — centre vs edges of UV
      float cx = v_uv.x - 0.5;
      float cy = v_uv.y - 0.5;
      float radial = 1.0 - clamp(sqrt(cx * cx + cy * cy) * 1.8, 0.0, 1.0);
      float gloss = pow(radial, 1.5) * 0.55 + 0.2;

      // Slow-moving sheen ripple to simulate environment reflection
      float sheen = noise(uv * 3.0 + 1.5708);
      sheen = smoothstep(0.35, 0.75, sheen) * 0.18;

      // Layer: base + candy over-coat + gloss highlight
      vec3 col = baseColor + candy * u_depth * gloss;
      col += vec3(sheen) * candyRGB * 0.5 + vec3(sheen * 0.3);

      // White specular peak at centre
      float specPeak = pow(gloss, 6.0) * 0.5;
      col += vec3(specPeak);

      col = clamp(col, 0.0, 1.0);
      if (u_is_spec > 0.5) {
        // Candy coat: non-metallic clear coat, metallic only rises where flake sparkles
        float sparkle = flake * flake2;
        float metallic = mix(0.05, 0.3, sparkle);
        float roughness = clamp(0.15 - gloss * 0.1, 0.05, 0.15);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_hue`,name:`Hue`,type:`float`,min:0,max:1,default:.02},{id:`u_depth`,name:`Depth`,type:`float`,min:.5,max:3,default:1.5}]},Le=e({default:()=>Re}),Re={id:`canvas_rip_artisan`,name:`Canvas Rip`,category:`Abstract`,added:`2026-04-15`,description:`Rough, crossing threads with a torn opening mimicking shredded heavy canvas.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = step(0.8, hash(floor(uv.xx * 2.0))) * step(0.8, hash(floor(uv.yy * 2.0)));
      float rip = step(0.5 + hash(v_uv * 5.0) * 0.2, v_uv.x);
      return mix(u_secondary_color, u_primary_color, lines * rip);
    }
  `,uniforms:[{id:`u_scale`,name:`Thread Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Thread`,type:`color`,default:[.9,.85,.8,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.1,.1,.1,0]}]},ze=e({default:()=>Be}),Be={id:`carpet_velour_artisan`,name:`Velour Carpet`,category:`Racing`,added:`2026-04-16`,description:`Soft, deep pile industrial carpet found in premium grand touring interiors.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale) + hash(v_uv * u_scale * 0.5) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Pile Density`,type:`float`,min:50,max:500,default:200},{id:`u_primary_color`,name:`絨毯 (Carpet Top)`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Pile Base`,type:`color`,default:[.05,.05,.08,1]}]},Ve=e({default:()=>He}),He={id:`cassette_reels`,name:`Cassette Reels`,category:`Retro`,added:`2026-06-11`,description:`Mixtape faces tiled edge to edge — smoked windows, toothed white hubs winding chocolate-brown tape, cream labels with hand-ruled lines and a hot accent stripe.`,shader:`
    // rounded-rectangle signed distance
    float rrect_cr(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_tiles;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      float seed = hash(cell);

      // --- shell: injection-moulded plastic with mould-flow noise ---
      vec3 shell = u_shell_color.rgb;
      shell *= 0.92 + noise(uv * 90.0) * 0.16;
      // bevelled tile edge: highlight top, shadow bottom
      shell *= 1.0 + (smoothstep(0.94, 1.0, f.y) - smoothstep(0.06, 0.0, f.y)) * 0.18;
      vec3 col = shell;

      vec3 keyline = vec3(0.05, 0.05, 0.06);

      // --- label card ---
      float labd = rrect_cr(f - vec2(0.5, 0.62), vec2(0.42, 0.31), 0.03);
      float label = 1.0 - smoothstep(0.0, 0.012, labd);
      vec3 labelc = u_label_color.rgb * (0.96 + noise(uv * 240.0) * 0.07);
      // accent stripe band across the top of the label
      float stripe = step(0.855, f.y) * step(f.y, 0.915);
      labelc = mix(labelc, u_accent_color.rgb, stripe);
      float stripe2 = step(0.825, f.y) * step(f.y, 0.85);
      labelc = mix(labelc, u_accent_color.rgb * 0.55, stripe2);
      // ruled writing lines on the lower label (faded ballpoint)
      float rule = step(0.965, fract(f.y * 28.0)) * step(f.y, 0.42) * step(0.34, f.y);
      labelc = mix(labelc, vec3(0.45, 0.48, 0.62), rule * 0.7);
      col = mix(col, labelc, label);

      // --- smoked tape window ---
      float wind = rrect_cr(f - vec2(0.5, 0.575), vec2(0.29, 0.135), 0.10);
      float inwin = 1.0 - smoothstep(0.0, 0.008, wind);
      vec3 winc = vec3(0.10, 0.09, 0.10) * (0.9 + noise(uv * 60.0) * 0.2);
      // glass glare diagonal
      winc += vec3(0.10) * smoothstep(0.08, 0.0, abs(f.x + f.y * 0.5 - 0.95));
      col = mix(col, winc, inwin);
      col = mix(col, keyline, 1.0 - smoothstep(0.004, 0.014, abs(wind)));

      // --- tape packs + hubs (two reels, supply wound fat, take-up thin) ---
      float wound = 0.075 + seed * 0.065;
      for (int i = 0; i < 2; i++) {
        float fi = float(i);
        vec2 c = vec2(mix(0.345, 0.655, fi), 0.575);
        float r = length(f - c);
        float tr = mix(wound, 0.215 - wound, fi);   // complementary tape radii
        // tape pack: dark brown with winding sheen rings
        float pack = (1.0 - smoothstep(tr, tr + 0.008, r)) * inwin;
        vec3 tape = vec3(0.16, 0.10, 0.07);
        tape += vec3(0.10, 0.06, 0.03) * (0.5 + 0.5 * sin(r * 480.0));
        col = mix(col, tape, pack);
        // white hub with six toothed notches
        float an = atan(f.y - c.y, f.x - c.x);
        float tooth = step(0.62, fract(an * 0.9549297));   // 6 teeth around
        float hubr = 0.052 - tooth * 0.016;
        float hub = 1.0 - smoothstep(hubr, hubr + 0.006, r);
        vec3 hubc = vec3(0.94, 0.94, 0.92) * (0.85 + 0.15 * cos(an * 2.0));
        col = mix(col, hubc, hub);
        col = mix(col, keyline, 1.0 - smoothstep(0.010, 0.018, r)); // spindle hole
      }

      // --- capstan / pinch-roller holes along the bottom skirt ---
      for (int k = 0; k < 4; k++) {
        vec2 hc = vec2(0.26 + float(k) * 0.16, 0.115);
        float hd = length(f - hc) - 0.022;
        col = mix(col, keyline, 1.0 - smoothstep(0.0, 0.010, hd));
      }

      // --- corner screws (mirrored to all four corners) ---
      vec2 sp = abs(f - 0.5);
      float sd = length(sp - vec2(0.44, 0.42));
      float screw = 1.0 - smoothstep(0.016, 0.026, sd);
      col = mix(col, vec3(0.55, 0.55, 0.58), screw);
      // phillips cross slot
      vec2 sc = sp - vec2(0.44, 0.42);
      float cross = min(abs(sc.x), abs(sc.y));
      col = mix(col, keyline * 1.6, screw * (1.0 - smoothstep(0.003, 0.007, cross)));

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_tiles`,name:`Cassettes Across`,type:`float`,min:1,max:6,default:2},{id:`u_shell_color`,name:`Shell Plastic`,type:`color`,default:[.16,.16,.18,1]},{id:`u_label_color`,name:`Label Card`,type:`color`,default:[.92,.88,.78,1]},{id:`u_accent_color`,name:`Label Stripe`,type:`color`,default:[.9,.35,.1,1]}]},Ue=e({default:()=>We}),We={id:`cast_iron`,name:`Cast Iron`,category:`Industrial`,added:`2026-05-01`,description:`Raw cast iron with a coarse sand-mold grain, dark matte grey surface, and occasional small porosity dimples from casting.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.0; a *= 0.5;
      }
      return v;
    }

    // Porosity dimple field — Worley-based sparse pits
    float porosity(vec2 uv, float scale) {
      vec2 scaled = uv * scale * 0.4;
      vec2 cell = floor(scaled);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          // Sparse: only create a pit where hash is above threshold
          float exists = step(0.78, hash(nc + vec2(3.7, 8.2)));
          vec2 jitter = vec2(hash(nc + vec2(1.1, 6.3)), hash(nc + vec2(9.4, 2.1)));
          vec2 pt = nc + 0.5 + (jitter - 0.5) * 0.7;
          float d = length(scaled - pt);
          // Only count this cell's pit if it exists
          d = mix(1.0, d, exists);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Coarse sand-mold grain — multi-scale fbm
      float coarseGrain = fbm(uv * u_grain * 1.2);
      float fineGrain   = fbm(uv * u_grain * 4.5 + vec2(5.7, 2.3));
      float grain = coarseGrain * 0.65 + fineGrain * 0.35;

      // Surface roughness modulates lightness — cast iron is dark
      float roughMod = mix(1.0 - u_roughness * 0.25, 1.0 + u_roughness * 0.12, grain);
      vec3 col = u_base_color.rgb * roughMod;

      // Occasional graphite flakes — slight lighter flecks (cast iron microstructure)
      float flake = step(0.82, noise(uv * u_grain * 8.0)) * 0.06;
      col += vec3(flake);

      // Porosity dimples — small dark circular depressions
      float pit = porosity(uv, u_grain);
      float pitMask = smoothstep(0.12, 0.04, pit);
      // Inside a pit it's darker and slightly concave (shadow at bottom)
      col = mix(col, u_base_color.rgb * 0.45, pitMask * u_roughness * 0.8);

      // Very slight surface oxidation — faint reddish-grey on high points
      float oxideTint = max(0.0, grain - 0.55) * 0.08;
      col += vec3(oxideTint * 0.4, oxideTint * 0.2, oxideTint * 0.1);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain`,type:`float`,min:5,max:50,default:22},{id:`u_base_color`,name:`Iron Color`,type:`color`,default:[.28,.27,.26,1]},{id:`u_roughness`,name:`Roughness`,type:`float`,min:.3,max:2,default:1}]},Ge=e({default:()=>Ke}),Ke={id:`caustic_light_net`,name:`Caustic Light Net`,category:`Ocean`,added:`2026-06-11`,description:`Dancing webs of refracted sunlight crisscrossing a shallow pool floor, with bright knots where the filaments converge.`,shader:`
    // Ridged-noise filament: bright where noise crosses zero
    float ridge_cln(vec2 p) {
      return 1.0 - abs(snoise(p));
    }

    // Two ridged fields multiplied — bright only where both filaments cross
    float net_cln(vec2 p) {
      float a = ridge_cln(p);
      float b = ridge_cln(p * 1.27 + vec2(7.7, 3.1));
      return pow(max(a * b, 0.0), 4.0);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // domain warp so the net wobbles like real refraction
      vec2 warp = vec2(snoise(uv * 0.9 + vec2(31.4, 7.2)),
                       snoise(uv * 0.9 + vec2(4.8, 19.6))) * 0.35;
      vec2 p = uv + warp;

      // --- pool floor base ---
      vec3 floor_col = u_floor_color.rgb;
      float grain = noise(v_uv * 180.0) * 0.10 - 0.05;     // sand / plaster grain
      float patch = fbm(v_uv * 4.0) * 0.5 + 0.5;            // broad floor tone shifts
      vec3 col = floor_col * (0.80 + 0.25 * patch) + grain;

      // depth tint — slightly bluer where the floor reads deeper
      col = mix(col, col * vec3(0.75, 0.9, 1.05), (1.0 - patch) * 0.5);

      // --- caustic net, two octaves ---
      float c1 = net_cln(p);                  // primary web
      float c2 = net_cln(p * 2.3 + 11.0);     // finer secondary web
      float caustic = c1 + c2 * 0.45;

      // chromatic fringing: red and blue webs sampled slightly apart
      float cr = net_cln(p + vec2(0.012, 0.0));
      float cb = net_cln(p - vec2(0.012, 0.0));

      vec3 light = u_light_color.rgb;
      col += light * caustic * u_intensity;
      col += vec3(0.35, 0.05, 0.0) * cr * u_intensity * 0.25;
      col += vec3(0.0, 0.08, 0.35) * cb * u_intensity * 0.25;

      // hot knots where filaments converge bloom toward white
      col += vec3(1.0) * smoothstep(0.55, 1.1, caustic) * u_intensity * 0.5;

      // soft ambient shimmer between the webs
      float shimmer = ridge_cln(p * 0.7 + 40.0);
      col += light * shimmer * shimmer * 0.06;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Net Scale`,type:`float`,min:2,max:16,default:6},{id:`u_intensity`,name:`Sun Intensity`,type:`float`,min:.2,max:2,default:1},{id:`u_light_color`,name:`Sunlight Color`,type:`color`,default:[.85,.95,1,1]},{id:`u_floor_color`,name:`Floor Color`,type:`color`,default:[.1,.42,.55,1]}]},qe=e({default:()=>Je}),Je={id:`cephalopod_chromatophores_artisan`,name:`Cephalopod Chromatophores`,category:`Organic`,added:`2026-05-13`,description:`Dynamic, cellular color-changing spots that vary in size and density over a fleshy base layer.`,shader:`
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 id = floor(uv);
        vec2 gv = fract(uv);
        
        float minDist = 1.0;
        vec2 closestPoint;
        
        for(int y=-1; y<=1; y++) {
            for(int x=-1; x<=1; x++) {
                vec2 offset = vec2(x, y);
                vec2 pt = random2(id + offset);
                
                // Animate points expanding/contracting
                float radius = 0.1 + 0.3 * (0.5 + 0.5 * sin(u_pulse + pt.x * 6.28));
                
                float dist = length(gv - (offset + pt));
                
                if(dist < radius) {
                    minDist = min(minDist, dist/radius);
                }
            }
        }
        
        float spotMask = smoothstep(1.0, 0.8, minDist);
        // Flesh variation
        float fleshNoise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.1;
        vec4 fleshColor = u_base_color + vec4(fleshNoise, fleshNoise, fleshNoise, 0.0);
        
        return mix(fleshColor, u_spot_color, spotMask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Scale`,type:`float`,min:2,max:30,default:12},{id:`u_base_color`,name:`Fleshy Base`,type:`color`,default:[.7,.3,.3,1]},{id:`u_spot_color`,name:`Chromatophore`,type:`color`,default:[.1,.1,.1,1]},{id:`u_pulse`,name:`Pulse Phase`,type:`float`,min:0,max:100,default:0}]},Ye=e({default:()=>Xe}),Xe={id:`chain_mail_artisan`,name:`Chain Mail`,category:`Industrial`,added:`2026-04-15`,description:`Interlocking metal ring structures used in protective armor and fencing.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(length(gv) - 0.35);
      float mask = smoothstep(0.05, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Ring Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Wire Metal`,type:`color`,default:[.7,.7,.72,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.02,.02,.02,1]}]},Ze=e({default:()=>Qe}),Qe={id:`chalkboard_dust_artisan`,name:`Chalk Dust`,category:`Abstract`,added:`2026-04-16`,description:`Smudged powdery residue and chalk markings found on weathered racing boards.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n * 0.5);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Chalk Mark`,type:`color`,default:[.9,.9,.9,1]},{id:`u_secondary_color`,name:`Slate Base`,type:`color`,default:[.1,.1,.12,1]}]},$e=e({default:()=>et}),et={id:`charcoal_sketch_artisan`,name:`Charcoal Sketch`,category:`Abstract`,added:`2026-04-15`,description:`Cross-hatched noise lines mimicking hand-drawn charcoal or graphite sketches.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.9, hash(uv));
      mask += step(0.95, hash(uv.yx + 10.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:50,max:200,default:100},{id:`u_primary_color`,name:`Pencil Lead`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[.95,.95,.92,1]}]},tt=e({default:()=>nt}),nt={id:`chitinous_exoskeleton_artisan`,name:`Chitinous Exoskeleton`,category:`Organic`,added:`2026-05-13`,description:`Iridescent, segmented insectoid armor plating with deep, structural color shifting.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Segments
        float segmentBase = fract(uv.y + noise(uv * 0.5) * 0.5);
        float segmentEdge = smoothstep(0.9, 1.0, segmentBase);
        float segmentDepth = smoothstep(0.0, 0.2, segmentBase);
        
        // Micro-structure (iridescence driver)
        float micro = noise(uv * 10.0);
        
        // Iridescence color shift based on angle (simulated by v_uv.y and micro noise)
        float iridescenceMix = fract(v_uv.y * 2.0 + micro * 0.2 + segmentBase * 0.5);
        
        vec4 color1 = u_color_a;
        vec4 color2 = u_color_b;
        vec4 color3 = u_color_c;
        
        vec4 iridColor;
        if(iridescenceMix < 0.5) {
            iridColor = mix(color1, color2, iridescenceMix * 2.0);
        } else {
            iridColor = mix(color2, color3, (iridescenceMix - 0.5) * 2.0);
        }
        
        // Add specular highlight on segments
        float spec = smoothstep(0.4, 0.5, segmentBase) - smoothstep(0.5, 0.6, segmentBase);
        iridColor += vec4(spec * 0.3 * micro);
        
        // Apply segment depth/edges
        iridColor = mix(iridColor, vec4(0.05, 0.05, 0.05, 1.0), segmentEdge);
        iridColor *= (0.5 + 0.5 * segmentDepth);
        
        return iridColor;
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Scale`,type:`float`,min:2,max:20,default:6},{id:`u_color_a`,name:`Iridescence Base`,type:`color`,default:[.1,.2,.5,1]},{id:`u_color_b`,name:`Iridescence Mid`,type:`color`,default:[.5,.1,.6,1]},{id:`u_color_c`,name:`Iridescence High`,type:`color`,default:[.1,.8,.4,1]}]},rt=e({default:()=>it}),it={id:`choc_chip_camo`,name:`Chocolate Chip Camo`,category:`Organic`,added:`2026-05-12`,description:`Broad waves of base color overlaid with small, high-contrast pebbles to mimic a rocky desert floor.`,shader:`
    
    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    
    // Returns distance and vector to closest point
    vec3 cellular(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float min_dist = 1.0;
      vec2 closest_diff;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i + neighbor);
          vec2 diff = neighbor + point - f;
          float dist = length(diff);
          if(dist < min_dist) {
            min_dist = dist;
            closest_diff = diff;
          }
        }
      }
      return vec3(min_dist, closest_diff);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Background waves
      float n1 = snoise(uv * 0.5);
      float n2 = snoise(uv * 0.8 + vec2(4.2));
      
      vec4 color = u_color_base;
      if (n1 > 0.2) color = u_color_1;
      if (n2 > 0.4) color = u_color_2;
      
      // Chocolate Chips (Pebbles with shadows)
      vec3 cell = cellular(uv * 3.0);
      float dist = cell.x;
      vec2 diff = cell.yz;
      
      // Shadow offset
      float shadow = length(diff - vec2(0.08, -0.08));
      
      if (dist < 0.12) {
        color = u_color_chip; // The white/light pebble
      } else if (shadow < 0.15) {
        color = u_color_shadow; // The black shadow
      }
      
      return color;
    }
  `,variants:[{name:`Desert Storm`,uniforms:{u_color_base:[.75,.65,.5,1],u_color_1:[.6,.5,.35,1],u_color_2:[.45,.35,.25,1],u_color_chip:[.9,.85,.75,1],u_color_shadow:[.1,.08,.05,1]}},{name:`Mars Surface`,uniforms:{u_color_base:[.65,.3,.15,1],u_color_1:[.5,.2,.1,1],u_color_2:[.8,.45,.25,1],u_color_chip:[.95,.65,.4,1],u_color_shadow:[.15,.05,.02,1]}},{name:`Urban Rubble`,uniforms:{u_color_base:[.55,.55,.6,1],u_color_1:[.4,.4,.45,1],u_color_2:[.3,.3,.35,1],u_color_chip:[.85,.85,.9,1],u_color_shadow:[.1,.1,.15,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.14,1],u_color_1:[.08,.08,.1,1],u_color_2:[.05,.05,.06,1],u_color_chip:[.2,.2,.22,1],u_color_shadow:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base Sand`,type:`color`,default:[.75,.65,.5,1]},{id:`u_color_1`,name:`Wave 1`,type:`color`,default:[.6,.5,.35,1]},{id:`u_color_2`,name:`Wave 2`,type:`color`,default:[.45,.35,.25,1]},{id:`u_color_chip`,name:`Pebble Color`,type:`color`,default:[.9,.85,.75,1]},{id:`u_color_shadow`,name:`Shadow Color`,type:`color`,default:[.1,.08,.05,1]}]},at=e({default:()=>ot}),ot={id:`chopped_carbon_artisan`,name:`Chopped Carbon`,category:`Industrial`,added:`2026-04-15`,description:`Randomly oriented forged carbon fragments mimicking premium high-performance composites.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fragment Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Resin Deep`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Fiber Flake`,type:`color`,default:[.2,.2,.25,1]}]},st=e({default:()=>ct}),ct={id:`chrome_mirror`,name:`Chrome Mirror`,category:`Industrial`,added:`2026-04-30`,description:`Mirror-polished chrome finish with gradient reflection bands simulating sky, horizon, and ground environment.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv;

      // Micro surface imperfection — tiny waviness distorting the reflection
      float micro = noise(uv * 180.0) * 0.004;
      float distY = uv.y + micro;

      // Reflection bands: map distorted Y through band_count sinusoidal zones
      // Simulates: sky (bright blue-white top), dark horizon, bright floor, dark undercarriage
      float bandPos = distY * u_band_count;
      float band = sin(bandPos * 3.14159);

      // Colour palette of reflected environment
      // bright sky white-blue, mid dark, lower warm floor highlight
      float t = fract(bandPos / 2.0);
      vec3 skyCol   = vec3(0.85, 0.92, 1.00);   // sky
      vec3 horizCol = vec3(0.05, 0.05, 0.06);   // dark horizon
      vec3 floorCol = vec3(0.75, 0.72, 0.65);   // warm ground
      vec3 envColor;
      if (t < 0.5) {
        envColor = mix(skyCol, horizCol, t * 2.0);
      } else {
        envColor = mix(horizCol, floorCol, (t - 0.5) * 2.0);
      }

      // Apply contrast
      float lum = dot(envColor, vec3(0.299, 0.587, 0.114));
      envColor = mix(vec3(lum), envColor, 1.0) * pow(lum + 0.001, 1.0 - u_contrast * 0.3);
      envColor = mix(vec3(0.5), envColor, u_contrast);

      // Chrome tint — very slightly blue-silver
      vec3 chromeTint = vec3(0.96, 0.97, 1.0);
      vec3 col = envColor * chromeTint;

      // Sharp specular hotspot at UV centre
      float dx = uv.x - 0.5; float dy = uv.y - 0.5;
      float spec = exp(-(dx * dx + dy * dy) * 40.0) * 0.6;
      col += vec3(spec);

      // Horizontal edge darkening (shadow of object edge)
      float edgeDark = smoothstep(0.0, 0.08, uv.x) * smoothstep(1.0, 0.92, uv.x);
      col *= mix(0.55, 1.0, edgeDark);

      col = clamp(col, 0.0, 1.0);
      if (u_is_spec > 0.5) {
        // Polished chrome: fully metallic, near-mirror roughness with micro waviness
        return vec4(1.0, clamp(0.03 + micro * 2.0, 0.02, 0.05), 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_contrast`,name:`Reflection Contrast`,type:`float`,min:.5,max:3,default:2},{id:`u_band_count`,name:`Band Count`,type:`float`,min:2,max:12,default:6}]},lt=e({default:()=>ut}),ut={id:`circuit_traces_pro`,name:`Circuit Traces`,category:`Technology`,added:`2026-04-15`,description:`Pro-grade PCB layout with branching traces and circular nodes.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float n = hash(id);
      float mask = 0.0;
      
      // Horizontal traces
      if (n > 0.5) mask += step(0.45, gv.y) * step(gv.y, 0.55);
      // Vertical traces
      if (hash(id + 1.0) > 0.5) mask += step(0.45, gv.x) * step(gv.x, 0.55);
      
      // Nodes
      float d = length(gv - 0.5);
      if (n > 0.8) mask += smoothstep(0.2, 0.15, d);
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Logic Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Trace Color`,type:`color`,default:[0,.8,.4,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[.02,.05,.02,1]}]},dt=e({default:()=>ft}),ft={id:`comet_tail`,name:`Comet Tail`,category:`Cosmos`,added:`2026-06-11`,description:`A dazzling comet nucleus dragging twin tails — a straight blue ion stream and a curved cream dust fan — through a quiet starfield.`,shader:`
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
  `,uniforms:[{id:`u_tail_length`,name:`Tail Length`,type:`float`,min:.3,max:2.5,default:1},{id:`u_tail_spread`,name:`Tail Spread`,type:`float`,min:.3,max:2.5,default:1},{id:`u_ion_color`,name:`Ion Tail`,type:`color`,default:[.3,.6,1,1]}]},pt=e({default:()=>mt}),mt={id:`constellation_chart`,name:`Constellation Chart`,category:`Cosmos`,added:`2026-06-11`,description:`A celestial atlas plate — named stars joined by fine asterism lines over an inked coordinate grid and faint ecliptic arc.`,shader:`
    // Distance from point p to segment a-b
    float segDist_cch(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / max(dot(ba, ba), 0.0001), 0.0, 1.0);
      return length(pa - ba * h);
    }

    // Star position inside a wrapped grid cell
    vec2 starPos_cch(vec2 cell, float density) {
      vec2 c = mod(cell, density);
      return (cell + vec2(0.15, 0.15) + 0.7 * vec2(hash(c + 3.1), hash(c + 11.7))) / density;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);
      float density = u_density;

      // --- Parchment-dark chart background with subtle mottling ---
      vec3 ink = u_chart_color.rgb;
      float mottle = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 col = ink * (0.85 + 0.20 * mottle);

      // --- Coordinate grid: fine RA/Dec lines, heavier every 4th ---
      vec2 gridUv = fract(uv * density);
      float thin = 0.012 * density / 6.0;
      float gline = smoothstep(thin, 0.0, min(gridUv.x, 1.0 - gridUv.x))
                  + smoothstep(thin, 0.0, min(gridUv.y, 1.0 - gridUv.y));
      vec2 major = fract(uv * density * 0.25);
      float mline = smoothstep(thin * 1.6, 0.0, min(major.x, 1.0 - major.x))
                  + smoothstep(thin * 1.6, 0.0, min(major.y, 1.0 - major.y));
      vec3 gridCol = ink + vec3(0.10, 0.12, 0.16);
      col = mix(col, gridCol, clamp(gline, 0.0, 1.0) * 0.45);
      col = mix(col, gridCol + 0.06, clamp(mline, 0.0, 1.0) * 0.6);

      // --- Ecliptic: a sweeping dashed arc across the chart ---
      float arcY = 0.5 + 0.22 * sin(uv.x * 6.2831853);
      float arcD = abs(uv.y - arcY);
      float dash = step(0.5, fract(uv.x * 24.0));
      col = mix(col, vec3(0.55, 0.42, 0.25), smoothstep(0.004, 0.0015, arcD) * dash * 0.8);

      // --- Stars + asterism lines on the wrapped grid ---
      vec2 cell = floor(uv * density);
      float lineGlow = 0.0;
      float starGlow = 0.0;
      float haloGlow = 0.0;

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 c = cell + vec2(float(x), float(y));
          vec2 cw = mod(c, density);
          vec2 sp = starPos_cch(c, density);
          float mag = hash(cw + 41.0); // star magnitude

          // Star point with magnitude-scaled core
          float d = length(uv - sp);
          float size = 0.004 + 0.010 * pow(mag, 2.0);
          starGlow = max(starGlow, exp(-pow(d / size, 2.0)) * (0.5 + 0.7 * mag));
          // Bright stars get a printed halo circle
          float haloR = size * 3.2;
          haloGlow = max(haloGlow,
            smoothstep(0.0025, 0.0008, abs(d - haloR)) * step(0.72, mag));

          // Asterism: connect to right and lower neighbours selectively
          vec2 spR = starPos_cch(c + vec2(1.0, 0.0), density);
          vec2 spD = starPos_cch(c + vec2(0.0, 1.0), density);
          float linkR = step(hash(cw + 57.0), u_connect);
          float linkD = step(hash(cw + 91.0), u_connect * 0.8);
          float lw = 0.0016;
          lineGlow = max(lineGlow, smoothstep(lw, lw * 0.3, segDist_cch(uv, sp, spR)) * linkR);
          lineGlow = max(lineGlow, smoothstep(lw, lw * 0.3, segDist_cch(uv, sp, spD)) * linkD);
        }
      }

      vec3 lineCol = vec3(0.45, 0.60, 0.78);
      col = mix(col, lineCol, lineGlow * 0.85);
      col = mix(col, lineCol * 1.1, haloGlow * 0.7);
      col += u_star_color.rgb * starGlow;

      // Faintest background dusting of unnamed stars
      vec2 fg = floor(uv * 140.0);
      float faint = smoothstep(0.96, 1.0, hash(fg + 8.8));
      col += u_star_color.rgb * faint *
             smoothstep(0.08, 0.0, length(fract(uv * 140.0) - 0.5)) * 0.35;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_density`,name:`Star Density`,type:`float`,min:3,max:12,default:6},{id:`u_connect`,name:`Line Frequency`,type:`float`,min:0,max:1,default:.45},{id:`u_chart_color`,name:`Chart Ink`,type:`color`,default:[.04,.06,.11,1]},{id:`u_star_color`,name:`Star Colour`,type:`color`,default:[.95,.92,.8,1]}]},ht=e({default:()=>gt}),gt={id:`coral_reef_artisan`,name:`Coral Branch`,category:`Natural`,added:`2026-04-16`,description:`Branching organic calcium structures mimicking underwater coral reef formations.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float d = 1.0;
      for (int i=0; i<4; i++) {
        float n = hash(floor(uv));
        d = min(d, length(fract(uv) - 0.5));
        uv *= 1.2;
        uv += n;
      }
      return mix(u_secondary_color, u_primary_color, smoothstep(0.2, 0.1, d));
    }
  `,uniforms:[{id:`u_scale`,name:`Reef Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Polyps`,type:`color`,default:[1,.5,.4,1]},{id:`u_secondary_color`,name:`Ocean Depth`,type:`color`,default:[0,.2,.4,1]}]},_t=e({default:()=>vt}),vt={id:`corduroy_rib_artisan`,name:`Corduroy Rib`,category:`Abstract`,added:`2026-04-15`,description:`Parallel fuzzy ridges of heavy fabric used in durable workwear.`,shader:`
    vec4 generate() {
      float rib = sin(v_uv.x * 100.0 * u_scale);
      float mask = smoothstep(-0.5, 0.5, rib);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rib Frequency`,type:`float`,min:.1,max:2,default:.8},{id:`u_primary_color`,name:`Rib Ridge`,type:`color`,default:[.4,.3,.2,1]},{id:`u_secondary_color`,name:`Rib Valley`,type:`color`,default:[.15,.1,.05,1]}]},yt=e({default:()=>bt}),bt={id:`corroded_aluminum`,name:`Corroded Aluminum`,category:`Industrial`,added:`2026-05-01`,description:`Pitted and oxidized aluminum with dull grey-white aluminum oxide patches over a matte base, with small darker corrosion pits.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    // Worley-style pit distance — returns distance to nearest pit centre
    float pitDist(vec2 uv, float scale) {
      vec2 cell = floor(uv * scale);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 jitter = vec2(hash(nc + vec2(7.3, 2.9)), hash(nc + vec2(1.7, 9.1)));
          vec2 pt = (nc + 0.3 + 0.4 * jitter) / scale;
          float d = length(uv - pt);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Large oxide patches — slow blob noise
      float oxidePatch = fbm(uv * u_scale * 0.5);
      oxidePatch = smoothstep(1.0 - u_corrosion, 1.0, oxidePatch);

      // Aluminum oxide is chalky white-grey
      vec3 oxideColor = vec3(0.82, 0.82, 0.80);

      // Base aluminum — dull, slightly specular
      vec3 base = u_base_color.rgb;
      // Low-amplitude surface variation
      float surfVar = noise(uv * u_scale * 4.0) * 0.06 - 0.03;
      base += vec3(surfVar);

      // Blend oxide patches over base
      vec3 col = mix(base, oxideColor, oxidePatch * 0.85);

      // Corrosion pits — small dark spots (Worley)
      float pit = pitDist(uv, u_scale * 1.5);
      float pitMask = smoothstep(0.04, 0.015, pit);
      // Pits are dark grey, slightly blue-grey (pit shadow)
      vec3 pitColor = vec3(0.22, 0.22, 0.20);
      col = mix(col, pitColor, pitMask * u_corrosion);

      // Fine surface grit noise — matte, not shiny
      float grit = noise(uv * u_scale * 12.0) * 0.04 - 0.02;
      col += vec3(grit);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_corrosion`,name:`Corrosion Coverage`,type:`float`,min:0,max:1,default:.6},{id:`u_scale`,name:`Scale`,type:`float`,min:2,max:20,default:8},{id:`u_base_color`,name:`Aluminum Base`,type:`color`,default:[.65,.65,.63,1]}]},xt=e({default:()=>St}),St={id:`corrugated_steel_artisan`,name:`Corrugated Steel`,category:`Industrial`,added:`2026-04-15`,description:`Wavy metal sheet textures used in industrial construction and containers.`,shader:`
    vec4 generate() {
      float wave = sin(v_uv.x * 30.0 * (1.0 + u_scale));
      float mask = smoothstep(-0.8, 0.8, wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Frequency`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Highlight`,type:`color`,default:[.7,.75,.8,1]},{id:`u_secondary_color`,name:`Recess`,type:`color`,default:[.15,.15,.2,1]}]},Ct=e({default:()=>wt}),wt={id:`cosmic_microwave`,name:`Cosmic Microwave`,category:`Cosmos`,added:`2026-06-11`,description:`The baby picture of the universe — mottled CMB temperature anisotropies in the classic blue-to-red heat map, speckled with acoustic-peak hot spots.`,shader:`
    // Band-limited blobby field: sums of smooth noise at survey-map scales
    float anis_cmb(vec2 uv, float scale) {
      float v = 0.0;
      v += snoise(uv * scale * 1.0) * 0.50;
      v += snoise(uv * scale * 2.3 + 17.0) * 0.28;
      v += snoise(uv * scale * 5.1 + 43.0) * 0.16;
      v += snoise(uv * scale * 11.7 + 91.0) * 0.09;
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Temperature fluctuation field, -1..1 ---
      float t = anis_cmb(uv, u_blob_scale);

      // Acoustic-peak emphasis: push values toward saturated extremes
      t = sign(t) * pow(abs(t), 1.0 / max(u_contrast, 0.001));
      t = clamp(t * 0.5 + 0.5, 0.0, 1.0);

      // --- Classic Planck-map palette: deep blue → cyan → cream → orange → red ---
      vec3 cold2  = vec3(0.04, 0.09, 0.45);   // coldest
      vec3 cold1  = vec3(0.10, 0.45, 0.80);
      vec3 medium = vec3(0.92, 0.88, 0.74);   // mean temperature cream
      vec3 warm1  = vec3(0.95, 0.55, 0.15);
      vec3 warm2  = vec3(0.70, 0.08, 0.04);   // hottest

      vec3 col;
      if (t < 0.25)      col = mix(cold2, cold1,  t / 0.25);
      else if (t < 0.5)  col = mix(cold1, medium, (t - 0.25) / 0.25);
      else if (t < 0.75) col = mix(medium, warm1, (t - 0.5) / 0.25);
      else               col = mix(warm1, warm2,  (t - 0.75) / 0.25);

      // --- Fine survey grain: instrument-noise stipple over the map ---
      float stipple = hash(floor(uv * 480.0));
      col *= 0.95 + 0.08 * stipple;

      // --- Compact hot/cold point sources scattered across the sky ---
      vec2 g = floor(uv * 60.0);
      vec2 f = fract(uv * 60.0);
      vec2 sp = vec2(hash(g + 7.0), hash(g + 23.0));
      float src = smoothstep(0.975, 1.0, hash(g + 51.0)) *
                  exp(-pow(length(f - sp) / 0.10, 2.0));
      vec3 srcCol = hash(g + 77.0) > 0.5 ? warm2 : cold2;
      col = mix(col, srcCol, src * 0.85);

      // --- Subtle large-scale dipole: one half of the sky runs warm ---
      float dipole = sin((uv.x + uv.y * 0.4) * 3.14159265) * u_dipole;
      col = mix(col, warm1, max(dipole, 0.0) * 0.10);
      col = mix(col, cold1, max(-dipole, 0.0) * 0.10);

      // Whisper of galactic-plane contamination: a faint dusty streak
      float plane = exp(-pow((uv.y - 0.5 - sin(uv.x * 6.2831853) * 0.04) / 0.05, 2.0));
      float planeTex = fbm(uv * vec2(14.0, 5.0) + 31.0) * 0.5 + 0.5;
      col = mix(col, vec3(0.55, 0.40, 0.28), plane * planeTex * 0.18);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_blob_scale`,name:`Anisotropy Scale`,type:`float`,min:2,max:16,default:6},{id:`u_contrast`,name:`Peak Contrast`,type:`float`,min:.5,max:3,default:1.4},{id:`u_dipole`,name:`Dipole Tilt`,type:`float`,min:0,max:1,default:.4}]},Tt=e({default:()=>Et}),Et={id:`cow_print`,name:`Cow Print`,category:`Organic`,added:`2026-06-11`,description:`Classic Holstein cow hide: irregular organic black blotches scattered over white, with a second smaller blotch layer for natural variety.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Domain warp so blotch edges wander organically instead of
      // following the smooth noise contours too literally.
      vec2 warp = vec2(
        snoise(uv * 0.9 + vec2(31.4, 8.2)),
        snoise(uv * 0.9 + vec2(73.1, 52.6))
      ) * 0.35;
      vec2 wuv = uv + warp;

      float soft = max(u_soft, 0.002);

      // Coverage maps to an fbm threshold: higher coverage lowers the
      // cut so more of the field becomes blotch.
      float thr = mix(0.55, -0.55, u_coverage);

      // Primary large blotches — slightly hard smoothstep edge for the
      // printed-hide look.
      float b1 = fbm(wuv);
      float mask = smoothstep(thr - soft, thr + soft, b1);

      // Secondary smaller, sparser blotch layer for variety.
      float b2 = fbm(wuv * 2.3 + vec2(45.7, 19.3));
      float mask2 = smoothstep(thr + 0.28 - soft, thr + 0.28 + soft, b2);
      mask = max(mask, mask2);

      vec4 color = mix(u_color_base, u_color_blotch, mask);

      // Faint hide grain so flat areas are not sterile.
      color.rgb += snoise(uv * 55.0) * 0.012;

      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Holstein`,uniforms:{u_color_blotch:[.05,.05,.06,1],u_color_base:[.96,.95,.93,1]}},{name:`Brown Swiss`,uniforms:{u_color_blotch:[.33,.2,.11,1],u_color_base:[.92,.87,.78,1]}},{name:`Pink Moo`,uniforms:{u_color_blotch:[.95,.35,.62,1],u_color_base:[1,.94,.97,1]}},{name:`Inverse`,uniforms:{u_color_blotch:[.96,.95,.93,1],u_color_base:[.05,.05,.06,1]}}],uniforms:[{id:`u_scale`,name:`Blotch Scale`,type:`float`,min:1,max:12,default:3.5},{id:`u_coverage`,name:`Blotch Coverage`,type:`float`,min:0,max:1,default:.45},{id:`u_soft`,name:`Edge Softness`,type:`float`,min:.002,max:.4,default:.05},{id:`u_color_blotch`,name:`Blotch Color`,type:`color`,default:[.05,.05,.06,1]},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.96,.95,.93,1]}]},Dt=e({default:()=>Ot}),Ot={id:`cratered_moon`,name:`Cratered Moon`,category:`Cosmos`,added:`2026-06-11`,description:`A battered lunar regolith plain — overlapping impact craters with sunlit rims and inky floor shadows, dusted with fine grey soil.`,shader:`
    // Crater field at one scale: jittered grid of bowl-shaped depressions.
    // Returns height contribution (negative = bowl, positive = rim).
    float craters_clm(vec2 uv, float density, float seed) {
      float h = 0.0;
      vec2 g = floor(uv * density);
      vec2 f = fract(uv * density);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 cell = g + vec2(float(x), float(y));
          vec2 c = mod(cell, density); // wrap so the field tiles
          float exists = step(0.35, hash(c + seed));
          vec2 cp = vec2(hash(c + seed + 7.1), hash(c + seed + 19.3));
          float rad = 0.18 + 0.30 * hash(c + seed + 3.3);
          float d = length(f - vec2(float(x), float(y)) - cp) / rad;
          // Bowl with raised rim: -1 at centre, +rim bump near d=1
          float bowl = -(1.0 - smoothstep(0.0, 0.95, d));
          float rim = exp(-pow((d - 1.0) / 0.22, 2.0)) * 0.45;
          h += exists * (bowl + rim) * rad;
        }
      }
      return h;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Multi-scale crater height field ---
      float h = 0.0;
      h += craters_clm(uv, 4.0, 0.0) * 1.0;
      h += craters_clm(uv, 9.0, 41.0) * 0.55;
      h += craters_clm(uv, 21.0, 97.0) * 0.28;
      h *= u_crater_depth;

      // Rolling regolith undulation + fine soil grain
      h += fbm(uv * 6.0) * 0.10;
      float soil = noise(uv * 220.0) * 0.5 + noise(uv * 90.0 + 31.0) * 0.5;

      // --- Lighting: finite-difference normal, low raking sun ---
      float e = 0.004;
      float hx = craters_clm(uv + vec2(e, 0.0), 4.0, 0.0)
               + craters_clm(uv + vec2(e, 0.0), 9.0, 41.0) * 0.55
               + craters_clm(uv + vec2(e, 0.0), 21.0, 97.0) * 0.28;
      float hy = craters_clm(uv + vec2(0.0, e), 4.0, 0.0)
               + craters_clm(uv + vec2(0.0, e), 9.0, 41.0) * 0.55
               + craters_clm(uv + vec2(0.0, e), 21.0, 97.0) * 0.28;
      hx = (hx * u_crater_depth + fbm((uv + vec2(e, 0.0)) * 6.0) * 0.10 - h) / e;
      hy = (hy * u_crater_depth + fbm((uv + vec2(0.0, e)) * 6.0) * 0.10 - h) / e;

      vec2 sun = normalize(vec2(cos(u_sun_angle), sin(u_sun_angle)));
      float slope = -(hx * sun.x + hy * sun.y);
      float light = clamp(0.55 + slope * 0.85, 0.0, 1.4);

      // Crater floors fall into deep shadow
      float floorShade = smoothstep(-0.05, -0.30, h);
      light *= 1.0 - floorShade * 0.75;

      // --- Maria: large darker basalt patches ---
      float maria = smoothstep(0.55, 0.8, fbm(uv * 2.2 + 7.0) * 0.5 + 0.5);

      // --- Palette ---
      vec3 highland = u_surface_color.rgb;          // warm pale grey
      vec3 mariaCol = highland * vec3(0.52, 0.54, 0.60);
      vec3 col = mix(highland, mariaCol, maria * 0.8);

      // Soil grain and bright ray ejecta around fresh craters
      col *= 0.88 + 0.14 * soil;
      float rays = smoothstep(0.30, 0.55, h) * (0.5 + 0.5 * soil);
      col = mix(col, highland * 1.18, rays * 0.5);

      col *= light;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_crater_depth`,name:`Crater Depth`,type:`float`,min:.3,max:2,default:1},{id:`u_sun_angle`,name:`Sun Angle`,type:`float`,min:0,max:6.28,default:.8},{id:`u_surface_color`,name:`Regolith`,type:`color`,default:[.72,.71,.68,1]}]},kt=e({default:()=>At}),At={id:`crocodile_hide_artisan`,name:`Crocodile Hide`,category:`Natural`,added:`2026-04-15`,description:`Large rectangular blocky scales with organic gap jitter found in reptilian leather.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Zoom`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Leather Top`,type:`color`,default:[.15,.1,.05,1]},{id:`u_secondary_color`,name:`Scale Gap`,type:`color`,default:[.05,.03,.01,1]}]},jt=e({default:()=>Mt}),Mt={id:`crt_phosphor_mask_artisan`,name:`CRT Phosphor Mask`,category:`Technology`,added:`2026-05-13`,description:`Macro view of an old tube monitor featuring RGB sub-pixels and scanlines.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Phosphor grid (aperture grille style)
        vec2 subuv = fract(uv);
        
        // X defines the R, G, B stripes
        float xStep = subuv.x * 3.0;
        float r = smoothstep(0.1, 0.9, 1.0 - abs(xStep - 0.5));
        float g = smoothstep(0.1, 0.9, 1.0 - abs(xStep - 1.5));
        float b = smoothstep(0.1, 0.9, 1.0 - abs(xStep - 2.5));
        
        // Scanlines on Y axis
        float scanline = 0.5 + 0.5 * sin(v_uv.y * u_scale * 3.14159 * 2.0);
        scanline = mix(0.7, 1.0, scanline);
        
        // Simulated glowing content behind the mask (low freq noise)
        float contentNoise = fract(sin(dot(floor(uv*0.1), vec2(12.9898, 78.233))) * 43758.5453);
        float content = smoothstep(0.3, 0.7, contentNoise + sin(u_phase + v_uv.x * 5.0) * 0.5);
        
        vec3 phosphor = vec3(r, g, b) * scanline * u_brightness;
        
        // Mix active content glow
        vec4 screen = vec4(phosphor * content, 1.0);
        
        // Add ambient reflection
        return screen + u_ambient_glare * 0.1;
    }
  `,uniforms:[{id:`u_scale`,name:`Grille Scale`,type:`float`,min:10,max:200,default:80},{id:`u_brightness`,name:`Phosphor Brightness`,type:`float`,min:.5,max:3,default:1.5},{id:`u_ambient_glare`,name:`Screen Glass`,type:`color`,default:[.05,.05,.05,1]},{id:`u_phase`,name:`Signal Phase`,type:`float`,min:0,max:100,default:0}]},Nt=e({default:()=>Pt}),Pt={id:`cyber_grid_pro`,name:`Cyber Grid`,category:`Technology`,added:`2026-04-15`,description:`Pro-grade data-matrix style grid with secondary interference lines.`,shader:`
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale);
      float grid = step(0.95, max(g.x, g.y));
      
      // Static pulse based on position instead of time
      float pulse = sin(v_uv.y * 10.0) * 0.5 + 0.5;
      float mask = grid * pulse;
      
      vec2 g2 = fract(v_uv * u_scale * 4.0);
      mask += step(0.98, max(g2.x, g2.y)) * 0.3;
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Resolution`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Grid Glow`,type:`color`,default:[0,.6,1,1]},{id:`u_secondary_color`,name:`Base Void`,type:`color`,default:[.02,.02,.05,1]}]},Ft=e({default:()=>It}),It={id:`cyber_leather_artisan`,name:`Cyber Leather`,category:`Technology`,added:`2026-04-16`,description:`Synthetic high-performance leather with integrated glowing micro-circuitry pores.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 100.0;
      float mask = step(0.9, hash(floor(uv)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Circuit Glow`,type:`color`,default:[1,0,.5,1]},{id:`u_secondary_color`,name:`Synthetic Skin`,type:`color`,default:[.05,.05,.06,1]}]},Lt=e({default:()=>Rt}),Rt={id:`cyber_twill_artisan`,name:`Cyber Twill`,category:`Technology`,added:`2026-04-16`,description:`Advanced glowing-edge carbon fiber weave for high-performance cybernetic components.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Glow Edge`,type:`color`,default:[0,1,.8,1]},{id:`u_secondary_color`,name:`Carbon Body`,type:`color`,default:[.05,.05,.05,1]}]},zt=e({default:()=>Bt}),Bt={id:`cyber_wiring_artisan`,name:`Cyber Bundle`,category:`Technology`,added:`2026-04-16`,description:`Dense, tangled bundles of high-speed digital wiring and fiber-optic strands.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * u_scale + sin(v_uv.x * 5.0));
      float n = hash(vec2(y, y));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Wire Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Wire Signal`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Insulation`,type:`color`,default:[.1,.1,.1,1]}]},Vt=e({default:()=>Ht}),Ht={id:`damask_lace_artisan`,name:`Damask Lace`,category:`Abstract`,added:`2026-04-16`,description:`Complex organic floral symmetry and decorative lace patterns.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float d = 0.0;
      for (int i=0; i<4; i++) {
        uv = abs(uv - 0.5) * 1.5;
        d += sin(uv.x * 10.0) * cos(uv.y * 10.0);
      }
      float mask = step(0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Lace High`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Sheer Base`,type:`color`,default:[.1,.1,.1,1]}]},Ut=e({default:()=>Wt}),Wt={id:`damask_silk_artisan`,name:`Damask Silk`,category:`Abstract`,added:`2026-04-15`,description:`Floral symmetrical weave with high-end fabric sheen found in luxury upholstery.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = length(uv - sin(uv.x * 5.0) * 0.1);
      float mask = smoothstep(0.4, 0.35, fract(d * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Silk Pattern`,type:`color`,default:[.8,.5,.2,1]},{id:`u_secondary_color`,name:`Base Satin`,type:`color`,default:[.4,.2,.1,1]}]},Gt=e({default:()=>Kt}),Kt={id:`data_matrix_artisan`,name:`Data Matrix`,category:`Technology`,added:`2026-04-16`,description:`Stacked digital data blocks mimicking high-density computer storage and visualization.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.5, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Data Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Active Bit`,type:`color`,default:[0,1,.5,1]},{id:`u_secondary_color`,name:`Zero Bit`,type:`color`,default:[0,.1,.05,1]}]},qt=e({default:()=>Jt}),Jt={id:`dazzle_camo`,name:`Dazzle Camo`,category:`Geometric`,added:`2026-06-11`,description:`WWI battleship razzle-dazzle: bold irregular geometric zones, each filled with hard-edged two-tone stripes at its own clashing angle and frequency, plus occasional accent zones.`,shader:`

    vec4 generate() {
      vec2 baseUv = v_uv;

      // Warp the lookup so zone borders are irregular polygons, not neat cells
      vec2 uv = baseUv * u_zone_scale;
      uv += vec2(snoise(uv * 0.9 + 4.7), snoise(uv * 0.9 + 19.3)) * 0.22;

      // Nearest jittered cell point -> zone id (cheap voronoi)
      vec2 g = floor(uv);
      vec2 fpos = fract(uv);
      float bestD = 99.0;
      vec2 bestId = g;
      for (int yy = -1; yy <= 1; yy++) {
        for (int xx = -1; xx <= 1; xx++) {
          vec2 off = vec2(float(xx), float(yy));
          vec2 id = g + off;
          vec2 toPt = off + vec2(hash(id + 3.1), hash(id + 71.7)) - fpos;
          float d = dot(toPt, toPt);
          if (d < bestD) { bestD = d; bestId = id; }
        }
      }

      // Every zone gets its own stripe direction, frequency and phase
      float zoneAng = hash(bestId + 9.4) * 3.14159265;
      vec2 stripeDir = vec2(cos(zoneAng), sin(zoneAng));
      float freq = u_stripe_freq * (0.65 + hash(bestId + 27.2) * 0.8);
      float s = dot(baseUv, stripeDir) * freq + hash(bestId + 55.5) * 8.0;
      float stripe = step(0.5, fract(s));

      // ~15% of zones swap the dark tone for the accent colour
      float useAccent = step(0.85, hash(bestId + 41.3));
      vec4 ink = mix(u_color_b, u_color_accent, useAccent);

      vec4 color = mix(u_color_a, ink, stripe);
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Classic B&W`,uniforms:{u_color_a:[.95,.95,.94,1],u_color_b:[.06,.06,.07,1],u_color_accent:[.3,.32,.36,1]}},{name:`Navy`,uniforms:{u_color_a:[.78,.83,.88,1],u_color_b:[.07,.13,.26,1],u_color_accent:[.32,.45,.62,1]}},{name:`Magenta Pop`,uniforms:{u_color_a:[.97,.96,.97,1],u_color_b:[.1,.08,.12,1],u_color_accent:[.92,.1,.55,1]}},{name:`Ghost Grey`,uniforms:{u_color_a:[.82,.83,.85,1],u_color_b:[.55,.57,.61,1],u_color_accent:[.38,.4,.45,1]}}],uniforms:[{id:`u_zone_scale`,name:`Zone Scale`,type:`float`,min:1.5,max:10,default:4},{id:`u_stripe_freq`,name:`Stripe Frequency`,type:`float`,min:5,max:60,default:18},{id:`u_color_a`,name:`Stripe Light`,type:`color`,default:[.95,.95,.94,1]},{id:`u_color_b`,name:`Stripe Dark`,type:`color`,default:[.06,.06,.07,1]},{id:`u_color_accent`,name:`Accent`,type:`color`,default:[.3,.32,.36,1]}]},Yt=e({default:()=>Xt}),Xt={id:`deep_trench_strata`,name:`Deep Trench Strata`,category:`Ocean`,added:`2026-06-11`,description:`A trench wall in cross-section — banded sediment strata sheared by vertical faults, with pale ash layers and crumbling edges.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 base = u_sediment_color.rgb;

      // --- fault blocks: columns shifted vertically against each other ---
      float cols = 3.0;
      float cidx = floor(uv.x * cols);
      float cf = fract(uv.x * cols);
      // wrap column index so the fault offsets tile horizontally
      float cw = mod(cidx, cols);
      float drop = (hash(vec2(cw, 7.7)) - 0.5) * u_fault;

      // layer coordinate: warped, faulted vertical position
      float wob = fbm(vec2(uv.x * 3.0, uv.y * 0.5)) * u_warp;
      float yy = (uv.y + drop + wob) * u_layers;
      float li = floor(yy);
      float lf = fract(yy);

      // --- per-layer sediment palette ---
      float lh = hash(vec2(li, 3.1));
      vec3 clay   = base;                               // ochre clay
      vec3 silt_g = base * vec3(0.70, 0.75, 0.80);      // grey silt
      vec3 organ  = base * vec3(0.45, 0.40, 0.38);      // dark organic mud
      vec3 ash    = vec3(0.82, 0.80, 0.76);             // pale volcanic ash
      vec3 lay_col = mix(clay, silt_g, step(0.35, lh));
      lay_col = mix(lay_col, organ, step(0.68, lh));
      // occasional thin ash marker bed
      float is_ash = step(0.88, lh);
      lay_col = mix(lay_col, ash, is_ash);

      // layer thickness shading: compacted dark base, lighter top
      float grade = mix(0.78, 1.12, lf);
      vec3 col = lay_col * grade;

      // crisp bedding plane at each layer boundary
      float bed = smoothstep(0.06, 0.0, min(lf, 1.0 - lf));
      col = mix(col, lay_col * 0.45, bed * 0.7);

      // --- intra-layer lamination: fine sub-bands ---
      float lam = sin(yy * 24.0 + lh * 31.0) * 0.5 + 0.5;
      col *= 0.95 + lam * 0.07;

      // --- fault planes: dark crush zones at column boundaries ---
      float fault_line = smoothstep(0.035, 0.0, min(cf, 1.0 - cf)) * step(0.01, abs(u_fault));
      col = mix(col, col * 0.40, fault_line * 0.85);
      // crushed breccia speckle along the fault
      float brec = noise(uv * vec2(40.0, 200.0));
      col = mix(col, lay_col * 0.65, fault_line * brec * 0.6);
      // drag fold: layers brighten slightly as they bend into the fault
      float drag = smoothstep(0.10, 0.0, min(cf, 1.0 - cf)) * (1.0 - fault_line);
      col *= 1.0 + drag * 0.06;

      // --- weathering: granular surface wear and crumbled pockets ---
      col += (noise(uv * 200.0) - 0.5) * 0.06;
      float pock = smoothstep(0.75, 0.95, fbm(uv * 8.0 + 51.0) * 0.5 + 0.5);
      col = mix(col, lay_col * 0.55, pock * 0.35);
      // pale mineral veining cutting across bedding
      float veinv = pow(1.0 - abs(snoise(uv * vec2(2.0, 6.0) + 23.0)), 12.0);
      col = mix(col, ash * 0.9, veinv * 0.35);

      // abyssal gloom gathers toward the bottom of the wall
      col *= mix(0.80, 1.05, uv.y);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_layers`,name:`Layer Count`,type:`float`,min:4,max:24,default:12},{id:`u_fault`,name:`Fault Offset`,type:`float`,min:0,max:.5,default:.18},{id:`u_warp`,name:`Bed Warping`,type:`float`,min:0,max:.4,default:.12},{id:`u_sediment_color`,name:`Sediment Tone`,type:`color`,default:[.52,.43,.32,1]}]},Zt=e({default:()=>Qt}),Qt={id:`demon_scales_artisan`,name:`Demon Scales`,category:`Natural`,added:`2026-04-15`,description:`Overlapping pointed organic scales with depth found in mythical beast armor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.3));
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Size`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Scale Top`,type:`color`,default:[.3,0,0,1]},{id:`u_secondary_color`,name:`Under Scale`,type:`color`,default:[.1,0,0,1]}]},$t=e({default:()=>en}),en={id:`denim_weave_artisan`,name:`Denim Fabric`,category:`Abstract`,added:`2026-04-15`,description:`Iconic indigo-stained twill weave with micro-directional thread noise.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float twill = sin((uv.x + uv.y) * 20.0);
      float noise = hash(v_uv * 500.0) * 0.2;
      float mask = step(0.0, twill + noise);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Twill Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Fade Blue`,type:`color`,default:[.3,.4,.6,1]},{id:`u_secondary_color`,name:`Indigo Deep`,type:`color`,default:[.1,.15,.3,1]}]},tn=e({default:()=>nn}),nn={id:`desert_dunes_artisan`,name:`Desert Dunes`,category:`Natural`,added:`2026-04-16`,description:`Wavy ripple-sand patterns mimicking windswept desert landscapes.`,shader:`
    vec4 generate() {
      float ripple = sin(v_uv.x * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dune Frequency`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Sunlit Sand`,type:`color`,default:[.9,.7,.4,1]},{id:`u_secondary_color`,name:`Dune Shadow`,type:`color`,default:[.7,.5,.3,1]}]},rn=e({default:()=>an}),an={id:`diamond_plate_pro`,name:`Diamond Plate`,category:`Industrial`,added:`2026-04-15`,description:`Classic anti-slip safety metal floor texture.`,shader:`
    float diamond(vec2 p) {
      p = abs(p);
      return max(p.x * 2.5, p.y);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      if (mod(id.x + id.y, 2.0) > 0.5) uv.x += 0.5;
      
      vec2 gv = fract(uv) - 0.5;
      float d = diamond(gv);
      float mask = smoothstep(0.4, 0.35, d);
      
      // Metal highlights
      float highlight = smoothstep(0.3, 0.35, d) * 0.2;
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb += highlight;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Scale`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Diamond Face`,type:`color`,default:[.7,.7,.72,1]},{id:`u_secondary_color`,name:`Plate Base`,type:`color`,default:[.4,.4,.42,1]}]},on=e({default:()=>sn}),sn={id:`diamond_quilt_artisan`,name:`Diamond Quilt`,category:`Abstract`,added:`2026-04-15`,description:`Stitched padded fabric effect with soft surface shading for luxury upholstery.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = fract(uv);
      float d = length(gv - 0.5);
      float mask = smoothstep(0.5, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stitch Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Padding`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Stitch Deep`,type:`color`,default:[.5,.5,.6,1]}]},cn=e({default:()=>ln}),ln={id:`diamond_stitch_v2_artisan`,name:`Pro Diamond Stitch`,category:`Racing`,added:`2026-04-16`,description:`Advanced padded upholstery with individual cross-stitching detail found in luxury GT cockpits.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Diamond Size`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Padding`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Stitch Line`,type:`color`,default:[.4,0,0,1]}]},un=e({default:()=>dn}),dn={id:`diatom_shells_artisan`,name:`Diatom Shells`,category:`Natural`,added:`2026-04-15`,description:`Intricate microscopic silicate shells found in marine plankton formations.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float mask = sin(d * 10.0 + sin(angle * 8.0));
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,uniforms:[{id:`u_scale`,name:`Shell Scale`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Silicate`,type:`color`,default:[.8,.9,1,1]},{id:`u_secondary_color`,name:`Marine Deep`,type:`color`,default:[0,.1,.2,1]}]},fn=e({default:()=>pn}),pn={id:`diffraction_grating_artisan`,name:`Diffraction Grating`,category:`Abstract`,added:`2026-04-15`,description:`Rainbow-like spectral interference bands mimicking light diffraction on surfaces.`,shader:`
    vec4 generate() {
      float d = sin(v_uv.x * 500.0 + v_uv.y * 50.0);
      vec3 rainbow = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + d * 3.14);
      return vec4(rainbow, 1.0);
    }
  `,uniforms:[]},mn=e({default:()=>hn}),hn={id:`digi_camo_urban`,name:`Urban Digi Camo`,category:`Racing`,added:`2026-04-15`,description:`High-contrast city digital camouflage.`,shader:`
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      vec4 color = u_color_base;
      if (n > 0.8) color = u_color_1;
      else if (n > 0.5) color = u_color_2;
      else if (n > 0.2) color = u_color_3;
      return color;
    }
  `,variants:[{name:`Urban (Default)`,uniforms:{u_color_base:[.5,.5,.5,1],u_color_1:[.1,.1,.1,1],u_color_2:[.3,.3,.3,1],u_color_3:[.7,.7,.7,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.08,.08,.09,1],u_color_1:[0,0,0,1],u_color_2:[.04,.04,.05,1],u_color_3:[.12,.12,.14,1]}}],uniforms:[{id:`u_scale`,name:`Detail`,type:`float`,min:10,max:100,default:50},{id:`u_color_base`,name:`Base`,type:`color`,default:[.5,.5,.5,1]},{id:`u_color_1`,name:`Dark`,type:`color`,default:[.1,.1,.1,1]},{id:`u_color_2`,name:`Mid`,type:`color`,default:[.3,.3,.3,1]},{id:`u_color_3`,name:`Light`,type:`color`,default:[.7,.7,.7,1]}]},gn=e({default:()=>_n}),_n={id:`digital_camo_v2_artisan`,name:`Ghost Camo`,category:`Racing`,added:`2026-04-16`,description:`Advanced multi-scale digital camouflage with low-visibility spectral patterns.`,shader:`
    vec4 generate() {
      float n = hash(floor(v_uv * 10.0)) + hash(floor(v_uv * 40.0)) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,variants:[{name:`Ghost (Default)`,uniforms:{u_primary_color:[.3,.3,.35,1],u_secondary_color:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_primary_color:[.08,.08,.09,1],u_secondary_color:[0,0,0,1]}}],uniforms:[{id:`u_primary_color`,name:`Camo High`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Camo Deep`,type:`color`,default:[.1,.1,.12,1]}]},vn=e({default:()=>yn}),yn={id:`digital_glitch_pro`,name:`Digital Glitch`,category:`Abstract`,added:`2026-04-15`,description:`Static pixel shift and signal interference simulation.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      // Removed time dependency from shift
      float shift = hash(y) * 0.2;
      float x = v_uv.x + shift;
      
      float mask = step(0.9, hash(floor(x * 10.0) + y));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Glitch Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Signal`,type:`color`,default:[0,1,.3,1]},{id:`u_secondary_color`,name:`Noise`,type:`color`,default:[.05,.05,.08,1]}]},bn=e({default:()=>xn}),xn={id:`disco_ball`,name:`Disco Ball`,category:`Retro`,added:`2026-06-11`,description:`Mirror-tile skin of a spinning glitter ball — silvered facets each angled at a different light, coloured spots washing across them and four-point flares spiking off the hottest.`,shader:`
    vec4 generate() {
      float facets = u_facets;
      vec2 uv = v_uv * facets;
      // alternate rows shift half a tile, like real glued mirror courses
      float row = floor(uv.y);
      uv.x += mod(row, 2.0) * 0.5;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;

      // --- each facet aims somewhere different ---
      float aim = hash(cell) * 6.2831;
      vec2 ndir = vec2(cos(aim), sin(aim));
      float catchlight = hash(cell + 17.0);
      catchlight = catchlight * catchlight;          // few bright, many dim

      // mirror base: cool silver with a gradient across the facet
      float grad = dot(f, ndir);
      vec3 silver = vec3(0.52, 0.55, 0.60);
      vec3 mirror = silver * (0.30 + catchlight * 1.1 + grad * 0.55);

      // each facet reflects one of the room's coloured lights
      float pick = hash(cell + 43.0);
      vec3 lightc = u_light_color.rgb;
      if (pick < 0.25)      lightc = vec3(0.30, 0.85, 1.00);   // cyan spot
      else if (pick < 0.5)  lightc = vec3(1.00, 0.75, 0.35);   // amber spot
      else if (pick < 0.7)  lightc = vec3(0.65, 0.40, 1.00);   // violet spot
      mirror = mix(mirror, mirror * (lightc * 1.6), 0.25 + catchlight * 0.45);

      // fine scratch swirl in the silvering
      mirror *= 0.94 + noise(uv * 60.0) * 0.12;

      // --- whole-sheet coloured washes sweeping across the ball ---
      vec2 s1 = v_uv - vec2(0.25, 0.70);
      vec2 s2 = v_uv - vec2(0.78, 0.30);
      mirror += u_light_color.rgb * exp(-dot(s1, s1) * 9.0) * 0.30;
      mirror += vec3(0.30, 0.85, 1.00) * exp(-dot(s2, s2) * 11.0) * 0.22;

      // --- grout gaps between tiles: dark adhesive with a glint ---
      float gap = min(min(f.x + 0.5, 0.5 - f.x), min(f.y + 0.5, 0.5 - f.y));
      float grout = 1.0 - smoothstep(0.025, 0.05, gap);
      vec3 col = mix(mirror, vec3(0.04, 0.04, 0.05), grout);
      // bevel: facet edge catches light opposite the grout
      float bevel = smoothstep(0.05, 0.025, gap) - smoothstep(0.025, 0.0, gap);
      col += silver * bevel * catchlight * 0.5;

      // --- four-point star flares off the hottest facets ---
      if (catchlight > 0.80) {
        float flare = exp(-abs(f.x) * 26.0) * exp(-f.y * f.y * 60.0)
                    + exp(-abs(f.y) * 26.0) * exp(-f.x * f.x * 60.0);
        flare *= exp(-length(f) * 3.0) * u_sparkle;
        col += (vec3(1.0) * 0.7 + lightc * 0.5) * flare * (catchlight - 0.6) * 3.0;
        // hot core
        col += vec3(1.0) * exp(-dot(f, f) * 700.0) * u_sparkle * 1.2;
      }

      // micro-glitter scattered across everything
      float micro = step(0.992, hash(floor(v_uv * facets * 6.0) + 3.0));
      col += lightc * micro * 0.6 * u_sparkle;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_facets`,name:`Facet Count`,type:`float`,min:8,max:48,default:18},{id:`u_sparkle`,name:`Flare Intensity`,type:`float`,min:0,max:2,default:1},{id:`u_light_color`,name:`Spot Light`,type:`color`,default:[1,.4,.8,1]}]},Sn=e({default:()=>Cn}),Cn={id:`door_panel_fabric_artisan`,name:`Panel Fabric`,category:`Racing`,added:`2026-04-16`,description:`Coarse interior textile weave found in lightweight door cards and racing interiors.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x * 2.0) * sin(uv.y * 2.0);
      float mask = smoothstep(-0.2, 0.2, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:50,max:300,default:150},{id:`u_primary_color`,name:`Fiber Grain`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Fabric Base`,type:`color`,default:[.15,.15,.2,1]}]},wn=e({default:()=>Tn}),Tn={id:`dragon_plate_artisan`,name:`Dragon Plate`,category:`Natural`,added:`2026-04-15`,description:`Thick, overlapping pointed armor-like scales with depth found in mythical creature hide.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.4));
      float mask = smoothstep(0.5, 0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Size`,type:`float`,min:5,max:25,default:12},{id:`u_primary_color`,name:`Plate Top`,type:`color`,default:[.3,0,.1,1]},{id:`u_secondary_color`,name:`Under Rim`,type:`color`,default:[.1,0,0,1]}]},En=e({default:()=>Dn}),Dn={id:`eclipse_corona`,name:`Eclipse Corona`,category:`Cosmos`,added:`2026-06-11`,description:`Totality — a jet-black lunar disc ringed by a blazing chromosphere and wispy pearl-white coronal streamers raking into the dark.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      float disc = u_disc_size;

      vec3 space = vec3(0.005, 0.006, 0.014);
      vec3 col = space;

      // --- Coronal streamers: angular fbm filaments stretched radially ---
      // Sample noise in (angle, log-radius) space so wisps rake outward
      float lr = log(max(r, 0.001));
      float wisp1 = fbm(vec2(theta * 2.5, lr * 1.2) * 1.4) * 0.5 + 0.5;
      float wisp2 = fbm(vec2(theta * 6.0 + 17.0, lr * 2.2)) * 0.5 + 0.5;
      float wisp3 = noise(vec2(theta * 14.0 + 41.0, lr * 4.0)); // fine threads

      // Streamer envelope: brighter along equatorial axis (helmet streamers)
      float helmet = 0.55 + 0.45 * pow(abs(cos(theta)), 1.5) * u_streamers;

      float wisps = wisp1 * 0.55 + wisp2 * 0.30 + wisp3 * 0.25;
      wisps = pow(clamp(wisps, 0.0, 1.0), 1.8);

      // Radial brightness: intense at the limb, fading with distance
      float fall = exp(-(r - disc) * (3.2 / u_corona_reach));
      float outside = smoothstep(disc * 0.98, disc * 1.02, r);
      float corona = wisps * helmet * fall * outside;

      vec3 pearl = vec3(0.92, 0.94, 1.0);
      col += pearl * corona * 1.35;

      // Inner corona: smooth bright collar hugging the disc
      float collar = exp(-pow((r - disc) / (disc * 0.10), 2.0)) * outside;
      col += vec3(1.0, 0.99, 0.95) * collar * 1.1;

      // --- Chromosphere: thin crimson flash ring with prominences ---
      float chromo = exp(-pow((r - disc * 1.005) / (disc * 0.018), 2.0));
      float promBumps = pow(max(noise(vec2(theta * 8.0, 3.3)) - 0.55, 0.0) * 2.2, 1.5);
      float prom = promBumps * exp(-pow((r - disc * 1.05) / (disc * 0.05), 2.0)) * outside;
      col += vec3(0.95, 0.18, 0.10) * (chromo * 0.8 + prom * 1.2);

      // Polar plumes: fine brush strokes at the poles
      float plume = pow(abs(sin(theta)), 6.0) * wisp3;
      col += pearl * plume * fall * outside * 0.5;

      // --- The black disc itself: occulting moon with faint earthshine ---
      float inDisc = smoothstep(disc * 1.005, disc * 0.985, r);
      float earthshine = fbm(uv * 8.0) * 0.5 + 0.5;
      vec3 discCol = vec3(0.012, 0.012, 0.016) + vec3(0.020, 0.020, 0.026) * earthshine;
      col = mix(col, discCol, inDisc);

      // Diamond-ring glint at one point on the limb
      vec2 gpos = vec2(cos(0.9), sin(0.9)) * disc * 0.5;
      float glint = exp(-pow(length(uv - gpos) * 2.0 / (disc * 0.06), 2.0));
      col += vec3(1.0, 0.98, 0.9) * glint * u_diamond * (1.0 - inDisc * 0.7);

      // Background stars visible during totality
      vec2 g = floor(v_uv * 65.0);
      float star = smoothstep(0.965, 1.0, hash(g + 9.1)) *
                   smoothstep(0.1, 0.0, length(fract(v_uv * 65.0) - vec2(hash(g), hash(g + 13.0))));
      col += vec3(0.85, 0.88, 1.0) * star * (1.0 - inDisc) * (1.0 - clamp(corona * 2.0, 0.0, 1.0));

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_disc_size`,name:`Disc Size`,type:`float`,min:.15,max:.55,default:.32},{id:`u_corona_reach`,name:`Corona Reach`,type:`float`,min:.3,max:2.5,default:1},{id:`u_streamers`,name:`Streamer Bias`,type:`float`,min:0,max:1,default:.7},{id:`u_diamond`,name:`Diamond Ring`,type:`float`,min:0,max:2,default:.8}]},On=e({default:()=>kn}),kn={id:`eight_bit_clouds`,name:`8-Bit Clouds`,category:`Retro`,added:`2026-06-11`,description:`Side-scroller sky straight off a 1985 cartridge — chunky white clouds with navy outlines and powder-blue undersides drifting over banded NES blue.`,shader:`
    float cloudfield_ebc(vec2 p) {
      return noise(p * 1.5) * 0.60 + noise(p * 3.0 + 4.7) * 0.30 + noise(p * 6.0 + 9.3) * 0.10;
    }

    vec4 generate() {
      float px = u_pixels;
      vec2 pv = floor(v_uv * px) / px;       // hard pixel quantization
      float tx = 1.0 / px;

      float thresh = 1.0 - u_cover * 0.7;    // higher cover -> lower threshold
      float scale = 3.0;

      // cloud occupancy at this pixel and its 4-neighbours (for outlines)
      float c0 = step(thresh, cloudfield_ebc(pv * scale));
      float cn = step(thresh, cloudfield_ebc((pv + vec2(0.0,  tx)) * scale));
      float cs = step(thresh, cloudfield_ebc((pv + vec2(0.0, -tx)) * scale));
      float ce = step(thresh, cloudfield_ebc((pv + vec2( tx, 0.0)) * scale));
      float cw = step(thresh, cloudfield_ebc((pv + vec2(-tx, 0.0)) * scale));
      float cs2 = step(thresh, cloudfield_ebc((pv + vec2(0.0, -2.0 * tx)) * scale));

      // sky: hard-banded gradient, brighter near the top of each tile
      vec3 sky = u_sky_color.rgb;
      float band = floor(fract(pv.y) * 6.0) / 5.0;
      vec3 col = mix(sky * 0.80, sky * 1.10, band);

      // distant cloud layer: smaller puffs, mixed halfway into the sky
      float far = step(thresh + 0.06, cloudfield_ebc(pv * scale * 2.3 + 17.0));
      col = mix(col, mix(col, vec3(1.0), 0.5), far);

      if (c0 > 0.5) {
        vec3 cloudTop   = vec3(0.99, 0.99, 1.00);
        vec3 cloudUnder = vec3(0.62, 0.78, 0.96);   // powder-blue shading
        vec3 outline    = vec3(0.07, 0.13, 0.38);   // navy keyline

        vec3 cloud = cloudTop;
        // underside shading: two pixels above the open sky
        if (cs2 < 0.5 || cs < 0.5) cloud = cloudUnder;
        // hard 1px outline against any sky neighbour
        if (cn < 0.5 || cs < 0.5 || ce < 0.5 || cw < 0.5) cloud = outline;
        col = cloud;
      }

      // 8-bit dither speckle in the sky only (sparse single bright pixels)
      if (c0 < 0.5 && far < 0.5) {
        float spark = hash(floor(v_uv * px) + 0.7);
        if (spark > 0.992) col = mix(col, vec3(1.0), 0.6);
      }

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_pixels`,name:`Pixel Grid`,type:`float`,min:24,max:96,default:48},{id:`u_cover`,name:`Cloud Cover`,type:`float`,min:.1,max:1,default:.55},{id:`u_sky_color`,name:`Sky Blue`,type:`color`,default:[.36,.58,.98,1]}]},An=e({default:()=>jn}),jn={id:`energy_shield_artisan`,name:`Phase Shield`,category:`Abstract`,added:`2026-04-16`,description:`Hexagonal-linked energy barrier pattern with high-frequency interference patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shield Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Ion Glow`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Hardlight Base`,type:`color`,default:[0,.1,.2,1]}]},Mn=e({default:()=>Nn}),Nn={id:`etched_brass_artisan`,name:`Etched Brass`,category:`Industrial`,added:`2026-04-16`,description:`Victorian-style chemical etching and ornate brass panel patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 10.0;
      float lines = sin(uv.x) * sin(uv.y) + sin(uv.x * 2.0) * cos(uv.y * 2.0);
      float mask = step(0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Brass High`,type:`color`,default:[.8,.6,.2,1]},{id:`u_secondary_color`,name:`Etched Deep`,type:`color`,default:[.4,.3,.1,1]}]},Pn=e({default:()=>Fn}),Fn={id:`exhaust_heat_artisan`,name:`Exhaust Bluing`,category:`Industrial`,added:`2026-04-16`,description:`Wavy prismatic heat seasoning found on high-temperature titanium and steel exhaust systems.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 5.0);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.2, 0.4)));
      return vec4(col, 1.0);
    }
  `,uniforms:[]},In=e({default:()=>Ln}),Ln={id:`expanded_grating_pro`,name:`Expanded Metal`,category:`Industrial`,added:`2026-04-15`,description:`Heavy industrial walkway grating with diamond-slotted apertures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float d = abs(gv.x) + abs(gv.y);
      float mask = step(0.4, d);
      
      // Slit shadow
      float shadow = smoothstep(0.4, 0.45, d) * 0.3;
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= shadow;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Mesh Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Steel Rib`,type:`color`,default:[.3,.3,.33,1]},{id:`u_secondary_color`,name:`Aperture`,type:`color`,default:[0,0,0,1]}]},Rn=e({default:()=>zn}),zn={id:`exposed_aggregate`,name:`Exposed Aggregate`,category:`Natural`,added:`2026-05-01`,description:`Exposed aggregate concrete with embedded smooth pebbles in warm stone colors set in a dark cement matrix.`,shader:`
    // --- helpers BEFORE generate() ---

    vec2 voronoi_rand_ea(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float hash1_ea(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float hash1b_ea(vec2 p) {
      return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
    }

    // Warm stone palette — 6 tones
    vec3 stone_palette(float idx) {
      // 0: mid grey, 1: warm beige, 2: cream, 3: warm brown, 4: terracotta, 5: cool grey
      if (idx < 0.5)       return vec3(0.56, 0.54, 0.52);   // mid grey
      else if (idx < 1.5)  return vec3(0.74, 0.68, 0.56);   // warm beige
      else if (idx < 2.5)  return vec3(0.86, 0.82, 0.72);   // cream
      else if (idx < 3.5)  return vec3(0.58, 0.44, 0.32);   // warm brown
      else if (idx < 4.5)  return vec3(0.68, 0.42, 0.30);   // terracotta
      else                 return vec3(0.62, 0.62, 0.66);   // cool grey
    }

    float smoothnoise_ea(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_ea(i);
      float b = hash1_ea(i + vec2(1.0, 0.0));
      float c = hash1_ea(i + vec2(0.0, 1.0));
      float d = hash1_ea(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_stone_size;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);

      // Voronoi — find closest cell and edge distance
      float m_dist  = 10.0;
      float m2_dist = 10.0;
      vec2  m_id    = vec2(0.0);
      vec2  m_local = vec2(0.0);   // local pos within cell (relative to site)

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          // Randomize stone site position — jitter 0.2–0.8 to avoid overlap issues
          vec2 rng  = 0.2 + 0.6 * voronoi_rand_ea(i_uv + neighbor);
          vec2 diff = neighbor + rng - f_uv;
          float d   = length(diff);
          if (d < m_dist) {
            m2_dist = m_dist;
            m_dist  = d;
            m_id    = i_uv + neighbor;
            m_local = diff;
          } else if (d < m2_dist) {
            m2_dist = d;
          }
        }
      }

      // Edge distance
      float edge_dist = m2_dist - m_dist;

      // Cement between stones
      float cement_mask = smoothstep(0.0, u_grout_width, edge_dist);

      // Stone color from palette
      float cell_hash = hash1_ea(m_id);
      float palette_idx = floor(cell_hash * 6.0);
      vec3 stone_col = stone_palette(palette_idx);

      // Slight brightness variation within each stone (second hash axis)
      float stone_var = hash1b_ea(m_id + vec2(3.7, 9.2));
      stone_col *= mix(0.88, 1.08, stone_var);

      // Pebble rounding: stones are brighter at their center (curved surface catching light)
      // m_dist is distance from stone site — normalized by typical cell size ~0.5
      float center_t = clamp(m_dist * 2.0, 0.0, 1.0);
      float curvature = 1.0 - center_t * center_t * 0.18;
      stone_col *= curvature;

      // Micro-texture on stone surface
      float micro = smoothnoise_ea(v_uv * 80.0 + m_id * 13.7);
      stone_col += (micro - 0.5) * 0.04;

      // Cement color — slightly darker than supplied, recessed
      vec3 cement = u_cement_color.rgb * 0.85;
      // Micro-texture on cement
      float cement_micro = smoothnoise_ea(v_uv * 40.0 + vec2(5.3, 2.1));
      cement += (cement_micro - 0.5) * 0.025;

      // Blend stone and cement
      vec3 col = mix(cement, stone_col, cement_mask);

      // Edge shadow — recessed cement casts slight shadow on adjacent stone edge
      float edge_shadow = smoothstep(0.0, u_grout_width * 2.5, edge_dist);
      col *= mix(0.82, 1.0, edge_shadow);

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_stone_size`,name:`Aggregate Density`,type:`float`,min:2,max:20,default:8},{id:`u_cement_color`,name:`Cement Color`,type:`color`,default:[.25,.24,.23,1]},{id:`u_grout_width`,name:`Cement Gap Width`,type:`float`,min:.02,max:.15,default:.06}]},Bn=e({default:()=>Vn}),Vn={id:`fiber_optic_bundle_artisan`,name:`Fiber Bundle`,category:`Technology`,added:`2026-04-16`,description:`Glowing bundles of light-conducting strands found in high-speed data transmission systems.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float n = hash(vec2(y, y));
      float strand = step(0.1, fract(v_uv.x * 5.0 + n));
      return mix(u_secondary_color, u_primary_color, strand);
    }
  `,uniforms:[{id:`u_scale`,name:`Strand Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Optic Glow`,type:`color`,default:[.2,1,1,1]},{id:`u_secondary_color`,name:`Dark Cladding`,type:`color`,default:[0,.05,.1,1]}]},Hn=e({default:()=>Un}),Un={id:`fingerprint_swirls_artisan`,name:`Fingerprint Swirls`,category:`Natural`,added:`2026-04-15`,description:`Swirling organic ridge patterns mimicking human dermatoglyphics.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 5.0) * 2.0);
      float mask = sin(n * 20.0);
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,uniforms:[{id:`u_scale`,name:`Ridge Detail`,type:`float`,min:2,max:15,default:5},{id:`u_primary_color`,name:`Ridge`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Valley`,type:`color`,default:[.95,.9,.85,1]}]},Wn=e({default:()=>Gn}),Gn={id:`fish_scales_artisan`,name:`Fish Scales`,category:`Natural`,added:`2026-04-15`,description:`Round, thin overlapping semi-circles found in aquatic life and reflective armor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Scale Body`,type:`color`,default:[.4,.6,.7,.8]},{id:`u_secondary_color`,name:`Joint Shadow`,type:`color`,default:[.1,.2,.3,1]}]},Kn=e({default:()=>qn}),qn={id:`flecktarn_camo`,name:`Flecktarn Camo`,category:`Organic`,added:`2026-05-12`,description:`A complex pattern consisting of small, densely packed spots and dots that create a disruptive, noisy texture.`,shader:`
    
    // Cellular noise for dots
    vec2 random2( vec2 p ) {
      return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float cellular(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float min_dist = 1.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i + neighbor);
          float dist = length(neighbor + point - f);
          min_dist = min(min_dist, dist);
        }
      }
      return min_dist;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Base organic blobs
      float base_noise = snoise(uv * 0.3);
      vec4 color = u_color_base;
      if (base_noise > 0.0) color = u_color_1;
      
      // Dots/Spots layered on top
      float spots1 = cellular(uv * 2.5);
      float spots2 = cellular(uv * 3.0 + vec2(10.0));
      float spots3 = cellular(uv * 3.5 + vec2(20.0));
      
      if (spots1 < 0.25) color = u_color_2;
      if (spots2 < 0.20) color = u_color_3;
      if (spots3 < 0.15) color = u_color_4;
      
      return color;
    }
  `,variants:[{name:`Flecktarn (Woodland)`,uniforms:{u_color_base:[.35,.4,.25,1],u_color_1:[.25,.3,.2,1],u_color_2:[.45,.35,.25,1],u_color_3:[.25,.15,.1,1],u_color_4:[.1,.1,.1,1]}},{name:`Tropentarn (Desert)`,uniforms:{u_color_base:[.75,.65,.5,1],u_color_1:[.65,.55,.4,1],u_color_2:[.45,.5,.35,1],u_color_3:[.35,.25,.15,1],u_color_4:[.15,.15,.15,1]}},{name:`Urban Mottled`,uniforms:{u_color_base:[.6,.6,.65,1],u_color_1:[.4,.4,.45,1],u_color_2:[.3,.3,.35,1],u_color_3:[.2,.2,.25,1],u_color_4:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.12,.12,.12,1],u_color_2:[.08,.08,.08,1],u_color_3:[.05,.05,.05,1],u_color_4:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Spot Scale`,type:`float`,min:5,max:40,default:15},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.35,.4,.25,1]},{id:`u_color_1`,name:`Blob Color`,type:`color`,default:[.25,.3,.2,1]},{id:`u_color_2`,name:`Spot 1`,type:`color`,default:[.45,.35,.25,1]},{id:`u_color_3`,name:`Spot 2`,type:`color`,default:[.25,.15,.1,1]},{id:`u_color_4`,name:`Spot 3`,type:`color`,default:[.1,.1,.1,1]}]},Jn=e({default:()=>Yn}),Yn={id:`fluid_marbling_pro`,name:`Fluid Marbling`,category:`Abstract`,added:`2026-04-15`,description:`Organic static liquid flow with colorful mineral-like marbling.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offsets
      float n = noise(uv);
      float n2 = noise(uv * 2.0 - n);
      float mask = smoothstep(0.3, 0.7, n * 0.5 + n2 * 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flow Scale`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Mineral A`,type:`color`,default:[.4,.1,.8,1]},{id:`u_secondary_color`,name:`Mineral B`,type:`color`,default:[.1,.4,.5,1]}]},Xn=e({default:()=>Zn}),Zn={id:`folded_damascus_steel_artisan`,name:`Folded Damascus Steel`,category:`Industrial`,added:`2026-05-13`,description:`Swirling, wavy folded steel patterns with high-contrast acid bath etching.`,shader:`
    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000 * noise(p); p *= 2.02;
      f += 0.2500 * noise(p); p *= 2.03;
      f += 0.1250 * noise(p); p *= 2.01;
      f += 0.0625 * noise(p);
      return f;
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Domain warping for folded look
        vec2 q = vec2(fbm(uv), fbm(uv + vec2(5.2, 1.3)));
        vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2)), fbm(uv + 4.0 * q + vec2(8.3, 2.8)));
        
        float n = fbm(uv + 4.0 * r);
        
        // High frequency folding lines
        float lines = sin(n * u_fold_density * 3.14159);
        
        // Etch depth based on folded lines
        float etch = smoothstep(0.4, 0.6, lines);
        
        vec4 darkLayer = u_dark_steel;
        vec4 lightLayer = mix(u_light_steel, vec4(1.0, 1.0, 1.0, 1.0), n * 0.5); // specular
        
        return mix(darkLayer, lightLayer, etch);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Scale`,type:`float`,min:1,max:10,default:3},{id:`u_fold_density`,name:`Fold Density`,type:`float`,min:5,max:30,default:15},{id:`u_dark_steel`,name:`Etched Layer`,type:`color`,default:[.15,.15,.16,1]},{id:`u_light_steel`,name:`Polished Layer`,type:`color`,default:[.6,.6,.65,1]}]},Qn=e({default:()=>$n}),$n={id:`forest_litter_artisan`,name:`Forest Litter`,category:`Natural`,added:`2026-04-15`,description:`Dense organic debris and varying leaf shapes found on a forest floor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float d = length(fract(uv) - 0.5);
      float mask = smoothstep(0.4, 0.1, d * (0.8 + n * 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Debris Density`,type:`float`,min:2,max:20,default:12},{id:`u_primary_color`,name:`Leaf Dust`,type:`color`,default:[.4,.3,.1,1]},{id:`u_secondary_color`,name:`Soil`,type:`color`,default:[.1,.08,.05,1]}]},er=e({default:()=>tr}),tr={id:`forged_carbon`,name:`Forged Carbon`,category:`Organic`,added:`2026-04-15`,description:`Randomized carbon shred pattern used in hypercars.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float fbm(vec2 p) {
      float f = 0.0;
      float a = 0.5;
      for(int i=0; i<6; i++) {
        f += a * abs(sin(p.x + sin(p.y)));
        p *= 2.0;
        a *= 0.5;
      }
      return f;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = fbm(uv * 3.0);
      float n2 = fbm(uv * 5.0 + n);
      float mask = mix(n, n2, 0.5);
      vec4 col = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) {
        // Chopped-fibre marbling modulates metallic and roughness so shreds read in reflections
        float metallic = mix(0.3, 0.5, clamp(mask, 0.0, 1.0));
        float roughness = clamp(0.2 - mask * 0.08, 0.1, 0.2);
        return vec4(metallic, roughness, 0.0, col.a);
      }
      return col;
    }
  `,uniforms:[{id:`u_scale`,name:`Flake Size`,type:`float`,min:1,max:20,default:8},{id:`u_primary_color`,name:`High Carbon`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Base Carbon`,type:`color`,default:[.05,.05,.05,1]}]},nr=e({default:()=>rr}),rr={id:`frost_crystals_artisan`,name:`Frost Crystals`,category:`Natural`,added:`2026-04-15`,description:`Crystalline window-ice patterns and frost blooms found in extreme cold.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 10.0);
      float crystal = step(0.9, hash(v_uv * 20.0 + n));
      return mix(u_secondary_color, u_primary_color, crystal);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Frost`,type:`color`,default:[.9,.95,1,1]},{id:`u_secondary_color`,name:`Glass`,type:`color`,default:[.1,.2,.3,1]}]},ir=e({default:()=>ar}),ar={id:`frozen_lake_artisan`,name:`Ice Fractures`,category:`Natural`,added:`2026-04-16`,description:`Angular ice cracks and crystalline fractures found in frozen lake and arctic simulation environments.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.02, 0.0, abs(m_dist - 0.1));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Ice Shard`,type:`color`,default:[.8,.9,1,1]},{id:`u_secondary_color`,name:`Deep Lake`,type:`color`,default:[0,.1,.2,1]}]},or=e({default:()=>sr}),sr={id:`fusion_panel_artisan`,name:`Fusion Plating`,category:`Technology`,added:`2026-04-16`,description:`Complex geometric panel lines and "greebles" found on high-energy reactor housings.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.02, f_uv.x) * step(f_uv.x, 0.98) * step(0.02, f_uv.y) * step(f_uv.y, 0.98);
      float n = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask * n);
    }
  `,uniforms:[{id:`u_scale`,name:`Panel Detail`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Alloy Surface`,type:`color`,default:[.12,.12,.15,1]},{id:`u_secondary_color`,name:`Panel Joint`,type:`color`,default:[0,0,0,1]}]},cr=e({default:()=>lr}),lr={id:`galaxy_spiral`,name:`Galaxy Spiral`,category:`Cosmos`,added:`2026-06-11`,description:`A grand-design spiral galaxy with logarithmic arms laced by dark dust lanes, a blazing golden core, and thousands of pinpoint stars.`,shader:`
    // 2D rotation helper (unique suffix to avoid prelude collisions)
    vec2 rot_gsp(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    }

    // Star speckle layer: sparse bright points on a jittered grid
    float stars_gsp(vec2 uv, float density, float threshold) {
      vec2 g = floor(uv * density);
      vec2 f = fract(uv * density);
      float h = hash(g);
      vec2 starPos = vec2(hash(g + 17.3), hash(g + 41.7));
      float d = length(f - starPos);
      float bright = smoothstep(threshold, 1.0, h);
      return bright * smoothstep(0.12, 0.0, d);
    }

    vec4 generate() {
      // Centre the galaxy in each tile so the texture repeats gracefully
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      // --- Logarithmic spiral coordinate ---
      // phase winds with log(r): classic grand-design arm geometry
      float windTight = u_arm_wind;
      float spiralPhase = theta - log(max(r, 0.015)) * windTight;
      // u_arm_count arms around the circle
      float armWave = cos(spiralPhase * u_arm_count);

      // Arm intensity: sharpen the cosine into bright arms
      float arm = pow(max(armWave * 0.5 + 0.5, 0.0), 2.2);

      // --- Turbulent arm structure ---
      // Domain-warp the arms with fbm so they break into clumpy star clouds
      vec2 warpUv = rot_gsp(uv, log(max(r, 0.015)) * windTight);
      float cloud = fbm(warpUv * 9.0 + 31.0) * 0.5 + 0.5;
      float armClumps = arm * (0.55 + 0.45 * cloud);

      // --- Dust lanes ---
      // Narrow dark filaments riding the inner edge of each arm
      float dustWave = cos(spiralPhase * u_arm_count + 0.85);
      float dust = pow(max(dustWave * 0.5 + 0.5, 0.0), 6.0);
      float dustNoise = fbm(warpUv * 14.0 + 77.0) * 0.5 + 0.5;
      dust *= smoothstep(0.12, 0.35, r) * smoothstep(1.05, 0.55, r) * (0.4 + 0.6 * dustNoise);

      // --- Radial disc falloff ---
      float disc = exp(-r * r * 2.4);
      float halo = exp(-r * 1.6) * 0.25;

      // --- Core bulge ---
      float core = exp(-r * r * 55.0) * 2.2 + exp(-r * r * 9.0) * 0.7;

      // --- Palette ---
      vec3 deepSpace = vec3(0.012, 0.014, 0.030);
      vec3 armBlue   = vec3(0.42, 0.55, 0.95);   // young hot stars in arms
      vec3 discTint  = u_disc_color.rgb;          // mid-disc population
      vec3 coreGold  = u_core_color.rgb;          // old yellow core
      vec3 dustBrown = vec3(0.085, 0.055, 0.045);

      vec3 col = deepSpace;
      // Diffuse disc glow
      col += discTint * (disc * 0.55 + halo);
      // Spiral arms: blue-white star clouds weighted by disc falloff
      col += armBlue * armClumps * disc * 1.35;
      // HII region sparkle: pink knots along the arms
      float knots = smoothstep(0.78, 0.95, cloud) * arm * disc;
      col += vec3(0.95, 0.45, 0.55) * knots * 0.5;
      // Dust lanes absorb light
      col = mix(col, dustBrown, clamp(dust * 0.85, 0.0, 0.9));
      // Core blooms over everything, warming toward the centre
      col += coreGold * core;
      col = mix(col, vec3(1.0, 0.97, 0.88), clamp(core - 1.1, 0.0, 1.0));

      // --- Star speckle: two depths of field ---
      float sBack  = stars_gsp(v_uv + 3.7, 90.0, 0.94);
      float sFront = stars_gsp(v_uv + 9.1, 45.0, 0.965);
      col += vec3(0.85, 0.88, 1.0) * sBack * 0.7;
      col += vec3(1.0, 0.96, 0.90) * sFront;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_arm_count`,name:`Spiral Arms`,type:`float`,min:1,max:6,default:2},{id:`u_arm_wind`,name:`Arm Tightness`,type:`float`,min:1.5,max:7,default:3.6},{id:`u_core_color`,name:`Core Glow`,type:`color`,default:[1,.82,.55,1]},{id:`u_disc_color`,name:`Disc Tint`,type:`color`,default:[.3,.34,.55,1]}]},ur=e({default:()=>dr}),dr={id:`galvanized_steel_artisan`,name:`Galvanized Steel`,category:`Industrial`,added:`2026-04-15`,description:`Spangled crystalline industrial coating found in heavy-duty utility equipment.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      return mix(u_secondary_color, u_primary_color, m_point.x);
    }
  `,uniforms:[{id:`u_scale`,name:`Spangle Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Zinc High`,type:`color`,default:[.9,.9,.92,1]},{id:`u_secondary_color`,name:`Zinc Deep`,type:`color`,default:[.5,.5,.55,1]}]},fr=e({default:()=>pr}),pr={id:`gas_giant_bands`,name:`Gas Giant Bands`,category:`Cosmos`,added:`2026-06-11`,description:`Jovian cloud belts and zones shearing past each other in turbulent cream and rust, with a swirling great storm oval.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      // --- Domain warp: zonal winds shear the cloud deck horizontally ---
      float shear = fbm(uv * vec2(2.0, 6.0)) * u_turbulence;
      float shear2 = fbm(uv * vec2(5.0, 14.0) + 41.0) * u_turbulence * 0.4;
      vec2 wuv = uv + vec2(shear * 0.10 + shear2 * 0.04, shear2 * 0.015);

      // --- Banded latitude structure (periodic in y so it tiles) ---
      float lat = wuv.y * u_band_count * 6.2831853;
      float belts = sin(lat) * 0.5 + sin(lat * 2.0 + 1.3) * 0.25 + sin(lat * 0.5 + 0.4) * 0.35;
      belts = belts * 0.5 + 0.5;

      // Sharpen some boundaries: belts have crisp edges where jets collide
      float jetEdge = abs(sin(lat * 1.5 + 0.7));
      belts = mix(belts, smoothstep(0.35, 0.65, belts), jetEdge * 0.6);

      // --- Cloud-deck texture inside each band ---
      float deck = fbm(wuv * vec2(7.0, 22.0) + 13.0) * 0.5 + 0.5;
      float curls = fbm(wuv * vec2(18.0, 45.0) + 71.0) * 0.5 + 0.5;
      float festoon = smoothstep(0.6, 0.85, fbm(wuv * vec2(4.0, 10.0) + 99.0) * 0.5 + 0.5);

      // --- Palette ---
      vec3 zoneCream = u_zone_color.rgb;   // bright high ammonia clouds
      vec3 beltRust  = vec3(0.62, 0.36, 0.24);   // warm deep belts
      vec3 beltDeep  = beltRust * vec3(0.55, 0.45, 0.45);
      vec3 white     = vec3(0.97, 0.95, 0.90);

      vec3 col = mix(beltRust, zoneCream, belts);
      // Deck mottling: deeper colour in the troughs, bright cloud tops
      col = mix(col, beltDeep, (1.0 - deck) * (1.0 - belts) * 0.55);
      col = mix(col, white, smoothstep(0.68, 0.92, deck) * belts * 0.45);
      // Fine curl detail
      col = mix(col, col * 0.85, (1.0 - curls) * 0.30);
      // Blue-grey festoons streaming off the equatorial zone
      col = mix(col, vec3(0.45, 0.52, 0.62), festoon * belts * 0.30);

      // --- Great storm oval (one per tile, anchored with fract) ---
      vec2 suv = fract(uv) - vec2(0.68, 0.38);
      suv.x *= 1.9; // oval aspect
      float sr = length(suv);
      float sAng = atan(suv.y, suv.x);
      // Spiral swirl inside the storm
      float swirl = sin(sAng * 3.0 + sr * 30.0 - fbm(suv * 8.0) * 4.0) * 0.5 + 0.5;
      float storm = smoothstep(u_storm_size, u_storm_size * 0.55, sr);
      float stormRim = smoothstep(u_storm_size * 1.25, u_storm_size, sr) - storm;

      vec3 stormCol = mix(vec3(0.78, 0.30, 0.18), vec3(0.95, 0.62, 0.42), swirl);
      stormCol = mix(stormCol, vec3(0.99, 0.88, 0.72), smoothstep(0.2, 0.0, sr) * 0.6);
      col = mix(col, stormCol, storm);
      // Pale turbulent collar around the storm
      col = mix(col, white * 0.92, stormRim * 0.55 * (0.5 + 0.5 * deck));

      // Subtle limb shading top and bottom of each tile band
      col *= 0.92 + 0.08 * sin(fract(uv.y) * 3.14159265);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_band_count`,name:`Belt Count`,type:`float`,min:1,max:8,default:3},{id:`u_turbulence`,name:`Turbulence`,type:`float`,min:.2,max:3,default:1.2},{id:`u_storm_size`,name:`Storm Size`,type:`float`,min:.05,max:.3,default:.14},{id:`u_zone_color`,name:`Zone Cream`,type:`color`,default:[.91,.84,.7,1]}]},mr=e({default:()=>hr}),hr={id:`gauge_cluster_artisan`,name:`Gauge Finish`,category:`Racing`,added:`2026-04-16`,description:`Concentric circular brushed finish found on high-end analog gauge clusters and trim panels.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * 1000.0);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Brushed Rim`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Brushed Deep`,type:`color`,default:[.5,.5,.55,1]}]},gr=e({default:()=>_r}),_r={id:`geometric_camo_ops`,name:`Geometric Camo (Ops)`,category:`Geometric`,added:`2026-05-12`,description:`A modern, sharp geometric splinter camouflage designed for high-performance racing liveries with vibrant accent capabilities.`,shader:`
    
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        vec2 g1 = floor(uv + vec2(uv.y * 0.5, 0.0));
        float h1 = hash(g1);
        
        vec2 g2 = floor(uv * 1.3 + vec2(0.0, uv.x * 0.5));
        float h2 = hash(g2 + vec2(11.0, 17.0));
        
        vec2 g3 = floor(uv * mat2(0.707, -0.707, 0.707, 0.707) * 1.7);
        float h3 = hash(g3 + vec2(23.0, 29.0));
        
        float val = fract(h1 + h2 + h3);
        
        vec4 col = u_color_base;
        if(val < 0.3) col = u_color_1;
        else if(val < 0.6) col = u_color_2;
        else if(val < 0.9) col = u_color_3;
        
        if (val > 0.98 - (u_accent_amount * 0.1)) {
             col = u_color_accent;
        }
        
        return col;
    }
  `,variants:[{name:`Woodland (Ops)`,uniforms:{u_color_base:[.22,.27,.2,1],u_color_1:[.15,.16,.15,1],u_color_2:[.05,.05,.05,1],u_color_3:[.35,.35,.35,1],u_color_accent:[.35,.28,.18,1]}},{name:`Desert Recon`,uniforms:{u_color_base:[.76,.69,.5,1],u_color_1:[.55,.47,.33,1],u_color_2:[.25,.28,.2,1],u_color_3:[.1,.1,.1,1],u_color_accent:[.6,.4,.1,1]}},{name:`Urban Stealth`,uniforms:{u_color_base:[.9,.9,.92,1],u_color_1:[.6,.6,.65,1],u_color_2:[.15,.15,.18,1],u_color_3:[.3,.3,.35,1],u_color_accent:[.25,.28,.35,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.08,.08,.09,1],u_color_1:[.03,.03,.04,1],u_color_2:[0,0,0,1],u_color_3:[.15,.15,.16,1],u_color_accent:[.05,.05,.06,1]}}],uniforms:[{id:`u_scale`,name:`Camo Scale`,type:`float`,min:1,max:50,default:12},{id:`u_color_base`,name:`Base Green`,type:`color`,default:[.22,.27,.2,1]},{id:`u_color_1`,name:`Dark Grey`,type:`color`,default:[.15,.16,.15,1]},{id:`u_color_2`,name:`Black`,type:`color`,default:[.05,.05,.05,1]},{id:`u_color_3`,name:`Light Grey`,type:`color`,default:[.35,.35,.35,1]},{id:`u_color_accent`,name:`Accent Line`,type:`color`,default:[.35,.28,.18,1]},{id:`u_accent_amount`,name:`Accent Amount`,type:`float`,min:0,max:1,default:.5}]},vr=e({default:()=>yr}),yr={id:`geometric_fracture_artisan`,name:`Shatter Shard`,category:`Abstract`,added:`2026-04-16`,description:`Sharp angular procedural shards and crystalline fractures mimicking high-speed impact surfaces.`,shader:`
    vec2 rand(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, step(0.1, m_dist));
    }
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Fracture Edge`,type:`color`,default:[.9,.9,1,1]},{id:`u_secondary_color`,name:`Fracture Void`,type:`color`,default:[.1,.1,.2,1]}]},br=e({default:()=>xr}),xr={id:`glacier_ice_artisan`,name:`Glacier Ice`,category:`Natural`,added:`2026-04-15`,description:`Crackled crystalline planes with directional depth found in Arctic ice formations.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float crack = step(0.9, hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, (n + crack) * 0.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Shelf Scale`,type:`float`,min:1,max:20,default:5},{id:`u_primary_color`,name:`Clean Ice`,type:`color`,default:[.9,.95,1,.8]},{id:`u_secondary_color`,name:`Deep Freeze`,type:`color`,default:[.1,.3,.5,1]}]},Sr=e({default:()=>Cr}),Cr={id:`glass_shards_artisan`,name:`Glass Shards`,category:`Abstract`,added:`2026-04-15`,description:`Sharp, non-animated geometric fragmentation mimicking shattered glass.`,shader:`
    vec2 random2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, m_dist);
    }
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Glass Highlight`,type:`color`,default:[.8,.9,1,.5]},{id:`u_secondary_color`,name:`Shard Depth`,type:`color`,default:[.1,.2,.4,.8]}]},wr=e({default:()=>Tr}),Tr={id:`glitch_interference_artisan`,name:`Signal Glitch`,category:`Abstract`,added:`2026-04-16`,description:`Chaotic horizontal interference and data-stream glitch patterns.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float x = v_uv.x + hash(y);
      float mask = step(0.5, fract(x * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Signal Peak`,type:`color`,default:[0,1,0,1]},{id:`u_secondary_color`,name:`Static Floor`,type:`color`,default:[0,.05,0,1]}]},Er=e({default:()=>Dr}),Dr={id:`glitch_text_logic_artisan`,name:`Logic Glitch`,category:`Abstract`,added:`2026-04-16`,description:`Abstract blocks of logic-like symbols and corrupted data stream visualizations.`,shader:`
    vec4 generate() {
      vec2 uv = floor(v_uv * 40.0);
      float n = hash(uv);
      float mask = step(0.7, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Bit Glow`,type:`color`,default:[0,1,.8,1]},{id:`u_secondary_color`,name:`Buffer Black`,type:`color`,default:[0,.01,0,1]}]},Or=e({default:()=>kr}),kr={id:`gold_leaf_artisan`,name:`Gold Leaf`,category:`Abstract`,added:`2026-04-15`,description:`Irregular metallic foil noise and gold leaf textures for premium accents.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 100.0) * hash(v_uv * 10.0);
      float mask = smoothstep(0.1, 0.3, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Gilded`,type:`color`,default:[1,.8,.3,1]},{id:`u_secondary_color`,name:`Underneath`,type:`color`,default:[.2,.1,0,1]}]},Ar=e({default:()=>jr}),jr={id:`gold_leaf_flake_artisan`,name:`Gold Flake`,category:`Abstract`,added:`2026-04-16`,description:`Thin, irregular metallic foil fragments and gold leaf flakes mimicking luxurious textured finishes.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.95, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flake Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Gold Leaf`,type:`color`,default:[1,.8,.2,1]},{id:`u_secondary_color`,name:`Base Resin`,type:`color`,default:[.1,.1,.1,1]}]},Mr=e({default:()=>Nr}),Nr={id:`gothic_filigree_artisan`,name:`Gothic Filigree`,category:`Abstract`,added:`2026-04-15`,description:`Intricate iron-like symmetrical swirls and ornate architectural blackwork.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = sin(uv.x * 10.0 + sin(uv.y * 10.0));
      float mask = smoothstep(0.1, 0.0, abs(d - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Detail Zoom`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Iron`,type:`color`,default:[.1,.1,.15,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.9,.85,.8,1]}]},Pr=e({default:()=>Fr}),Fr={id:`granite_speckle_natural`,name:`Granite Speckle`,category:`Natural`,added:`2026-05-01`,description:`Classic grey granite with randomly scattered feldspar, quartz, biotite mica, and hornblende mineral grains.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash12(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Voronoi-style nearest-point distance + cell ID
    vec2 voronoi(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      float minDist = 8.0;
      float cellID  = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2  neighbor = vec2(float(x), float(y));
          vec2  point    = vec2(hash21(i + neighbor), hash21(i + neighbor + vec2(53.1, 97.3)));
          float d        = length(f - neighbor - point);
          if (d < minDist) {
            minDist = d;
            cellID  = hash21(i + neighbor + vec2(7.3, 13.7));
          }
        }
      }
      return vec2(minDist, cellID);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 vor = voronoi(uv);
      float dist   = vor.x;
      float cellID = vor.y;

      // Assign mineral type by cell ID ranges
      // 0.00–0.45 → feldspar/quartz (light)
      // 0.45–0.75 → matrix grey
      // 0.75–0.88 → biotite mica (dark flake)
      // 0.88–1.00 → hornblende (black)

      float grainSize = 0.3 + hash12(cellID) * 0.25;  // vary grain radius
      float inGrain   = 1.0 - smoothstep(grainSize * 0.5, grainSize, dist);

      vec3 matrixCol = mix(u_light_mineral.rgb * 0.55, u_dark_mineral.rgb * 4.0, 0.35);

      vec3 mineralCol;
      if (cellID < 0.45) {
        // Feldspar / quartz — light, slight warm cream tint
        float warmShift = hash12(cellID + 0.1) * 0.08;
        mineralCol = u_light_mineral.rgb + vec3(warmShift, warmShift * 0.6, -warmShift * 0.3);
      } else if (cellID < 0.75) {
        // Mid-grey matrix quartz
        float g = 0.42 + hash12(cellID + 0.5) * 0.18;
        mineralCol = vec3(g);
      } else if (cellID < 0.88) {
        // Biotite mica — dark brownish black with slight sheen
        mineralCol = mix(u_dark_mineral.rgb, vec3(0.18, 0.14, 0.10), hash12(cellID + 0.9));
      } else {
        // Hornblende — near black
        mineralCol = u_dark_mineral.rgb;
      }

      vec3 col = mix(matrixCol, mineralCol, inGrain);

      // Fine background speckle noise for matrix texture
      float micro = hash21(v_uv * u_scale * 6.0) * 0.06 - 0.03;
      col += micro;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:2,max:20,default:8},{id:`u_light_mineral`,name:`Light Mineral`,type:`color`,default:[.9,.88,.85,1]},{id:`u_dark_mineral`,name:`Dark Mineral`,type:`color`,default:[.08,.08,.09,1]}]},Ir=e({default:()=>Lr}),Lr={id:`graphene_nanotubes_artisan`,name:`Graphene Nanotubes`,category:`Industrial`,added:`2026-05-13`,description:`Hexagonal carbon lattices at a molecular scale with metallic glowing points.`,shader:`
    // Hexagonal grid function
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1.0, 1.732)));
      return max(c, p.x);
    }
    vec4 hexGrid(vec2 uv) {
      vec2 r = vec2(1.0, 1.732);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      vec2 gv = dot(a, a) < dot(b,b) ? a : b;
      float d = hexDist(gv);
      // Edge
      float edge = smoothstep(0.4, 0.45, d) - smoothstep(0.45, 0.5, d);
      // Vertices (points)
      float points = smoothstep(0.15, 0.05, length(gv - vec2(0.0, 0.577))) + 
                     smoothstep(0.15, 0.05, length(gv - vec2(0.5, 0.288))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(0.5, -0.288))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(0.0, -0.577))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(-0.5, -0.288))) +
                     smoothstep(0.15, 0.05, length(gv - vec2(-0.5, 0.288)));
      return vec4(edge, points, 0.0, 0.0);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 hex = hexGrid(uv);
      vec4 baseColor = mix(u_bg_color, u_line_color, hex.x);
      return mix(baseColor, u_glow_color, hex.y);
    }
  `,uniforms:[{id:`u_scale`,name:`Lattice Scale`,type:`float`,min:2,max:40,default:15},{id:`u_bg_color`,name:`Background`,type:`color`,default:[.05,.05,.05,1]},{id:`u_line_color`,name:`Bond Lines`,type:`color`,default:[.3,.3,.35,1]},{id:`u_glow_color`,name:`Node Glow`,type:`color`,default:[0,.8,1,1]}]},Rr=e({default:()=>zr}),zr={id:`gravel_trap_artisan`,name:`Gravel Trap`,category:`Racing`,added:`2026-04-15`,description:`Irregular sharp cellular noise mimicking track-side runoff gravel.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv * (0.5 + hash(floor(uv)) * 0.5));
      float mask = smoothstep(0.4, 0.3, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stone Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Gravel`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Dust`,type:`color`,default:[.3,.3,.32,1]}]},Br=e({default:()=>Vr}),Vr={id:`greek_key_artisan`,name:`Greek Key`,category:`Abstract`,added:`2026-04-15`,description:`Classic ancient geometric meander border patterns found in historic architecture.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale);
      float mask = step(0.1, uv.x) * step(uv.x, 0.9) * step(0.1, uv.y) * step(uv.y, 0.9);
      mask -= step(0.3, uv.x) * step(uv.x, 0.7) * step(0.3, uv.y) * step(uv.y, 0.7);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Key Rows`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Meander`,type:`color`,default:[.8,.7,.3,1]},{id:`u_secondary_color`,name:`Plinth`,type:`color`,default:[.1,.1,.1,1]}]},Hr=e({default:()=>Ur}),Ur={id:`halftone_dots_artisan`,name:`CMYK Halftone`,category:`Abstract`,added:`2026-04-16`,description:`Professional offset color dots and halftone patterns used in high-end graphic design.`,shader:`
    vec4 generate() {
      float a = u_angle * 0.01745329;
      vec2 p = v_uv - 0.5;
      p = mat2(cos(a), -sin(a), sin(a), cos(a)) * p;
      vec2 uv = (p + 0.5) * u_scale;

      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);

      // Optional print-style tonal fade across the sheet
      float r = u_dot_size * mix(1.0, 1.0 - v_uv.y * 0.85, u_fade);
      float s = max(u_softness, 0.003);
      float mask = smoothstep(r + s, r - s, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[0,1,1,1],u_secondary_color:[1,1,1,1],u_dot_size:.4,u_angle:0,u_fade:0}},{name:`Comic Pop`,uniforms:{u_primary_color:[.95,.1,.5,1],u_secondary_color:[1,.92,.3,1],u_dot_size:.35,u_angle:45,u_fade:.5}},{name:`Newsprint`,uniforms:{u_primary_color:[.08,.08,.08,1],u_secondary_color:[.94,.92,.87,1],u_dot_size:.3,u_angle:22,u_fade:0}},{name:`Neon Fade`,uniforms:{u_primary_color:[.1,1,.5,1],u_secondary_color:[.02,.02,.05,1],u_dot_size:.42,u_angle:30,u_fade:.8}}],uniforms:[{id:`u_scale`,name:`Dot Density`,type:`float`,min:10,max:100,default:50},{id:`u_dot_size`,name:`Dot Size`,type:`float`,min:.05,max:.7,default:.4},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.3,default:.01},{id:`u_angle`,name:`Screen Angle`,type:`float`,min:0,max:90,default:0},{id:`u_fade`,name:`Tonal Fade`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Ink Dot`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[1,1,1,1]}]},Wr=e({default:()=>Gr}),Gr={id:`halftone_pop_artisan`,name:`Halftone Pop-Art`,category:`Abstract`,added:`2026-04-15`,description:`Classic CMYK-style dot matrix textures found in pop-art and comic books.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float intensity = sin(v_uv.x * 5.0) * 0.5 + 0.5;
      float d = length(gv);
      float mask = smoothstep(intensity * 0.5, intensity * 0.45, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Dot Color`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Paper Base`,type:`color`,default:[1,1,.95,1]}]},Kr=e({default:()=>qr}),qr={id:`hammered_copper_artisan`,name:`Hammered Copper`,category:`Industrial`,added:`2026-04-15`,description:`Indented, concave specular surfaces found in artisanal hammered metalwork.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, 1.0 - m_dist);
    }
  `,uniforms:[{id:`u_scale`,name:`Dents`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rim Shine`,type:`color`,default:[.9,.6,.4,1]},{id:`u_secondary_color`,name:`Copper Deep`,type:`color`,default:[.4,.2,.1,1]}]},Jr=e({default:()=>Yr}),Yr={id:`harlequin_diamond`,name:`Harlequin Diamond`,category:`Geometric`,added:`2026-04-15`,description:`Classic high-contrast diagonal diamond pattern.`,shader:`
    vec4 generate() {
      float a = u_angle * 0.01745329;
      mat2 rot = mat2(cos(a), -sin(a), sin(a), cos(a));
      vec2 uv = rot * (v_uv - 0.5) * u_scale;
      uv.y *= u_aspect;

      // Anti-aliased checker via soft-XOR of triangle waves
      float s = max(u_softness, 0.0005);
      float tx = abs(fract((uv.x + 0.5) * 0.5) * 2.0 - 1.0);
      float ty = abs(fract((uv.y + 0.5) * 0.5) * 2.0 - 1.0);
      float mx = smoothstep(0.5 - s, 0.5 + s, tx);
      float my = smoothstep(0.5 - s, 0.5 + s, ty);
      float mask = mx + my - 2.0 * mx * my;

      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Optional diamond outline
      vec2 gv = abs(fract(uv) - 0.5);
      float line = smoothstep(0.44 - s, 0.44 + s, max(gv.x, gv.y)) * u_outline;
      color = mix(color, u_accent_color, line);

      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,.1,.1,1],u_secondary_color:[.1,.1,.1,1],u_accent_color:[.95,.85,.4,1],u_angle:45,u_aspect:1,u_outline:0}},{name:`Jester`,uniforms:{u_primary_color:[.5,.12,.6,1],u_secondary_color:[.08,.08,.1,1],u_accent_color:[.95,.78,.2,1],u_angle:45,u_aspect:1.4,u_outline:.9}},{name:`Carnival`,uniforms:{u_primary_color:[.85,.1,.15,1],u_secondary_color:[.95,.92,.85,1],u_accent_color:[.95,.85,.4,1],u_angle:45,u_aspect:1,u_outline:0}},{name:`Ivory Lattice`,uniforms:{u_primary_color:[.92,.9,.85,1],u_secondary_color:[.85,.82,.75,1],u_accent_color:[.4,.3,.2,1],u_angle:45,u_aspect:1.8,u_outline:1}}],uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:50,default:12},{id:`u_angle`,name:`Rotation`,type:`float`,min:0,max:90,default:45},{id:`u_aspect`,name:`Diamond Stretch`,type:`float`,min:.4,max:2.5,default:1},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.008},{id:`u_outline`,name:`Outline Strength`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Color A`,type:`color`,default:[1,.1,.1,1]},{id:`u_secondary_color`,name:`Color B`,type:`color`,default:[.1,.1,.1,1]},{id:`u_accent_color`,name:`Outline`,type:`color`,default:[.95,.85,.4,1]}]},Xr=e({default:()=>Zr}),Zr={id:`headliner_mesh_artisan`,name:`Headliner Mesh`,category:`Racing`,added:`2026-04-16`,description:`Breathable ceiling textile with hexagonal micro-pores found in modern automotive interiors.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pore Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Textile Surface`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Pore Shade`,type:`color`,default:[.05,.05,.1,1]}]},Qr=e({default:()=>$r}),$r={id:`heat_blued_titanium`,name:`Heat-Blued Titanium`,category:`Industrial`,added:`2026-05-13`,description:`Titanium heat-oxidation colour bands — the characteristic silver → straw → gold → purple → blue gradient on exhaust systems and racing hardware.`,shader:`
    float hash_hbt(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_hbt(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_hbt(i), hash_hbt(i+vec2(1,0)), f.x),
                 mix(hash_hbt(i+vec2(0,1)), hash_hbt(i+vec2(1,1)), f.x), f.y);
    }

    // Cascade of mix() — GPU-friendly colour ramp, no branching
    vec3 titaniumRamp(float t) {
      vec3 c0 = vec3(0.78, 0.76, 0.74); // cool silver
      vec3 c1 = vec3(0.90, 0.80, 0.48); // straw
      vec3 c2 = vec3(0.84, 0.60, 0.18); // gold
      vec3 c3 = vec3(0.58, 0.28, 0.68); // purple
      vec3 c4 = vec3(0.22, 0.38, 0.82); // blue
      vec3 c5 = vec3(0.46, 0.54, 0.72); // grey-blue (very hot)
      float s = t * 5.0;
      vec3 col = mix(c0, c1, clamp(s,       0.0, 1.0));
      col      = mix(col, c2, clamp(s-1.0,  0.0, 1.0));
      col      = mix(col, c3, clamp(s-2.0,  0.0, 1.0));
      col      = mix(col, c4, clamp(s-3.0,  0.0, 1.0));
      col      = mix(col, c5, clamp(s-4.0,  0.0, 1.0));
      return col;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Primary heat gradient along chosen axis
      float primary = mix(uv.x, 1.0 - uv.y, u_direction);

      // Organic turbulence for natural heat-flow shape
      float turb = noise_hbt(uv * 2.8) * 0.3 + noise_hbt(uv * 6.5) * 0.12;
      turb /= 0.42;

      float t = clamp(primary * u_spread + (turb - 0.5) * 0.25 + u_heat_bias, 0.0, 1.0);

      vec3 col = titaniumRamp(t);

      // Directional brushed grain (fine horizontal lines like turned/polished titanium)
      float grainAxis = mix(uv.x, uv.y, u_direction);
      float grain = noise_hbt(vec2(grainAxis * 180.0, uv.y * 1.5)) * 0.045;
      col += vec3(grain);

      // Subtle specular sheen
      float sheen = pow(max(0.0, 1.0 - abs(primary - 0.5) * 2.5), 5.0) * 0.12;
      col += vec3(sheen);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_heat_bias`,name:`Heat Level`,type:`float`,default:.4,min:0,max:1},{id:`u_spread`,name:`Band Spread`,type:`float`,default:.85,min:.2,max:1.5},{id:`u_direction`,name:`Direction`,type:`float`,default:0,min:0,max:1}]},ei=e({default:()=>ti}),ti={id:`herringbone_weave_pro`,name:`Herringbone`,category:`Geometric`,added:`2026-04-15`,description:`Pro-grade chevron-style herringbone weave pattern.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.x), 2.0) == 0.0) uv.y += 0.5;
      vec2 gv = fract(uv);

      float s = max(u_softness, 0.0005);
      float mask = smoothstep(u_balance - s, u_balance + s, abs(gv.x - gv.y));
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Optional fibrous grain along the weave
      float grain = (noise(uv * 14.0) - 0.5) * u_grain;
      color.rgb += grain;

      if (u_is_spec > 0.5) return vec4(0.0, 0.0, 0.0, 1.0);
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.1,.1,.1,1],u_secondary_color:[.05,.05,.05,1],u_balance:.5,u_grain:0}},{name:`Grey Tweed`,uniforms:{u_primary_color:[.55,.53,.5,1],u_secondary_color:[.32,.3,.28,1],u_balance:.5,u_grain:.18}},{name:`Oak Parquet`,uniforms:{u_primary_color:[.55,.38,.22,1],u_secondary_color:[.4,.26,.14,1],u_scale:12,u_balance:.5,u_grain:.22}},{name:`Racing Green`,uniforms:{u_primary_color:[.04,.25,.14,1],u_secondary_color:[.02,.12,.07,1],u_balance:.45,u_grain:.08}}],uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:2,max:100,default:20},{id:`u_balance`,name:`Chevron Balance`,type:`float`,min:.2,max:.8,default:.5},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.005},{id:`u_grain`,name:`Fiber Grain`,type:`float`,min:0,max:.4,default:0},{id:`u_primary_color`,name:`Primary Weave`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Secondary Weave`,type:`color`,default:[.05,.05,.05,1]}]},ni=e({default:()=>ri}),ri={id:`hex_basalt_natural`,name:`Hex Basalt`,category:`Natural`,added:`2026-05-01`,description:`Hexagonal columnar basalt cross-sections like the Giants Causeway, with dark joints and per-column tonal variation.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    // Classic 3-check hex grid.
    // Returns (nearest hex center, distance to nearest edge)
    vec3 hexGrid(vec2 uv) {
      // Skewed axial coordinates
      vec2 q = vec2(uv.x - uv.y * 0.57735, uv.y * 1.1547);
      vec2 pi = floor(q);
      vec2 pf = fract(q);

      float v = mod(pi.x + pi.y, 3.0);

      float ca = step(1.0, v);
      float cb = step(2.0, v);

      vec2 ma = step(pf, pf.yx);  // for edge detection

      // Three candidate hex centres
      vec2 p0 = pi + vec2(0.0, 0.0);
      vec2 p1 = pi + vec2(1.0, 0.0);
      vec2 p2 = pi + vec2(0.0, 1.0);

      // Distance in original space
      float d0 = length(uv - (p0 * vec2(1.0, 0.8660) + p0.y * vec2(0.5, 0.0)));
      float d1 = length(uv - (p1 * vec2(1.0, 0.8660) + p1.y * vec2(0.5, 0.0)));
      float d2 = length(uv - (p2 * vec2(1.0, 0.8660) + p2.y * vec2(0.5, 0.0)));

      // Use a simpler, robust hex distance approach instead
      // Convert to axial hex, round to nearest hex, compute distance
      vec2 ax = vec2(uv.x * 1.1547, uv.y + uv.x * 0.57735);
      vec2 r  = floor(ax + 0.5);
      vec2 f2 = ax - r;
      // Correct rounding for hex
      float s = sign(f2.x + f2.y);
      float mx = s * max(abs(f2.x), abs(f2.y)) > 0.5 ? 1.0 : 0.0;
      if (abs(f2.x) > abs(f2.y)) {
        r.x += s * mx;
      } else {
        r.y += s * mx;
      }

      float cellID = hash21(r);

      // Distance from hex center (in axial space, then back to world)
      vec2 hexCenter = vec2(r.x - r.y * 0.5, r.y * 0.8660);
      float dist = length(uv - hexCenter);

      return vec3(dist, cellID, length(f2));
    }

    vec4 generate() {
      vec2 uv  = v_uv * u_scale;
      vec3 hex = hexGrid(uv);

      float dist   = hex.x;
      float cellID = hex.y;

      // Hex "radius" in world units
      float hexR = 0.5 / u_scale;  // approx half-width of one column

      // Per-column grey tone variation
      float colTone = 0.85 + (hash21(vec2(cellID, 0.3)) - 0.5) * 0.22;
      vec3  rockCol = u_rock_color.rgb * colTone;

      // Raised edge: a subtle lighter rim just inside the joint
      float normDist = dist / (0.57 / u_scale);  // normalise to ~0..1
      float rimMask  = smoothstep(0.70, 0.84, normDist) * (1.0 - smoothstep(0.84, 0.92, normDist));
      rockCol = mix(rockCol, rockCol * 1.18, rimMask);

      // Dark joint between columns
      float jointWidth = u_joint_width;
      float jointMask  = smoothstep(0.88 - jointWidth, 0.92, normDist);
      rockCol = mix(rockCol, vec3(0.04, 0.04, 0.04), jointMask);

      return vec4(clamp(rockCol, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Column Density`,type:`float`,min:2,max:16,default:7},{id:`u_rock_color`,name:`Basalt Color`,type:`color`,default:[.38,.38,.36,1]},{id:`u_joint_width`,name:`Joint Width`,type:`float`,min:.01,max:.1,default:.04}]},ii=e({default:()=>ai}),ai={id:`hex_fade`,name:`Hex Fade`,category:`Geometric`,added:`2026-06-11`,description:`The signature modern GT livery motif: a crisp honeycomb hexagon grid that shrinks and dissolves to nothing along a controllable fade direction with dithered per-cell dropout.`,shader:`

    // Signed-ish distance to a hexagon edge in cell space (edge sits at 0.5)
    float hexEdge(vec2 p) {
      p = abs(p);
      return max(dot(p, vec2(0.5, 0.8660254)), p.x);
    }

    vec4 generate() {
      float angRad = radians(u_fade_angle);
      vec2 fadeDir = vec2(cos(angRad), sin(angRad));

      // Standard interleaved hex grid lookup
      vec2 uv = v_uv * u_scale;
      vec2 rep = vec2(1.0, 1.7320508);
      vec2 halfRep = rep * 0.5;
      vec2 a = mod(uv, rep) - halfRep;
      vec2 b = mod(uv - halfRep, rep) - halfRep;
      vec2 gv = (dot(a, a) < dot(b, b)) ? a : b;
      vec2 id = uv - gv;

      // Fade progress measured at the cell centre so whole cells act together
      float prog = dot(id / u_scale - 0.5, fadeDir) + 0.5;
      float t = clamp((prog - u_fade_start) / max(u_fade_length, 0.001), 0.0, 1.0);

      // Per-cell dropout threshold -> dithered dissolve instead of a hard wipe
      float cellHash = hash(id * 0.731 + 17.13);
      float alive = step(t, cellHash * 0.999);

      // Cells shrink as the fade approaches their personal dropout point
      float local = clamp(t / max(cellHash, 0.0001), 0.0, 1.0);
      float radius = (0.5 - u_border * 0.5) * (1.0 - local * 0.9);

      float d = hexEdge(gv);
      float hexMask = smoothstep(radius, radius - 0.035, d) * alive;

      vec4 color = mix(u_color_bg, u_color_hex, hexMask);
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Carbon Fade`,uniforms:{u_color_hex:[.16,.17,.19,1],u_color_bg:[.05,.05,.06,1]}},{name:`Victory Red`,uniforms:{u_color_hex:[.82,.07,.1,1],u_color_bg:[.96,.96,.96,1]}},{name:`Electric Blue`,uniforms:{u_color_hex:[.05,.55,1,1],u_color_bg:[.02,.04,.1,1]}},{name:`Stealth`,uniforms:{u_color_hex:[.1,.1,.11,1],u_color_bg:[.2,.21,.23,1]}}],uniforms:[{id:`u_scale`,name:`Hex Scale`,type:`float`,min:4,max:40,default:14},{id:`u_fade_angle`,name:`Fade Angle (deg)`,type:`float`,min:0,max:360,default:0},{id:`u_fade_start`,name:`Fade Start`,type:`float`,min:0,max:1,default:.2},{id:`u_fade_length`,name:`Fade Length`,type:`float`,min:.05,max:1,default:.6},{id:`u_border`,name:`Hex Border`,type:`float`,min:0,max:.3,default:.08},{id:`u_color_hex`,name:`Hex Color`,type:`color`,default:[.16,.17,.19,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.05,.05,.06,1]}]},oi=e({default:()=>si}),si={id:`hex_mesh_pro`,name:`Aerodynamic Hex`,category:`Technology`,added:`2026-04-15`,description:`Technical high-airflow hexagonal mesh grid.`,shader:`
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1.0, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec4 generate() {
      vec2 r = vec2(1.0, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;

      float hd = hexDist(gv);
      float s = max(u_softness, 0.0005);
      float mask = smoothstep(u_inset + s, u_inset - s, hd);
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Optional bevel shading toward each cell border
      float bevel = smoothstep(u_inset - 0.12, u_inset, hd) * mask * u_bevel;
      color.rgb = mix(color.rgb, color.rgb * 0.55, bevel);
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.35,.35,.4,1],u_secondary_color:[.02,.02,.02,1],u_inset:.43,u_bevel:0}},{name:`Stealth Mesh`,uniforms:{u_primary_color:[.08,.08,.09,1],u_secondary_color:[0,0,0,1],u_inset:.43,u_bevel:.5}},{name:`Radiator Brass`,uniforms:{u_primary_color:[.72,.55,.25,1],u_secondary_color:[.06,.04,.02,1],u_inset:.4,u_bevel:.6}},{name:`Tron Grid`,uniforms:{u_primary_color:[.04,.05,.07,1],u_secondary_color:[.1,.9,1,1],u_inset:.45,u_bevel:0}}],uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:10,max:100,default:40},{id:`u_inset`,name:`Cell Size`,type:`float`,min:.2,max:.49,default:.43},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.08,default:.008},{id:`u_bevel`,name:`Bevel Shading`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Mesh`,type:`color`,default:[.35,.35,.4,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.02,.02,.02,1]}]},ci=e({default:()=>li}),li={id:`holographic_foil_artisan`,name:`Holographic Foil`,category:`Abstract`,added:`2026-05-13`,description:`Multi-layered, shifting prismatic gradients reminiscent of rare trading cards.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Base spectral gradient shifting with view angle/uv.y
        float angle = v_uv.y + u_shift * 0.1;
        float spectrum = fract(angle * 3.0);
        
        vec3 col;
        col.r = abs(spectrum * 6.0 - 3.0) - 1.0;
        col.g = 2.0 - abs(spectrum * 6.0 - 2.0);
        col.b = 2.0 - abs(spectrum * 6.0 - 4.0);
        col = clamp(col, 0.0, 1.0);
        
        // Overlay geometric patterns (hex or diamond)
        vec2 p = abs(fract(uv) - 0.5);
        float d = max(p.x + p.y * 0.57735, p.y); // hex distance
        float pattern = smoothstep(0.4, 0.5, d) - smoothstep(0.5, 0.6, d);
        
        // Combine foil spectrum with pattern reflection
        vec4 baseFoil = vec4(col, 1.0) * u_foil_intensity;
        
        // Prismatic scatter noise
        float scatter = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
        
        return baseFoil + pattern * scatter * u_pattern_brightness;
    }
  `,uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:5,max:50,default:20},{id:`u_foil_intensity`,name:`Spectral Saturation`,type:`float`,min:0,max:2,default:1},{id:`u_pattern_brightness`,name:`Foil Glint`,type:`float`,min:0,max:2,default:1.2},{id:`u_shift`,name:`Angle Shift`,type:`float`,min:0,max:10,default:0}]},ui=e({default:()=>di}),di={id:`holographic_glitch_artisan`,name:`Hologlitch`,category:`Abstract`,added:`2026-04-16`,description:`Chromatic offset stripes and holographic artifacts mimicking digital interference.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 40.0);
      float offset = hash(y);
      float r = step(0.5, fract(v_uv.x * 10.0 + offset));
      return mix(u_secondary_color, u_primary_color, r);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Cyan Beam`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Magenta Blur`,type:`color`,default:[1,0,1,1]}]},fi=e({default:()=>pi}),pi={id:`honeycomb_bio`,name:`HoneyComb Bio`,category:`Natural`,added:`2026-04-15`,description:`Precise hexagonal organic cell wall structure.`,shader:`
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1, 1.73)));
      c = max(c, p.x);
      return c;
    }
    vec4 generate() {
      vec2 r = vec2(1, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(v_uv * u_scale, r) - h;
      vec2 b = mod(v_uv * u_scale - h, r) - h;
      vec2 gv = dot(a, a) < dot(b, b) ? a : b;
      
      float d = hexDist(gv);
      float mask = smoothstep(0.4, 0.45, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Count`,type:`float`,min:2,max:40,default:12},{id:`u_primary_color`,name:`Honey Fill`,type:`color`,default:[1,.7,0,1]},{id:`u_secondary_color`,name:`Wax Wall`,type:`color`,default:[.2,.1,0,1]}]},mi=e({default:()=>hi}),hi={id:`honeycomb_metal`,name:`Honeycomb Metal`,category:`Industrial`,added:`2026-05-01`,description:`Aerospace aluminium honeycomb panel â€” machine-perfect hexagonal cells with bright thin walls and deep dark interiors.`,shader:`
    // Perfect hexagonal grid SDF
    // Returns: x = dist to hex centre, y = dist to nearest wall
    vec2 hexGrid(vec2 uv) {
      // Axial hex coordinates
      const vec2 s = vec2(1.0, 1.7320508); // 1, sqrt(3)

      vec2 p  = uv;
      vec4 hC = floor(vec4(p, p - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
      vec4 h  = vec4(p - hC.xy * s, p - (hC.zw + 0.5) * s);

      // Pick closer centre
      return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw;
    }

    // Hexagon SDF (regular, circumradius 1)
    float hexSDF(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x) - 1.0;
    }

    vec4 generate() {
      float scale     = u_scale;
      vec3  wallCol   = u_wall_color.rgb;
      float cellDepth = u_cell_depth;

      vec2 uv = v_uv * scale;

      // Hex cell local coordinates
      vec2 local = hexGrid(uv);

      // Inner hexagon radius (cell interior)
      float wallThickness = 0.06;
      float hexR = 1.0 - wallThickness * 2.2; // circumradius of inner hex

      // SDF inside the hex cell (positive = inside cell, negative = in wall)
      // local is relative to hex centre, hex circumradius ~ 0.577 in this grid
      float cellRadius  = 0.555;
      float innerRadius = cellRadius - wallThickness;

      float distToEdge  = cellRadius - length(local) * (1.0 / 0.577); // approx
      // More accurate: use hex SDF
      vec2 pl = local / cellRadius;
      float hexd = hexSDF(pl * vec2(1.0, 0.5773503));  // normalised hex
      // hexd < 0 = inside hex cell, > 0 = outside

      float insideCell = step(hexd, -wallThickness / cellRadius);
      float inWall     = 1.0 - insideCell;

      // Wall lighting â€” simulate thin aluminium wall under oblique light
      // Brightest on the wall face closest to light (upper-right)
      vec2  lightDir2D = normalize(vec2(0.7, 0.9));
      float wallFacing = clamp(dot(normalize(local), lightDir2D), 0.0, 1.0);

      // Wall colour â€” bright aluminium with directional specular
      float wallBright  = 0.55 + wallFacing * 0.45;
      float wallSpec    = pow(wallFacing, 12.0) * 0.4;
      vec3  wallShaded  = wallCol * wallBright + wallSpec;

      // Cell interior â€” dark (depth), with slight concentric shading toward centre
      float cellInterior = 1.0 - smoothstep(0.0, 0.8, -hexd / (cellRadius * 0.6));
      vec3  cellCol      = wallCol * (1.0 - cellDepth * 0.92) * (0.04 + cellInterior * 0.06);

      // Chamfer highlight â€” very thin bright line right at the hex wall edge
      float edgeDist   = abs(hexd + wallThickness / cellRadius);
      float edgeHighlight = smoothstep(0.04, 0.0, edgeDist) * 0.6;

      vec3 col = mix(cellCol, wallShaded, inWall);
      col += edgeHighlight * wallCol;
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_scale`,type:`float`,default:14,min:4,max:30,name:`Cell Scale`},{id:`u_wall_color`,type:`color`,default:[.78,.8,.82,1],name:`Wall Colour`},{id:`u_cell_depth`,type:`float`,default:.85,min:.2,max:1,name:`Cell Depth`}]},gi=e({default:()=>_i}),_i={id:`hotrod_flames`,name:`Hot Rod Flames`,category:`Racing`,added:`2026-06-11`,description:`Classic hot rod flame licks streaming left to right: fbm-warped tongues that taper and curl, layered outer, mid and hot-core colours for the traditional outlined look.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv;

      // Lick coordinate: horizontal bands of flame tongues
      float lick = uv.y * u_scale;

      // Domain warp — turbulence grows along x so the tips curl and break up
      float w1 = fbm(vec2(uv.x * 2.2 / max(u_stretch, 0.1) - 3.0, lick * 0.8)) * u_turbulence;
      float w2 = fbm(vec2(uv.x * 4.6 / max(u_stretch, 0.1) + 11.0, lick * 1.6)) * u_turbulence * 0.5;
      float y = lick + (w1 + w2) * (0.35 + uv.x * 1.6);

      float bands = abs(fract(y) - 0.5) * 2.0; // 0 at lick centreline
      float head = 1.0 - clamp(uv.x / max(u_length, 0.05), 0.0, 1.0);

      // Solid at the root, only the band centrelines survive toward the tail
      float field = head * 1.15 - bands * 0.6;

      // Offset thresholds give the classic outlined three-layer flame
      float outer = smoothstep(0.0, 0.015, field);
      float mid = smoothstep(0.16, 0.175, field + w2 * 0.2);
      float core = smoothstep(0.34, 0.355, field - w1 * 0.1);

      vec4 color = u_color_bg;
      color = mix(color, u_color_outer, outer);
      color = mix(color, u_color_mid, mid);
      color = mix(color, u_color_core, core);
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Classic Orange`,uniforms:{u_color_outer:[.75,.05,.02,1],u_color_mid:[1,.45,.02,1],u_color_core:[1,.9,.25,1],u_color_bg:[.03,.03,.04,1]}},{name:`Blue Flame`,uniforms:{u_color_outer:[.05,.1,.45,1],u_color_mid:[.1,.45,.95,1],u_color_core:[.8,.95,1,1],u_color_bg:[.02,.02,.05,1]}},{name:`Green Envy`,uniforms:{u_color_outer:[.04,.3,.06,1],u_color_mid:[.2,.8,.1,1],u_color_core:[.85,1,.4,1],u_color_bg:[.02,.04,.02,1]}},{name:`Purple Haze`,uniforms:{u_color_outer:[.28,.04,.45,1],u_color_mid:[.65,.2,.95,1],u_color_core:[.95,.75,1,1],u_color_bg:[.04,.02,.06,1]}}],uniforms:[{id:`u_scale`,name:`Flame Scale`,type:`float`,min:2,max:12,default:5},{id:`u_length`,name:`Lick Length`,type:`float`,min:.3,max:1.5,default:.95},{id:`u_stretch`,name:`Lick Stretch`,type:`float`,min:.4,max:3,default:1.2},{id:`u_turbulence`,name:`Turbulence`,type:`float`,min:0,max:1.5,default:.6},{id:`u_color_outer`,name:`Outer Flame`,type:`color`,default:[.75,.05,.02,1]},{id:`u_color_mid`,name:`Mid Flame`,type:`color`,default:[1,.45,.02,1]},{id:`u_color_core`,name:`Hot Core`,type:`color`,default:[1,.9,.25,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.03,.03,.04,1]}]},vi=e({default:()=>yi}),yi={id:`houndstooth`,name:`Houndstooth`,category:`Geometric`,added:`2026-04-15`,description:`Pro-grade textile pattern for classic racing interiors.`,shader:`
    float ht_edge(float edge, float x, float s) {
      return smoothstep(edge - s, edge + s, x);
    }
    float houndstooth(vec2 p, float s) {
      vec2 gv = fract(p);
      float mask = (1.0 - ht_edge(0.5, gv.x, s)) * (1.0 - ht_edge(0.5, gv.y, s));
      mask += ht_edge(0.5, gv.x, s) * ht_edge(0.5, gv.y, s);
      float diag = 1.0 - ht_edge(0.5, gv.x + gv.y, s);
      float diag2 = ht_edge(1.5, gv.x + gv.y, s);
      return abs(mask - (diag + diag2));
    }
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = (p + 0.5) * u_scale;

      float s = max(u_softness, 0.0005);
      float mask = houndstooth(uv, s);
      vec4 color = mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));

      // Optional woven thread texture
      float weave = sin(uv.x * 60.0) * sin(uv.y * 60.0) * 0.5 + 0.5;
      color.rgb = mix(color.rgb, color.rgb * (0.85 + weave * 0.3), u_weave);
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,1,1,1],u_secondary_color:[.05,.05,.05,1],u_rotate:0,u_weave:0}},{name:`Camel Coat`,uniforms:{u_primary_color:[.82,.66,.45,1],u_secondary_color:[.25,.16,.1,1],u_rotate:0,u_weave:.5}},{name:`Grey Tweed`,uniforms:{u_primary_color:[.75,.75,.78,1],u_secondary_color:[.12,.12,.14,1],u_rotate:0,u_weave:.35}},{name:`Speed Punch`,uniforms:{u_primary_color:[.95,.25,.1,1],u_secondary_color:[.05,.05,.06,1],u_rotate:45,u_weave:0}}],uniforms:[{id:`u_scale`,name:`Pattern Size`,type:`float`,min:5,max:100,default:40},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.05,default:.004},{id:`u_rotate`,name:`Rotation`,type:`float`,min:0,max:90,default:0},{id:`u_weave`,name:`Thread Texture`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Primary Thread`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Secondary Thread`,type:`color`,default:[.05,.05,.05,1]}]},bi=e({default:()=>xi}),xi={id:`hunting_camo_forest`,name:`Forest Hunting Camo`,category:`Racing`,added:`2026-04-15`,description:`Pro-grade wilderness camouflage with organic branch and leaf shapes.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv * 1.5);
      float mask1 = step(0.6, n1);
      float n2 = noise(uv * 3.0 + n1 * 0.5);
      float mask2 = step(0.6, n2);
      float n3 = noise(vec2(uv.x * 0.5, uv.y * 4.0));
      float mask3 = step(0.7, n3);
      
      vec4 color = u_color_tan;
      color = mix(color, u_color_green, mask2);
      color = mix(color, u_color_brown, mask1);
      color = mix(color, u_color_dark, mask3);
      
      if (u_is_spec > 0.5) return vec4(0.0, 0.9, 0.0, 1.0);
      return color;
    }
  `,variants:[{name:`Forest (Default)`,uniforms:{u_color_green:[.1,.15,.05,1],u_color_tan:[.5,.45,.3,1],u_color_brown:[.25,.15,.1,1],u_color_dark:[.05,.05,.02,1]}},{name:`Blackout Stealth`,uniforms:{u_color_green:[.06,.06,.07,1],u_color_tan:[.15,.15,.16,1],u_color_brown:[.03,.03,.04,1],u_color_dark:[0,0,0,1]}}],uniforms:[{id:`u_scale`,name:`Detail Density`,type:`float`,min:1,max:10,default:3.5},{id:`u_color_green`,name:`Greenish`,type:`color`,default:[.1,.15,.05,1]},{id:`u_color_tan`,name:`Tan Base`,type:`color`,default:[.5,.45,.3,1]},{id:`u_color_brown`,name:`Brown`,type:`color`,default:[.25,.15,.1,1]},{id:`u_color_dark`,name:`Dark`,type:`color`,default:[.05,.05,.02,1]}]},Si=e({default:()=>Ci}),Ci={id:`hydrothermal_vent`,name:`Hydrothermal Vent`,category:`Ocean`,added:`2026-06-11`,description:`Black smoker chimneys belching turbulent mineral plumes over fissured basalt veined with magma glow.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      // --- basalt seafloor base: near-black, lumpy ---
      float rock = fbm(uv * 6.0) * 0.5 + 0.5;
      float rough = fbm(uv * 22.0) * 0.5 + 0.5;
      vec3 basalt = vec3(0.05, 0.05, 0.06);
      vec3 col = basalt * (0.5 + rock * 0.8) + rough * 0.04;
      // sulfide mineral crusting: dull yellow-grey patches
      float crust = smoothstep(0.62, 0.78, fbm(uv * 4.0 + 17.0) * 0.5 + 0.5);
      col = mix(col, vec3(0.22, 0.19, 0.12), crust * 0.55);

      // --- magma fissures: ridged cracks glowing from below ---
      float vein = 1.0 - abs(snoise(uv * 5.0 + vec2(43.0, 9.0)));
      vein = pow(vein, 8.0);
      float vein2 = 1.0 - abs(snoise(uv * 11.0 + vec2(3.0, 71.0)));
      vein += pow(vein2, 10.0) * 0.5;
      // glow strongest low on the texture, near the vent field
      float depth_gate = 1.0 - uv.y * 0.7;
      vec3 glow = u_glow_color.rgb;
      col += glow * vein * depth_gate * u_glow_amt;
      col += vec3(1.0, 0.85, 0.5) * smoothstep(0.7, 1.2, vein * depth_gate * u_glow_amt) * 0.6;

      // --- smoker plumes: turbulent columns rising from fixed x positions ---
      float smoke = 0.0;
      for (int k = 0; k < 3; k++) {
        float fk = float(k);
        float px = fract(0.18 + fk * 0.34 + hash(vec2(fk, 2.2)) * 0.08);
        // plume meanders and widens as it rises
        float wander = snoise(vec2(fk * 9.1, uv.y * 3.0)) * 0.06 * uv.y
                     + snoise(vec2(fk * 4.7, uv.y * 9.0)) * 0.02;
        float dx = uv.x - px - wander;
        // wrap horizontally so plumes tile
        dx = dx - floor(dx + 0.5);
        float width = (0.015 + uv.y * 0.10 * u_plume_width);
        float core = exp(-dx * dx / (width * width));
        // turbulent billow texture inside the column
        float bil = fbm(vec2(uv.x * 9.0 + fk * 31.0, uv.y * 5.0)) * 0.5 + 0.5;
        bil = mix(0.6, 1.2, bil * u_turbulence);
        // densest just above the chimney mouth, thinning upward
        float rise = smoothstep(0.0, 0.10, uv.y) * (1.0 - uv.y * 0.35);
        smoke += core * bil * rise;
      }
      smoke = clamp(smoke, 0.0, 1.4);
      vec3 smoke_col = vec3(0.16, 0.15, 0.16); // mineral-black smoker water
      col = mix(col, smoke_col, clamp(smoke, 0.0, 1.0) * 0.85);
      // shimmering superheated water at the plume cores
      col += vec3(0.10, 0.12, 0.14) * smoothstep(0.9, 1.4, smoke);

      // chimney silhouettes at the base of each plume
      for (int k = 0; k < 3; k++) {
        float fk = float(k);
        float px = fract(0.18 + fk * 0.34 + hash(vec2(fk, 2.2)) * 0.08);
        float dx = uv.x - px;
        dx = dx - floor(dx + 0.5);
        float chim_h = 0.12 + hash(vec2(fk, 8.8)) * 0.08;
        float chim_w = 0.030 * (1.0 - uv.y / chim_h) + 0.012;
        float chim = step(abs(dx), chim_w) * step(uv.y, chim_h);
        // gnarled chimney surface with glowing mouth rim
        vec3 chim_col = vec3(0.04, 0.035, 0.04) * (0.6 + rough);
        chim_col += glow * smoothstep(chim_h - 0.02, chim_h, uv.y) * 0.8;
        col = mix(col, chim_col, chim);
      }

      // drifting mineral snow
      col += vec3(0.35) * step(0.993, hash(floor(uv * 140.0))) * 0.4;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_plume_width`,name:`Plume Spread`,type:`float`,min:.2,max:2,default:1},{id:`u_turbulence`,name:`Turbulence`,type:`float`,min:.2,max:1.5,default:.9},{id:`u_glow_amt`,name:`Magma Glow`,type:`float`,min:0,max:1.5,default:.7},{id:`u_glow_color`,name:`Glow Color`,type:`color`,default:[1,.35,.05,1]}]},wi=e({default:()=>Ti}),Ti={id:`impasto_paint_artisan`,name:`Impasto Paint`,category:`Abstract`,added:`2026-04-16`,description:`Thick, textured brush strokes and heavy oil paint impasto effects.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Paint Peak`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Canvas Base`,type:`color`,default:[.4,0,0,1]}]},Ei=e({default:()=>Di}),Di={id:`infinite_spiral_pro`,name:`Infinite Spiral`,category:`Abstract`,added:`2026-04-15`,description:`Mathematical spirograph with static interlocking floral loops.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float r = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Removed time from spiral function
      float spiral = sin(r * 10.0 - a * 5.0);
      float mask = smoothstep(0.0, 0.1, abs(spiral) - 0.1);
      
      return mix(u_secondary_color, u_primary_color, 1.0 - mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Spiral Power`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Ink Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[0,0,0,1]}]},Oi=e({default:()=>ki}),ki={id:`ink_blot_test_artisan`,name:`Ink Blot`,category:`Abstract`,added:`2026-04-16`,description:`Symmetrical organic Rorschach blobs mimicking organic ink flow on folded paper.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float n = noise(uv * 5.0 + noise(uv * 10.0));
      float mask = step(0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Ink Body`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[.95,.95,.9,1]}]},Ai=e({default:()=>ji}),ji={id:`interference_rings`,name:`Interference Rings`,category:`Abstract`,added:`2026-05-01`,description:`Newton's rings â€” concentric iridescent interference fringes radiating from a contact point.`,shader:`
    // Convert HSV to RGB (GLSL 1.0 compatible)
    vec3 hsv2rgb(float h, float s, float v) {
      float hh = mod(h * 6.0, 6.0);
      float c  = v * s;
      float x  = c * (1.0 - abs(mod(hh, 2.0) - 1.0));
      vec3 rgb;
      if      (hh < 1.0) rgb = vec3(c, x, 0.0);
      else if (hh < 2.0) rgb = vec3(x, c, 0.0);
      else if (hh < 3.0) rgb = vec3(0.0, c, x);
      else if (hh < 4.0) rgb = vec3(0.0, x, c);
      else if (hh < 5.0) rgb = vec3(x, 0.0, c);
      else               rgb = vec3(c, 0.0, x);
      return rgb + (v - c);
    }

    // Thin-film fringe intensity at path-length difference delta (in half-waves)
    float fringeIntensity(float delta) {
      return 0.5 + 0.5 * cos(delta * 6.28318);
    }

    vec4 generate() {
      float freq  = u_fringe_freq;
      float irid  = u_iridescence;
      float cx    = u_center;        // ring centre X (Y is always 0.5)

      vec2  centre = vec2(cx, 0.5);
      float dist   = length(v_uv - centre);

      // Air-gap thickness grows as r^2 for Newton's rings geometry
      // But visually a sqrt mapping looks more like the classic photo
      float gap = dist * dist * freq * 8.0;

      // Three wavelengths (R, G, B) â€” slightly different fringe frequencies
      float fR = fringeIntensity(gap * 1.00);
      float fG = fringeIntensity(gap * 1.18);
      float fB = fringeIntensity(gap * 1.38);

      vec3 fringeRGB = vec3(fR, fG, fB);

      // Iridescent hue rotation â€” shift hue with gap
      float hue   = fract(gap * 0.08 + 0.0);
      vec3  iridCol = hsv2rgb(hue, irid * 0.7, 1.0);

      // Blend achromatic fringe with iridescent hue
      vec3 col = mix(fringeRGB, iridCol, clamp(irid * 0.5, 0.0, 1.0));

      // Dark centre spot (perfect contact â€” zero gap, destructive at all Î»)
      float centreDark = smoothstep(0.015, 0.0, dist) * 0.9;
      col *= (1.0 - centreDark);

      // Slight radial vignette â€” interference fades at large radius
      float vignette = 1.0 - smoothstep(0.4, 0.72, dist);
      col = mix(vec3(0.92), col, vignette);
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_fringe_freq`,type:`float`,default:18,min:4,max:40,name:`Fringe Frequency`},{id:`u_iridescence`,type:`float`,default:1.2,min:0,max:2,name:`Iridescence`},{id:`u_center`,type:`float`,default:.5,min:.1,max:.9,name:`Ring Centre X`}]},Mi=e({default:()=>Ni}),Ni={id:`iris_fibers_artisan`,name:`Iris Fibers`,category:`Natural`,added:`2026-04-15`,description:`Radial organic fibrous patterns found in the human eye iris.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 50.0, 0.0));
      float mask = smoothstep(0.1, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Pupil Edge`,type:`color`,default:[.1,.3,.6,1]},{id:`u_secondary_color`,name:`Outer Stroma`,type:`color`,default:[0,.05,.1,1]}]},Pi=e({default:()=>Fi}),Fi={id:`julia_fractal`,name:`Julia Set`,category:`Abstract`,added:`2026-04-15`,description:`High-symmetry mathematical fractal based on complex number seeds.`,shader:`
    vec4 generate() {
      vec2 z = (v_uv - 0.5) * 4.0 / u_scale;
      vec2 c = vec2(-0.7, 0.27015);
      float iter = 0.0;
      const float max_iter = 64.0;
      
      for(float i=0.0; i<max_iter; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(length(z) > 2.0) break;
        iter++;
      }
      
      float mask = iter / max_iter;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fractal Size`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Core Color`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Outer Space`,type:`color`,default:[0,0,.1,1]}]},Ii=e({default:()=>Li}),Li={id:`kelp_forest`,name:`Kelp Forest`,category:`Ocean`,added:`2026-06-11`,description:`Sinuous kelp stalks with fluttering blades rising through teal water, layered into hazy depth under slanting light shafts.`,shader:`
    // One depth layer of kelp: returns stalk+blade mask for a column field
    float kelp_layer_klp(vec2 uv, float count, float sway, float seed) {
      float xc = uv.x * count;
      float col_id = floor(xc);
      float fx = fract(xc) - 0.5;
      float h = hash(vec2(col_id, seed));
      if (h < 0.35) return 0.0; // some columns empty — forest, not a fence

      // stalk centreline weaves with height
      float weave = sin(uv.y * (5.0 + h * 6.0) + h * 31.0) * sway
                  + snoise(vec2(col_id * 3.7 + seed, uv.y * 2.0)) * sway * 0.6;
      float d = fx - weave;

      // stipe: thin continuous stalk
      float stipe = smoothstep(0.035, 0.012, abs(d));

      // blades: lobes alternating left/right along the stalk
      float seg = uv.y * (9.0 + h * 4.0) + h * 17.0;
      float si = floor(seg);
      float sf = fract(seg);
      float side = mod(si, 2.0) < 1.0 ? 1.0 : -1.0;
      // blade reaches out from stalk, widest mid-segment, ragged tip
      float reach = (0.10 + 0.10 * hash(vec2(col_id, si + seed)))
                  * sin(sf * 3.14159);
      float bd = d * side; // distance on the blade side
      float blade = smoothstep(reach, reach * 0.2, bd) * step(0.0, bd)
                  * smoothstep(0.0, 0.15, sf) * smoothstep(1.0, 0.85, sf);
      // blade ruffle
      blade *= 0.7 + 0.3 * snoise(vec2(seg * 4.0, col_id + seed));

      return clamp(stipe + blade * 0.9, 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- water column: darker at the bottom, hazier behind ---
      vec3 water = u_water_color.rgb;
      vec3 col = mix(water * 0.45, water * 1.25, uv.y);
      col += (fbm(uv * 5.0) * 0.5 + 0.5) * water * 0.15; // drifting murk

      // slanting light shafts from the surface
      float shaft = noise(vec2((uv.x + uv.y * 0.35) * 6.0, 0.5));
      shaft = pow(shaft, 3.0) * uv.y;
      col += u_light_color.rgb * shaft * 0.35;

      // --- three kelp layers, back to front ---
      vec3 kelp_far  = mix(water, vec3(0.10, 0.22, 0.16), 0.55);
      vec3 kelp_mid  = vec3(0.13, 0.30, 0.14);
      vec3 kelp_near = vec3(0.20, 0.38, 0.12);

      float k1 = kelp_layer_klp(uv + vec2(0.13, 0.0), u_stalks * 1.6, u_sway * 0.7, 3.0);
      col = mix(col, kelp_far, k1 * 0.6);

      float k2 = kelp_layer_klp(uv + vec2(0.41, 0.0), u_stalks * 1.2, u_sway * 0.85, 7.0);
      col = mix(col, kelp_mid, k2 * 0.85);

      float k3 = kelp_layer_klp(uv, u_stalks, u_sway, 11.0);
      // foreground kelp catches rim light on its top edges
      vec3 lit = kelp_near + u_light_color.rgb * shaft * 0.5;
      col = mix(col, lit, k3);

      // pneumatocysts: tiny gas bladders glinting on near stalks
      float bub = step(0.97, hash(floor(uv * vec2(u_stalks * 6.0, 40.0)))) * k3;
      col += vec3(0.5, 0.6, 0.4) * bub;

      // floating detritus specks
      col += vec3(0.25, 0.3, 0.28) * step(0.992, hash(floor(uv * 160.0))) * 0.5;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_stalks`,name:`Stalk Count`,type:`float`,min:3,max:14,default:7},{id:`u_sway`,name:`Current Sway`,type:`float`,min:0,max:.25,default:.1},{id:`u_water_color`,name:`Water Color`,type:`color`,default:[.03,.2,.24,1]},{id:`u_light_color`,name:`Light Shafts`,type:`color`,default:[.55,.85,.75,1]}]},Ri=e({default:()=>zi}),zi={id:`kers_containment_core_artisan`,name:`KERS Containment Core`,category:`Technology`,added:`2026-05-13`,description:`Glowing, high-energy plasma cells wrapped in intricate copper coiling.`,shader:`
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float res = 8.0;
        for(int j=-1; j<=1; j++)
        for(int i=-1; i<=1; i++) {
            vec2 b = vec2(i, j);
            vec2 r = vec2(b) - f + random2(n + b);
            float d = dot(r, r);
            res = min(res, d);
        }
        return sqrt(res);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Plasma core using inverted voronoi
        float v = voronoi(uv + vec2(u_flow * 0.1, u_flow * 0.15));
        float plasma = smoothstep(0.4, 0.0, v);
        
        // Copper coils (horizontal lines)
        float coilFreq = u_scale * 4.0;
        float coil = sin(v_uv.y * 3.14159 * coilFreq);
        float coilMask = smoothstep(0.8, 0.9, coil);
        
        // Add subtle offset to coils based on voronoi underlying pressure
        coilMask += smoothstep(0.85, 0.95, sin(v_uv.y * 3.14159 * coilFreq + v*2.0)) * 0.5;
        coilMask = clamp(coilMask, 0.0, 1.0);
        
        vec4 plasmaLayer = mix(u_bg_color, u_plasma_color, plasma);
        vec4 coilLayer = mix(u_copper_dark, u_copper_light, smoothstep(-1.0, 1.0, coil));
        
        return mix(plasmaLayer, coilLayer, coilMask);
    }
  `,uniforms:[{id:`u_scale`,name:`Core Scale`,type:`float`,min:2,max:20,default:5},{id:`u_bg_color`,name:`Housing`,type:`color`,default:[.05,.05,.08,1]},{id:`u_plasma_color`,name:`Plasma Energy`,type:`color`,default:[0,.8,1,1]},{id:`u_copper_light`,name:`Copper Coil Highlight`,type:`color`,default:[.8,.4,.2,1]},{id:`u_copper_dark`,name:`Copper Coil Shadow`,type:`color`,default:[.3,.1,.05,1]},{id:`u_flow`,name:`Energy Flow`,type:`float`,min:0,max:100,default:0}]},Bi=e({default:()=>Vi}),Vi={id:`kevlar_grid_artisan`,name:`Kevlar Weave`,category:`Industrial`,added:`2026-04-15`,description:`Heavy tactical weave used in protective armor and performance gear.`,shader:`
    vec4 generate() {
      float lines = sin(v_uv.x * u_scale) * sin(v_uv.y * u_scale);
      float mask = smoothstep(-u_softness, u_softness, lines);
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Directional sheen along the raised tows
      float sheen = pow(max(lines, 0.0), 3.0) * u_sheen;
      color.rgb += sheen * 0.35;
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.8,.7,.2,1],u_secondary_color:[.1,.1,.1,1],u_scale:400,u_softness:.5,u_sheen:0}},{name:`Black Ops`,uniforms:{u_primary_color:[.16,.16,.17,1],u_secondary_color:[.04,.04,.05,1],u_scale:500,u_softness:.45,u_sheen:.3}},{name:`Blue Aramid`,uniforms:{u_primary_color:[.15,.35,.75,1],u_secondary_color:[.03,.05,.1,1],u_scale:400,u_softness:.5,u_sheen:.35}},{name:`Crimson Hybrid`,uniforms:{u_primary_color:[.7,.1,.12,1],u_secondary_color:[.06,.04,.04,1],u_scale:320,u_softness:.55,u_sheen:.4}}],uniforms:[{id:`u_scale`,name:`Weave Density`,type:`float`,min:100,max:1e3,default:400},{id:`u_softness`,name:`Weave Softness`,type:`float`,min:.05,max:1,default:.5},{id:`u_sheen`,name:`Tow Sheen`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Kevlar Gold`,type:`color`,default:[.8,.7,.2,1]},{id:`u_secondary_color`,name:`Outer Mesh`,type:`color`,default:[.1,.1,.1,1]}]},Hi=e({default:()=>Ui}),Ui={id:`knurl_grip`,name:`Knurl Grip`,category:`Racing`,added:`2026-05-01`,description:`Diamond knurl grip pattern — two sets of diagonal machined ridges crossing at 45 degrees to form sharp pyramid diamonds with bright tips and dark valleys.`,shader:`
    // Rotate a UV coordinate by angle (radians)
    vec2 rot2d(vec2 p, float a) {
      float s = sin(a); float c = cos(a);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Single set of parallel ridges along one axis after rotation
    // Returns 0 at valley, 1 at ridge peak
    float ridges(vec2 uv, float density, float angle) {
      vec2 r = rot2d(uv, angle);
      // Use r.x for ridge position, fract gives saw-tooth, smoothed to sine-like
      float t = fract(r.x * density);
      // Smooth triangle wave: sharp at peak, smooth at valley
      t = 1.0 - abs(t * 2.0 - 1.0);
      return t;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Two ridge sets at +45 and -45 degrees (0.7854 rad)
      float r1 = ridges(uv, u_density, 0.7854);
      float r2 = ridges(uv, u_density, -0.7854);

      // Diamond height: both ridges must be high simultaneously
      // Multiply gives peak only where both are at maximum
      float diamond = r1 * r2;

      // Sharpen the peak using a power — creates pyramid look
      diamond = pow(diamond, mix(1.5, 3.5, u_depth * 0.5));

      // Valley (dark) vs tip (bright)
      // Valleys between ridges are the darkest points
      float valley = (1.0 - r1) * (1.0 - r2);
      float valleyMask = pow(valley, 1.8);

      // Base colour
      vec3 col = u_base_color.rgb;

      // Darken valleys
      col *= mix(1.0, 0.35, valleyMask * u_depth * 0.7);

      // Bright highlight on pyramid tips
      float tipHighlight = diamond * u_depth * 0.45;
      col += vec3(tipHighlight, tipHighlight * 0.98, tipHighlight * 0.95);

      // Mid-slope shading — slight gradient on ridge faces
      float slope = r1 * (1.0 - r2) + r2 * (1.0 - r1);
      col *= mix(1.0, 0.72, slope * u_depth * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_density`,name:`Diamond Density`,type:`float`,min:4,max:40,default:16},{id:`u_base_color`,name:`Base Metal`,type:`color`,default:[.55,.55,.57,1]},{id:`u_depth`,name:`Ridge Depth`,type:`float`,min:.2,max:2,default:1}]},Wi=e({default:()=>Gi}),Gi={id:`laser_etch`,name:`Laser Etch`,category:`Technology`,added:`2026-05-01`,description:`Laser-engraved geometric lines on dark anodized metal, revealing bright bare aluminium in precise 45-degree patterns.`,shader:`
    // --- helpers BEFORE generate() ---

    // Rotate UV by 45 degrees
    vec2 rotate45(vec2 uv) {
      float c = 0.70710678; // cos(45deg)
      float s = 0.70710678; // sin(45deg)
      return vec2(c * uv.x - s * uv.y,
                  s * uv.x + c * uv.y);
    }

    // Rotate UV by -45 degrees
    vec2 rotate_neg45(vec2 uv) {
      float c =  0.70710678;
      float s = -0.70710678;
      return vec2(c * uv.x - s * uv.y,
                  s * uv.x + c * uv.y);
    }

    // Sharp line: returns 1.0 on a thin periodic line, 0.0 elsewhere
    // period_fract: fract within one repeat period, width: fraction of period
    float laser_line(float period_fract, float width) {
      // Line lives at fract = 0.0 (and 1.0)
      float dist_to_line = min(period_fract, 1.0 - period_fract);
      return 1.0 - smoothstep(width * 0.3, width * 0.5, dist_to_line);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Primary lines at +45 degrees ---
      vec2 uv45     = rotate45(uv) * u_line_density;
      float line_a  = laser_line(fract(uv45.x), u_line_width);

      // --- Secondary lines at -45 degrees (perpendicular cross) ---
      vec2 uv_neg45 = rotate_neg45(uv) * u_line_density;
      float line_b  = laser_line(fract(uv_neg45.x), u_line_width);

      // --- Cross-hatch gate: only draw second layer in checker zones ---
      // Checker based on grid cells in original UV space
      vec2  grid_cell  = floor(uv * u_line_density * 0.5);
      float checker    = mod(grid_cell.x + grid_cell.y, 2.0);
      // In checker=1 cells, show both line_a and line_b (cross-hatch)
      // In checker=0 cells, show only line_a (single hatch)
      float cross_hatch = mix(0.0, line_b, checker);

      // Combine: primary lines always on, cross-hatch in checker zones
      float etched = clamp(line_a + cross_hatch, 0.0, 1.0);

      // --- Colors ---
      vec3 bg    = u_background.rgb;
      vec3 etch  = u_etch_color.rgb;

      // Bright aluminium in etched lines
      vec3 col   = mix(bg, etch, etched);

      // Slight anodized surface micro-texture in background
      // Use simple high-frequency variation — no extra helper needed
      float micro_x = fract(uv.x * 210.3 + 0.17);
      float micro_y = fract(uv.y * 197.7 + 0.83);
      float micro   = fract(micro_x * 7.3 + micro_y * 13.1);
      float micro_n = (micro - 0.5) * 0.025 * (1.0 - etched);
      col += micro_n;

      // Edge glow on etched lines — very subtle warm glow (laser heat)
      // Lines slightly brighter at center
      float glow_a = laser_line(fract(uv45.x),     u_line_width * 0.18) * 0.08;
      float glow_b = laser_line(fract(uv_neg45.x), u_line_width * 0.18) * checker * 0.08;
      col += (glow_a + glow_b) * vec3(1.0, 0.92, 0.75) * (1.0 - etched * 0.5);

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_line_density`,name:`Line Density`,type:`float`,min:4,max:40,default:16},{id:`u_background`,name:`Background`,type:`color`,default:[.08,.08,.1,1]},{id:`u_etch_color`,name:`Etch Color`,type:`color`,default:[.85,.87,.88,1]},{id:`u_line_width`,name:`Line Width`,type:`float`,min:.01,max:.2,default:.06}]},Ki=e({default:()=>qi}),qi={id:`lava_crust_pro`,name:`Lava Crust`,category:`Natural`,added:`2026-04-15`,description:`Static volcanic cooling patterns with high-heat emission cracks.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offset
      float n = noise(uv);
      float mask = smoothstep(0.4, 0.6, n);
      
      vec4 heat = vec4(1.0, 0.2, 0.0, 1.0);
      vec4 rock = vec4(0.1, 0.1, 0.12, 1.0);
      
      return mix(heat, rock, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flow Intensity`,type:`float`,min:1,max:10,default:4}]},Ji=e({default:()=>Yi}),Yi={id:`lava_lamp`,name:`Lava Lamp`,category:`Retro`,added:`2026-06-11`,description:`Molten wax suspended mid-rise — backlit metaball globs stretching and necking apart in violet liquid, hot yellow cores cooling to orange skins with a gooey glow.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      // gooey domain warp so blob edges wobble organically
      vec2 w = uv + vec2(snoise(uv * 3.0 + 5.0), snoise(uv * 3.0 + 9.0)) * 0.045 * u_goo;

      // --- metaball field: 8 wax globs, wrapped both axes so the sheet tiles ---
      float field = 0.0;
      for (int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 c = vec2(hash(vec2(fi, 3.7)), hash(vec2(fi, 8.1)));
        vec2 d = fract(w - c + 0.5) - 0.5;        // wrapped distance
        d.x *= 1.7;                                // globs stretch vertically as they rise
        float r = (0.045 + hash(vec2(fi, 13.3)) * 0.085) * u_blob_scale;
        field += (r * r) / (dot(d, d) + 0.0006);
      }
      // a few small trailing droplets
      for (int j = 0; j < 5; j++) {
        float fj = float(j) + 20.0;
        vec2 c = vec2(hash(vec2(fj, 3.7)), hash(vec2(fj, 8.1)));
        vec2 d = fract(w - c + 0.5) - 0.5;
        d.x *= 1.7;
        float r = 0.022 * u_blob_scale;
        field += (r * r) / (dot(d, d) + 0.0006);
      }

      // --- the liquid: backlit gradient, brightest at the lamp base ---
      vec3 fluidDeep = u_fluid_color.rgb;
      vec3 fluidLit  = mix(fluidDeep, u_wax_color.rgb, 0.45) + 0.10;
      vec3 fluid = mix(fluidLit, fluidDeep, smoothstep(0.0, 1.0, uv.y));
      // bulb rays shafting up through the liquid
      fluid += u_wax_color.rgb * 0.06 * (0.5 + 0.5 * sin(uv.x * 40.0 + snoise(uv * 4.0) * 3.0)) * (1.0 - uv.y);
      // suspended glitter motes
      float mote = step(0.995, hash(floor(uv * 220.0)));
      fluid += vec3(0.35, 0.25, 0.30) * mote;

      // --- compose wax over liquid ---
      float body = smoothstep(0.92, 1.18, field);
      float core = smoothstep(1.6, 4.5, field);

      vec3 wax = u_wax_color.rgb;
      // skin darkens slightly where the glob curves away
      vec3 skin = wax * 0.78;
      // core superheats toward yellow-white
      vec3 hot = mix(wax, vec3(1.0, 0.92, 0.55), 0.85);
      vec3 glob = mix(skin, wax, smoothstep(0.92, 1.5, field));
      glob = mix(glob, hot, core);
      // rim light where liquid backlights the skin
      float rim = smoothstep(0.92, 1.05, field) * (1.0 - smoothstep(1.05, 1.5, field));
      glob += fluidLit * rim * 0.4;

      vec3 col = mix(fluid, glob, body);

      // halo: the liquid warms around each glob (sub-threshold field glow)
      float nearGlob = smoothstep(0.45, 0.92, field) * (1.0 - body);
      col += wax * nearGlob * 0.18;

      // glass curvature: subtle vertical highlight bands (the lamp wall)
      col += vec3(0.05) * exp(-pow((fract(uv.x * 1.0) - 0.18) * 9.0, 2.0));
      col *= 0.94 + noise(uv * 300.0) * 0.06;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_blob_scale`,name:`Glob Size`,type:`float`,min:.5,max:2,default:1},{id:`u_goo`,name:`Goo Wobble`,type:`float`,min:0,max:2,default:1},{id:`u_wax_color`,name:`Wax`,type:`color`,default:[1,.45,.08,1]},{id:`u_fluid_color`,name:`Liquid`,type:`color`,default:[.25,.05,.45,1]}]},Xi=e({default:()=>Zi}),Zi={id:`leaf_skeleton_pro`,name:`Leaf Skeleton`,category:`Natural`,added:`2026-04-15`,description:`Technical vein structure mimicking a decaying leaf skeleton.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float mask = step(0.95, hash(id + gv.x * 0.1));
      mask += step(0.98, max(gv.x, gv.y));
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Vein Detail`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Vein Color`,type:`color`,default:[.95,.95,.9,1]},{id:`u_secondary_color`,name:`Void Space`,type:`color`,default:[.05,.05,.05,1]}]},Qi=e({default:()=>$i}),$i={id:`leopard_print`,name:`Leopard Print`,category:`Organic`,added:`2026-06-11`,description:`Classic leopard rosettes: irregular broken dark rings around tan centres scattered with hash jitter over a cream-gold base, with noise-driven ring break-up and size variance.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 g = floor(uv);

      float ringAcc = 0.0;
      float centerAcc = 0.0;

      for (int yy = -1; yy <= 1; yy++) {
        for (int xx = -1; xx <= 1; xx++) {
          vec2 id = g + vec2(float(xx), float(yy));

          // Drop ~18% of cells so the spacing stays irregular
          float keep = step(0.18, hash(id + 4.2));

          // Jittered rosette centre inside its cell
          vec2 pt = id + vec2(0.2, 0.2) + 0.6 * vec2(hash(id + 1.7), hash(id + 9.3));
          vec2 rel = uv - pt;

          // Wobble the radius so spots are organic blobs, not circles
          float d = length(rel) + snoise(rel * 3.0 + id * 5.0) * 0.07;
          float rs = u_rosette * (0.75 + 0.5 * hash(id + 6.6));

          // Ring band between ~62% and 100% of the rosette radius
          float ring = smoothstep(rs, rs - 0.06, d) - smoothstep(rs * 0.62, rs * 0.62 - 0.06, d);

          // Break the ring into the classic incomplete brushy segments
          vec2 cdir = normalize(rel + vec2(0.0001, 0.0001));
          float breakField = snoise(cdir * 1.9 + id * 7.0 + rel * 2.5);
          float thr = u_break * 2.0 - 1.0;
          ring *= smoothstep(thr - 0.1, thr + 0.1, breakField);

          // Tan centre fills up to just under the ring's inner edge
          float center = smoothstep(rs * 0.66, rs * 0.54, d);

          ringAcc = max(ringAcc, ring * keep);
          centerAcc = max(centerAcc, center * keep);
        }
      }

      vec4 color = u_color_base;
      color = mix(color, u_color_center, clamp(centerAcc, 0.0, 1.0));
      color = mix(color, u_color_ring, clamp(ringAcc, 0.0, 1.0));
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Classic`,uniforms:{u_color_base:[.87,.76,.55,1],u_color_ring:[.1,.07,.05,1],u_color_center:[.72,.51,.28,1]}},{name:`Snow Leopard`,uniforms:{u_color_base:[.93,.93,.95,1],u_color_ring:[.15,.15,.18,1],u_color_center:[.65,.65,.7,1]}},{name:`Pink Pop`,uniforms:{u_color_base:[.98,.8,.88,1],u_color_ring:[.22,.02,.12,1],u_color_center:[.95,.35,.6,1]}},{name:`Midnight`,uniforms:{u_color_base:[.1,.11,.15,1],u_color_ring:[.01,.01,.02,1],u_color_center:[.22,.24,.33,1]}}],uniforms:[{id:`u_scale`,name:`Spot Scale`,type:`float`,min:2,max:15,default:6},{id:`u_rosette`,name:`Rosette Size`,type:`float`,min:.15,max:.6,default:.38},{id:`u_break`,name:`Ring Break-Up`,type:`float`,min:0,max:1,default:.45},{id:`u_color_base`,name:`Base Coat`,type:`color`,default:[.87,.76,.55,1]},{id:`u_color_ring`,name:`Rosette Ring`,type:`color`,default:[.1,.07,.05,1]},{id:`u_color_center`,name:`Spot Center`,type:`color`,default:[.72,.51,.28,1]}]},ea=e({default:()=>ta}),ta={id:`lichen_growth_artisan`,name:`Lichen Moss`,category:`Natural`,added:`2026-04-16`,description:`Splotchy organic crust and symbiotic growths found on weathered rocks and trees.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, step(0.5, n));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Lichen High`,type:`color`,default:[.7,.8,.5,1]},{id:`u_secondary_color`,name:`Rock Base`,type:`color`,default:[.2,.2,.2,1]}]},na=e({default:()=>ra}),ra={id:`lichtenberg_trees_artisan`,name:`Lichtenberg Trees`,category:`Abstract`,added:`2026-04-15`,description:`Fractal electrical discharge patterns found in high-voltage dielectric breakdown.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 100.0);
      float branch = step(0.98, n * hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, branch);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Discharge`,type:`color`,default:[.4,.8,1,1]},{id:`u_secondary_color`,name:`Insulator`,type:`color`,default:[.05,.05,.08,1]}]},ia=e({default:()=>aa}),aa={id:`linear_gradient_artisan`,name:`Master Linear`,category:`Abstract`,added:`2026-04-15`,description:`High-precision linear gradient for base transitions.`,shader:`
    vec4 generate() {
      float mask = v_uv.x;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Start Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`End Color`,type:`color`,default:[0,0,0,1]}]},oa=e({default:()=>sa}),sa={id:`linen_weave`,name:`Linen Weave`,category:`Industrial`,added:`2026-05-01`,description:`Natural linen plain weave with organic fibre slubs and warm ecru tones.`,shader:`
    // Hash for pseudo-random noise
    float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
    }

    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    // Smooth noise for slub irregularity
    float noise1(float x) {
      float i = floor(x);
      float f = fract(x);
      float u = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), u);
    }

    // Simulate a single thread with slubs
    float threadProfile(float pos, float threadId) {
      float base = 0.55;
      float slubFreq = 1.8 + hash11(threadId) * 2.5;
      float slubAmp  = 0.08 + hash11(threadId + 7.3) * 0.12;
      float slub = noise1(pos * slubFreq + hash11(threadId) * 10.0) * slubAmp;
      float twist = sin(pos * (4.0 + hash11(threadId + 3.1)) + hash11(threadId + 1.7) * 6.28) * 0.04;
      return base + slub + twist;
    }

    vec4 generate() {
      float scale = u_weave_scale;
      vec2 uv = v_uv * scale;

      vec2 cell = floor(uv);
      vec2 local = fract(uv);

      // Determine if this cell is warp (vertical) or weft (horizontal) thread on top
      float cellParity = mod(cell.x + cell.y, 2.0);

      // Warp thread runs vertically (u direction is across thread, v along thread)
      // Weft thread runs horizontally (v direction is across thread, u along thread)

      // Thread radii â€” vary slightly per thread for organic feel
      float warpId = cell.x;
      float weftId = cell.y;

      float warpRadius = threadProfile(cell.y + local.y, warpId);
      float weftRadius = threadProfile(cell.x + local.x, weftId + 100.0);

      // Cross-section distance for each thread
      float dWarp = abs(local.x - 0.5);
      float dWeft = abs(local.y - 0.5);

      // Over-under weave: alternate which thread is on top
      float warpOnTop = step(0.5, cellParity);

      float warpMask = smoothstep(warpRadius, warpRadius - 0.04, dWarp);
      float weftMask = smoothstep(weftRadius, weftRadius - 0.04, dWeft);

      // Shadow: thread going under gets slightly darkened
      float shadow = mix(1.0, 0.78, (1.0 - warpOnTop) * warpMask * (1.0 - weftMask));
      shadow      *= mix(1.0, 0.78, warpOnTop * weftMask * (1.0 - warpMask));

      // Micro-fibre fuzz along thread edges
      float fuzz = hash21(floor(uv * 3.0)) * 0.04;

      // Colour blend: warp vs weft tones
      vec3 warpCol = u_base_color.rgb;
      vec3 weftCol = u_warp_color.rgb;
      float blend = mix(warpOnTop * warpMask, (1.0 - warpOnTop) * weftMask, 0.5);
      vec3 col = mix(weftCol, warpCol, clamp(blend + fuzz, 0.0, 1.0));

      col *= shadow;

      // Slight global irregularity
      float globalNoise = noise1(v_uv.x * scale * 0.3) * 0.04;
      col = clamp(col + globalNoise - 0.02, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_weave_scale`,type:`float`,default:18,min:4,max:40,name:`Weave Scale`},{id:`u_base_color`,type:`color`,default:[.82,.75,.58,1],name:`Warp Colour`},{id:`u_warp_color`,type:`color`,default:[.72,.64,.48,1],name:`Weft Colour`}]},ca=e({default:()=>la}),la={id:`liquid_mercury_artisan`,name:`Liquid Mercury`,category:`Abstract`,added:`2026-04-15`,description:`Smooth, blobby metallic shapes with high specularity mimicking liquid metal.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.45, n);
      vec4 col = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) {
        // Liquid metal: full metallic on blobs, near-zero roughness; voids slightly duller
        return vec4(mix(0.85, 1.0, mask), mix(0.06, 0.02, mask), 0.0, col.a);
      }
      return col;
    }
  `,uniforms:[{id:`u_scale`,name:`Blob Size`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Mercury`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.1,.1,.12,1]}]},ua=e({default:()=>da}),da={id:`louis_check_artisan`,name:`Louis Check`,category:`Abstract`,added:`2026-04-15`,description:`Luxury designer-style checkered leather pattern with premium soft shading.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Anti-aliased checker via soft-XOR of triangle waves
      float s = max(u_softness, 0.0005);
      float tx = abs(fract((uv.x + 0.5) * 0.5) * 2.0 - 1.0);
      float ty = abs(fract((uv.y + 0.5) * 0.5) * 2.0 - 1.0);
      float mx = smoothstep(0.5 - s, 0.5 + s, tx);
      float my = smoothstep(0.5 - s, 0.5 + s, ty);
      float mask = mx + my - 2.0 * mx * my;

      float edge = smoothstep(0.45, 0.5, abs(fract(uv.x) - 0.5)) + smoothstep(0.45, 0.5, abs(fract(uv.y) - 0.5));
      vec4 color = mix(u_secondary_color, u_primary_color, mask + edge * u_edge_shade);

      // Optional fine leather grain
      color.rgb += (noise(uv * 18.0) - 0.5) * u_grain;
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.3,.2,.15,1],u_secondary_color:[.6,.45,.35,1],u_edge_shade:.2,u_grain:0}},{name:`Noir Damier`,uniforms:{u_primary_color:[.05,.05,.06,1],u_secondary_color:[.22,.22,.24,1],u_edge_shade:.25,u_grain:.1}},{name:`Burgundy Lux`,uniforms:{u_primary_color:[.3,.06,.1,1],u_secondary_color:[.55,.2,.22,1],u_edge_shade:.2,u_grain:.12}},{name:`Cream Canvas`,uniforms:{u_primary_color:[.78,.7,.58,1],u_secondary_color:[.92,.87,.76,1],u_edge_shade:.3,u_grain:.06}}],uniforms:[{id:`u_scale`,name:`Check Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.01},{id:`u_edge_shade`,name:`Edge Shading`,type:`float`,min:0,max:.6,default:.2},{id:`u_grain`,name:`Leather Grain`,type:`float`,min:0,max:.4,default:0},{id:`u_primary_color`,name:`Leather Dark`,type:`color`,default:[.3,.2,.15,1]},{id:`u_secondary_color`,name:`Leather Tan`,type:`color`,default:[.6,.45,.35,1]}]},fa=e({default:()=>pa}),pa={id:`low_poly_facets`,name:`Low-Poly Facets`,category:`Geometric`,added:`2026-06-11`,description:`Triangulated low-poly mosaic with flat per-face shading: hash-jittered facet brightness over a large-scale lighting gradient so the surface reads like a faceted 3D render.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 g = floor(uv);
      vec2 f = fract(uv);

      // Each square cell splits along a hash-chosen diagonal into two triangles
      float flip = step(0.5, hash(g + 5.31));
      float dCoord = mix(f.x + f.y - 1.0, f.x - f.y, flip);
      float side = step(0.0, dCoord);

      float faceHash = hash(g * 1.37 + side * 19.7 + flip * 7.3);

      // Large-scale "lighting" gradient so the mosaic reads as a lit surface
      float light = dot(v_uv - 0.5, vec2(0.55, 0.85)) + 0.5;
      light += snoise(v_uv * 2.2 + 8.8) * 0.12;
      float shade = clamp(light + (faceHash - 0.5) * u_contrast, 0.0, 1.0);

      vec4 color = mix(u_color_a, u_color_b, shade);

      // Thin facet borders: cell edges plus the splitting diagonal
      float diag = abs(dCoord) * 0.70710678;
      float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      edge = min(edge, diag);
      float line = 1.0 - smoothstep(0.012, 0.032, edge);
      color.rgb *= 1.0 - line * u_border * 0.6;

      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Ice`,uniforms:{u_color_a:[.25,.38,.55,1],u_color_b:[.92,.97,1,1]}},{name:`Gunmetal`,uniforms:{u_color_a:[.09,.1,.12,1],u_color_b:[.48,.51,.56,1]}},{name:`Sunset`,uniforms:{u_color_a:[.45,.08,.25,1],u_color_b:[1,.62,.2,1]}},{name:`Emerald`,uniforms:{u_color_a:[.02,.18,.1,1],u_color_b:[.25,.85,.5,1]}}],uniforms:[{id:`u_scale`,name:`Facet Scale`,type:`float`,min:3,max:30,default:9},{id:`u_contrast`,name:`Shading Contrast`,type:`float`,min:0,max:1,default:.55},{id:`u_border`,name:`Border Strength`,type:`float`,min:0,max:1,default:.35},{id:`u_color_a`,name:`Shadow Color`,type:`color`,default:[.25,.38,.55,1]},{id:`u_color_b`,name:`Highlight Color`,type:`color`,default:[.92,.97,1,1]}]},ma=e({default:()=>ha}),ha={id:`machined_wheel`,name:`Machined Wheel`,category:`Racing`,added:`2026-04-30`,description:`CNC machined aluminum wheel face with concentric lathe rings, radial spoke shadows, and a polished centre hub.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv - 0.5;          // centre at 0,0

      float r    = length(uv);
      float ang  = atan(uv.y, uv.x); // -pi .. pi

      // ---- Concentric machining rings ----
      // Lathe produces fine, evenly spaced ridges
      float ringPhase = r * u_ring_freq;
      float ring = sin(ringPhase * 6.28318);
      // Vary slightly with micro noise (tool chatter)
      float chatter = noise(vec2(r * u_ring_freq * 0.5, ang * 3.0)) * 0.15;
      ring = ring * (1.0 - chatter) + chatter;
      ring = ring * 0.5 + 0.5;  // [0,1]

      // Polished highlight: bright crests, dark valleys
      float machinedBright = mix(0.55, 0.92, ring);

      // ---- Spoke shadow regions ----
      // Normalise angle to [0, 2pi)
      float angN  = ang + 3.14159;
      float sector = angN * u_spoke_count / 6.28318; // which spoke
      float sectorFrac = fract(sector);
      // Shadow in pocket between spokes (centre 0.5 of each sector)
      float spokeMask = abs(sectorFrac - 0.5) * 2.0; // 0 at midpoint, 1 at spoke
      float spokeShadow = smoothstep(0.3, 0.7, spokeMask);
      // Only apply beyond inner hub radius
      float hubRadius = 0.12;
      float rimRadius = 0.48;
      float spokeBlend = smoothstep(hubRadius, hubRadius + 0.06, r) *
                         smoothstep(rimRadius, rimRadius - 0.04, r);
      float shadowFactor = mix(1.0, spokeShadow * 0.55 + 0.35, spokeBlend);

      // ---- Hub: smooth polished disc ----
      float hubMask = smoothstep(hubRadius, hubRadius - 0.03, r);
      float hubGlow = 1.0 - r / hubRadius;
      float hubLight = mix(0.0, 0.85 + hubGlow * 0.15, hubMask);

      // ---- Rim lip: slightly darker ----
      float rimMask = smoothstep(rimRadius - 0.03, rimRadius, r);
      float rimDark = mix(1.0, 0.6, rimMask);

      // ---- Compose ----
      float lum = machinedBright * shadowFactor * rimDark;
      lum = mix(lum, 0.9, hubMask); // hub overrides ring texture

      // Aluminium colour — neutral with faint warm tinge
      vec3 alumColor = vec3(0.88, 0.87, 0.86);
      vec3 col = alumColor * lum;

      // Thin iridescent sheen on machined ridges
      float irid = sin(ringPhase * 6.28318 * 0.5 + ang) * 0.03;
      col += vec3(irid * 0.4, irid * 0.5, irid * 0.8) * (1.0 - hubMask);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_ring_freq`,name:`Ring Density`,type:`float`,min:10,max:60,default:30},{id:`u_spoke_count`,name:`Spoke Count`,type:`float`,min:3,max:10,default:5}]},ga=e({default:()=>_a}),_a={id:`macrame_knot_artisan`,name:`Macrame Knot`,category:`Abstract`,added:`2026-04-15`,description:`Interlocking geometric square knots found in traditional fiber crafts.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = smoothstep(0.4, 0.5, abs(gv.x - 0.5) + abs(gv.y - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Knot Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Cotton Rope`,type:`color`,default:[.95,.9,.85,1]},{id:`u_secondary_color`,name:`Knot Deep`,type:`color`,default:[.6,.55,.5,1]}]},va=e({default:()=>ya}),ya={id:`mandala_radial_artisan`,name:`Mandala Radial`,category:`Abstract`,added:`2026-04-16`,description:`Harmonic geometric recurrence and radial symmetry patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float d = length(uv);
      float pulses = sin(d * 40.0) * sin(angle * 8.0);
      float mask = step(0.0, pulses);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Geometry Glow`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Mental Void`,type:`color`,default:[0,0,0,1]}]},ba=e({default:()=>xa}),xa={id:`mandelbrot_fractal`,name:`Mandelbrot Explorer`,category:`Abstract`,added:`2026-04-15`,description:`Pure mathematical fractal boundary with high-precision iteration.`,shader:`
    vec4 generate() {
      vec2 c = (v_uv - 0.5) * 4.0 / u_scale - vec2(0.5, 0.0);
      vec2 z = vec2(0.0);
      float iter = 0.0;
      const float max_iter = 100.0;
      
      for(float i=0.0; i<max_iter; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(length(z) > 2.0) break;
        iter++;
      }
      
      float mask = iter / max_iter;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Zoom Level`,type:`float`,min:1,max:20,default:2},{id:`u_primary_color`,name:`Inner Glow`,type:`color`,default:[1,.4,0,1]},{id:`u_secondary_color`,name:`Void Depth`,type:`color`,default:[.05,0,.05,1]}]},Sa=e({default:()=>Ca}),Ca={id:`manta_wing_gradient`,name:`Manta Wing Gradient`,category:`Ocean`,added:`2026-06-11`,description:`Manta-ray countershading — velvet black dorsal sweeping into white belly along a curved wing line, with shoulder chevrons and skin speckle.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 dark  = u_dark_color.rgb;
      vec3 light = u_light_color.rgb;

      // --- curved countershade boundary, repeating per wing tile ---
      float wing_x = fract(uv.x * 2.0);                   // two wings per tile
      float curve = sin(wing_x * 3.14159) * u_curve;      // boundary dips mid-wing
      float edge = 0.45 - curve;
      float d = uv.y - edge;                              // signed dist from boundary

      // wide velvety blend with a tighter core transition
      float t = smoothstep(-0.18, 0.18, d);
      t = mix(t, smoothstep(-0.05, 0.05, d), 0.45);
      vec3 col = mix(light, dark, t);

      // --- dorsal shading: wing surface curvature ---
      // subtle sheen band running along the wing above the boundary
      float sheen = exp(-pow((d - 0.16) * 7.0, 2.0));
      col += (light - dark) * 0.08 * sheen * t;
      // dorsal darkens toward the trailing (top) edge
      col *= 1.0 - smoothstep(0.65, 1.0, uv.y) * 0.18 * t;

      // --- white shoulder chevrons on the dark side ---
      // two swept patches per wing, mirrored about wing centre
      float cx = abs(wing_x - 0.5);
      vec2 sp = vec2(cx - 0.22, uv.y - (edge + 0.30));
      sp.x *= 1.6;
      float chev = exp(-dot(sp, sp) * 90.0);
      // chevron is swept: cut its lower edge along a diagonal
      chev *= smoothstep(-0.02, 0.10, sp.y + sp.x * 0.8);
      col = mix(col, light * 0.92, chev * 0.85 * t);

      // --- ventral grey mottling near the boundary (belly markings) ---
      float mott = fbm(uv * 7.0 + 21.0) * 0.5 + 0.5;
      float belly_band = (1.0 - t) * smoothstep(-0.3, -0.05, d);
      col = mix(col, dark * 0.6 + light * 0.3,
                smoothstep(0.62, 0.78, mott) * belly_band * 0.35);

      // --- skin speckle: pale flecks on the dorsal, dark on the belly ---
      float spk = noise(uv * 160.0);
      col += (light - dark) * 0.05 * (spk - 0.5) * u_speckle * t;
      float fleck = step(0.985, hash(floor(uv * 110.0)));
      col = mix(col, light * 0.8, fleck * t * 0.25 * u_speckle);
      float dfleck = step(0.988, hash(floor(uv * 90.0) + 7.0));
      col = mix(col, dark, dfleck * (1.0 - t) * 0.30 * u_speckle);

      // soft broad lighting from above-left
      col *= 0.94 + 0.10 * (1.0 - uv.y) * (1.0 - wing_x * 0.4);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_curve`,name:`Wing Curve`,type:`float`,min:0,max:.3,default:.14},{id:`u_speckle`,name:`Skin Speckle`,type:`float`,min:0,max:2,default:1},{id:`u_dark_color`,name:`Dorsal Color`,type:`color`,default:[.04,.05,.08,1]},{id:`u_light_color`,name:`Ventral Color`,type:`color`,default:[.92,.94,.95,1]}]},wa=e({default:()=>Ta}),Ta={id:`maple_leaves_artisan`,name:`Maple Leaf Scatter`,category:`Natural`,added:`2026-04-15`,description:`Randomly distributed maple leaf shapes with rotation and scale variance.`,shader:`
    float maple(vec2 p) {
      float a = atan(p.y, p.x);
      float r = length(p);
      float d = 1.0 + 0.5 * sin(5.0 * a) * (0.5 + 0.5 * sin(15.0 * a));
      return r - 0.4 * d;
    }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv) - 0.5;
      
      float mask = 0.0;
      for(int y=-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
          vec2 offset = vec2(float(x), float(y));
          float n = hash(id + offset);
          vec2 p = gv - (offset + vec2(n, hash(id + offset + 1.0)) - 0.5);
          float d = maple(p * (0.8 + n * 0.4));
          mask = max(mask, smoothstep(0.01, 0.0, d));
        }
      }
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:15,default:6},{id:`u_primary_color`,name:`Leaf Color`,type:`color`,default:[1,.4,.1,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.1,.1,.05,1]}]},Ea=e({default:()=>Da}),Da={id:`marble_stone_artisan`,name:`Marbled Stone`,category:`Organic`,added:`2026-04-15`,description:`Natural stone texture with randomized crystalline veins.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv + noise(uv * 2.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Vein Density`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Vein Color`,type:`color`,default:[.95,.95,1,1]},{id:`u_secondary_color`,name:`Stone Base`,type:`color`,default:[.3,.3,.35,1]}]},Oa=e({default:()=>ka}),ka={id:`martian_surface`,name:`Martian Surface`,category:`Cosmos`,added:`2026-06-11`,description:`Rust-red Martian terrain — wind-combed dune ripples, scattered dark basalt cobbles, and pale dust pooling in the hollows.`,shader:`
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
  `,uniforms:[{id:`u_ripple_freq`,name:`Dune Ripples`,type:`float`,min:4,max:30,default:12},{id:`u_dust_cover`,name:`Dust Cover`,type:`float`,min:0,max:1.5,default:.8},{id:`u_soil_color`,name:`Soil Colour`,type:`color`,default:[.66,.32,.18,1]}]},Aa=e({default:()=>ja}),ja={id:`matte_clearcoat`,name:`Matte Clearcoat`,category:`Racing`,added:`2026-04-30`,description:`Flat/satin automotive paint finish with micro-surface grain, mimicking matte-wrapped or flat-painted race cars.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // 3-octave fBm for micro-surface tooth
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p  *= 2.1;
        a  *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // High-frequency micro-texture grain (the "tooth" of flat paint)
      float grain = fbm(uv * u_noise_scale);
      // Keep grain subtle — it's a very small surface roughness
      grain = (grain - 0.5) * 0.06;

      // Base pigment color with grain applied as a lightness nudge
      vec3 col = u_paint_color.rgb + vec3(grain);

      // Fresnel-style brightening: UV edges simulate viewing-angle curvature.
      // Map v_uv to [-1, 1] and use squared distance from center as proxy.
      vec2 centered = uv * 2.0 - 1.0;
      float edgeFactor = dot(centered, centered); // 0 at center, ~1 at corners
      edgeFactor = clamp(edgeFactor, 0.0, 1.0);

      // Satin level governs how much the Fresnel sheen shows
      float sheenAmount = u_sheen * 0.12 * edgeFactor;
      col += vec3(sheenAmount);

      // Very faint specular blob at center for satin finish
      float centralSpec = (1.0 - edgeFactor) * u_sheen * 0.05;
      col += vec3(centralSpec);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_paint_color.a * u_opacity);
    }
  `,uniforms:[{id:`u_paint_color`,name:`Paint Color`,type:`color`,default:[.08,.08,.08,1]},{id:`u_noise_scale`,name:`Grain Scale`,type:`float`,min:.5,max:20,default:8},{id:`u_sheen`,name:`Satin Sheen`,type:`float`,min:0,max:1,default:.15}]},Ma=e({default:()=>Na}),Na={id:`mesh_jersey`,name:`Mesh Jersey`,category:`Industrial`,added:`2026-05-01`,description:`Open-hole sports jersey knit mesh with rounded thread loops forming a regular grid of holes.`,shader:`
    // Smooth minimum for rounded shape merging
    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // Signed distance to a rounded rectangle
    float sdRoundRect(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    // Loop cross-section: a kidney/loop shaped thread path around hole
    float loopSDF(vec2 local, float holeRadius) {
      // Distance to hole border (negative = outside hole)
      float distToHole = length(local) - holeRadius;
      // Thread occupies a band around the hole
      return abs(distToHole) - 0.12;
    }

    vec4 generate() {
      float scale    = u_scale;
      float holeSize = u_hole_size;

      vec2 uv = v_uv * scale;

      // Offset every other column for jersey knit stagger
      float col = floor(uv.x);
      float rowOffset = mod(col, 2.0) * 0.5;
      vec2 shifted = vec2(uv.x, uv.y + rowOffset);

      vec2 cell  = floor(shifted);
      vec2 local = fract(shifted) - 0.5; // [-0.5, 0.5]

      // Elliptical hole (slightly taller than wide â€” jersey stretches horizontally)
      vec2 holeScale = vec2(1.0 / (holeSize * 0.9), 1.0 / holeSize);
      float holeDist = length(local * holeScale) - 1.0;

      // Thread band around the hole
      float threadWidth = 0.22 - holeSize * 0.15;
      threadWidth = clamp(threadWidth, 0.06, 0.18);
      float thread = abs(holeDist) - threadWidth;

      // Shading: inside of loop is slightly darker (depth), top of loop is bright
      float loopShade = 1.0 - smoothstep(-0.05, 0.25, holeDist) * 0.3;

      // Specular glint along the top of each loop arc
      float angle = atan(local.y, local.x);
      float specAngle = cos(angle - 1.1);
      float specGlint = smoothstep(0.6, 1.0, specAngle) * smoothstep(threadWidth, 0.0, abs(thread)) * 0.4;

      // Thread mask
      float threadMask = 1.0 - smoothstep(-0.01, 0.02, thread);

      // Hole (transparent / background)
      float holeMask = smoothstep(-0.02, 0.02, holeDist);
      float bgMask   = 1.0 - threadMask;

      // Darken background (no thread â€” just see-through dark)
      vec3 bgCol     = u_thread_color.rgb * 0.08;
      vec3 threadCol = u_thread_color.rgb * loopShade + specGlint;

      vec3 col3 = mix(bgCol, threadCol, threadMask);

      // Slight crosshatch from neighbouring loops (ambient contact shadow)
      float shadow = 1.0 - smoothstep(0.30, 0.50, length(local)) * 0.18;
      col3 *= shadow;

      return vec4(clamp(col3, 0.0, 1.0), 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_scale`,type:`float`,default:14,min:4,max:30,name:`Mesh Scale`},{id:`u_thread_color`,type:`color`,default:[.9,.9,.9,1],name:`Thread Colour`},{id:`u_hole_size`,type:`float`,default:.45,min:.2,max:.7,name:`Hole Size`}]},Pa=e({default:()=>Fa}),Fa={id:`metal_flake`,name:`Metal Flake`,category:`Racing`,added:`2026-04-30`,description:`Automotive metallic flake base coat with dense randomly oriented aluminium flakes sparkling in a tinted binder.`,shader:`
    float hash1(float n) { return fract(sin(n) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv;

      // Scale UV for flake grid — u_flake_density maps to grid cells per unit
      vec2 flakeUV  = uv * u_flake_density * 0.04;
      vec2 flakeCell = floor(flakeUV);
      vec2 flakeLocal = fract(flakeUV);

      float flakeLight = 0.0;

      // Check 3x3 neighbourhood so flakes near cell borders are caught
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = flakeCell + vec2(float(dx), float(dy));
          // Pseudo-random position and orientation per flake
          float rx  = hash(nc + vec2(0.13, 0.45));
          float ry  = hash(nc + vec2(0.67, 0.23));
          float ang = hash(nc + vec2(0.91, 0.55)) * 6.28318;
          float sz  = 0.25 + hash(nc + vec2(0.22, 0.88)) * 0.3;

          // Flake is a small oriented rectangle — rotate local coord
          vec2 diff = flakeLocal - (vec2(float(dx), float(dy)) + vec2(rx, ry));
          float ca = cos(ang); float sa = sin(ang);
          vec2 rot = vec2(ca * diff.x - sa * diff.y,
                          sa * diff.x + ca * diff.y);
          // Rectangle SDF: flakes are thin slabs
          vec2 flakeHalf = vec2(sz, sz * 0.15);
          vec2 dBox = abs(rot) - flakeHalf;
          float boxDist = length(max(dBox, 0.0));
          // Bright if inside flake
          float inside = smoothstep(0.04, 0.0, boxDist);
          // Each flake has a unique reflectance based on random orientation vs. light
          float reflBias = hash(nc + vec2(1.3, 2.7));
          float brightness = pow(reflBias, 1.5) * u_flake_brightness;
          flakeLight = max(flakeLight, inside * brightness);
        }
      }

      // Binder base colour — u_base_color tinted slightly lighter for depth
      float bgVariation = noise(uv * 8.0) * 0.04;
      vec3 binder = u_base_color.rgb + vec3(bgVariation);

      // Flake colour: pure silver-white
      vec3 flakeColor = vec3(0.95, 0.95, 0.97);

      vec3 col = mix(binder, flakeColor, flakeLight * 0.9);

      // Subtle slow-varying shimmer across the whole surface (viewing angle variation)
      float shimmer = noise(uv * 2.5 + 1.5708) * 0.06;
      col += u_base_color.rgb * shimmer;

      col = clamp(col, 0.0, 1.0);
      if (u_is_spec > 0.5) {
        // Metallic binder with bright aluminium flake glints; flakes slightly varied via shimmer
        float metallic = mix(0.45, 1.0, flakeLight);
        float roughness = clamp(mix(0.25, 0.08, flakeLight) + shimmer, 0.05, 0.3);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.08,.15,.35,1]},{id:`u_flake_density`,name:`Flake Density`,type:`float`,min:200,max:2e3,default:800},{id:`u_flake_brightness`,name:`Flake Brightness`,type:`float`,min:.3,max:1.5,default:1}]},Ia=e({default:()=>La}),La={id:`meteor_shower`,name:`Meteor Shower`,category:`Cosmos`,added:`2026-06-11`,description:`A radiant burst of shooting stars — parallel incandescent streaks with white-hot heads, sputtering ember trails, and a calm starfield behind.`,shader:`
    vec2 rot_msh(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(c * p.x - s * p.y, s * p.x + c * p.y);
    }

    // One layer of meteors: streaks in slanted bands that wrap with the tile
    vec3 meteors_msh(vec2 uv, float density, float seed, float scale, vec3 headCol, vec3 trailCol) {
      // Rotate into meteor-aligned frame: meteors travel along +x
      vec2 m = rot_msh(uv, -u_angle);
      vec2 g = floor(m * density);
      vec3 acc = vec3(0.0);
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 cell = g + vec2(float(x), float(y));
          vec2 cw = mod(cell, density * 4.0); // wrap window for tiling-ish repeat
          float exists = step(0.72, hash(cw + seed));
          // Head position inside the cell
          vec2 hp = (cell + vec2(hash(cw + seed + 7.0), hash(cw + seed + 19.0))) / density;
          vec2 rel = m - hp;
          float len = (0.10 + 0.22 * hash(cw + seed + 31.0)) * scale;

          // Trail: bright at the head, exponential decay behind (rel.x < 0)
          float behind = -rel.x;
          float onTrail = step(0.0, behind) * step(behind, len);
          float trailFall = exp(-behind * (4.5 / len));
          float thick = 0.0022 * scale * (0.4 + 0.6 * trailFall);
          float lateral = exp(-pow(rel.y / max(thick, 0.0001), 2.0));
          // Sputtering brightness flickers along the trail
          float sputter = 0.65 + 0.35 * hash(vec2(floor(behind * 90.0), cw.x + seed));
          acc += trailCol * exists * onTrail * lateral * trailFall * sputter;

          // White-hot head with a small teardrop bloom
          float hd = length(rel * vec2(1.0, 2.2));
          acc += headCol * exists * exp(-pow(hd / (0.008 * scale), 2.0)) * 1.6;
          acc += headCol * exists * exp(-hd * (140.0 / scale)) * 0.35;
        }
      }
      return acc;
    }

    float stars_msh(vec2 uv) {
      vec2 g = floor(uv * 80.0);
      vec2 f = fract(uv * 80.0);
      vec2 p = vec2(hash(g + 9.7), hash(g + 25.1));
      return smoothstep(0.96, 1.0, hash(g)) * smoothstep(0.10, 0.0, length(f - p));
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Night sky with faint airglow gradient and thin cloud wisp ---
      vec3 col = mix(vec3(0.020, 0.026, 0.055), vec3(0.008, 0.010, 0.030), uv.y);
      float wisp = fbm(uv * vec2(3.0, 6.0)) * 0.5 + 0.5;
      col += vec3(0.030, 0.035, 0.055) * smoothstep(0.6, 0.9, wisp) * 0.6;

      // --- Static stars, some twinkle-bright ---
      col += vec3(0.80, 0.85, 1.0) * stars_msh(v_uv + 2.2) * 0.9;
      col += vec3(1.0, 0.95, 0.85) * stars_msh(v_uv * 0.6 + 8.8) * 0.5;

      // --- Meteor layers: faint distant + bold foreground ---
      vec3 head = vec3(1.0, 0.99, 0.95);
      vec3 trail = u_trail_color.rgb;
      vec3 ember = trail * vec3(1.0, 0.55, 0.30);

      col += meteors_msh(uv, u_density * 1.6, 13.0, 0.6, head * 0.55, trail * 0.45);
      col += meteors_msh(uv, u_density, 47.0, 1.0, head, trail);
      // Ember after-glow layer slightly offset behind the bright trails
      col += meteors_msh(uv + 0.002, u_density, 47.0, 1.1, vec3(0.0), ember * 0.30);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_density`,name:`Meteor Count`,type:`float`,min:2,max:9,default:4},{id:`u_angle`,name:`Fall Angle`,type:`float`,min:0,max:6.28,default:5.6},{id:`u_trail_color`,name:`Trail Colour`,type:`color`,default:[.6,.8,1,1]}]},Ra=e({default:()=>za}),za={id:`micro_cells_artisan`,name:`Micro Cells`,category:`Natural`,added:`2026-04-15`,description:`Biological cellular membranes and nuclei mimicking microscopic organic life.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.1, 0.05, abs(m_dist - 0.2));
      float nucleus = smoothstep(0.1, 0.0, m_dist);
      return mix(u_secondary_color, u_primary_color, mask + nucleus);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Magnification`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Organelle`,type:`color`,default:[.8,.4,.6,1]},{id:`u_secondary_color`,name:`Cytoplasm`,type:`color`,default:[.1,.05,.1,1]}]},Ba=e({default:()=>Va}),Va={id:`micro_logic_grid_artisan`,name:`Logic Array`,category:`Technology`,added:`2026-04-16`,description:`Microscopic grid of semiconductor logic gates and data-bus structures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Gate Matrix`,type:`float`,min:10,max:200,default:80},{id:`u_primary_color`,name:`Bus Copper`,type:`color`,default:[.8,1,0,1]},{id:`u_secondary_color`,name:`Silicon Base`,type:`color`,default:[.05,.05,.1,1]}]},Ha=e({default:()=>Ua}),Ua={id:`microchip_wafer_pro`,name:`Microchip Die`,category:`Technology`,added:`2026-04-15`,description:`High-density silicon wafer etching with localized circuit density.`,shader:`
    vec4 generate() {
      vec2 id = floor(v_uv * u_scale);
      vec2 gv = fract(v_uv * u_scale);
      
      float n = hash(id);
      float mask = step(0.8, n);
      
      // Sub-divisions
      if (n > 0.4) {
        vec2 gv2 = fract(gv * 4.0);
        mask += step(0.9, max(gv2.x, gv2.y)) * 0.5;
      }
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Wafer Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Etched Metal`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Silicon`,type:`color`,default:[.1,.1,.12,1]}]},Wa=e({default:()=>Ga}),Ga={id:`moire_silk_artisan`,name:`Moire Silk`,category:`Abstract`,added:`2026-04-15`,description:`Water-like wavy fabric interference patterns found in heavy silk moire.`,shader:`
    vec4 generate() {
      float lines1 = sin(v_uv.x * 400.0);
      float lines2 = sin((v_uv.x + v_uv.y * 0.1) * 405.0);
      float mask = smoothstep(-0.5, 0.5, lines1 * lines2);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Sheen`,type:`color`,default:[.3,.35,.5,1]},{id:`u_secondary_color`,name:`Deep Silk`,type:`color`,default:[.1,.1,.2,1]}]},Ka=e({default:()=>qa}),qa={id:`molten_tungsten_artisan`,name:`Molten Tungsten`,category:`Industrial`,added:`2026-05-13`,description:`Superheated, cracked metal surface glowing intensely white-hot in the deep fissures.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    // Cellular noise for cracks
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float res = 8.0;
        for(int j=-1; j<=1; j++)
        for(int i=-1; i<=1; i++) {
            vec2 b = vec2(i, j);
            vec2 r = vec2(b) - f + random2(n + b);
            float d = dot(r, r);
            res = min(res, d);
        }
        return sqrt(res);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Warped uv for organic cracks
        vec2 warpUV = uv + vec2(noise(uv*2.0), noise(uv*2.0 + 5.2)) * 0.5;
        float v = voronoi(warpUV);
        
        // Crisp cracks
        float crack = smoothstep(0.0, 0.05, v);
        
        // Surface cooling noise
        float surfaceNoise = noise(uv * 5.0) * 0.5 + noise(uv * 10.0) * 0.5;
        vec4 coolSurface = mix(u_cool_metal, u_hot_metal, surfaceNoise * 0.5);
        
        // Add glow bloom around cracks
        float bloom = smoothstep(0.3, 0.0, v);
        
        // Heat animation
        float heatPulse = 0.5 + 0.5 * sin(u_heat * 2.0 + warpUV.x * 2.0);
        
        vec4 crackGlow = mix(u_heat_core, vec4(1.0, 1.0, 1.0, 1.0), heatPulse * 0.5); // White hot core
        crackGlow += bloom * u_heat_core * 0.5;
        
        return mix(crackGlow, coolSurface, crack);
    }
  `,uniforms:[{id:`u_scale`,name:`Crack Scale`,type:`float`,min:2,max:15,default:5},{id:`u_cool_metal`,name:`Cooled Surface`,type:`color`,default:[.1,.1,.12,1]},{id:`u_hot_metal`,name:`Warm Surface`,type:`color`,default:[.4,.1,.05,1]},{id:`u_heat_core`,name:`Fissure Core`,type:`color`,default:[1,.4,0,1]},{id:`u_heat`,name:`Heat Pulse`,type:`float`,min:0,max:100,default:0}]},Ja=e({default:()=>Ya}),Ya={id:`monstera_leaf_artisan`,name:`Monstera Split-Leaf`,category:`Natural`,added:`2026-04-15`,description:`The iconic tropical split-leaf silhouette with decorative voids.`,shader:`
    float circle(vec2 p, float r) { return length(p) - r; }
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Heart shape base
      float heart = d - (sin(a) * sqrt(abs(cos(a))) / (sin(a) + 1.4) - 2.0 * sin(a) + 2.0);
      float mask = smoothstep(0.1, 0.0, heart);
      
      // Secondary holes
      vec2 gv = fract(v_uv * u_scale * 2.0) - 0.5;
      if (length(gv) < 0.2) mask = 0.0;
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Leaf Size`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Foliage Color`,type:`color`,default:[0,.5,.2,1]},{id:`u_secondary_color`,name:`Negative Space`,type:`color`,default:[0,0,0,0]}]},Xa=e({default:()=>Za}),Za={id:`moon_jelly_glow`,name:`Moon Jelly Glow`,category:`Ocean`,added:`2026-06-11`,description:`Translucent moon jellies drifting in dark water — glassy bell rims, four-leaf gonad rings and trailing wisps of oral arms.`,shader:`
    // One jelly bell at local coords p (cell-centred), returns added light
    vec3 jelly_mjg(vec2 p, float seed, vec3 glow, vec3 organ) {
      float r = length(p);
      vec3 c = vec3(0.0);

      // bell body: translucent dome, brightest at the thin rim
      float bell = smoothstep(0.42, 0.36, r);
      float rim = exp(-pow((r - 0.36) * 22.0, 2.0));
      float body = smoothstep(0.40, 0.0, r);
      c += glow * body * 0.18;                       // faint interior haze
      c += glow * rim * 0.85;                        // glowing bell margin
      // radial canals: fine spokes from the centre
      float ang = atan(p.y, p.x);
      float canal = pow(abs(sin(ang * 8.0 + seed)), 24.0);
      c += glow * canal * body * 0.20;

      // four-leaf gonad rings: horseshoes arranged in a clover
      for (int k = 0; k < 4; k++) {
        float a = (float(k) + 0.5) * 1.5708 + seed * 0.3;
        vec2 gc = vec2(cos(a), sin(a)) * 0.13;
        float gd = length(p - gc);
        float ring = exp(-pow((gd - 0.075) * 38.0, 2.0));
        // horseshoe: dim the ring on the side facing the centre
        float open_side = smoothstep(-0.02, 0.06, dot(normalize(p - gc + 0.0001), normalize(gc)));
        c += organ * ring * (0.35 + 0.65 * open_side) * bell;
      }

      // scalloped fringe just outside the rim (marginal tentacles)
      float fringe = exp(-pow((r - 0.42) * 30.0, 2.0));
      fringe *= 0.5 + 0.5 * sin(ang * 36.0 + seed * 7.0);
      c += glow * fringe * 0.30;

      // trailing oral-arm wisps below the bell, fading with depth
      if (p.y < -0.30) {
        float wisp = exp(-p.x * p.x * 120.0) * exp((p.y + 0.30) * 4.0);
        wisp *= 0.6 + 0.4 * sin(p.y * 30.0 + seed * 9.0 + p.x * 20.0);
        c += glow * clamp(wisp, 0.0, 1.0) * 0.35;
      }
      return c;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- midnight water with drifting haze ---
      vec3 water = u_water_color.rgb;
      float haze = fbm(uv * 4.0) * 0.5 + 0.5;
      vec3 col = water * (0.5 + haze * 0.5);
      // marine snow
      col += vec3(0.30, 0.34, 0.40) * step(0.991, hash(floor(uv * 180.0))) * 0.5;

      vec3 glow  = u_glow_color.rgb;
      vec3 organ = u_organ_color.rgb;

      // --- jellies on a jittered grid, 3x3 neighbourhood ---
      vec2 g = uv * u_scale;
      vec2 id = floor(g);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 cid = id + o;
          float h = hash(cid + 5.5);
          if (h < 0.30) continue;                 // some cells empty
          vec2 c = cid + 0.5 + (vec2(hash(cid + 1.7), hash(cid + 8.3)) - 0.5) * 0.4;
          vec2 p = (g - c) / (0.75 + 0.5 * h);    // size variation
          col += jelly_mjg(p, h * 43.0, glow, organ) * (0.55 + 0.45 * h);
        }
      }

      // faint distant layer: smaller, dimmer jellies behind
      vec2 g2 = uv * u_scale * 2.3 + 7.0;
      vec2 id2 = floor(g2);
      float h2 = hash(id2 + 2.2);
      if (h2 > 0.55) {
        vec2 c2 = id2 + 0.5;
        vec2 p2 = g2 - c2;
        col += jelly_mjg(p2, h2 * 17.0, glow * 0.5, organ * 0.4) * 0.4;
      }

      // gentle bloom where light accumulates
      col += glow * smoothstep(0.5, 1.2, dot(col, vec3(0.333))) * 0.08;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Jelly Density`,type:`float`,min:1,max:6,default:2.5},{id:`u_glow_color`,name:`Bell Glow`,type:`color`,default:[.55,.75,.95,1]},{id:`u_organ_color`,name:`Gonad Rings`,type:`color`,default:[.85,.55,.7,1]},{id:`u_water_color`,name:`Water Color`,type:`color`,default:[.02,.04,.1,1]}]},Qa=e({default:()=>$a}),$a={id:`morpho_iridescence_natural`,name:`Morpho Iridescence`,category:`Natural`,added:`2026-05-01`,description:`Deep structural blue iridescence of the Morpho butterfly wing — pure nanostructure diffraction blue with fine scale-row banding and angle-dependent shimmer.`,shader:`
    float hash11(float p) { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)  { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    // 2D smooth noise for micro-distortion
    float smoothNoise2D(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      // Wing scale rows: horizontal bands at u_scale_freq frequency
      float scaleFreq  = u_scale_freq;
      float rowY       = v_uv.y * scaleFreq;

      // Slight horizontal undulation of rows (mimics natural scale misalignment)
      float rowWaver   = smoothNoise1D(v_uv.x * 8.0) * 0.6;
      float rowLocal   = fract(rowY + rowWaver);
      float rowIndex   = floor(rowY + rowWaver);

      // Within-row brightness — each scale row is a ridge-valley structure
      // Bright at scale top, darker at row gap
      float rowBright  = smoothstep(0.0, 0.28, rowLocal) * (1.0 - smoothstep(0.72, 1.0, rowLocal));

      // Per-row tiny random brightness offset (natural variation in scale height)
      float rowVar     = 0.88 + hash11(rowIndex) * 0.24;

      // Angle-dependent shimmer: simulate view-angle dependence with UV position
      // (since we have no real normals, use distance from a "normal incidence" center)
      float dx         = v_uv.x - 0.5;
      float dy         = v_uv.y - 0.5;
      float angleFactor = 1.0 - (dx * dx + dy * dy) * 2.0 * u_shimmer;
      angleFactor      = clamp(angleFactor, 0.0, 1.0);

      // Micro-distortion noise on the diffraction (gives "depth" to the shimmer)
      float microNoise = smoothNoise2D(v_uv * 18.0) * 0.08 - 0.04;

      // Base blue from uniform, modulated by angle and row structure
      vec3 baseBlue    = u_base_blue.rgb;

      // At high angle (edges), the structural color shifts slightly toward UV (darker, more violet)
      float edgeShift  = 1.0 - angleFactor;
      vec3  violetShift = vec3(-0.03, -0.06, 0.05);  // subtle violet push at edges
      vec3  col         = baseBlue + violetShift * edgeShift;

      // Combine row modulation and angle brightness
      float brightness = rowBright * rowVar * angleFactor;
      brightness       = clamp(brightness + microNoise, 0.0, 1.0);

      col *= (0.25 + 0.75 * brightness);  // dark minimum for scale gaps

      // Specular-like shimmer band — narrow bright stripe that follows normal incidence
      float shimmerBand = exp(-40.0 * (dx * dx + dy * dy)) * u_shimmer * 0.35;
      col += baseBlue * shimmerBand;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_base_blue`,name:`Morpho Blue`,type:`color`,default:[.05,.15,.92,1]},{id:`u_scale_freq`,name:`Scale Row Frequency`,type:`float`,min:10,max:80,default:40},{id:`u_shimmer`,name:`Shimmer Intensity`,type:`float`,min:0,max:1,default:.7}]},eo=e({default:()=>to}),to={id:`mother_of_pearl_artisan`,name:`Mother of Pearl`,category:`Natural`,added:`2026-04-15`,description:`Iridescent-like wavy organic noise smears mimicking biological nacre.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float m = noise(v_uv * u_scale * 2.0 + n);
      return mix(u_secondary_color, u_primary_color, m);
    }
  `,uniforms:[{id:`u_scale`,name:`Iridescence Detail`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Shell Pearl`,type:`color`,default:[.9,.95,1,1]},{id:`u_secondary_color`,name:`Shell Deep`,type:`color`,default:[.8,.85,.9,1]}]},no=e({default:()=>ro}),ro={id:`mud_cracks_artisan`,name:`Dried Mud`,category:`Natural`,added:`2026-04-15`,description:`High-fidelity organic polygonal fissures mimicking cracked desert earth.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.05, 0.1, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Crack Density`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Earth`,type:`color`,default:[.4,.3,.2,1]},{id:`u_secondary_color`,name:`Fissure`,type:`color`,default:[.15,.1,.05,1]}]},io=e({default:()=>ao}),ao={id:`mud_splatter`,name:`Mud Splatter`,category:`Racing`,added:`2026-04-30`,description:`Dried mud and dirt splatter with organic layered blobs of varying size and opacity, typical of rally or race car bodywork.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.2; a *= 0.48; }
      return v;
    }

    // Single splatter blob centred at c with radius r
    float blob(vec2 uv, vec2 c, float r) {
      // Organic distortion via fbm
      float distort = fbm(uv * 5.0 + c * 4.3) * 0.25 * r;
      vec2 diff = uv - c;
      // Stretch in X axis slightly (horizontal splatter motion)
      diff.x *= 0.75;
      float d = length(diff) - distort;
      return smoothstep(r, r * 0.4, d);
    }

    // Small satellite droplets around a main blob
    float droplets(vec2 uv, vec2 c, float seed) {
      float acc = 0.0;
      for (int i = 0; i < 6; i++) {
        float fi = float(i);
        float ang   = hash(vec2(seed + fi, 1.1)) * 6.28318;
        float dist  = 0.04 + hash(vec2(seed + fi, 2.3)) * 0.10;
        float dropR = 0.005 + hash(vec2(seed + fi, 3.7)) * 0.018;
        vec2 dropC  = c + vec2(cos(ang), sin(ang)) * dist;
        acc = max(acc, blob(uv, dropC, dropR * u_size));
      }
      return acc;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float mudTotal = 0.0;

      // Main blobs at pseudo-random positions scaled by u_density
      float count = u_density;
      // We iterate a fixed number but break early based on count via weight
      for (int i = 0; i < 20; i++) {
        float fi = float(i);
        // Weight fades blobs beyond u_density
        float weight = clamp(count - fi, 0.0, 1.0);
        if (weight < 0.001) break;

        vec2 centre = vec2(hash(vec2(fi * 1.7, 0.3)), hash(vec2(fi * 2.3, 0.8)));
        float r = (0.04 + hash(vec2(fi, 5.5)) * 0.09) * u_size;

        float b = blob(uv, centre, r) * weight;
        // Satellite drops
        float d = droplets(uv, centre, fi * 10.0 + 1.3) * weight;
        mudTotal = max(mudTotal, max(b, d));
      }

      // Thin dried mud edge — slightly lighter, more cracked looking
      float edgeNoise = fbm(uv * 20.0) * 0.1;
      float mudThick  = mudTotal;
      float mudEdge   = smoothstep(0.1, 0.4, mudThick) * (1.0 - smoothstep(0.4, 0.9, mudThick));
      mudEdge *= (0.5 + edgeNoise);

      // Mud colour variation — darker wet centre, lighter dried edge
      vec3 mudDark  = u_mud_color.rgb * 0.6;
      vec3 mudLight = mix(u_mud_color.rgb, vec3(0.55, 0.48, 0.36), 0.5);
      vec3 mudCol   = mix(mudLight, mudDark, smoothstep(0.3, 0.9, mudThick));
      mudCol = mix(mudCol, mudLight * 1.2, mudEdge);

      // Substrate
      float subGrain = noise(uv * 80.0) * 0.03;
      vec3 subCol = u_substrate.rgb + vec3(subGrain);

      vec3 col = mix(subCol, mudCol, mudTotal * 0.95);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_mud_color`,name:`Mud Color`,type:`color`,default:[.3,.22,.12,1]},{id:`u_substrate`,name:`Substrate`,type:`color`,default:[.15,.13,.12,1]},{id:`u_density`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_size`,name:`Blob Size`,type:`float`,min:.5,max:3,default:1}]},oo=e({default:()=>so}),so={id:`multi_env_camo`,name:`Multi-Environment Camo`,category:`Organic`,added:`2026-05-12`,description:`An advanced shader that uses smooth gradients and soft blending between layers rather than hard edges, creating a highly modern, versatile camouflage.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      float n1 = fbm(uv);
      float n2 = fbm(uv + vec2(12.3, 4.5));
      float n3 = fbm(uv * 2.0 + vec2(33.1, 11.2));
      
      // Use smoothstep to create smooth gradient transitions instead of hard cuts
      float blend1 = smoothstep(-0.2, 0.4, n1);
      float blend2 = smoothstep(0.1, 0.6, n2);
      float blend3 = smoothstep(0.2, 0.7, n3);
      
      vec4 color = mix(u_color_base, u_color_1, blend1);
      color = mix(color, u_color_2, blend2);
      
      // Add smaller, sharper dark/light accents
      float n4 = snoise(uv * 4.0);
      float n5 = snoise(uv * 4.0 + vec2(50.0));
      
      if (n4 > 0.5) {
          color = mix(color, u_color_3, smoothstep(0.5, 0.7, n4));
      }
      if (n5 > 0.6) {
          color = mix(color, u_color_4, smoothstep(0.6, 0.8, n5));
      }
      
      return color;
    }
  `,variants:[{name:`Arid (Default)`,uniforms:{u_color_base:[.65,.6,.5,1],u_color_1:[.55,.5,.4,1],u_color_2:[.45,.4,.35,1],u_color_3:[.3,.25,.2,1],u_color_4:[.8,.75,.65,1]}},{name:`Tropic`,uniforms:{u_color_base:[.35,.45,.25,1],u_color_1:[.25,.35,.15,1],u_color_2:[.15,.25,.1,1],u_color_3:[.05,.15,.05,1],u_color_4:[.55,.65,.4,1]}},{name:`Alpine`,uniforms:{u_color_base:[.85,.85,.9,1],u_color_1:[.7,.7,.75,1],u_color_2:[.55,.55,.6,1],u_color_3:[.3,.3,.35,1],u_color_4:[.95,.95,1,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.12,.12,.12,1],u_color_2:[.09,.09,.09,1],u_color_3:[.05,.05,.05,1],u_color_4:[.25,.25,.25,1]}}],uniforms:[{id:`u_scale`,name:`Blend Scale`,type:`float`,min:1,max:20,default:4},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.65,.6,.5,1]},{id:`u_color_1`,name:`Gradient 1`,type:`color`,default:[.55,.5,.4,1]},{id:`u_color_2`,name:`Gradient 2`,type:`color`,default:[.45,.4,.35,1]},{id:`u_color_3`,name:`Dark Accent`,type:`color`,default:[.3,.25,.2,1]},{id:`u_color_4`,name:`Light Accent`,type:`color`,default:[.8,.75,.65,1]}]},co=e({default:()=>lo}),lo={id:`multicam`,name:`MultiCam`,category:`Organic`,added:`2026-06-11`,description:`The modern multi-terrain camouflage standard: a drifting tan-to-cream base gradient layered with organic olive and brown blobs and the signature small dark and cream spots.`,shader:`

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Signature MultiCam trait: the base colour drifts horizontally
      // between tan and cream across the fabric.
      float drift = snoise(vec2(v_uv.x * 2.5, v_uv.y * 0.6)) * 0.5 + 0.5;
      vec4 color = mix(u_color_base, u_color_light, drift * 0.65);

      // Large organic blobs — olive first, brown layered over,
      // with fairly crisp (but not hard) edges like printed fabric.
      float blob1 = fbm(uv);
      float blob2 = fbm(uv * 1.25 + vec2(41.3, 17.8));
      color = mix(color, u_color_olive, smoothstep(0.14, 0.24, blob1));
      color = mix(color, u_color_brown, smoothstep(0.22, 0.32, blob2));

      // Small rounded accent spots — dark brown and pale cream
      float spot1 = snoise(uv * 2.8 + vec2(7.7, 91.0));
      float spot2 = snoise(uv * 2.8 + vec2(55.5, 23.0));
      color = mix(color, u_color_dark, smoothstep(0.50, 0.60, spot1));
      color = mix(color, u_color_light, smoothstep(0.58, 0.68, spot2) * 0.9);

      // Subtle fabric weave grain
      float grain = snoise(uv * 60.0) * 0.025;
      color.rgb += grain;

      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Original`,uniforms:{u_color_base:[.62,.56,.43,1],u_color_light:[.85,.81,.69,1],u_color_olive:[.42,.43,.3,1],u_color_brown:[.49,.39,.28,1],u_color_dark:[.27,.21,.15,1]}},{name:`Black`,uniforms:{u_color_base:[.2,.2,.21,1],u_color_light:[.38,.38,.4,1],u_color_olive:[.13,.13,.14,1],u_color_brown:[.24,.23,.25,1],u_color_dark:[.05,.05,.06,1]}},{name:`Tropic`,uniforms:{u_color_base:[.3,.4,.22,1],u_color_light:[.55,.62,.38,1],u_color_olive:[.18,.28,.13,1],u_color_brown:[.32,.27,.17,1],u_color_dark:[.08,.14,.07,1]}},{name:`Arid`,uniforms:{u_color_base:[.72,.65,.5,1],u_color_light:[.89,.85,.73,1],u_color_olive:[.55,.5,.36,1],u_color_brown:[.6,.49,.35,1],u_color_dark:[.38,.3,.21,1]}},{name:`Alpine`,uniforms:{u_color_base:[.78,.79,.82,1],u_color_light:[.94,.94,.96,1],u_color_olive:[.58,.6,.65,1],u_color_brown:[.66,.66,.7,1],u_color_dark:[.4,.41,.46,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base Tan`,type:`color`,default:[.62,.56,.43,1]},{id:`u_color_light`,name:`Highlight Cream`,type:`color`,default:[.85,.81,.69,1]},{id:`u_color_olive`,name:`Olive Blobs`,type:`color`,default:[.42,.43,.3,1]},{id:`u_color_brown`,name:`Brown Blobs`,type:`color`,default:[.49,.39,.28,1]},{id:`u_color_dark`,name:`Dark Spots`,type:`color`,default:[.27,.21,.15,1]}]},uo=e({default:()=>fo}),fo={id:`mushroom_gills_artisan`,name:`Fungi Gills`,category:`Natural`,added:`2026-04-16`,description:`Radiant organic ridges found on the underside of exotic fungal caps.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float gills = sin(angle * u_scale);
      float mask = step(0.0, gills);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Gill Count`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Gill Ridge`,type:`color`,default:[.8,.75,.7,1]},{id:`u_secondary_color`,name:`Cap Depth`,type:`color`,default:[.4,.35,.3,1]}]},po=e({default:()=>mo}),mo={id:`mylar_heatshield`,name:`Mylar Heat Shield`,category:`Racing`,added:`2026-05-01`,description:`Crinkled mylar or aluminium heat shield foil with bright specular hotspots and crinkle shadow valleys.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_mh(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_mh(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_mh(i);
      float b = hash1_mh(i + vec2(1.0, 0.0));
      float c = hash1_mh(i + vec2(0.0, 1.0));
      float d = hash1_mh(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for wrinkle surface
    float fbm_mh(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 4; i++) {
        v += a * smoothnoise_mh(p * s);
        s *= 2.1;
        a *= 0.50;
      }
      return v;
    }

    // Approximate gradient of FBM for surface normal
    vec2 fbm_gradient(vec2 p) {
      float eps = 0.02;
      float dx = fbm_mh(p + vec2(eps, 0.0)) - fbm_mh(p - vec2(eps, 0.0));
      float dy = fbm_mh(p + vec2(0.0, eps)) - fbm_mh(p - vec2(0.0, eps));
      return vec2(dx, dy) / (2.0 * eps);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Crinkle noise coordinates — scaled by crinkle intensity
      vec2 crinkleUV = uv * u_crinkle;

      // Height field from FBM
      float height = fbm_mh(crinkleUV);

      // Surface gradient — used as a fake normal perturbation
      vec2 grad = fbm_gradient(crinkleUV);

      // Perturbed "normal" in 2D (we simulate a z component)
      // Normal direction: (-grad.x, -grad.y, 1.0) normalized approximately
      float normal_z = 1.0 / sqrt(1.0 + dot(grad, grad) * 0.5);
      float normal_x = -grad.x * normal_z * 0.4;
      float normal_y = -grad.y * normal_z * 0.4;

      // Light direction — coming from upper-left (simulated environment)
      vec3 light_dir = normalize(vec3(0.4, 0.6, 1.0));
      vec3 n = normalize(vec3(normal_x, normal_y, normal_z));
      float ndotl = clamp(dot(n, light_dir), 0.0, 1.0);

      // Environment: bright sky gradient from above
      float sky_env = clamp(0.5 + 0.5 * normal_y, 0.0, 1.0);

      // Specular reflection — approximate mirror highlight
      vec3 view_dir = vec3(0.0, 0.0, 1.0);
      vec3 reflect_dir = vec3(-normal_x * 2.0, -normal_y * 2.0, 1.0);
      float spec_raw = clamp(reflect_dir.z, 0.0, 1.0);
      float spec = pow(spec_raw, 18.0) * u_reflectivity;

      // Foil base color
      vec3 foil = u_foil_color.rgb;
      // Shadow color: dark version of foil
      vec3 shadow_col = foil * 0.15;
      // Bright highlight: near white with foil tint
      vec3 highlight_col = mix(foil, vec3(1.0, 1.0, 1.0), 0.7);

      // Compose: diffuse bounce + specular hotspot
      vec3 col = mix(shadow_col, foil, ndotl);
      // Sky environment adds secondary bounce
      col = mix(col, foil * 1.1, sky_env * 0.25);
      // Specular hotspot is bright white
      col += highlight_col * spec;

      // Height-based crinkle texture: ridges catch more light
      float ridge = smoothstep(0.45, 0.65, height);
      col = mix(col, foil * 1.2, ridge * 0.15);

      // Micro-sheen: fine dimple structure
      float micro = smoothnoise_mh(uv * 80.0 * u_crinkle);
      col += (micro - 0.5) * 0.04;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_foil_color`,name:`Foil Color`,type:`color`,default:[.92,.75,.25,1]},{id:`u_crinkle`,name:`Crinkle Intensity`,type:`float`,min:1,max:10,default:4},{id:`u_reflectivity`,name:`Highlight Brightness`,type:`float`,min:.3,max:2,default:1.4}]},ho=e({default:()=>go}),go={id:`nanotech_cells_artisan`,name:`Nano Plating`,category:`Technology`,added:`2026-04-16`,description:`Microscopic hexagonal active plating designed for dynamic aerodynamic surfaces.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Nano Zoom`,type:`float`,min:10,max:100,default:60},{id:`u_primary_color`,name:`Plate Surface`,type:`color`,default:[.15,.15,.18,1]},{id:`u_secondary_color`,name:`Nano Joint`,type:`color`,default:[0,.8,1,1]}]},_o=e({default:()=>vo}),vo={id:`nappa_leather_artisan`,name:`Nappa Leather`,category:`Racing`,added:`2026-04-16`,description:`Smooth premium leather grain with subtle organic pores found in high-end bucket seats.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Zoom`,type:`float`,min:50,max:200,default:100},{id:`u_primary_color`,name:`Leather Top`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Pore Deep`,type:`color`,default:[.05,.05,.05,1]}]},yo=e({default:()=>bo}),bo={id:`nautilus_spiral`,name:`Nautilus Spiral`,category:`Ocean`,added:`2026-06-11`,description:`A chambered nautilus in cross-section — logarithmic spiral whorls, curved septa walls and flame-striped cream shell.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float r = max(length(uv) * 2.0, 0.001);
      float ang = atan(uv.y, uv.x);

      vec3 shell  = u_shell_color.rgb;
      vec3 stripe = u_stripe_color.rgb;

      // --- logarithmic spiral coordinate ---
      // s increases by 1 every whorl outward; fract(s) = position across the whorl
      float b = u_tightness;                       // growth rate per turn
      float s = log(r) / b - ang / 6.28318;
      float whorl = floor(s);
      float wf = fract(s);

      // --- base shell: cream with subtle radial sheen ---
      float sheen = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 col = shell * (0.88 + 0.18 * sheen);
      col += (noise(v_uv * 240.0) - 0.5) * 0.035;  // porcelain grain

      // --- whorl wall: dark spiral seam between successive turns ---
      float wall = smoothstep(0.06, 0.0, min(wf, 1.0 - wf));
      col = mix(col, shell * 0.45, wall * 0.85);
      // shading across each whorl tube: rounded, lit toward the outer side
      float tube = sin(wf * 3.14159);
      col *= 0.80 + 0.28 * tube;

      // --- septa: curved chamber walls subdividing each whorl ---
      // chamber index advances along the spiral arc
      float arc = (ang / 6.28318 + s) * u_chambers; // marches around the coil
      float ch = fract(arc);
      float septa = smoothstep(0.05, 0.0, min(ch, 1.0 - ch));
      // septa fade out across the outermost (living) chamber
      float living = smoothstep(0.0, -1.0, s + 1.0);
      col = mix(col, shell * 0.50, septa * 0.7 * (1.0 - living));
      // nacre gleam inside each chamber: brightest just past each septum
      float nacre = smoothstep(0.05, 0.35, ch) * smoothstep(0.95, 0.55, ch);
      col += vec3(0.10, 0.09, 0.07) * nacre * tube * 0.6;
      // iridescent cast in the inner chambers
      vec3 irid = vec3(0.5 + 0.5 * sin(arc * 2.0),
                       0.5 + 0.5 * sin(arc * 2.0 + 2.1),
                       0.5 + 0.5 * sin(arc * 2.0 + 4.2));
      col = mix(col, col * (0.85 + irid * 0.25), smoothstep(0.6, 0.0, r) * 0.5);

      // --- flame stripes: red-brown bands sweeping over the outer shell ---
      // stripes follow radial-ish lines, irregular width via noise
      float fl = sin(ang * 14.0 + snoise(vec2(ang * 2.0, s * 1.5)) * 1.5);
      float flame = smoothstep(0.15, 0.55, fl);
      // stripes belong to the outer whorls only, fading toward the apex
      float outer = smoothstep(0.25, 0.65, r);
      // and they break up across each whorl (tiger striping)
      flame *= 0.65 + 0.35 * snoise(vec2(s * 4.0, ang * 3.0));
      col = mix(col, stripe, clamp(flame, 0.0, 1.0) * outer * 0.85);
      // stripe edges darken slightly for printed depth
      float fl_edge = smoothstep(0.10, 0.18, fl) - smoothstep(0.18, 0.30, fl);
      col = mix(col, stripe * 0.6, clamp(fl_edge, 0.0, 1.0) * outer * 0.5);

      // --- apex: tight dark coil centre ---
      col = mix(col, shell * 0.40, smoothstep(0.06, 0.0, r));

      // gentle top-light across the whole shell
      col *= 0.92 + 0.12 * (1.0 - v_uv.y);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_tightness`,name:`Spiral Tightness`,type:`float`,min:.15,max:.8,default:.35},{id:`u_chambers`,name:`Chamber Count`,type:`float`,min:4,max:20,default:11},{id:`u_shell_color`,name:`Shell Color`,type:`color`,default:[.93,.88,.78,1]},{id:`u_stripe_color`,name:`Stripe Color`,type:`color`,default:[.55,.22,.1,1]}]},xo=e({default:()=>So}),So={id:`nebula_dust_artisan`,name:`Nebula Dust`,category:`Natural`,added:`2026-04-15`,description:`Soft, colored organic dust clouds found in interstellar gas formations.`,shader:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      n += noise(v_uv * u_scale * 2.0) * 0.5;
      float mask = smoothstep(0.2, 0.8, n / 1.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Gas Density`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Ionized Gas`,type:`color`,default:[.6,.1,.8,1]},{id:`u_secondary_color`,name:`Vacuum`,type:`color`,default:[0,0,.05,1]}]},Co=e({default:()=>wo}),wo={id:`neon_marquee_chase`,name:`Marquee Chase Lights`,category:`Retro`,added:`2026-06-11`,description:`Theatre-marquee bulb rows frozen mid-chase — every third incandescent globe blazing in its brass socket, the rest cooling amber to dead glass on enamelled red channel.`,shader:`
    vec4 generate() {
      float rows = u_rows;
      float ry = v_uv.y * rows;
      float row = floor(ry);
      float fy = fract(ry);

      // --- enamelled channel panel between bulb strips ---
      vec3 panel = u_panel_color.rgb;
      panel *= 0.88 + noise(v_uv * 140.0) * 0.18;          // orange-peel enamel
      panel *= 0.85 + 0.15 * sin(fy * 3.14159);            // channel curvature
      // gold pinstripes at each band edge
      float edge = min(fy, 1.0 - fy);
      float pin = (1.0 - smoothstep(0.035, 0.05, edge)) - (1.0 - smoothstep(0.012, 0.02, edge));
      vec3 gold = vec3(0.78, 0.60, 0.22);
      vec3 col = mix(panel, gold * (0.8 + noise(v_uv * 300.0) * 0.4), clamp(pin, 0.0, 1.0));

      // --- bulb strip down the middle of each band ---
      float count = u_bulb_count;
      float bx = v_uv.x * count + mod(row, 2.0) * 0.5;     // stagger alternate rows
      float bulbIdx = floor(bx);
      vec2 bf = vec2(fract(bx) - 0.5, (fy - 0.5) * (count / rows));
      float d = length(bf);

      // chase phase: position in the 1-in-3 cycle (rows counter-rotate)
      float phase = mod(bulbIdx + row * 2.0, 3.0);
      float lit  = step(phase, 0.5);                        // full burn
      float warm = step(0.5, phase) * step(phase, 1.5);     // cooling filament

      vec3 litc = u_lit_color.rgb;

      // socket: brass collar
      float collar = (1.0 - smoothstep(0.30, 0.36, d)) - (1.0 - smoothstep(0.24, 0.28, d));
      col = mix(col, gold * (0.55 + 0.45 * max(-bf.y * 3.0, 0.0)), clamp(collar, 0.0, 1.0));

      // glass globe
      float globe = 1.0 - smoothstep(0.24, 0.27, d);
      // dead bulb: smoked glass with a sliver of filament
      vec3 glass = vec3(0.10, 0.09, 0.09) + vec3(0.06) * (1.0 - d * 3.5);
      float fil = exp(-pow(bf.x * 30.0, 2.0)) * exp(-pow((bf.y + 0.04) * 22.0, 2.0));
      glass += vec3(0.25, 0.14, 0.06) * fil;
      // cooling bulb: amber ember
      vec3 ember = mix(glass, litc * vec3(0.7, 0.45, 0.25), 0.75 - d * 1.8);
      // lit bulb: white-hot core falling to amber rim
      vec3 burn = mix(litc * 1.6, litc * vec3(1.0, 0.7, 0.4), smoothstep(0.0, 0.26, d));

      vec3 bulb = glass;
      bulb = mix(bulb, ember, warm);
      bulb = mix(bulb, burn, lit);
      // specular pip upper-left on every globe
      bulb += vec3(0.8) * exp(-dot(bf - vec2(-0.07, 0.08), bf - vec2(-0.07, 0.08)) * 600.0) * (0.4 + lit);
      col = mix(col, bulb, globe);

      // halo spilling onto the enamel from lit bulbs
      col += litc * exp(-max(d - 0.24, 0.0) * 7.0) * lit * u_glow * 0.6;
      col += litc * vec3(1.0, 0.6, 0.3) * exp(-max(d - 0.24, 0.0) * 12.0) * warm * u_glow * 0.15;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_rows`,name:`Bulb Rows`,type:`float`,min:2,max:8,default:4},{id:`u_bulb_count`,name:`Bulbs Per Row`,type:`float`,min:6,max:24,default:12},{id:`u_glow`,name:`Halo Spill`,type:`float`,min:0,max:2,default:1},{id:`u_lit_color`,name:`Filament Glow`,type:`color`,default:[1,.85,.55,1]}]},To=e({default:()=>Eo}),Eo={id:`neon_tubes_artisan`,name:`Neon Path`,category:`Abstract`,added:`2026-04-16`,description:`Glowing tubular neon paths mimicking high-fidelity urban lighting rigs.`,shader:`
    vec4 generate() {
      float y = fract(v_uv.y * u_scale);
      float mask = smoothstep(0.1, 0.2, y) * smoothstep(0.9, 0.8, y);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tube Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Neon Glow`,type:`color`,default:[1,0,.5,1]},{id:`u_secondary_color`,name:`Vacuum Background`,type:`color`,default:[.05,0,.05,1]}]},Do=e({default:()=>Oo}),Oo={id:`neoprene`,name:`Neoprene`,category:`Industrial`,added:`2026-05-01`,description:`Dense rubber neoprene with a characteristic small-cell foam surface texture and slightly glossy matte finish, as used in wetsuits and padding.`,shader:`

    // Worley nearest-cell distance for foam cells
    float worley(vec2 uv, float scale) {
      vec2 scaled = uv * scale;
      vec2 cell = floor(scaled);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 jitter = vec2(hash(nc + vec2(4.1, 2.7)), hash(nc + vec2(8.3, 5.1)));
          vec2 pt = nc + 0.5 + (jitter - 0.5) * 0.65;
          float d = length(scaled - pt);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Cell distance field — each cell is a foam bubble
      float cell = worley(uv, u_cell_size);

      // Cell walls are darker; cell centres are lighter (puffy/raised)
      // Invert: low distance = near wall = dark; high = centre = light
      float cellLight = smoothstep(0.0, 0.45, cell);

      // Subtle secondary micro-bump — smaller cells overlaid
      float micro = worley(uv, u_cell_size * 3.5) * 0.25;

      // Combined height map
      float height = cellLight * 0.75 + micro * 0.25;

      // Base colour modulated by height (puffy top catches more light)
      vec3 col = u_base_color.rgb * mix(0.55, 1.15, height);

      // Cell wall shadow — add slight blue-grey tint in valleys
      float wallShadow = (1.0 - cellLight) * 0.08;
      col -= vec3(wallShadow * 0.4, wallShadow * 0.4, wallShadow * 0.3);

      // Glossy sheen — specular highlight near the top of each bump
      // Approximate: bright where height is near peak
      float specMask = pow(max(0.0, cellLight - 0.6) / 0.4, 2.0);
      float sheen = specMask * u_sheen * 0.4;
      col += vec3(sheen * 0.9, sheen * 0.95, sheen);

      // Surface-level noise for slight material variation
      float surfVar = noise(uv * u_cell_size * 8.0) * 0.04 - 0.02;
      col += vec3(surfVar);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_cell_size`,name:`Cell Size`,type:`float`,min:5,max:40,default:18},{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.05,.05,.05,1]},{id:`u_sheen`,name:`Sheen`,type:`float`,min:0,max:1,default:.3}]},ko=e({default:()=>Ao}),Ao={id:`neural_net_artisan`,name:`Neural Network`,category:`Technology`,added:`2026-04-16`,description:`Interconnected nodes and synthetic logic lines mimicking artificial intelligence structures.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.05, 0.0, abs(m_dist - 0.2));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Node Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Synapse`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Neural Base`,type:`color`,default:[.01,.02,.05,1]}]},jo=e({default:()=>Mo}),Mo={id:`nomex_weave`,name:`Nomex Fire Suit Weave`,category:`Racing`,added:`2026-05-13`,description:`FIA-grade Nomex aramid weave as found on fire suits, helmet liners, and race car interiors. Tight 2/1 diagonal twill structure.`,shader:`
    float hash_nw(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Slight diagonal — Nomex is woven at ~30° off horizontal
      float ang = u_angle * 0.5236 + 0.5236; // range ~30°-60°
      float ca = cos(ang), sa = sin(ang);
      uv = mat2(ca, -sa, sa, ca) * uv;

      vec2 cell = fract(uv);
      vec2 cid  = floor(uv);

      // 2/1 twill: each warp thread goes over 2 weft then under 1
      float row    = mod(cid.y, 3.0);
      float col_   = mod(cid.x, 3.0);
      float warpTop = step(0.01, mod(col_ + row, 3.0) - 0.99);

      // Narrow fiber profiles — Nomex has a tight, fine weave
      float fR = 0.38;
      float fE = 0.055;
      float warpP = smoothstep(fR, fR - fE, abs(cell.y - 0.5));
      float weftP = smoothstep(fR, fR - fE, abs(cell.x - 0.5));

      float topP = mix(weftP, warpP, warpTop);
      float btmP = mix(warpP, weftP, warpTop);

      // Sheen along fiber axis
      float warpSheen = max(0.0, 1.0 - abs(cell.x - 0.5) * 3.5) * warpP;
      float weftSheen = max(0.0, 1.0 - abs(cell.y - 0.5) * 3.5) * weftP;
      float topSheen  = mix(weftSheen, warpSheen, warpTop) * 0.18;

      // Fine strand variation
      float strand = hash_nw(cid) * 0.04 - 0.02;

      float fiber = topP * (0.85 + strand) + btmP * 0.45 + topSheen;

      // Nomex colour: cream/golden-tan base
      vec3 base  = u_fiber_color.rgb;
      vec3 shadow = base * 0.40;
      vec3 col   = mix(shadow, base, fiber);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale`,type:`float`,default:90,min:30,max:220},{id:`u_angle`,name:`Weave Angle`,type:`float`,default:.5,min:0,max:1},{id:`u_fiber_color`,name:`Fibre Colour`,type:`color`,default:[.92,.84,.62,1]}]},No=e({default:()=>Po}),Po={id:`obsidian_fracture_artisan`,name:`Obsidian Flow`,category:`Geology`,added:`2026-04-16`,description:`Sharp, mirror-like volcanic glass fractures found in fresh obsidian flows.`,shader:`
    vec4 generate() {
      float n = hash(floor(v_uv * u_scale));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Fracture Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Glass High`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Glass Shore`,type:`color`,default:[0,0,0,1]}]},Fo=e({default:()=>Io}),Io={id:`octopus_suckers`,name:`Octopus Suckers`,category:`Ocean`,added:`2026-06-11`,description:`Underside of octopus arms — staggered double rows of fleshy suction cups with raised rims and deep cup centers on mottled mauve skin.`,shader:`
    // One sucker: returns vec2(mask, height 0..1) for shading
    vec2 sucker_ocs(vec2 p, float radius) {
      float d = length(p) / radius;
      float mask = smoothstep(1.0, 0.92, d);
      // height profile: raised outer rim, dished cup, deep centre hole
      float rim = exp(-pow((d - 0.78) * 5.5, 2.0));          // rim torus
      float cup = smoothstep(0.78, 0.30, d) * 0.45;          // dished interior
      float hole = smoothstep(0.22, 0.05, d);                // dark orifice
      float h = rim + cup - hole * 0.9;
      return vec2(mask, clamp(h * 0.5 + 0.4, 0.0, 1.0));
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- arm skin base: mottled mauve-red ---
      vec3 skin = u_skin_color.rgb;
      float mott = fbm(uv * 8.0) * 0.5 + 0.5;
      vec3 col = mix(skin * 0.72, skin * 1.10, mott);
      col += (noise(uv * 200.0) - 0.5) * 0.05;   // skin micro-grain

      // arms run vertically; shade each arm cylinder across its width
      float arms = u_arms;
      float ax = fract(uv.x * arms);
      float arm_shade = sin(ax * 3.14159);
      col *= 0.70 + 0.40 * arm_shade;
      // dark crease between arms
      col *= 1.0 - smoothstep(0.10, 0.0, min(ax, 1.0 - ax)) * 0.45;

      // --- suckers: two staggered rows per arm ---
      float rows = u_row_density;
      float best_m = 0.0;
      float best_h = 0.5;
      for (int s = 0; s < 2; s++) {
        float side = float(s) * 2.0 - 1.0;                  // -1 left, +1 right
        float yoff = float(s) * 0.5;                        // stagger the rows
        float ry = uv.y * rows + yoff;
        float row_id = floor(ry);
        float fy = fract(ry) - 0.5;
        // sucker centre offset from arm midline; size varies per sucker
        float hsh = hash(vec2(floor(uv.x * arms), row_id + float(s) * 31.0));
        float cxo = 0.5 + side * (0.16 + 0.03 * hsh);
        // periodic size taper along the arm (suckers shrink, then repeat)
        float taper = 0.75 + 0.25 * sin(uv.y * 6.28318 + float(s));
        float radius = (0.13 + 0.04 * hsh) * taper;
        vec2 p = vec2((ax - cxo) , fy / rows * arms);       // arm-local coords
        p.y *= 1.0;
        vec2 sk = sucker_ocs(p, radius);
        if (sk.x > best_m) { best_m = sk.x; best_h = sk.y; }
      }

      // --- shade the sucker by its height profile ---
      vec3 cup_deep = skin * 0.30 + vec3(0.05, 0.0, 0.02);   // dark orifice
      vec3 cup_mid  = skin * 0.85 + vec3(0.08, 0.04, 0.05);  // dished interior
      vec3 rim_hi   = skin * 1.30 + vec3(0.16, 0.10, 0.12);  // lit rim flesh
      vec3 sucker_col = mix(cup_deep, cup_mid, smoothstep(0.0, 0.55, best_h));
      sucker_col = mix(sucker_col, rim_hi, smoothstep(0.55, 0.95, best_h));
      // wet specular ping on the rim crest
      sucker_col += vec3(0.35, 0.30, 0.32) * smoothstep(0.88, 1.0, best_h);
      // contact shadow around each sucker base
      float halo = best_m * (1.0 - smoothstep(0.0, 0.3, abs(best_h - 0.4)));
      col = mix(col, skin * 0.55, halo * 0.4);
      col = mix(col, sucker_col, best_m);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_arms`,name:`Arm Count`,type:`float`,min:1,max:6,default:3},{id:`u_row_density`,name:`Sucker Rows`,type:`float`,min:4,max:18,default:9},{id:`u_skin_color`,name:`Skin Color`,type:`color`,default:[.55,.3,.34,1]}]},Lo=e({default:()=>Ro}),Ro={id:`oil_canvas_artisan`,name:`Oil Canvas Strokes`,category:`Abstract`,added:`2026-04-15`,description:`Directional brush-stroke noise mimicking thick oil paint on canvas.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv.y * 50.0) + vec2(floor(uv.x * 2.0), 0.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Canvas Zoom`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Paint Color`,type:`color`,default:[.6,.1,.2,1]},{id:`u_secondary_color`,name:`Canvas Weave`,type:`color`,default:[.8,.75,.7,1]}]},zo=e({default:()=>Bo}),Bo={id:`oil_slick`,name:`Oil Slick`,category:`Natural`,added:`2026-05-01`,description:`Thin-film oil interference on wet dark tarmac — rainbow iridescence bands in sinuous organic puddles.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_os(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_os(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_os(i);
      float b = hash1_os(i + vec2(1.0, 0.0));
      float c = hash1_os(i + vec2(0.0, 1.0));
      float d = hash1_os(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // 3-octave FBM
    float fbm_os(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 3; i++) {
        v += a * smoothnoise_os(p * s);
        s *= 2.1;
        a *= 0.48;
      }
      return v;
    }

    // HSV-style hue to RGB (GLSL 1.0 compatible, no ES3)
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Animated noise coordinates
      vec2 noiseUV = uv * u_band_scale + vec2(1.5708 * 0.02, 1.5708 * 0.015);

      // Thickness map — two FBM layers for complexity
      float thickness1 = fbm_os(noiseUV);
      float thickness2 = fbm_os(noiseUV * 1.7 + vec2(5.3, 2.1));
      float thickness  = thickness1 * 0.65 + thickness2 * 0.35;

      // Puddle mask — wetness controls coverage
      // Use a separate low-freq noise as a coverage mask
      float puddle_mask = fbm_os(uv * u_band_scale * 0.4 + vec2(3.7, 8.2));
      float wet_mask = smoothstep(1.0 - u_wetness, 1.0 - u_wetness * 0.3, puddle_mask);
      wet_mask = clamp(wet_mask, 0.0, 1.0);

      // Map thickness to hue — full rainbow cycle
      // Shift hue with time for slow drift
      float hue = fract(thickness * 1.2 + 1.5708 * 0.04);
      vec3 iridescent = hue2rgb(hue);

      // Thin-film intensity: brighter at mid-thickness, dimmer at edges
      float film_intensity = smoothstep(0.1, 0.4, thickness) * smoothstep(1.0, 0.6, thickness);
      film_intensity *= u_iridescence * wet_mask;

      // Wet tarmac base: very dark blue-black
      vec3 tarmac_dry = vec3(0.10, 0.10, 0.11);
      // Wet darkens and adds slight grey-blue sheen
      vec3 tarmac_wet = vec3(0.04, 0.04, 0.05);
      vec3 base = mix(tarmac_dry, tarmac_wet, wet_mask * 0.7);

      // Slight specular highlight on wet surface
      float spec_noise = smoothnoise_os(uv * 18.0 + vec2(1.5708 * 0.1));
      float spec = pow(clamp(spec_noise, 0.0, 1.0), 6.0) * wet_mask * 0.12;

      // Additive iridescence on top of base
      vec3 col = base + iridescent * film_intensity * 0.7 + spec;

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_band_scale`,name:`Band Scale`,type:`float`,min:1,max:10,default:3},{id:`u_iridescence`,name:`Color Intensity`,type:`float`,min:0,max:2,default:1.2},{id:`u_wetness`,name:`Puddle Coverage`,type:`float`,min:0,max:1,default:.8}]},Vo=e({default:()=>Ho}),Ho={id:`oil_stain`,name:`Oil Stain`,category:`Industrial`,added:`2026-04-30`,description:`Dark oil and grease stains on a concrete substrate with irregular pooling and thin-film iridescence at dried edges.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    // Thin-film iridescence: maps a value [0-1] to an RGB rainbow
    vec3 thinFilm(float t) {
      float r = 0.5 + 0.5 * sin(6.28318 * (t + 0.00));
      float g = 0.5 + 0.5 * sin(6.28318 * (t + 0.33));
      float b = 0.5 + 0.5 * sin(6.28318 * (t + 0.67));
      return vec3(r, g, b);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float totalStain = 0.0;
      float totalEdge  = 0.0;

      // Accumulate multiple stain blobs placed pseudo-randomly
      for (int i = 0; i < 8; i++) {
        if (float(i) >= u_stain_count) break;
        float fi = float(i);
        // Each stain has a random centre
        vec2 centre = vec2(hash(vec2(fi, 0.3)), hash(vec2(fi, 0.7)));
        vec2 diff   = uv - centre;
        // Stretch stain slightly (oil pools are flatter)
        diff.x *= 1.4;
        float dist = length(diff);
        // Organic boundary via fbm
        float boundary = fbm(uv * 4.0 + centre * 7.0) * 0.18;
        float radius   = 0.12 + hash(vec2(fi, 1.1)) * 0.15 + boundary;
        float stain    = smoothstep(radius, radius * 0.5, dist);
        // Opacity darkens toward centre (oil thicker there)
        float depth    = stain * stain;
        totalStain = max(totalStain, depth);
        // Edge ring for iridescence — thin shell just outside stain
        float edgeW  = 0.035;
        float edgeMask = smoothstep(radius - edgeW, radius, dist) *
                         smoothstep(radius + edgeW, radius, dist);
        totalEdge = max(totalEdge, edgeMask);
      }

      // Substrate concrete
      float concGrain = fbm(uv * 18.0) * 0.06;
      vec3 subCol = u_substrate.rgb + vec3(concGrain);

      // Oil colour — very dark, near black, slight brown-green tint
      vec3 oilDark  = vec3(0.04, 0.035, 0.03);
      vec3 oilLight = vec3(0.10, 0.09,  0.07);
      vec3 oilColor = mix(oilDark, oilLight, 1.0 - totalStain);

      vec3 col = mix(subCol, oilColor, totalStain * 0.92);

      // Thin-film iridescent edge
      float filmT = noise(uv * 12.0 + 1.5708 * 0.01) * 0.5;
      vec3 film = thinFilm(filmT);
      col = mix(col, col * 0.5 + film * 0.55, totalEdge * 0.7);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_stain_count`,name:`Stain Count`,type:`float`,min:1,max:8,default:3},{id:`u_substrate`,name:`Substrate`,type:`color`,default:[.25,.23,.22,1]}]},Uo=e({default:()=>Wo}),Wo={id:`olive_branch_artisan`,name:`Olive Branch`,category:`Natural`,added:`2026-04-15`,description:`Symmetrical leaf layering along a spine, symbolizing peace and precision.`,shader:`
    float leaf(vec2 p) {
      p = abs(p);
      return max(length(p - vec2(0.0, 0.2)), length(p + vec2(0.0, 0.2))) - 0.3;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float spine = step(abs(uv.x - 0.5), 0.005);
      
      float leafMask = 0.0;
      for(float i=0.0; i<10.0; i++) {
        vec2 p = uv - vec2(0.5, i * 0.1);
        if (mod(i, 2.0) == 0.0) p.x += 0.1; else p.x -= 0.1;
        leafMask = max(leafMask, smoothstep(0.1, 0.05, leaf(p * 15.0)));
      }
      
      float mask = max(spine, leafMask);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Branch Length`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Branch Color`,type:`color`,default:[.4,.5,.2,1]},{id:`u_secondary_color`,name:`Base`,type:`color`,default:[.05,.05,.02,1]}]},Go=e({default:()=>Ko}),Ko={id:`optical_fiber_bundle_artisan`,name:`Optical Fiber Bundle`,category:`Technology`,added:`2026-05-13`,description:`Glowing fiber optic cables of varying diameters, bleeding light into a dark resin matrix.`,shader:`
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 id = floor(uv);
        vec2 gv = fract(uv);
        
        float minDist = 1.0;
        vec2 closestPoint;
        float fiberType = 0.0;
        
        for(int y=-1; y<=1; y++) {
            for(int x=-1; x<=1; x++) {
                vec2 offset = vec2(x, y);
                vec2 pt = random2(id + offset);
                
                // Variable fiber radius
                float radius = 0.2 + 0.3 * fract(pt.x * 13.45);
                
                float dist = length(gv - (offset + pt));
                
                if(dist < radius && dist < minDist) {
                    minDist = dist / radius;
                    fiberType = fract(pt.y * 7.89);
                }
            }
        }
        
        // Fiber core vs cladding
        float core = smoothstep(0.9, 0.7, minDist);
        float cladding = smoothstep(1.0, 0.9, minDist) - core;
        
        // Resin matrix
        float matrix = smoothstep(1.0, 1.2, minDist);
        
        // Fiber light transmission animation
        float lightPulse = 0.5 + 0.5 * sin(u_flow * 5.0 + fiberType * 6.28);
        
        vec4 coreColor = mix(u_fiber_dark, u_fiber_glow, lightPulse);
        
        vec4 finalColor = mix(u_resin_matrix, u_cladding, cladding);
        finalColor = mix(finalColor, coreColor, core);
        
        // Light bleed into resin
        finalColor += u_fiber_glow * smoothstep(1.5, 0.8, minDist) * 0.2 * lightPulse;
        
        return finalColor;
    }
  `,uniforms:[{id:`u_scale`,name:`Bundle Scale`,type:`float`,min:2,max:20,default:8},{id:`u_resin_matrix`,name:`Resin Base`,type:`color`,default:[.05,.05,.05,1]},{id:`u_cladding`,name:`Fiber Cladding`,type:`color`,default:[.2,.2,.25,1]},{id:`u_fiber_glow`,name:`Light Transmission`,type:`color`,default:[0,.8,1,1]},{id:`u_fiber_dark`,name:`Inactive Fiber`,type:`color`,default:[.1,.1,.2,1]},{id:`u_flow`,name:`Data Flow`,type:`float`,min:0,max:100,default:0}]},qo=e({default:()=>Jo}),Jo={id:`origami_fold`,name:`Origami Fold`,category:`Geometric`,added:`2026-05-01`,description:`Origami crease pattern with radiating mountain and valley fold lines on cream paper.`,shader:`
    // Distance from point p to infinite line through a and b
    float lineDistance(vec2 p, vec2 a, vec2 b) {
      vec2 ab = b - a;
      vec2 ap = p - a;
      float t = clamp(dot(ap, ab) / dot(ab, ab), 0.0, 1.0);
      return length(ap - ab * t);
    }

    // Hash for deterministic fold point placement
    float hash11(float n) {
      return fract(sin(n) * 43758.5453);
    }
    float hash21(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Distance to a crease line from a given fold point, radiating at angle theta
    float creaseLine(vec2 uv, vec2 origin, float angle, float lineWidth) {
      vec2 dir = vec2(cos(angle), sin(angle));
      vec2 p = uv - origin;
      float para  = dot(p, dir);
      float perp  = abs(dot(p, vec2(-dir.y, dir.x)));
      // Only draw the ray (half-line), not full infinite line
      float rayMask = step(0.0, para);
      return perp * rayMask + (1.0 - rayMask) * 9999.0;
    }

    vec4 generate() {
      float complexity = u_complexity;
      vec3  paper  = u_paper_color.rgb;
      vec3  crease = u_crease_color.rgb;

      vec2 uv = v_uv;

      // Number of fold point sources â€” driven by complexity
      int numPoints = int(clamp(complexity * 2.0 + 1.0, 1.0, 11.0));

      float minCreaseDist = 9999.0;
      float creaseAngle   = 0.0;

      // For each fold point, radiate several crease lines
      for (int i = 0; i < 11; i++) {
        if (i >= numPoints) break;
        float fi = float(i);

        // Deterministic fold origin on canvas
        vec2 origin = vec2(
          hash11(fi * 3.71 + 1.0),
          hash11(fi * 5.13 + 2.0)
        );

        // Number of radiating folds from this point
        int numRays = int(3.0 + floor(hash11(fi * 7.0) * complexity * 1.5));
        numRays = min(numRays, 7);

        for (int j = 0; j < 7; j++) {
          if (j >= numRays) break;
          float fj = float(j);
          float baseAngle = hash11(fi * 13.0 + fj * 3.0) * 6.2831;
          float angle = baseAngle;

          // Mountain fold: every other ray
          float isMountain = step(0.5, hash11(fi * 2.1 + fj));

          float d = creaseLine(uv, origin, angle, 0.002);

          if (d < minCreaseDist) {
            minCreaseDist = d;
            creaseAngle   = isMountain;
          }
        }
      }

      // Base paper texture â€” very slight mottled grain
      float grain = (hash21(uv * 180.0) - 0.5) * 0.025;

      // Crease line width (thinner for high complexity)
      float creaseWidth = 0.003 / clamp(complexity * 0.4, 0.5, 2.0);

      float creaseMask  = 1.0 - smoothstep(creaseWidth * 0.5, creaseWidth * 1.5, minCreaseDist);

      // Shadow on valley fold side (slight gradient perpendicular to crease)
      float shadowWidth = creaseWidth * 5.0;
      float foldShadow  = smoothstep(shadowWidth, 0.0, minCreaseDist) * (1.0 - creaseAngle) * 0.18;

      // Light on mountain fold side
      float foldLight   = smoothstep(shadowWidth, 0.0, minCreaseDist) * creaseAngle * 0.10;

      vec3 paperGrain = paper + grain;
      vec3 col = paperGrain;
      col -= foldShadow;       // valley shadow
      col += foldLight;        // mountain highlight
      col = mix(col, crease, creaseMask);  // dark crease line itself

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_complexity`,type:`float`,default:2.5,min:1,max:5,name:`Complexity`},{id:`u_paper_color`,type:`color`,default:[.96,.94,.9,1],name:`Paper Colour`},{id:`u_crease_color`,type:`color`,default:[.55,.5,.45,1],name:`Crease Colour`}]},Yo=e({default:()=>Xo}),Xo={id:`oscilloscope_lissajous`,name:`Oscilloscope Lissajous`,category:`Retro`,added:`2026-06-11`,description:`A lab scope locked on a Lissajous figure — the phosphor beam looping its frequency-ratio knot over an etched graticule, green afterglow pooling in the glass.`,shader:`
    vec4 generate() {
      vec2 p = fract(v_uv) - 0.5;
      vec2 uv = fract(v_uv);

      // --- CRT glass: deep green-black with a domed sheen ---
      float rr = length(p);
      vec3 col = vec3(0.012, 0.035, 0.022);
      col += vec3(0.0, 0.018, 0.010) * (1.0 - smoothstep(0.15, 0.70, rr));
      // glass dome glare upper-left
      vec2 gp = p - vec2(-0.22, 0.24);
      col += vec3(0.025, 0.045, 0.035) * exp(-dot(gp, gp) * 18.0);

      // --- graticule: 10x10 etched grid, centre axes heavier, axis ticks ---
      vec2 g = fract(uv * 10.0);
      float gl = min(min(g.x, 1.0 - g.x), min(g.y, 1.0 - g.y));
      float grid = 1.0 - smoothstep(0.0, 0.05, gl);
      col += vec3(0.05, 0.10, 0.07) * grid * 0.5;
      float axes = (1.0 - smoothstep(0.002, 0.006, abs(p.x)))
                 + (1.0 - smoothstep(0.002, 0.006, abs(p.y)));
      col += vec3(0.06, 0.12, 0.08) * clamp(axes, 0.0, 1.0) * 0.7;
      // fine tick dots along the axes
      float tickx = (1.0 - smoothstep(0.002, 0.005, abs(p.y))) * step(0.8, fract(uv.x * 50.0));
      float ticky = (1.0 - smoothstep(0.002, 0.005, abs(p.x))) * step(0.8, fract(uv.y * 50.0));
      col += vec3(0.05, 0.10, 0.07) * clamp(tickx + ticky, 0.0, 1.0) * 0.5;

      // --- the beam: closed Lissajous knot, sampled as a polyline ---
      float a = floor(u_ratio_a + 0.5);
      float b = floor(u_ratio_b + 0.5);
      float dmin = 1e5;
      for (int i = 0; i < 128; i++) {
        float t = float(i) / 128.0 * 6.2831853;
        vec2 q = vec2(sin(a * t + u_phase), sin(b * t)) * 0.385;
        float d = length(p - q);
        if (d < dmin) dmin = d;
      }

      vec3 beam = u_beam_color.rgb;
      // hot core, inner bloom, wide afterglow
      float core = exp(-dmin * dmin * 14000.0);
      float bloom = exp(-dmin * 38.0) * 0.55;
      float after = exp(-dmin * 9.0) * 0.16;
      col += beam * (core * 1.35 + bloom + after);
      // the core whites out where it burns hardest
      col += vec3(0.7, 0.9, 0.8) * core * 0.5;

      // phosphor grain + slow burn-in mottle
      col *= 0.92 + noise(uv * 420.0) * 0.16;
      col *= 0.95 + 0.05 * snoise(uv * 3.0);

      // bezel vignette
      col *= 1.0 - smoothstep(0.42, 0.55, rr) * 0.55;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_ratio_a`,name:`X Frequency`,type:`float`,min:1,max:7,default:3},{id:`u_ratio_b`,name:`Y Frequency`,type:`float`,min:1,max:7,default:2},{id:`u_phase`,name:`Phase Shift`,type:`float`,min:0,max:3.14159,default:1.5708},{id:`u_beam_color`,name:`Phosphor`,type:`color`,default:[.3,1,.45,1]}]},Zo=e({default:()=>Qo}),Qo={id:`paint_chips`,name:`Paint Chips`,category:`Industrial`,added:`2026-04-30`,description:`Chipped and scratched paint surface revealing bare metal substrate through irregular chips and long directional scratches.`,shader:`
    float hash1(float n) { return fract(sin(n) * 43758.5453); }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.3; a *= 0.48; }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_chip_density;

      // ---- Voronoi-ish chip mask ----
      vec2 cell = floor(uv);
      vec2 local = fract(uv);
      float chipMask = 1.0; // 1 = paint intact

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 rnd = vec2(hash(nc + vec2(0.3, 0.7)), hash(nc + vec2(0.8, 0.2)));
          // Random chip centre within this cell
          vec2 chipPos = vec2(float(dx), float(dy)) + rnd;
          vec2 diff = local - chipPos;
          // Elliptical chip shape with fbm edge distortion
          float distort = fbm(nc * 3.1 + diff * 2.0) * 0.35;
          float d = length(diff * vec2(1.0 + distort, 0.7 + distort * 0.5));
          // Chip radius random per cell
          float chipR = 0.15 + hash(nc + 5.0) * 0.28;
          chipMask = min(chipMask, smoothstep(chipR - 0.04, chipR, d));
        }
      }

      // ---- Long directional scratches ----
      float scratchUV = v_uv.y * u_chip_density * 8.0;
      float scrLine   = noise(vec2(v_uv.x * u_chip_density * 60.0, scratchUV));
      float scrLine2  = noise(vec2(v_uv.x * u_chip_density * 80.0 + 7.3, scratchUV * 0.7));
      float scratch   = smoothstep(0.82, 0.86, scrLine) + smoothstep(0.85, 0.88, scrLine2);
      scratch = clamp(scratch, 0.0, 1.0);
      // Scratches cut through paint partially (shallow — show primer grey)
      vec4 scratchColor = vec4(mix(u_paint_color.rgb, vec3(0.35, 0.33, 0.32), 0.7), 1.0);

      // ---- Compose layers ----
      // Deep chip — bare metal
      vec4 col = mix(u_base_color, u_paint_color, chipMask);
      // Scratch over top
      col = mix(col, scratchColor, scratch * chipMask);

      // Slight paint edge highlight at chip boundary
      float chipEdge = smoothstep(0.0, 0.04, 1.0 - chipMask) * smoothstep(0.0, 0.04, chipMask);
      col.rgb += vec3(chipEdge * 0.12);

      // Paint surface micro variation
      float paintGrain = noise(v_uv * 300.0) * 0.04;
      col.rgb = mix(col.rgb, col.rgb + paintGrain, chipMask);

      col.a = u_opacity;
      return clamp(col, 0.0, 1.0);
    }
  `,uniforms:[{id:`u_chip_density`,name:`Chip Density`,type:`float`,min:1,max:20,default:8},{id:`u_base_color`,name:`Metal Substrate`,type:`color`,default:[.15,.15,.18,1]},{id:`u_paint_color`,name:`Paint Color`,type:`color`,default:[.3,.05,.05,1]}]},$o=e({default:()=>es}),es={id:`paisley_bandana`,name:`Paisley Bandana`,category:`Abstract`,added:`2026-06-11`,description:`Bandana-style repeat of curled paisley boteh teardrops with echo outlines, center dots and dotted halo rings, alternating orientation on a staggered grid.`,shader:`

    float smin(float a, float b, float k) {
      float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
      return mix(b, a, h) - k * h * (1.0 - h);
    }

    // Paisley boteh: a body circle smooth-joined to a tip circle, with a
    // bite carved out to bend the tip into the signature curl.
    float boteh(vec2 p) {
      float body = length(p - vec2(-0.02, -0.10)) - 0.21;
      float tip = length(p - vec2(0.10, 0.22)) - 0.07;
      float d = smin(body, tip, 0.16);
      float bite = length(p - vec2(0.28, 0.28)) - 0.13;
      d = max(d, -bite);
      return d;
    }

    vec4 generate() {
      vec2 gp = v_uv * u_scale;
      float row = floor(gp.y);
      float offx = mod(row, 2.0) * 0.5;
      vec2 sp = vec2(gp.x - offx, gp.y);
      vec2 cell = floor(sp);
      vec2 p = sp - cell - 0.5;

      // Alternate cells flip the motif for the woven bandana rhythm.
      float checker = mod(cell.x + cell.y, 2.0);
      if (checker > 0.5) {
        p = -p;
      }

      float d = boteh(p);
      float aa = u_scale * 1.5 / u_resolution.y;
      float t = u_line;

      // Main outline plus an inner echo line, classic bandana engraving.
      float outline = 1.0 - smoothstep(t, t + aa, abs(d));
      float echo = 1.0 - smoothstep(t * 0.7, t * 0.7 + aa, abs(d + 0.065));

      // Dotted halo ring around the motif.
      float pr = length(p);
      float pa = atan(p.y, p.x) / 6.2831853;
      float arc = (fract(pa * 16.0) - 0.5) / 16.0 * 6.2831853 * 0.40;
      float dotD = length(vec2(pr - 0.40, arc)) - 0.022;
      float dots = 1.0 - smoothstep(0.0, aa * 2.0, dotD);

      // Seed dot in the heart of the boteh.
      float cdot = 1.0 - smoothstep(0.045, 0.045 + aa, length(p - vec2(-0.02, -0.10)));

      vec4 color = u_color_bg;
      color = mix(color, u_color_accent, echo * u_dots);
      color = mix(color, u_color_motif, outline);
      color = mix(color, u_color_motif, dots * u_dots);
      color = mix(color, u_color_accent, cdot);

      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Bandana Red`,uniforms:{u_color_motif:[.97,.95,.92,1],u_color_accent:[.12,.05,.05,1],u_color_bg:[.62,.1,.12,1]}},{name:`Bandana Blue`,uniforms:{u_color_motif:[.96,.96,.97,1],u_color_accent:[.04,.05,.12,1],u_color_bg:[.12,.2,.45,1]}},{name:`Black & Gold`,uniforms:{u_color_motif:[.88,.71,.28,1],u_color_accent:[.55,.42,.15,1],u_color_bg:[.06,.06,.07,1]}},{name:`Ivory`,uniforms:{u_color_motif:[.35,.3,.26,1],u_color_accent:[.62,.54,.44,1],u_color_bg:[.94,.91,.84,1]}}],uniforms:[{id:`u_scale`,name:`Motif Scale`,type:`float`,min:2,max:14,default:5},{id:`u_dots`,name:`Dot Detail`,type:`float`,min:0,max:1,default:1},{id:`u_line`,name:`Line Thickness`,type:`float`,min:.005,max:.05,default:.016},{id:`u_color_motif`,name:`Motif Color`,type:`color`,default:[.97,.95,.92,1]},{id:`u_color_accent`,name:`Accent Color`,type:`color`,default:[.12,.05,.05,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.62,.1,.12,1]}]},ts=e({default:()=>ns}),ns={id:`palm_fronds_artisan`,name:`Palm Fronds`,category:`Natural`,added:`2026-04-15`,description:`Fan-like radial leaf structures found in tropical palm trees.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = atan(uv.y, uv.x);
      float r = length(uv);
      
      float frond = sin(a * 15.0) * step(r, 1.0) * step(0.1, r);
      float mask = smoothstep(0.0, 0.1, frond);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Frond Length`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Palm Leaf`,type:`color`,default:[.1,.6,.2,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[0,0,0,1]}]},rs=e({default:()=>is}),is={id:`paper_tear_artisan`,name:`Aggressive Tear`,category:`Abstract`,added:`2026-04-15`,description:`High-intensity directional shreds and jagged ruptures mimicking ripped metal or heavy cardstock.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p); p *= 2.0; a *= 0.5;
      }
      return v;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Directional shred math
      float shred = fbm(uv * vec2(1.0, 5.0) + fbm(uv * 2.0) * u_intensity);
      float mask = smoothstep(0.4, 0.5, shred);
      
      // Add jaggedness to the edge
      float jagged = fbm(uv * 15.0) * 0.2;
      mask = smoothstep(0.4 + jagged, 0.5 + jagged, shred);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shred Scale`,type:`float`,min:1,max:10,default:3},{id:`u_intensity`,name:`Aggression`,type:`float`,min:.1,max:5,default:2},{id:`u_primary_color`,name:`Top Layer`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Deep Tear`,type:`color`,default:[.95,.95,.95,1]}]},as=e({default:()=>os}),os={id:`pcb_traces_v3_artisan`,name:`Pro PCB Logic`,category:`Technology`,added:`2026-04-16`,description:`Triple-layer circuit logic with advanced bus-routing and microscopic trace detail.`,shader:`
    vec4 generate() {
      float lines = sin(v_uv.x * 400.0) * sin(v_uv.y * 400.0);
      float mask = step(0.1, abs(lines));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Trace Copper`,type:`color`,default:[1,.6,.1,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[0,.15,.05,1]}]},ss=e({default:()=>cs}),cs={id:`peacock_eyes_artisan`,name:`Peacock Eyes`,category:`Natural`,added:`2026-04-15`,description:`Ornate organic pattern mimicking the "eyes" found in peacock feathers.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      vec4 col = u_secondary_color;
      col = mix(col, u_primary_color, smoothstep(0.4, 0.35, d));
      col = mix(col, vec4(0.0, 0.0, 0.5, 1.0), smoothstep(0.25, 0.2, d));
      col = mix(col, vec4(0.0, 1.0, 1.0, 1.0), smoothstep(0.1, 0.05, d));
      return col;
    }
  `,uniforms:[{id:`u_scale`,name:`Eye Count`,type:`float`,min:2,max:20,default:6},{id:`u_primary_color`,name:`Eye Border`,type:`color`,default:[.1,.8,.3,1]},{id:`u_secondary_color`,name:`Feather Base`,type:`color`,default:[.05,.2,.05,1]}]},ls=e({default:()=>us}),us={id:`pearl_flake_paint`,name:`Pearl Flake Paint`,category:`Racing`,added:`2026-04-30`,description:`Iridescent pearl automotive paint with hue-shifting colour across the surface and fine mica flake shimmer.`,shader:`

    // Hue rotation applied to an RGB colour
    vec3 rotateHue(vec3 col, float shift) {
      // Convert to approximate YIQ, rotate chroma
      float Y  =  dot(col, vec3(0.299,  0.587,  0.114));
      float I  =  dot(col, vec3(0.596, -0.274, -0.321));
      float Q  =  dot(col, vec3(0.211, -0.523,  0.311));
      float ang = shift * 6.28318;
      float ca = cos(ang); float sa = sin(ang);
      float Ir = I * ca - Q * sa;
      float Qr = I * sa + Q * ca;
      return clamp(vec3(
        Y + 0.956 * Ir + 0.621 * Qr,
        Y - 0.272 * Ir - 0.647 * Qr,
        Y - 1.107 * Ir + 1.705 * Qr), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Hue shift map — smooth spatial variation simulating viewing angle
      float shiftNoise = noise(uv * 3.0 + 1.5708 * 0.02);
      shiftNoise += noise(uv * 6.0 + 1.7) * 0.4;
      shiftNoise /= 1.4;
      float hueShift = (shiftNoise * 2.0 - 1.0) * u_shift_amount * 0.35;

      // Pearl base shifted
      vec3 pearlBase = rotateHue(u_base_color.rgb, hueShift);

      // Mica flake layer — tiny hexagonal-ish cells
      vec2 flakeUV   = uv * u_flake_density * 0.02;
      vec2 flakeCell = floor(flakeUV);
      vec2 flakeLocal = fract(flakeUV);
      float micaBright = 0.0;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc  = flakeCell + vec2(float(dx), float(dy));
          float rx = hash(nc + vec2(0.17, 0.53));
          float ry = hash(nc + vec2(0.74, 0.29));
          float reflectance = hash(nc + vec2(0.33, 0.81));
          vec2 diff = flakeLocal - (vec2(float(dx), float(dy)) + vec2(rx, ry));
          float d   = length(diff);
          float sz  = 0.25 + hash(nc + vec2(0.5, 0.1)) * 0.2;
          float inside = smoothstep(sz, sz * 0.6, d);
          micaBright = max(micaBright, inside * pow(reflectance, 2.0));
        }
      }

      // Mica flake colour: slightly iridescent — pull from the opposite hue shift
      vec3 micaColor = rotateHue(vec3(0.98, 0.97, 0.95), -hueShift * 0.5);

      vec3 col = mix(pearlBase, micaColor, micaBright * 0.7);

      // Soft gloss gradient to simulate environmental reflection
      float gloss = pow(1.0 - abs(uv.x - 0.5) * 2.0, 2.0) * 0.12;
      col += vec3(gloss);

      col = clamp(col, 0.0, 1.0);
      if (u_is_spec > 0.5) {
        // Pearl: softer than metal flake — moderate metallic lift at mica, very glossy overall
        float metallic = mix(0.3, 0.6, micaBright);
        float roughness = mix(0.1, 0.04, micaBright);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.95,.93,.9,1]},{id:`u_shift_amount`,name:`Colour Shift`,type:`float`,min:0,max:1,default:.4},{id:`u_flake_density`,name:`Mica Density`,type:`float`,min:100,max:1e3,default:400}]},ds=e({default:()=>fs}),fs={id:`peat_moss_artisan`,name:`Peat Moss`,category:`Natural`,added:`2026-04-16`,description:`Dense organic clumpy sprawl mimicking professional landscape and high-fidelity vegetation.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Moss Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Moss High`,type:`color`,default:[.3,.4,.2,1]},{id:`u_secondary_color`,name:`Moss Deep`,type:`color`,default:[.1,.15,.05,1]}]},ps=e({default:()=>ms}),ms={id:`penrose_tiling_artisan`,name:`Penrose Mesh`,category:`Abstract`,added:`2026-04-16`,description:`Aperiodic, non-repeating tiling lines mimicking complex mathematical quasicrystal structures.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = 0.62831853; // 2pi/10
      float d = 0.0;
      for (int i=0; i<5; i++) {
        vec2 dir = vec2(cos(float(i)*a), sin(float(i)*a));
        d += step(0.9, fract(dot(uv, dir)));
      }
      return mix(u_secondary_color, u_primary_color, clamp(d, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Penrose Detail`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Tiling Line`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Void Space`,type:`color`,default:[.05,.05,.1,1]}]},hs=e({default:()=>gs}),gs={id:`perforated_leather`,name:`Perforated Leather`,category:`Industrial`,added:`2026-05-01`,description:`Smooth leather with a regular diamond punched-hole pattern over a contrasting backing, as used in racing seats and steering wheel grips.`,shader:`

    // Fine leather grain — long micro scratches aligned roughly horizontally
    float leatherGrain(vec2 uv) {
      float g1 = noise(vec2(uv.x * 80.0, uv.y * 12.0));
      float g2 = noise(vec2(uv.x * 160.0, uv.y * 8.0 + 3.1));
      return g1 * 0.6 + g2 * 0.4;
    }

    // Diamond grid: offset every other row to form a diamond lattice
    vec2 diamondCell(vec2 uv, float density) {
      vec2 scaled = uv * density;
      // Offset alternating rows by 0.5 in X
      float row = floor(scaled.y);
      float xOffset = mod(row, 2.0) * 0.5;
      vec2 cell = fract(vec2(scaled.x + xOffset, scaled.y));
      // Distance to cell centre
      return abs(cell - 0.5);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Get diamond cell local coords
      vec2 dc = diamondCell(uv, u_hole_density);

      // Diamond hole shape: use Chebyshev / rotated L-inf to get a diamond
      // Rotate local coords 45 degrees
      vec2 rot45 = vec2(dc.x + dc.y, dc.y - dc.x) * 0.7071;
      float holeDist = max(abs(rot45.x), abs(rot45.y));

      // Hole threshold from u_hole_size (0.2–0.7 of half-cell)
      float holeRadius = u_hole_size * 0.5;

      // 1 = inside hole, 0 = leather surface
      float inHole = step(holeDist, holeRadius * 0.5);

      // Soft inner edge bevel — gives a punched-through look
      float bevel = smoothstep(holeRadius * 0.5, holeRadius * 0.5 - 0.015, holeDist);

      // Leather grain texture
      float grain = leatherGrain(uv);
      float grainMod = mix(0.88, 1.08, grain);

      // Leather colour
      vec3 leatherCol = u_leather_color.rgb * grainMod;

      // Subtle sheen on leather — soft specular blob
      float sheen = exp(-pow(length(uv - vec2(0.3, 0.35)) * 3.5, 2.0)) * 0.12;
      leatherCol += vec3(sheen * 0.6, sheen * 0.5, sheen * 0.4);

      // Bevel darkens the edge of the hole (punch shadow)
      vec3 bevelColor = leatherCol * 0.55;

      // Combine: backing where hole, bevel at edge, leather elsewhere
      vec3 col = mix(leatherCol, bevelColor, (1.0 - bevel) * (1.0 - inHole) * step(holeDist, holeRadius * 0.5 + 0.03));
      col = mix(col, u_backing_color.rgb, inHole);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_hole_density`,name:`Hole Density`,type:`float`,min:4,max:30,default:14},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.2,max:.7,default:.45},{id:`u_leather_color`,name:`Leather Color`,type:`color`,default:[.12,.1,.08,1]},{id:`u_backing_color`,name:`Backing Color`,type:`color`,default:[.85,.05,.05,1]}]},_s=e({default:()=>vs}),vs={id:`perforated_sheet`,name:`Perforated Sheet`,category:`Industrial`,added:`2026-04-30`,description:`CNC-perforated aluminium sheet with round punched-through holes and chamfer highlights on hole rims.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      // Tile into cells according to density
      vec2 tiled = v_uv * u_density;
      vec2 cellUV = fract(tiled) - 0.5; // [-0.5, 0.5] per cell, center at 0
      vec2 cellID = floor(tiled);

      float d = length(cellUV);         // distance from cell center
      float r = u_hole_size * 0.5;      // hole radius in cell-space [0, 0.5]

      // ---- Hole: fully transparent inside ----
      // Soft edge: 1 px of blur mapped to cell space
      float edgeWidth = 0.008;
      float inHole = smoothstep(r - edgeWidth, r + edgeWidth, d);
      // inHole == 0 inside hole, 1 outside

      // ---- Brushed metal plate ----
      // Subtle horizontal brushing: low-amplitude noise along Y axis
      float brushNoise = noise(vec2(cellID.x + tiled.x * 0.3, tiled.y * 18.0)) * 0.035;
      vec3 metalCol = u_metal_color.rgb + vec3(brushNoise * 0.6, brushNoise * 0.6, brushNoise * 0.65);

      // ---- Chamfer highlight ring on hole rim ----
      // Bright annular band just outside the hole edge (tooling chamfer)
      float chamferInner = r + edgeWidth;
      float chamferOuter = chamferInner + 0.04;
      float chamfer = smoothstep(chamferInner - 0.002, chamferInner + 0.002, d)
                    - smoothstep(chamferOuter - 0.008, chamferOuter,        d);
      chamfer = clamp(chamfer, 0.0, 1.0);

      // Directional highlight: brightest at top-left of rim (simulated light at ~135 deg)
      vec2 dir = normalize(cellUV + vec2(0.001)); // avoid div-by-zero
      float lightAngle = dot(dir, normalize(vec2(-0.7, 0.7)));
      float rimLight = chamfer * clamp(lightAngle, 0.0, 1.0) * 0.55;

      // Combine: metal plate + rim highlight, then punch out the hole via alpha
      vec3 col = clamp(metalCol + vec3(rimLight), 0.0, 1.0);
      float alpha = inHole * u_metal_color.a * u_opacity;

      return vec4(col, alpha);
    }
  `,uniforms:[{id:`u_density`,name:`Hole Density`,type:`float`,min:2,max:40,default:16},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.2,max:.85,default:.55},{id:`u_metal_color`,name:`Metal Color`,type:`color`,default:[.78,.8,.82,1]}]},ys=e({default:()=>bs}),bs={id:`petrified_wood_artisan`,name:`Petrified Wood`,category:`Geology`,added:`2026-04-16`,description:`Fossilized wood grain with vibrant mineral staining and crystalized structures.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Chert High`,type:`color`,default:[.8,.4,.2,1]},{id:`u_secondary_color`,name:`Silt Deep`,type:`color`,default:[.4,.2,.1,1]}]},xs=e({default:()=>Ss}),Ss={id:`pinball_playfield`,name:`Pinball Playfield`,category:`Retro`,added:`2026-06-11`,description:`Silkscreened 70s pinball playfield art — pop-bumper ring targets, rollover stars and lane arrows keylined in black over ball-worn ivory lacquer.`,shader:`
    mat2 rot2_pp(float a) {
      float c = cos(a); float s = sin(a);
      return mat2(c, -s, s, c);
    }

    // five-point star signed distance (approximate, via angular radius)
    float star_pp(vec2 p, float r) {
      float an = atan(p.y, p.x);
      float rr = r * (0.62 + 0.38 * cos(an * 5.0));
      return length(p) - rr;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;

      // ivory lacquer over faint plywood grain
      vec3 ivory = vec3(0.93, 0.89, 0.78);
      float grain = noise(vec2(v_uv.x * 26.0, v_uv.y * 240.0)) * 0.06;
      vec3 col = ivory - grain;

      // decades of ball tracks: grey swirled wear
      float swirl = smoothstep(0.55, 0.92, fbm(v_uv * 4.0) * 0.5 + 0.5);
      col = mix(col, vec3(0.78, 0.75, 0.66), swirl * u_wear);

      vec3 accent  = u_accent_color.rgb;
      vec3 teal    = vec3(0.0, 0.55, 0.55);
      vec3 keyline = vec3(0.12, 0.10, 0.10);
      vec3 cream   = vec3(0.98, 0.96, 0.90);

      float h = hash(cell);
      float r = length(f);

      if (h < 0.34) {
        // --- pop bumper: screened concentric rings + cap ---
        float disc = 1.0 - smoothstep(0.40, 0.42, r);
        float ring = step(0.5, fract(r * 5.5));
        vec3 bump = mix(accent, cream, ring);
        // bolt cap dead centre
        bump = mix(bump, accent * 1.25, 1.0 - smoothstep(0.07, 0.10, r));
        bump = mix(bump, keyline, 1.0 - smoothstep(0.025, 0.045, r));
        col = mix(col, bump, disc);
        // black keyline circle
        col = mix(col, keyline, (1.0 - smoothstep(0.012, 0.024, abs(r - 0.41))));
      } else if (h < 0.60) {
        // --- rollover star insert ---
        vec2 sp = rot2_pp(hash(cell + 5.5) * 6.2831) * f;
        float halo = 1.0 - smoothstep(0.36, 0.38, r);
        col = mix(col, teal, halo);
        col = mix(col, keyline, 1.0 - smoothstep(0.010, 0.022, abs(r - 0.37)));
        float sd = star_pp(sp, 0.27);
        col = mix(col, cream, 1.0 - smoothstep(0.0, 0.02, sd));
        col = mix(col, keyline, 1.0 - smoothstep(0.0, 0.015, abs(sd) - 0.012));
        // tiny accent dot at star heart
        col = mix(col, accent, 1.0 - smoothstep(0.045, 0.065, r));
      } else if (h < 0.82) {
        // --- lane arrow (random quarter-turn) ---
        float quarter = floor(hash(cell + 9.1) * 4.0) * 1.5707963;
        vec2 ap = rot2_pp(quarter) * f;
        float shaft = step(abs(ap.x), 0.07) * step(abs(ap.y + 0.13), 0.17);
        float headw = (0.30 - ap.y) * 0.78;
        float head = step(0.04, ap.y) * step(ap.y, 0.30) * step(abs(ap.x), headw);
        float arrow = max(shaft, head);
        // slightly larger silhouette for the keyline pass
        float shaft2 = step(abs(ap.x), 0.095) * step(abs(ap.y + 0.13), 0.195);
        float headw2 = (0.33 - ap.y) * 0.85;
        float head2 = step(0.02, ap.y) * step(ap.y, 0.33) * step(abs(ap.x), headw2);
        float outline = max(shaft2, head2);
        col = mix(col, keyline, outline);
        col = mix(col, accent, arrow);
      } else {
        // --- blank lane: rosette of four rivet dots ---
        vec2 q = abs(f) - 0.22;
        float dot1 = length(q);
        col = mix(col, keyline, (1.0 - smoothstep(0.025, 0.045, dot1)) * 0.7);
      }

      // screened lane guide grid between cells
      vec2 gf = abs(fract(uv) - 0.5);
      float guide = 1.0 - smoothstep(0.006, 0.014, 0.5 - max(gf.x, gf.y));
      col = mix(col, keyline, guide * 0.35);

      // lacquer sheen
      col += (noise(v_uv * 500.0) - 0.5) * 0.025;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Insert Density`,type:`float`,min:2,max:10,default:4},{id:`u_wear`,name:`Ball Wear`,type:`float`,min:0,max:1,default:.35},{id:`u_accent_color`,name:`Screen Ink`,type:`color`,default:[.85,.12,.12,1]}]},Cs=e({default:()=>ws}),ws={id:`pine_bark_artisan`,name:`Pine Bark`,category:`Natural`,added:`2026-04-16`,description:`Rough, vertical flaky ridges found on mature pine trees.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,uniforms:[{id:`u_scale`,name:`Bark Detail`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Bark High`,type:`color`,default:[.3,.2,.15,1]},{id:`u_secondary_color`,name:`Bark Crevice`,type:`color`,default:[.15,.1,.08,1]}]},Ts=e({default:()=>Es}),Es={id:`piston_top_artisan`,name:`Piston Head`,category:`Racing`,added:`2026-04-16`,description:`Concentric rings of machined high-performance aluminum with heat seasoning.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Ring Density`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Alloy High`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Alloy Deep`,type:`color`,default:[.6,.6,.65,1]}]},Ds=e({default:()=>Os}),Os={id:`pixel_art_canvas_artisan`,name:`Pixel Grid`,category:`Abstract`,added:`2026-04-16`,description:`Large-block quantized color grid mimicking retro 8-bit digital canvases.`,shader:`
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Pixel Size`,type:`float`,min:8,max:128,default:32},{id:`u_primary_color`,name:`Pixel High`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Pixel Dark`,type:`color`,default:[.5,.5,.5,1]}]},ks=e({default:()=>As}),As={id:`plaid_tartan_artisan`,name:`Plaid Tartan`,category:`Abstract`,added:`2026-04-15`,description:`Multi-colored interlocking textile grid found in classic Scottish kilts.`,shader:`
    vec4 generate() {
      float s = max(u_softness, 0.0005);
      float t = 1.0 - u_band;
      float fx = fract(v_uv.x * u_scale);
      float fy = fract(v_uv.y * u_scale);

      float hor = smoothstep(t - s, t + s, fx) * 0.5;
      float ver = smoothstep(t - s, t + s, fy) * 0.5;
      vec4 color = mix(u_secondary_color, u_primary_color, hor + ver);

      // Optional thin overcheck lines (hidden when width is 0)
      float on = step(0.001, u_accent_width);
      float accA = 1.0 - smoothstep(u_accent_width, u_accent_width + s, abs(fx - 0.35));
      float accB = 1.0 - smoothstep(u_accent_width, u_accent_width + s, abs(fy - 0.35));
      float acc = clamp(accA + accB, 0.0, 1.0) * on;
      color = mix(color, u_accent_color, acc * 0.85);
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,0,0,1],u_secondary_color:[0,.2,.1,1],u_accent_color:[.95,.9,.3,1],u_band:.3,u_accent_width:0}},{name:`Royal Stewart`,uniforms:{u_primary_color:[.08,.1,.3,1],u_secondary_color:[.6,.07,.1,1],u_accent_color:[.95,.85,.25,1],u_band:.28,u_accent_width:.02}},{name:`Blackwatch`,uniforms:{u_primary_color:[.05,.22,.12,1],u_secondary_color:[.05,.12,.2,1],u_accent_color:[.08,.08,.1,1],u_band:.35,u_accent_width:.025}},{name:`Grey Flannel`,uniforms:{u_primary_color:[.2,.2,.22,1],u_secondary_color:[.45,.45,.47,1],u_accent_color:[.7,.15,.15,1],u_band:.3,u_accent_width:.015}}],uniforms:[{id:`u_scale`,name:`Grid Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_band`,name:`Band Width`,type:`float`,min:.05,max:.6,default:.3},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.008},{id:`u_accent_width`,name:`Overcheck Width`,type:`float`,min:0,max:.1,default:0},{id:`u_primary_color`,name:`Stripe`,type:`color`,default:[1,0,0,1]},{id:`u_secondary_color`,name:`Base Wool`,type:`color`,default:[0,.2,.1,1]},{id:`u_accent_color`,name:`Overcheck`,type:`color`,default:[.95,.9,.3,1]}]},js=e({default:()=>Ms}),Ms={id:`planet_rings`,name:`Planet Rings`,category:`Cosmos`,added:`2026-06-11`,description:`Saturn-style ice rings seen edge-on across the panel — banded ringlets, a dark Cassini gap, grainy particle shimmer, and a shadowed limb.`,shader:`
    // Layered 1D value noise along the ring radius (drives ringlet banding)
    float ringNoise_prn(float x) {
      float v = 0.0;
      float a = 0.55;
      float f = 1.0;
      for (int i = 0; i < 5; i++) {
        float fl = floor(x * f);
        float fr = fract(x * f);
        fr = fr * fr * (3.0 - 2.0 * fr);
        v += a * mix(hash(vec2(fl, 3.7)), hash(vec2(fl + 1.0, 3.7)), fr);
        f *= 2.13;
        a *= 0.55;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Rings run horizontally with a gentle perspective bow
      float bow = sin(uv.x * 3.14159265) * u_tilt * 0.08;
      float ry = uv.y + bow;

      // Radial coordinate within the ring system (0 inner edge, 1 outer)
      float t = fract(ry * u_ring_scale);

      // --- Ringlet density profile ---
      // Stacked octaves of banding at several radial frequencies
      float bands = ringNoise_prn(t * 7.0);
      float fine  = ringNoise_prn(t * 41.0 + 13.0);
      float micro = ringNoise_prn(t * 160.0 + 51.0);
      float density = bands * 0.6 + fine * 0.3 + micro * 0.18;

      // --- Cassini division: a clean dark gap ---
      float gapPos = 0.62;
      float gap = 1.0 - smoothstep(0.035, 0.012, abs(t - gapPos));
      // Encke-style thin secondary gap
      float gap2 = 1.0 - smoothstep(0.012, 0.004, abs(t - 0.86));
      density *= gap * (0.55 + 0.45 * gap2);

      // Inner C-ring is translucent, B-ring densest, A-ring moderate
      float profile = smoothstep(0.02, 0.18, t) *
                      (0.45 + 0.55 * smoothstep(0.18, 0.34, t)) *
                      smoothstep(1.0, 0.93, t);
      // A-ring slightly dimmer than B-ring
      profile *= mix(1.0, 0.72, smoothstep(gapPos, gapPos + 0.05, t));
      density *= profile;

      // --- Particle grain: icy rubble shimmer along the bands ---
      float grain = hash(vec2(floor(uv.x * 900.0), floor(t * 380.0)));
      density *= 0.82 + 0.30 * grain;

      // --- Lighting: soft top-lit shading across each ring annulus ---
      float shade = 0.75 + 0.25 * sin(t * 6.2831853 + 1.2);

      // --- Palette ---
      vec3 space    = vec3(0.012, 0.012, 0.022);
      vec3 iceCol   = u_ring_color.rgb;            // pale sand-ice
      vec3 dustCol  = iceCol * vec3(0.62, 0.55, 0.50); // dustier inner tone
      vec3 shadowed = iceCol * 0.22;

      vec3 ringCol = mix(dustCol, iceCol, smoothstep(0.15, 0.6, t));
      ringCol = mix(shadowed, ringCol, shade);

      vec3 col = mix(space, ringCol, clamp(density * 1.6, 0.0, 1.0));

      // Bright specular thread where the densest B-ring catches the sun
      float gleam = smoothstep(0.55, 0.95, density) * smoothstep(0.42, 0.36, abs(t - 0.40));
      col += vec3(1.0, 0.97, 0.9) * gleam * 0.25;

      // Sparse background stars in the gaps
      vec2 g = floor(uv * 80.0);
      float star = smoothstep(0.97, 1.0, hash(g + 7.7)) *
                   smoothstep(0.09, 0.0, length(fract(uv * 80.0) - vec2(hash(g), hash(g + 31.0))));
      col += vec3(0.8, 0.85, 1.0) * star * (1.0 - clamp(density * 2.0, 0.0, 1.0));

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_ring_scale`,name:`Ring Bands`,type:`float`,min:.5,max:4,default:1},{id:`u_tilt`,name:`Ring Bow`,type:`float`,min:0,max:1,default:.4},{id:`u_ring_color`,name:`Ice Colour`,type:`color`,default:[.86,.78,.62,1]}]},Ns=e({default:()=>Ps}),Ps={id:`plant_cells_artisan`,name:`Plant Cells`,category:`Natural`,added:`2026-04-15`,description:`Geometric hexagonal-ish stacked cells mimicking biological plant structures.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float cell = smoothstep(0.05, 0.1, abs(m_dist - 0.2));
      return mix(u_secondary_color, u_primary_color, cell);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Magnification`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Chlorophyll`,type:`color`,default:[.2,.5,.1,1]},{id:`u_secondary_color`,name:`Cell Wall`,type:`color`,default:[.1,.2,.05,1]}]},Fs=e({default:()=>Is}),Is={id:`plasma_core_artisan`,name:`Plasma Core`,category:`Abstract`,added:`2026-04-16`,description:`Pulsing radial energy patterns mimicking high-energy physics experiment cores.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale - 1.5708);
      float mask = smoothstep(0.2, 0.5, pulse * (1.0 - d));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pulse Speed`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Plasma Glow`,type:`color`,default:[1,.4,1,1]},{id:`u_secondary_color`,name:`Plasma Void`,type:`color`,default:[.1,0,.1,1]}]},Ls=e({default:()=>Rs}),Rs={id:`pleated_fabric`,name:`Pleated Fabric`,category:`Industrial`,added:`2026-05-01`,description:`Accordion-pleated fabric with lit faces, shadowed valleys, and specular fold edges.`,shader:`
    // Map a value into a sawtooth that folds into a triangle wave (accordion pleat shape)
    float pleatProfile(float x) {
      // x in [0,1] per pleat â€” returns height in [0,1]
      // Each pleat: rise sharply (lit face), fold back (shadow face)
      float t = fract(x);
      // Triangle wave: 0â†’1â†’0 over one period
      return 1.0 - abs(2.0 * t - 1.0);
    }

    // Derivative approximation for surface normal shading
    float pleatDeriv(float x) {
      float t = fract(x);
      return t < 0.5 ? 1.0 : -1.0;
    }

    vec4 generate() {
      float count  = u_pleat_count;
      float depth  = u_depth;
      vec3  fabric = u_fabric_color.rgb;

      // Pleats run vertically â€” fold along Y axis, wave in X
      float px = v_uv.x * count;
      float height = pleatProfile(px);
      float slope  = pleatDeriv(px);  // +1 = lit face, -1 = shadow face

      // Simulate directional lighting: light comes from upper-left
      // Lit face (slope > 0): bright. Shadow face (slope < 0): dark.
      float litFactor   = smoothstep(-1.0, 1.0, slope);
      float shadeAmount = mix(1.0 - 0.55 * depth, 1.0, litFactor);

      // Fold edge highlight: near the peak of each pleat
      float peak = 1.0 - abs(height - 1.0) / 1.0; // 1 at peak, 0 at valley
      float foldEdge = pow(smoothstep(0.80, 1.0, height), 3.0);
      float specular = foldEdge * 0.45 * clamp(depth * 0.7, 0.0, 1.0);

      // Valley shadow: dark crease at the base
      float valley = pow(smoothstep(0.12, 0.0, height), 2.0);
      float valShadow = valley * 0.5 * depth;

      // Ambient occlusion in the tight valley fold
      float ao = 1.0 - valley * 0.4 * depth;

      // Subtle vertical fabric grain (tiny horizontal texture variation along the pleat face)
      float grain = sin(v_uv.y * count * 80.0) * 0.015;

      vec3 col = fabric * shadeAmount * ao;
      col += specular;          // fold edge brightening
      col -= valShadow;         // valley darkening
      col += grain * litFactor; // surface micro-texture

      col = clamp(col, 0.0, 1.0);

      // If specular pass, return the highlight channel
      float specPass = foldEdge * step(0.5, u_is_spec);
      col = mix(col, vec3(specular + 0.1), specPass);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_pleat_count`,type:`float`,default:12,min:4,max:30,name:`Pleat Count`},{id:`u_fabric_color`,type:`color`,default:[.15,.15,.18,1],name:`Fabric Colour`},{id:`u_depth`,type:`float`,default:1,min:.2,max:2,name:`Fold Depth`}]},zs=e({default:()=>Bs}),Bs={id:`polaroid_fade`,name:`Polaroid Fade`,category:`Retro`,added:`2026-06-11`,description:`Instant photos pinned in a grid — chalky white frames with fat bottoms, each window holding a sun-bleached chemical sunset drowning in cyan shadows and grain.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_tiles;
      vec2 cell = floor(uv);
      vec2 f = fract(uv);
      float seed = hash(cell);

      // photo window: equal sides/top, fat bottom margin
      vec2 lo = vec2(0.08, 0.215);
      vec2 hi = vec2(0.92, 0.925);
      bool inPhoto = f.x > lo.x && f.x < hi.x && f.y > lo.y && f.y < hi.y;

      // --- the frame ---
      vec3 frame = vec3(0.965, 0.955, 0.925);
      frame -= vec3(0.05, 0.06, 0.08) * noise(uv * 160.0) * 0.5;
      // age-yellowing creeping in from the tile edge
      float edged = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      frame = mix(frame * vec3(1.0, 0.96, 0.86), frame, smoothstep(0.0, 0.06, edged));
      // soft drop shadow ring hugging the photo window
      vec2 q = max(lo - f, f - hi);
      float outd = max(q.x, q.y);
      frame *= 1.0 - exp(-max(outd, 0.0) * 55.0) * 0.22;
      // tile separation shadow
      frame *= 0.88 + 0.12 * smoothstep(0.0, 0.025, edged);

      vec3 col = frame;

      if (inPhoto) {
        vec2 pf = (f - lo) / (hi - lo);   // 0..1 inside the photo

        // --- the photograph: a low-sun landscape ---
        float horizon = 0.42 + (seed - 0.5) * 0.10;
        vec3 skyTop = vec3(0.55, 0.62, 0.72);
        vec3 skyLow = vec3(0.95, 0.72, 0.50);
        vec3 ground = vec3(0.30, 0.26, 0.22);
        vec3 photo = mix(skyLow, skyTop, smoothstep(horizon, 1.0, pf.y));
        photo = mix(ground * (0.7 + 0.3 * pf.y / max(horizon, 0.01)), photo, smoothstep(horizon - 0.015, horizon, pf.y));

        // soft blown-out sun
        vec2 sp = pf - vec2(0.30 + seed * 0.4, horizon + 0.16);
        photo += vec3(1.0, 0.85, 0.6) * exp(-dot(sp, sp) * 55.0) * 0.7;

        // distant treeline scribble on the horizon
        float tree = smoothstep(0.0, 0.025, pf.y - horizon) * smoothstep(0.06, 0.02, pf.y - horizon);
        photo = mix(photo, vec3(0.22, 0.20, 0.17), tree * step(0.35, noise(vec2(pf.x * 30.0 + cell.x * 13.0, 2.0))));

        // --- chemical decay ---
        // milky fade toward beige + cyan-shifted shadows
        vec3 milk = vec3(0.88, 0.84, 0.74);
        float lum = dot(photo, vec3(0.299, 0.587, 0.114));
        photo = mix(photo, mix(vec3(0.30, 0.45, 0.48), milk, lum), u_fade);
        // warm cast from the tint uniform
        photo *= mix(vec3(1.0), u_tint.rgb, 0.35);
        // per-print exposure lottery
        photo *= 0.88 + hash(cell + 3.3) * 0.24;
        // vertical developer streaks
        photo += vec3(0.06, 0.05, 0.03) * (noise(vec2(pf.x * 18.0 + cell.x * 31.0, 0.5)) - 0.5);
        // emulsion grain
        photo += (noise(uv * 480.0) - 0.5) * 0.06;
        // hard vignette pooling in the corners
        vec2 vc = pf - 0.5;
        photo *= 1.0 - dot(vc, vc) * 0.55;

        col = photo;
      }

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_tiles`,name:`Prints Across`,type:`float`,min:1,max:5,default:2},{id:`u_fade`,name:`Chemical Fade`,type:`float`,min:0,max:1,default:.55},{id:`u_tint`,name:`Age Tint`,type:`color`,default:[1,.88,.7,1]}]},Vs=e({default:()=>Hs}),Hs={id:`polka_dot_artisan`,name:`Pro Polka Dots`,category:`Organic`,added:`2026-04-15`,description:`Precision uniform polka dots with adjustable spacing and edge softness.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      float mask = smoothstep(u_radius, u_radius - 0.02, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Count`,type:`float`,min:2,max:50,default:10},{id:`u_radius`,name:`Dot Size`,type:`float`,min:.1,max:.5,default:.3},{id:`u_primary_color`,name:`Dot Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Base Color`,type:`color`,default:[.05,.05,.1,1]}]},Us=e({default:()=>Ws}),Ws={id:`powder_coat`,name:`Powder Coat`,category:`Industrial`,added:`2026-05-13`,description:`Powder coat finish with characteristic orange-peel micro-texture. Common on roll cages, wheel centres, and suspension components.`,shader:`
    float hash_pc(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_pc(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_pc(i), hash_pc(i+vec2(1,0)), f.x),
                 mix(hash_pc(i+vec2(0,1)), hash_pc(i+vec2(1,1)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Orange-peel: 3 octaves of noise at different scales
      // Creates the characteristic random bumpy surface
      float s = u_peel_scale;
      float n1 = noise_pc(uv * s);
      float n2 = noise_pc(uv * s * 2.1 + vec2(1.7, 3.3)) * 0.5;
      float n3 = noise_pc(uv * s * 4.3 + vec2(5.1, 2.8)) * 0.25;
      float peel = (n1 + n2 + n3) / 1.75;

      // Convert to surface normal approximation for shading
      // Sample nearby for gradient
      float dx = noise_pc(uv * s + vec2(0.002, 0.0)) - noise_pc(uv * s - vec2(0.002, 0.0));
      float dy = noise_pc(uv * s + vec2(0.0, 0.002)) - noise_pc(uv * s - vec2(0.0, 0.002));
      // Simple Lambertian diffuse from fixed light direction
      vec3 lightDir = normalize(vec3(-0.4, 0.6, 1.0));
      vec3 normal   = normalize(vec3(-dx * u_depth * 8.0, -dy * u_depth * 8.0, 1.0));
      float diffuse = max(0.0, dot(normal, lightDir));

      // Specular — powder coat is semi-matte so keep this subtle
      vec3 viewDir  = vec3(0.0, 0.0, 1.0);
      vec3 halfDir  = normalize(lightDir + viewDir);
      float spec    = pow(max(0.0, dot(normal, halfDir)), 12.0) * 0.08 * u_gloss;

      // Compose
      vec3 base  = u_coat_color.rgb;
      vec3 col   = base * (0.35 + diffuse * 0.65) + vec3(spec);

      // Micro specks — powder coat often has tiny metallic particles
      float speck = step(0.97, hash_pc(uv * 400.0)) * 0.15 * u_gloss;
      col += vec3(speck);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_coat_color`,name:`Coat Colour`,type:`color`,default:[.08,.08,.09,1]},{id:`u_peel_scale`,name:`Peel Scale`,type:`float`,default:60,min:10,max:150},{id:`u_depth`,name:`Texture Depth`,type:`float`,default:.6,min:0,max:1},{id:`u_gloss`,name:`Gloss Level`,type:`float`,default:.4,min:0,max:1}]},Gs=e({default:()=>Ks}),Ks={id:`prism_shards_artisan`,name:`Prism Shards`,category:`Abstract`,added:`2026-04-15`,description:`Sharp refracted geometric light cells with internal color shifts across the spectrum.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      vec3 color = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + m_point.x * 6.28);
      return vec4(color, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Refraction Density`,type:`float`,min:2,max:15,default:8}]},qs=e({default:()=>Js}),Js={id:`prismatic_flip`,name:`Prismatic Flip Paint`,category:`Racing`,added:`2026-05-13`,description:`Colour-shifting flip paint that sweeps through the spectrum across the surface — as seen on modern motorsport liveries and special-edition road cars.`,shader:`
    float hash_pf(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_pf(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_pf(i), hash_pf(i+vec2(1,0)), f.x),
                 mix(hash_pf(i+vec2(0,1)), hash_pf(i+vec2(1,1)), f.x), f.y);
    }

    vec3 hsvToRgb(float h, float s, float v) {
      vec3 c = abs(fract(vec3(h) + vec3(0.0, 0.333, 0.667)) * 6.0 - 3.0) - 1.0;
      return v * mix(vec3(1.0), clamp(c, 0.0, 1.0), s);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Directional hue sweep across surface
      float axis  = mix(uv.x, uv.y, u_direction);
      float sweep = (axis - 0.5) * u_range;

      // Organic turbulence breaks up the flat gradient
      float n = noise_pf(uv * 2.8) * 0.5 + noise_pf(uv * 7.2) * 0.22;
      n /= 0.72;

      float hue = fract(u_base_hue + sweep + (n - 0.5) * u_turbulence);

      vec3 col = hsvToRgb(hue, u_saturation, u_brightness);

      // Directional gloss band — simulates environmental reflection sweep
      float gloss = pow(max(0.0, 1.0 - abs(axis - 0.5) * 2.0), 4.0) * 0.18;
      col = clamp(col + gloss, 0.0, 1.0);

      if (u_is_spec > 0.5) {
        // Flip paint: moderate-high metallic, glossy; turbulence noise gives subtle variation
        float metallic = clamp(0.65 + (n - 0.5) * 0.2, 0.0, 1.0);
        float roughness = clamp(0.1 + (0.5 - n) * 0.08, 0.05, 0.18);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_base_hue`,name:`Base Hue`,type:`float`,default:0,min:0,max:1},{id:`u_range`,name:`Hue Range`,type:`float`,default:.55,min:.05,max:2},{id:`u_direction`,name:`Direction`,type:`float`,default:.3,min:0,max:1},{id:`u_saturation`,name:`Saturation`,type:`float`,default:.88,min:.1,max:1},{id:`u_brightness`,name:`Brightness`,type:`float`,default:.88,min:.2,max:1},{id:`u_turbulence`,name:`Turbulence`,type:`float`,default:.28,min:0,max:1}]},Ys=e({default:()=>Xs}),Xs={id:`pulsar_radial_artisan`,name:`Pulsar Radial`,category:`Abstract`,added:`2026-04-16`,description:`High-frequency radial pulses mimicking deep-space electromagnetic emissions.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale);
      float mask = step(0.5, pulse);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pulse Freq`,type:`float`,min:50,max:500,default:200},{id:`u_primary_color`,name:`Pulsar Beam`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Space Void`,type:`color`,default:[0,0,0,1]}]},Zs=e({default:()=>Qs}),Qs={id:`punch_card`,name:`Punch Card`,category:`Retro`,added:`2026-06-11`,description:`Mainframe Hollerith card stock — manila fibre ruled into twelve punch rows, rectangular chads stamped clean through with bevelled lips and faint printed digit marks.`,shader:`
    // rounded-rectangle signed distance
    float rrect_pc(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    vec4 generate() {
      float cols = u_columns;
      float rows = 12.0;
      vec2 guv = vec2(v_uv.x * cols, v_uv.y * rows);
      vec2 cell = floor(guv);
      vec2 f = fract(guv) - 0.5;

      // --- manila card stock ---
      vec3 card = u_card_color.rgb;
      card *= 0.93 + noise(guv * vec2(3.0, 40.0)) * 0.12;       // long paper fibres
      card *= 0.97 + noise(v_uv * 600.0) * 0.05;                // pulp speckle
      // handling grime drifting in from card edges
      card *= 1.0 - smoothstep(0.55, 0.95, fbm(v_uv * 3.0) * 0.5 + 0.5) * 0.08;

      vec3 col = card;
      vec3 inkfaint = card * 0.55;

      // --- printed structure: row rules + column ticks ---
      float rowline = 1.0 - smoothstep(0.015, 0.035, abs(f.y + 0.5) );
      rowline = max(rowline, 1.0 - smoothstep(0.015, 0.035, abs(f.y - 0.5)));
      col = mix(col, inkfaint, rowline * 0.25);
      float coltick = 1.0 - smoothstep(0.02, 0.05, abs(f.x + 0.5));
      col = mix(col, inkfaint, coltick * 0.15);

      // printed digit mark at every position (small faint dash pair)
      float dgx = step(abs(f.x), 0.12);
      float dg1 = dgx * step(abs(f.y - 0.10), 0.035);
      float dg2 = dgx * step(abs(f.y + 0.10), 0.035);
      col = mix(col, inkfaint, (dg1 + dg2) * 0.5);

      // --- which positions are punched: one or two punches per column,
      //     like real encoded data ---
      float colseed = mod(cell.x, cols);   // stable per column, tiles with the sheet
      float r1 = floor(hash(vec2(colseed, 1.0)) * 12.0);
      float r2 = floor(hash(vec2(colseed, 2.0)) * 12.0);
      float want2 = step(0.45, hash(vec2(colseed, 3.0)));
      float punched = step(abs(cell.y - r1), 0.25)
                    + step(abs(cell.y - r2), 0.25) * want2 * u_punch_density * 2.0;
      punched = clamp(punched * step(0.05, u_punch_density), 0.0, 1.0);

      if (punched > 0.5) {
        float hd = rrect_pc(f, vec2(0.20, 0.32), 0.05);
        // dark void through the card
        vec3 through = vec3(0.10, 0.09, 0.08) * (0.8 + noise(guv * 13.0) * 0.3);
        col = mix(col, through, 1.0 - smoothstep(0.0, 0.03, hd));
        // torn-fibre bright lip around the punch
        float lip = (1.0 - smoothstep(0.03, 0.10, abs(hd))) * step(0.0, hd);
        col = mix(col, card * 1.18, lip * 0.8);
        // die-press shadow below the hole
        float press = (1.0 - smoothstep(0.0, 0.12, hd)) * step(hd, 0.0) * 0.0
                    + (1.0 - smoothstep(0.02, 0.14, abs(hd))) * max(-f.y, 0.0);
        col *= 1.0 - press * 0.25;
      }

      // --- every 10th column printed bolder (field separators) ---
      float sep = step(mod(cell.x, 10.0), 0.25);
      col = mix(col, inkfaint, sep * coltick * 0.6);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_columns`,name:`Card Columns`,type:`float`,min:10,max:60,default:26},{id:`u_punch_density`,name:`Data Density`,type:`float`,min:0,max:1,default:.55},{id:`u_card_color`,name:`Card Stock`,type:`color`,default:[.87,.8,.62,1]}]},$s=e({default:()=>ec}),ec={id:`quantum_foam_artisan`,name:`Quantum Foam`,category:`Abstract`,added:`2026-04-15`,description:`Abstract probability interference and grain noise mimicking fluctuations at the Planck scale.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 1.1);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Planck Resolution`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Fluctuation`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Vacuum`,type:`color`,default:[0,0,.05,1]}]},tc=e({default:()=>nc}),nc={id:`quartz_crystal_artisan`,name:`Quartz Plane`,category:`Geology`,added:`2026-04-16`,description:`Sharp geometric crystalline planes and internal mineral prisms.`,shader:`
    vec4 generate() {
      float d = abs(v_uv.x - 0.5) + abs(v_uv.y - 0.5);
      float mask = step(0.4, fract(d * u_scale));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Quartz Face`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Prism Core`,type:`color`,default:[.8,.8,.9,1]}]},rc=e({default:()=>ic}),ic={id:`racing_livery_stripe`,name:`Racing Livery Stripe`,category:`Racing`,added:`2026-05-01`,description:`Dual-tone diagonal speed stripe with gradient fade and crisp edges â€” a classic motorsport livery element.`,shader:`
    // Signed distance to an infinite angled stripe centred on the canvas
    float stripeSDist(vec2 uv, float angle) {
      // Direction perpendicular to stripe edge
      vec2 dir = vec2(cos(angle), sin(angle));
      // Project UV (centred at 0.5) onto the perpendicular axis
      vec2 p = uv - 0.5;
      return dot(p, dir);
    }

    // Remap x from [a,b] to [0,1]
    float remap01(float x, float a, float b) {
      return clamp((x - a) / (b - a), 0.0, 1.0);
    }

    vec4 generate() {
      vec3  stripeCol = u_stripe_color.rgb;
      vec3  bgCol     = u_bg_color.rgb;
      float halfW     = u_stripe_width * 0.5;
      float angle     = u_angle * 3.14159;  // -pi to pi

      // Perpendicular signed distance to stripe centreline
      float sDist = stripeSDist(v_uv, angle + 1.5707963); // perpendicular to stripe direction

      // Sharp stripe mask â€” no anti-alias blur (crisp edge)
      float stripeMask = step(-halfW, sDist) * step(sDist, halfW);

      // Gradient along the stripe length (parallel to stripe direction)
      vec2  stripeDir = vec2(cos(angle), sin(angle));
      float along     = dot(v_uv - 0.5, stripeDir) + 0.5; // 0â†’1 along stripe

      // Colour gradient from stripeCol at one end to a lighter/darker variant
      vec3 stripeEnd   = mix(stripeCol, vec3(1.0), 0.25); // lighter at far end
      vec3 gradStripe  = mix(stripeCol, stripeEnd, along);

      // Edge highlight â€” very thin bright line at each stripe edge for crispness
      float edgeDist = min(abs(sDist - halfW), abs(sDist + halfW));
      float edgeHighlight = smoothstep(0.012, 0.0, edgeDist) * 0.35 * stripeMask;

      // Compose
      vec3 col = mix(bgCol, gradStripe, stripeMask);
      col += edgeHighlight;
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_stripe_color`,type:`color`,default:[.9,.1,.1,1],name:`Stripe Colour`},{id:`u_bg_color`,type:`color`,default:[.05,.05,.05,1],name:`Background Colour`},{id:`u_stripe_width`,type:`float`,default:.45,min:.1,max:.9,name:`Stripe Width`},{id:`u_angle`,type:`float`,default:.3,min:-1,max:1,name:`Stripe Angle`}]},ac=e({default:()=>oc}),oc={id:`radial_gradient_artisan`,name:`Master Radial`,category:`Abstract`,added:`2026-04-15`,description:`Focus-aligned radial gradient transition.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5) * 2.0;
      float mask = smoothstep(0.0, 1.0, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Center Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Outer Color`,type:`color`,default:[0,0,0,1]}]},sc=e({default:()=>cc}),cc={id:`radiolarian_skeletons_artisan`,name:`Radiolarian Skeletons`,category:`Organic`,added:`2026-05-13`,description:`Intricate, symmetrical, perforated silica shells based on microscopic marine zooplankton.`,shader:`
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        vec2 id = floor(uv);
        vec2 gv = fract(uv) - 0.5;
        
        // Create repeating circular structures
        float dist = length(gv);
        
        // Main silica shell
        float shell = smoothstep(0.45, 0.4, dist) - smoothstep(0.35, 0.3, dist);
        
        // Radiating spines
        float angle = atan(gv.y, gv.x);
        float spines = 0.5 + 0.5 * sin(angle * 12.0); // 12-fold symmetry
        float spineMask = smoothstep(0.8, 1.0, spines) * smoothstep(0.6, 0.4, dist) * smoothstep(0.1, 0.2, dist);
        
        // Internal perforated mesh
        float innerDist = length(gv);
        float meshMask = smoothstep(0.35, 0.3, innerDist);
        float perforations = sin(gv.x * 40.0) * sin(gv.y * 40.0);
        meshMask *= smoothstep(0.2, 0.4, perforations); // punch holes
        
        // Combine features
        float silicaMask = clamp(shell + spineMask + meshMask, 0.0, 1.0);
        
        // Depth shading
        float depth = 1.0 - dist;
        vec4 silicaColor = mix(u_silica_shadow, u_silica_highlight, silicaMask * depth);
        
        return mix(u_fluid_bg, silicaColor, silicaMask);
    }
  `,uniforms:[{id:`u_scale`,name:`Plankton Scale`,type:`float`,min:2,max:20,default:5},{id:`u_fluid_bg`,name:`Marine Fluid`,type:`color`,default:[.05,.15,.2,1]},{id:`u_silica_shadow`,name:`Silica Core`,type:`color`,default:[.7,.75,.8,1]},{id:`u_silica_highlight`,name:`Silica Edge`,type:`color`,default:[.95,.95,1,1]}]},lc=e({default:()=>uc}),uc={id:`rain_on_glass`,name:`Rain on Glass`,category:`Natural`,added:`2026-04-30`,description:`Rainwater on a tinted glass windshield — beaded droplets with meniscus rim highlights and wavy vertical rivulets.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    float hash1(float n) { return fract(sin(n) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    // ---- Voronoi-like droplet field ----
    // Returns (distance-to-nearest-center, cell hash).
    vec2 dropletCell(vec2 uv) {
      vec2 cellID = floor(uv);
      vec2 cellUV = fract(uv);
      float minDist = 1e9;
      float minHash = 0.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 nID = cellID + neighbor;
          // Random point within the neighboring cell — offset by noise for organic shape
          float hx = hash(nID);
          float hy = hash(nID + vec2(31.41, 27.18));
          vec2 center = neighbor + vec2(hx, hy);
          // Warp center slightly with slow noise for irregular droplet placement
          center += 0.15 * vec2(
            noise(nID * 0.7 + 1.5708 * 0.03),
            noise(nID * 0.7 + vec2(5.3, 1.7) + 1.5708 * 0.03)
          );
          float d = length(cellUV - center);
          if (d < minDist) {
            minDist = d;
            minHash = hash(nID + vec2(99.1, 7.3));
          }
        }
      }
      return vec2(minDist, minHash);
    }

    // ---- Rivulet streak ----
    // One vertical streak at normalised x position xPos [0,1].
    float rivulet(vec2 uv, float xPos) {
      float xDist = abs(uv.x - xPos);
      // Wavy wobble along Y using noise + time (slow drip)
      float wobble = fbm(vec2(xPos * 4.7, uv.y * 2.5 + 1.5708 * 0.04)) * 0.04;
      float streak = smoothstep(0.022, 0.008, xDist + wobble);
      return streak;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- Base tinted glass ----
      vec3 col = u_glass_color.rgb;

      // ---- Droplets ----
      vec2 dropUV = uv * u_drop_density;
      vec2 cell = dropletCell(dropUV);
      float d   = cell.x;   // 0 at droplet center, ~0.5 at cell edge
      float ch  = cell.y;   // per-cell hash for size variation

      // Vary droplet radius slightly per cell for organic feel
      float dropRadius = 0.28 + ch * 0.12;
      dropRadius *= u_wetness;

      // Interior of droplet: slightly brighter (refraction / lensing)
      float dropInterior = smoothstep(dropRadius + 0.01, dropRadius - 0.01, d);

      // Annular rim highlight (surface tension meniscus)
      float rimInner  = dropRadius * 0.78;
      float rimOuter  = dropRadius;
      float rim = smoothstep(rimInner - 0.01, rimInner + 0.01, d)
                - smoothstep(rimOuter  - 0.008, rimOuter,       d);
      rim = clamp(rim, 0.0, 1.0);

      // Water lens brightening inside droplet
      vec3 dropCol = col * (1.0 + 0.18 * dropInterior);
      // Specular rim: white-ish highlight
      dropCol += vec3(rim * 0.55);

      // Blend droplet over glass by coverage
      float dropMask = clamp(dropInterior + rim * 0.6, 0.0, 1.0) * u_wetness;
      col = mix(col, dropCol, dropMask);

      // ---- Rivulets ----
      // Space u_rivulet_count streaks evenly across X, with per-streak hash offset
      float rivMask = 0.0;
      for (int i = 0; i < 20; i++) {
        if (float(i) >= u_rivulet_count) break;
        float xPos = (float(i) + 0.5 + hash1(float(i) * 7.39) * 0.4) / u_rivulet_count;
        rivMask += rivulet(uv, xPos);
      }
      rivMask = clamp(rivMask, 0.0, 1.0) * u_wetness;

      // Rivulets: brighter, slightly blue-tinted water streak
      vec3 rivColor = col * 1.22 + vec3(0.02, 0.03, 0.05);
      col = mix(col, rivColor, rivMask * 0.75);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_glass_color.a * u_opacity);
    }
  `,uniforms:[{id:`u_glass_color`,name:`Glass Tint`,type:`color`,default:[.1,.13,.16,1]},{id:`u_drop_density`,name:`Drop Density`,type:`float`,min:2,max:20,default:8},{id:`u_rivulet_count`,name:`Rivulet Count`,type:`float`,min:2,max:20,default:8},{id:`u_wetness`,name:`Wetness`,type:`float`,min:0,max:1,default:.7}]},dc=e({default:()=>fc}),fc={id:`reaction_diffusion_artisan`,name:`Reaction Diffusion`,category:`Abstract`,added:`2026-04-15`,description:`Organic biological growth and coral-like patterns mimicking chemical morphogenesis.`,shader:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      n = abs(sin(n * 20.0));
      float mask = smoothstep(0.4, 0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Growth Scale`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Organism`,type:`color`,default:[.8,.4,.2,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[.1,.05,0,1]}]},pc=e({default:()=>mc}),mc={id:`realistic_viper_artisan`,name:`Realistic Viper`,category:`Natural`,added:`2026-04-15`,description:`Small, diamond-shaped high-fidelity interlocking scales mimicking viper skin.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:10,max:80,default:40},{id:`u_primary_color`,name:`Scales`,type:`color`,default:[.1,.15,.05,1]},{id:`u_secondary_color`,name:`Skin Deep`,type:`color`,default:[0,.05,0,1]}]},hc=e({default:()=>gc}),gc={id:`rim_spoke_carbon_artisan`,name:`Spoke Carbon`,category:`Racing`,added:`2026-04-16`,description:`Multi-layered carbon strands optimized for high-strength wheel spokes.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x + uv.y) * sin(uv.x - uv.y);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Fiber Top`,type:`color`,default:[.2,.2,.22,1]},{id:`u_secondary_color`,name:`Resin Base`,type:`color`,default:[.1,.1,.12,1]}]},_c=e({default:()=>vc}),vc={id:`risograph_grain`,name:`Risograph Grain`,category:`Retro`,added:`2026-06-11`,description:`Two-drum riso zine print — fluorescent pink and federal blue soy inks overprinting off-register, every shape dissolving into gritty stochastic grain on toothy paper.`,shader:`
    // ink coverage artwork for one drum: blobby discs + screened bands
    float inkart_rg(vec2 uv, float seed) {
      float n = fbm(uv * 2.2 + seed) * 0.5 + 0.5;
      float blobs = smoothstep(0.50, 0.72, n);
      float bands = step(0.70, fract(uv.y * 5.0 + n * 1.6)) * 0.65;
      float dots = smoothstep(0.78, 0.86, noise(uv * 9.0 + seed * 3.0)) * 0.8;
      return clamp(blobs + bands + dots, 0.0, 1.0);
    }

    // stochastic riso screen: coverage -> grainy printed mask
    float screen_rg(vec2 uv, float cov) {
      float g = hash(floor(uv * 850.0));
      float thresh = mix(0.5, g, u_grain);
      // drum pressure blotch: coverage wobbles at low frequency
      cov *= 0.82 + 0.36 * (noise(uv * 3.5 + 21.0));
      return smoothstep(thresh - 0.18, thresh + 0.18, cov);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // toothy recycled paper
      vec3 paper = vec3(0.95, 0.93, 0.87);
      paper -= vec3(0.06) * noise(uv * 320.0);
      paper -= vec3(0.10, 0.08, 0.05) * smoothstep(0.93, 1.0, noise(uv * 55.0)); // flecks

      // drum 1: fluorescent pink, on register
      float covA = inkart_rg(uv * 3.0, 4.7);
      float maskA = screen_rg(uv, covA);

      // drum 2: blue, deliberately knocked off register
      vec2 off = vec2(u_misreg, -u_misreg * 0.6);
      float covB = inkart_rg((uv + off) * 3.0 + vec2(13.0, 5.0), 9.2);
      float maskB = screen_rg(uv + off * 0.5, covB);

      // translucent soy inks multiply onto the sheet
      vec3 col = paper;
      col *= mix(vec3(1.0), u_ink_a.rgb, maskA * 0.92);
      col *= mix(vec3(1.0), u_ink_b.rgb, maskB * 0.88);
      // overprint pools slightly darker where both drums hit
      col *= 1.0 - maskA * maskB * 0.18;

      // roller pickup: faint horizontal ghosting streaks
      col *= 1.0 - (noise(vec2(uv.y * 120.0, 3.0)) - 0.5) * 0.05;

      // ink never quite reaches the grain valleys — paper sparkle
      float valley = step(0.94, hash(floor(uv * 850.0) + 7.0));
      col = mix(col, paper, valley * 0.5);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain Strength`,type:`float`,min:0,max:1,default:.65},{id:`u_misreg`,name:`Misregistration`,type:`float`,min:0,max:.02,default:.006},{id:`u_ink_a`,name:`Drum 1 Ink`,type:`color`,default:[1,.3,.55,1]},{id:`u_ink_b`,name:`Drum 2 Ink`,type:`color`,default:[.15,.35,.85,1]}]},yc=e({default:()=>bc}),bc={id:`river_cobble_artisan`,name:`River Cobble`,category:`Natural`,added:`2026-04-15`,description:`Smooth, irregular organic stone clusters mimicking riverbed masonry.`,shader:`
    vec2 random2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = random2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.45, 0.4, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stone Grey`,type:`color`,default:[.6,.6,.65,1]},{id:`u_secondary_color`,name:`Joint`,type:`color`,default:[.1,.1,.1,1]}]},xc=e({default:()=>Sc}),Sc={id:`river_stone_artisan`,name:`River Stones`,category:`Natural`,added:`2026-04-16`,description:`Smooth rounded pebble shapes mimicking naturally eroded riverbed stones.`,shader:`
    vec2 rand(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      float mask = smoothstep(0.4, 0.38, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stone Size`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Pebble Surface`,type:`color`,default:[.5,.5,.5,1]},{id:`u_secondary_color`,name:`Joint Sediment`,type:`color`,default:[.3,.3,.3,1]}]},Cc=e({default:()=>wc}),wc={id:`rivet_lines_pro`,name:`Panel Rivets`,category:`Industrial`,added:`2026-04-15`,description:`Structural rivet seams for automotive panels.`,shader:`
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale) - 0.5;
      float d = length(g);
      float mask = step(0.3, d) * step(d, 0.35);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rivet Spacing`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Rivet`,type:`color`,default:[.6,.6,.6,1]},{id:`u_secondary_color`,name:`Panel`,type:`color`,default:[.35,.35,.35,1]}]},Tc=e({default:()=>Ec}),Ec={id:`rivet_plate_elite`,name:`Rivet Plate Elite`,category:`Industrial`,added:`2026-04-15`,description:`Overlapping heavy armor sections with structural corner rivets.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      
      float plate = step(0.02, gv.x) * step(gv.x, 0.98) * step(0.02, gv.y) * step(gv.y, 0.98);
      float rivet = 0.0;
      if (length(gv - 0.1) < 0.05) rivet = 1.0;
      if (length(gv - 0.9) < 0.05) rivet = 1.0;
      
      float mask = max(plate * 0.5, rivet);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Count`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Armor Steel`,type:`color`,default:[.5,.5,.55,1]},{id:`u_secondary_color`,name:`Seam`,type:`color`,default:[.1,.1,.12,1]}]},Dc=e({default:()=>Oc}),Oc={id:`rocket_plume`,name:`Rocket Plume`,category:`Cosmos`,added:`2026-06-11`,description:`A roaring engine exhaust column stacked with glowing mach diamonds — violet-blue core, white shock discs, and ragged orange combustion fringe.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv);
      // Plume axis runs vertically down the tile centre
      float along = uv.y;                  // 0 = nozzle (top), 1 = downstream
      float across = (uv.x - 0.5) * 2.0;   // -1..1 across the plume

      // --- Plume envelope: necks in and flares out with distance ---
      float width = u_plume_width * (0.45 + 0.25 * sin(along * 9.0) * exp(-along * 1.2) + along * 0.55);
      // Turbulent edge raggedness grows downstream
      float edgeNoise = fbm(vec2(across * 3.0, along * 9.0)) * (0.15 + along * 0.5);
      float xa = abs(across) / max(width, 0.001) + edgeNoise * 0.45;

      float body = smoothstep(1.0, 0.55, xa);
      float coreMask = smoothstep(0.55, 0.0, xa);

      // --- Mach diamonds: periodic shock cells along the axis ---
      float cells = u_diamond_count;
      float ph = fract(along * cells);
      // Diamond shape: bright where the axial phase peak meets the centreline
      float diaAxial = exp(-pow((ph - 0.5) / 0.16, 2.0));
      float diaShape = exp(-pow(abs(across) / (width * 0.28 * (1.0 - abs(ph - 0.5))), 2.0));
      float diamonds = diaAxial * diaShape * exp(-along * 0.9);
      // Crossing oblique shock lines forming the X between diamonds
      float shockX = exp(-pow((abs(across) / max(width, 0.001) - abs(ph - 0.5) * 1.6) / 0.10, 2.0));
      shockX *= body * exp(-along * 1.1) * 0.5;

      // --- Combustion texture: streaming turbulence drawn downstream ---
      float streamTex = fbm(vec2(across * 7.0, along * 3.0 - fbm(vec2(across * 4.0, along * 6.0)))) * 0.5 + 0.5;
      float fineStreaks = noise(vec2(across * 30.0, along * 8.0));

      // --- Palette ---
      vec3 space    = vec3(0.012, 0.012, 0.025);
      vec3 coreCol  = u_core_color.rgb;            // violet-blue inner jet
      vec3 white    = vec3(1.0, 0.99, 0.95);
      vec3 flameOr  = vec3(1.0, 0.55, 0.15);       // outer combustion
      vec3 emberRed = vec3(0.70, 0.18, 0.05);

      vec3 col = space;

      // Outer fringe: orange fading to red embers downstream
      vec3 fringe = mix(flameOr, emberRed, smoothstep(0.2, 0.9, along));
      col += fringe * body * (0.4 + 0.6 * streamTex) * (1.0 - coreMask * 0.7);

      // Inner core column: hot blue, brightest near the nozzle
      float coreHeat = exp(-along * 1.6);
      col += coreCol * coreMask * (0.7 + 0.9 * coreHeat) * (0.75 + 0.35 * fineStreaks);

      // Mach diamonds blaze white over everything
      col += white * diamonds * u_diamond_glow * 2.2;
      col += coreCol * shockX * u_diamond_glow;

      // Nozzle-exit flash at the very top
      float exitFlash = exp(-along * 18.0) * coreMask;
      col += white * exitFlash * 1.2;

      // Sparse incandescent sparks swept downstream
      vec2 sg = floor(vec2(uv.x * 80.0, uv.y * 26.0));
      float spark = smoothstep(0.975, 1.0, hash(sg + 3.0)) * body;
      col += flameOr * spark * (0.6 + 0.4 * hash(sg + 9.0));

      // Soft ambient glow lighting the surrounding space
      col += fringe * exp(-pow(abs(across) / (width * 2.6), 2.0)) * 0.18;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_plume_width`,name:`Plume Width`,type:`float`,min:.1,max:.5,default:.22},{id:`u_diamond_count`,name:`Mach Diamonds`,type:`float`,min:2,max:10,default:5},{id:`u_diamond_glow`,name:`Diamond Glow`,type:`float`,min:.2,max:2,default:1},{id:`u_core_color`,name:`Core Colour`,type:`color`,default:[.45,.55,1,1]}]},kc=e({default:()=>Ac}),Ac={id:`roll_cage_foam_artisan`,name:`Roll Cage Foam`,category:`Racing`,added:`2026-04-16`,description:`Dense, pitted cellular protective foam found on professional roll cage padding.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          m_dist = min(m_dist, dist);
        }
      }
      return mix(u_secondary_color, u_primary_color, smoothstep(0.2, 0.4, m_dist));
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Foam Body`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Pore Shade`,type:`color`,default:[.05,.05,.05,1]}]},jc=e({default:()=>Mc}),Mc={id:`roof_shingles_artisan`,name:`Scalloped Shingles`,category:`Industrial`,added:`2026-04-15`,description:`Overlapping curved roofing tiles used in architectural design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = step(d, 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Rows`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Shingle`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Rim`,type:`color`,default:[.4,.4,.45,1]}]},Nc=e({default:()=>Pc}),Pc={id:`root_system_artisan`,name:`Root System`,category:`Natural`,added:`2026-04-16`,description:`Branching procedural line networks found in organic root systems and neural pathways.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float d = 1.0;
      for (int i=0; i<3; i++) {
        float n = hash(floor(uv));
        d = min(d, abs(fract(uv.x + n) - 0.5));
        uv *= 1.5;
        uv += n;
      }
      float mask = smoothstep(0.1, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Branching`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Root Fiber`,type:`color`,default:[.5,.4,.3,1]},{id:`u_secondary_color`,name:`Soil Deep`,type:`color`,default:[.1,.08,.05,1]}]},Fc=e({default:()=>Ic}),Ic={id:`rose_gold_brushed`,name:`Rose Gold Brushed`,category:`Industrial`,added:`2026-05-01`,description:`Directional brushed rose gold metal with warm pink-gold grain streaks and a subtle specular sheen band.`,shader:`
    float hash11(float p) { return fract(sin(p * 127.1) * 43758.5453); }

    float brushNoise(float y, float grain) {
      float band = floor(y * grain);
      float f    = fract(y * grain);
      float a = hash11(band);
      float b = hash11(band + 1.0);
      return mix(a, b, f * f * (3.0 - 2.0 * f));
    }

    float gaussianSheen(float x, float center, float sigma) {
      float d = x - center;
      return exp(-(d * d) / (2.0 * sigma * sigma));
    }

    vec4 generate() {
      // Horizontal brush grain along Y axis
      float grain = brushNoise(v_uv.y, u_grain);

      // Fine high-frequency streak noise
      float streak = hash11(floor(v_uv.y * u_grain * 8.0)) * 0.5 + 0.5;
      float noise  = mix(grain, streak, 0.35);

      // Base rose gold color modulated by grain
      vec3 baseCol = u_base_color.rgb * (0.82 + 0.18 * noise);

      // Gaussian specular sheen band across center-ish of UV.x
      float sheen = gaussianSheen(v_uv.x, 0.5, 0.18) * u_sheen;
      // Warm specular highlight — slightly whiter/lighter than base
      vec3 sheenCol = mix(baseCol, vec3(1.0, 0.90, 0.85), sheen * 0.6);

      return vec4(sheenCol, 1.0);
    }
  `,uniforms:[{id:`u_grain`,name:`Grain Density`,type:`float`,min:5,max:100,default:40},{id:`u_sheen`,name:`Sheen Intensity`,type:`float`,min:0,max:1,default:.6},{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.88,.65,.55,1]}]},Lc=e({default:()=>Rc}),Rc={id:`rubber_compound`,name:`Rubber Compound`,category:`Racing`,added:`2026-05-01`,description:`Fresh vulcanised racing tyre rubber — near-black carbon grain, subtle mould-release sheen, and low-frequency press flow marks.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_rb(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_rb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_rb(i);
      float b = hash1_rb(i + vec2(1.0, 0.0));
      float c = hash1_rb(i + vec2(0.0, 1.0));
      float d = hash1_rb(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for carbon-black micro grain
    float fbm_rb(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 4; i++) {
        v += a * smoothnoise_rb(p * s);
        s *= 2.1;
        a *= 0.50;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Carbon-black micro grain ---
      float grain = fbm_rb(uv * u_grain);

      // Low-frequency vulcanisation press flow marks
      // Circular concentric arcs — low frequency, very subtle
      float flow_angle = atan(uv.y - 0.5, uv.x - 0.5);
      float flow_radius = length(uv - 0.5);
      // Faint concentric ripple from press
      float flow = sin(flow_radius * 18.0 - flow_angle * 0.3) * 0.012;

      // Slight directional sheen — mould release surface
      // The sheen is slightly stronger across the x direction (mould release direction)
      float sheen_grad = 1.0 - abs(uv.x - 0.5) * 0.4;
      // Combined with a Gaussian centered at top-right (raking light)
      float sheen_spot = exp(-5.0 * length(uv - vec2(0.75, 0.75)) * 1.5);
      float sheen = (sheen_grad * 0.3 + sheen_spot * 0.7) * u_sheen;

      // Compound base color
      vec3 base = u_compound_color.rgb;

      // Carbon grain: very subtle brightness — ±4% on near-black base
      float grain_v = (grain - 0.5) * 0.08;

      // Highlight tint: raw rubber has faint warm (brownish) highlight
      vec3 warm_tint = vec3(0.04, 0.02, 0.00);
      float highlight_t = smoothstep(0.45, 0.65, grain);

      vec3 col = base + grain_v + warm_tint * highlight_t * 0.6;

      // Add flow marks (very faint)
      col += flow;

      // Mould-release surface sheen — slightly warm off-white reflection
      col += vec3(0.12, 0.11, 0.09) * sheen * 0.4;

      // Prevent blowing out — rubber stays dark
      col = clamp(col, 0.0, 0.22);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_compound_color`,name:`Rubber Color`,type:`color`,default:[.06,.05,.04,1]},{id:`u_grain`,name:`Surface Grain`,type:`float`,min:5,max:50,default:20},{id:`u_sheen`,name:`Rubber Gloss`,type:`float`,min:0,max:1,default:.4}]},zc=e({default:()=>Bc}),Bc={id:`safety_harness_artisan`,name:`Safety Harness`,category:`Racing`,added:`2026-04-16`,description:`Heavy-duty nylon web weave found in 5-point and 6-point racing harnesses.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 40.0;
      float lines = sin(uv.x) * sin(uv.y * 5.0);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Nylon Web`,type:`color`,default:[.5,0,0,1]},{id:`u_secondary_color`,name:`Weave Gap`,type:`color`,default:[.1,0,0,1]}]},Vc=e({default:()=>Hc}),Hc={id:`sakura_petals`,name:`Sakura Petals`,category:`Natural`,added:`2026-06-11`,description:`Scattered cherry-blossom petals drifting across the surface at three depths, each petal a softly notched teardrop with its own size, tilt and tint.`,shader:`

    vec2 rot2(vec2 q, float a) {
      float c = cos(a);
      float s = sin(a);
      return vec2(c * q.x - s * q.y, s * q.x + c * q.y);
    }

    // Signed distance (normalized by size) to a sakura petal pointing +y:
    // an ellipse tapered toward the stem with a small notch at the tip.
    float petalDist(vec2 q, float size) {
      float taper = 0.55 + 0.45 * smoothstep(-size, size * 0.7, q.y);
      float d = length(vec2(q.x / max(taper * 0.62, 0.01), q.y)) - size;
      float notch = exp(-pow(q.x / (0.14 * size), 2.0)) * smoothstep(size * 0.35, size, q.y);
      d += 0.22 * size * notch;
      return d / size;
    }

    vec4 petalLayer(vec4 color, vec2 uv, float seed, float fade) {
      vec2 cell = floor(uv);
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 cc = cell + vec2(float(dx), float(dy));
          float h1 = hash(cc + seed);
          float h2 = hash(cc + seed + 17.31);
          float h3 = hash(cc + seed + 41.77);
          if (h1 < 0.68) {
            vec2 center = cc + 0.5 + (vec2(h2, h3) - 0.5) * 0.7;
            float ang = mix(0.7, h2 * 6.2831853, u_chaos);
            float size = 0.32 * (1.0 - u_var * h3 * 0.65);
            vec2 q = rot2(uv - center, ang);
            float dn = petalDist(q, size);
            float mask = smoothstep(0.09, -0.09, dn);
            // Darker accent toward the petal rim.
            float edge = smoothstep(-0.5, -0.02, dn);
            vec3 pc = mix(u_color_petal.rgb, u_color_accent.rgb, edge * 0.7);
            pc *= 0.88 + 0.24 * h2;
            float a = mask * u_color_petal.a * fade;
            color.rgb = mix(color.rgb, pc, a);
            color.a = color.a + (1.0 - color.a) * a;
          }
        }
      }
      return color;
    }

    vec4 generate() {
      vec4 color = u_color_bg;
      float s = u_density;
      // Back (small, faint) to front (large, full strength).
      color = petalLayer(color, v_uv * s * 1.9 + 7.13, 3.1, 0.45);
      color = petalLayer(color, v_uv * s * 1.35 + 3.41, 9.7, 0.72);
      color = petalLayer(color, v_uv * s, 1.0, 1.0);
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Spring Pink`,uniforms:{u_color_petal:[.99,.78,.85,1],u_color_accent:[.88,.45,.62,1],u_color_bg:[1,.96,.96,1]}},{name:`White Blossom`,uniforms:{u_color_petal:[.99,.98,.97,1],u_color_accent:[.82,.76,.8,1],u_color_bg:[.66,.78,.82,1]}},{name:`Night Bloom`,uniforms:{u_color_petal:[.85,.55,.75,1],u_color_accent:[.55,.25,.5,1],u_color_bg:[.05,.04,.1,1]}},{name:`Autumn Gold`,uniforms:{u_color_petal:[.94,.72,.3,1],u_color_accent:[.72,.4,.12,1],u_color_bg:[.16,.09,.06,1]}}],uniforms:[{id:`u_density`,name:`Petal Density`,type:`float`,min:2,max:14,default:6},{id:`u_var`,name:`Size Variation`,type:`float`,min:0,max:1,default:.55},{id:`u_chaos`,name:`Rotation Chaos`,type:`float`,min:0,max:1,default:1},{id:`u_color_petal`,name:`Petal Color`,type:`color`,default:[.99,.78,.85,1]},{id:`u_color_accent`,name:`Petal Accent`,type:`color`,default:[.88,.45,.62,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[1,.96,.96,1]}]},Uc=e({default:()=>Wc}),Wc={id:`salt_crystal_natural`,name:`Salt Crystal`,category:`Natural`,added:`2026-05-01`,description:`Cubic salt crystal formations of varying size seen from above, white and translucent on a dark substrate.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash11(float p) { return fract(sin(p * 311.7) * 43758.5453); }

    // Rotate 2D point around origin by angle
    vec2 rot2(vec2 p, float a) {
      float c = cos(a); float s = sin(a);
      return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
    }

    // Signed distance to axis-aligned square, centered at origin, half-size h
    float sdSquare(vec2 p, float h) {
      vec2 d = abs(p) - h;
      return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_density;
      vec2 cell = floor(uv);
      vec2 f    = fract(uv) - 0.5;

      // Check this cell and 8 neighbours so crystals from adjacent cells can overlap
      float minDist = 1e9;
      float crystalBright = 0.0;

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc  = cell + vec2(float(dx), float(dy));
          vec2 rnd = vec2(hash21(nc), hash21(nc + vec2(37.3, 71.9)));

          // Crystal center jitter within cell (keep away from exact edge)
          vec2 center = vec2(float(dx), float(dy)) + rnd * 0.7 - 0.35;

          // Per-crystal random size (0.15–0.42 of cell)
          float sz = 0.15 + hash11(hash21(nc + 0.5)) * 0.27;

          // Slight random rotation (cubic symmetry — multiples of 15 deg)
          float angle = floor(rnd.y * 6.0) * 0.2618;   // 0..5 × 15°

          vec2 lp = rot2(f - center, angle);
          float d = sdSquare(lp, sz);

          if (d < minDist) {
            minDist = d;
            // Crystal face brightness — slight per-crystal variation
            crystalBright = 0.75 + hash21(nc + vec2(11.1, 23.3)) * 0.25;
          }
        }
      }

      // Inside crystal: minDist < 0
      float inside = 1.0 - smoothstep(-0.02, 0.01, minDist);

      // Edge highlight (raised rim light)
      float rim = smoothstep(0.05, 0.0, abs(minDist)) * 0.5;

      vec3 crystalCol = u_crystal_color.rgb * crystalBright + rim;

      // Dark gap between crystals
      vec3 col = mix(u_background.rgb, crystalCol, inside);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_density`,name:`Crystal Density`,type:`float`,min:4,max:30,default:14},{id:`u_crystal_color`,name:`Crystal Color`,type:`color`,default:[.92,.93,.95,1]},{id:`u_background`,name:`Background`,type:`color`,default:[.08,.06,.08,1]}]},Gc=e({default:()=>Kc}),Kc={id:`sand_dunes_artisan`,name:`Sand Dunes`,category:`Natural`,added:`2026-04-15`,description:`Rippling wave-like ridges found in vast desert wastelands and oceanic floors.`,shader:`
    vec4 generate() {
      float waves = sin(v_uv.x * 20.0 * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, waves);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dune Frequency`,type:`float`,min:.5,max:3,default:1},{id:`u_primary_color`,name:`Sunlight`,type:`color`,default:[.9,.7,.4,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[.4,.3,.15,1]}]},qc=e({default:()=>Jc}),Jc={id:`sandblasted_steel`,name:`Sandblasted Steel`,category:`Industrial`,added:`2026-05-01`,description:`Bead-blasted aluminium or steel with uniform isotropic micro-crater texture and soft satin sheen.`,shader:`
    // --- helpers BEFORE generate() ---

    // Isotropic 2D hash — uses both x and y, no directional bias
    float hash2_sb(vec2 p) {
      vec2 q = vec2(dot(p, vec2(127.1, 311.7)),
                    dot(p, vec2(269.5, 183.3)));
      return fract(sin(dot(q, vec2(1.0, 37.0))) * 43758.5453);
    }

    float smoothnoise_sb(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      // Quintic interpolation for softer micro-pitting
      vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
      float a = hash2_sb(i);
      float b = hash2_sb(i + vec2(1.0, 0.0));
      float c = hash2_sb(i + vec2(0.0, 1.0));
      float d = hash2_sb(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Two octaves of isotropic micro-grain
    float micro_grain(vec2 p, float freq) {
      float v  = smoothnoise_sb(p * freq)          * 0.6;
      v       += smoothnoise_sb(p * freq * 2.1 + vec2(1.7, 3.3)) * 0.3;
      v       += smoothnoise_sb(p * freq * 4.3 + vec2(5.1, 2.8)) * 0.1;
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Isotropic micro-crater noise — scale by u_grit
      float grain = micro_grain(uv, u_grit);

      // Map noise to ±8% brightness variation around neutral
      float brightness_var = (grain - 0.5) * 0.16;

      // Base metal color
      vec3 base = u_metal_color.rgb;

      // Apply brightness variation
      vec3 col = base + brightness_var;

      // Soft Gaussian specular sheen — distant area light source
      // Sheen center near UV (0.35, 0.65) — off-center feels natural
      vec2 sheen_center = vec2(0.35, 0.65);
      float sheen_dist = length(uv - sheen_center);
      float sheen = exp(-4.5 * sheen_dist * sheen_dist) * u_sheen * 0.25;

      // Sheen is warm-white
      col += vec3(sheen * 1.0, sheen * 0.98, sheen * 0.94);

      // Second smaller specular hotspot (secondary light bounce)
      vec2  sheen2_center = vec2(0.72, 0.28);
      float sheen2_dist   = length(uv - sheen2_center);
      float sheen2        = exp(-8.0 * sheen2_dist * sheen2_dist) * u_sheen * 0.10;
      col += sheen2;

      // Subtle vignette — edges are marginally darker (blasted surface edge effect)
      float vignette = 1.0 - 0.06 * length(uv - 0.5) * 2.0;
      col *= vignette;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_metal_color`,name:`Metal Color`,type:`color`,default:[.72,.72,.72,1]},{id:`u_grit`,name:`Grit Size`,type:`float`,min:20,max:200,default:80},{id:`u_sheen`,name:`Surface Sheen`,type:`float`,min:0,max:1,default:.3}]},Yc=e({default:()=>Xc}),Xc={id:`sandstone_layers_artisan`,name:`Sandstone Strata`,category:`Geology`,added:`2026-04-16`,description:`Fine horizontal layers and sediments found in weathered sandstone walls.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = v_uv.y * u_scale;
      float strata = hash(floor(y));
      return mix(u_secondary_color, u_primary_color, strata);
    }
  `,uniforms:[{id:`u_scale`,name:`Strata Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Sediment High`,type:`color`,default:[.8,.6,.4,1]},{id:`u_secondary_color`,name:`Sediment Deep`,type:`color`,default:[.6,.4,.3,1]}]},Zc=e({default:()=>Qc}),Qc={id:`satellite_array`,name:`Satellite Array`,category:`Cosmos`,added:`2026-06-11`,description:`Orbital hardware skin — deep-blue photovoltaic cells in gridded panels, silver bus bars, kapton gold foil seams, and the odd sun-flash glint.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv);

      // --- Panel layout: large panels separated by structural rails ---
      float panels = u_panel_count;
      vec2 puv = uv * panels;
      vec2 pid = floor(puv);
      vec2 pf = fract(puv);

      // Rail gap between panels
      float railW = 0.045;
      float rail = step(pf.x, railW) + step(1.0 - railW, pf.x)
                 + step(pf.y, railW) + step(1.0 - railW, pf.y);
      rail = clamp(rail, 0.0, 1.0);

      // --- Cell grid inside each panel ---
      float cellsPer = 6.0;
      vec2 cuv = pf * cellsPer;
      vec2 cid = floor(cuv);
      vec2 cf = fract(cuv);
      vec2 cellKey = mod(pid * cellsPer + cid, panels * cellsPer);

      // Cell border (silver interconnect fingers)
      float borderW = 0.07;
      float border = step(cf.x, borderW) + step(1.0 - borderW, cf.x)
                   + step(cf.y, borderW) + step(1.0 - borderW, cf.y);
      border = clamp(border, 0.0, 1.0);

      // Bus bars: two vertical conductor stripes crossing each cell
      float bus = smoothstep(0.030, 0.012, abs(cf.x - 0.33))
                + smoothstep(0.030, 0.012, abs(cf.x - 0.67));
      bus = clamp(bus, 0.0, 1.0);

      // --- Cell face: anti-reflective blue with crystalline mottling ---
      vec3 cellBlue = u_cell_color.rgb;
      float crystal = noise(uv * 90.0 + hash(cellKey) * 13.0);
      float facets  = noise(uv * 28.0 + 41.0);
      vec3 face = cellBlue * (0.80 + 0.25 * crystal);
      face = mix(face, cellBlue * vec3(0.85, 1.05, 1.25), smoothstep(0.6, 0.85, facets) * 0.35);

      // Per-cell tint variance: manufacturing batch differences
      float batch = hash(cellKey + 7.7);
      face *= 0.92 + 0.14 * batch;

      // Dead cell: rare darkened failure
      float dead = step(0.97, hash(cellKey + 33.0));
      face = mix(face, vec3(0.05, 0.06, 0.09), dead * 0.8);

      // --- Sun glint: a moving-feel diagonal sheen across the array ---
      float sheen = pow(max(sin((uv.x + uv.y) * 3.14159265 * 1.0 + 0.6), 0.0), 6.0);
      face += vec3(0.85, 0.90, 1.0) * sheen * u_glint * 0.35;
      // Hard specular flash on a few lucky cells aligned with the sun
      float flash = step(0.985, hash(cellKey + 61.0)) * sheen;
      face += vec3(1.0, 0.98, 0.92) * flash * u_glint * 1.4;

      // --- Compose layers ---
      vec3 silver = vec3(0.72, 0.74, 0.78);
      vec3 col = face;
      col = mix(col, silver * (0.8 + 0.2 * crystal), border * 0.85);
      col = mix(col, silver * 1.05, bus * (1.0 - border) * 0.7);

      // Structural rails: dark anodized frame with rivet dots
      vec3 frame = vec3(0.13, 0.14, 0.17);
      float rivetPh = fract((pf.x + pf.y) * 14.0);
      float rivet = smoothstep(0.12, 0.05, abs(rivetPh - 0.5)) * rail;
      col = mix(col, frame * (0.9 + 0.2 * crystal), rail);
      col = mix(col, silver * 0.9, rivet * 0.5);

      // --- Kapton gold foil strip: one wrapped seam band per tile ---
      float foilBand = smoothstep(0.035, 0.020, abs(uv.y - 0.5));
      float crinkle = fbm(uv * vec2(40.0, 14.0)) * 0.5 + 0.5;
      vec3 kapton = vec3(0.85, 0.55, 0.12) * (0.7 + 0.6 * crinkle);
      kapton += vec3(1.0, 0.85, 0.4) * pow(crinkle, 4.0) * 0.8;
      col = mix(col, kapton, foilBand * u_foil);

      // Subtle panel-level lighting falloff (sun from upper-left)
      col *= 0.92 + 0.10 * (1.0 - (pf.x + pf.y) * 0.25);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_panel_count`,name:`Panel Count`,type:`float`,min:1,max:6,default:3},{id:`u_glint`,name:`Sun Glint`,type:`float`,min:0,max:2,default:1},{id:`u_foil`,name:`Kapton Seam`,type:`float`,min:0,max:1,default:.6},{id:`u_cell_color`,name:`Cell Colour`,type:`color`,default:[.07,.14,.38,1]}]},$c=e({default:()=>el}),el={id:`sea_foam_lace`,name:`Sea Foam Lace`,category:`Ocean`,added:`2026-06-11`,description:`Frothy white lacework left by a receding wave — bubble webs, pinholes and torn foam edges over wet green glass.`,shader:`
    // Lace filament field: bright threads where noise crosses zero, two scales
    float lace_sfl(vec2 p, float seed) {
      float a = 1.0 - abs(snoise(p + seed));
      float b = 1.0 - abs(snoise(p * 2.13 + seed * 1.7 + 9.0));
      return max(pow(a, 6.0), pow(b, 8.0) * 0.8);
    }

    // Bubble-hole field: dark pinpricks punched out of the foam
    float holes_sfl(vec2 uv, float scale) {
      vec2 g = uv * scale;
      vec2 id = floor(g);
      vec2 f = fract(g) - 0.5;
      vec2 jit = vec2(hash(id + 4.4), hash(id + 8.8)) - 0.5;
      float r = 0.10 + 0.22 * hash(id);
      float d = length(f - jit * 0.6);
      return smoothstep(r, r * 0.55, d);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- wet sea surface beneath the foam ---
      vec3 sea = u_sea_color.rgb;
      float swell = fbm(uv * 3.5) * 0.5 + 0.5;
      vec3 col = mix(sea * 0.6, sea * 1.3, swell);
      // glassy highlight streaks on the wet surface
      float streak = pow(1.0 - abs(snoise(uv * vec2(4.0, 9.0) + 33.0)), 5.0);
      col += vec3(0.10, 0.16, 0.16) * streak;

      // --- foam coverage mask: torn patches, not uniform ---
      float patch = fbm(uv * 2.6 + 12.0) * 0.5 + 0.5;
      float coverage = smoothstep(1.0 - u_coverage, 1.0 - u_coverage + 0.35, patch);

      // --- lace network inside covered areas ---
      float web = lace_sfl(uv * u_scale, 3.0);
      web += lace_sfl(uv * u_scale * 2.4 + 7.0, 11.0) * 0.55;     // finer web
      // dense foam core where patches are thickest
      float core = smoothstep(0.75, 0.95, patch);
      float foam = clamp(web * coverage + core * 0.9, 0.0, 1.0);

      // punch bubble holes through the dense foam
      float hole = holes_sfl(uv, u_scale * 5.0) * core;
      hole = max(hole, holes_sfl(uv + 5.0, u_scale * 11.0) * core * 0.7);
      foam *= 1.0 - hole * 0.85;

      // --- composite: foam whites with cool shadowed underside ---
      vec3 foam_lo = u_foam_color.rgb * 0.62 + sea * 0.15;  // foam in shadow
      vec3 foam_hi = u_foam_color.rgb;
      vec3 foam_col = mix(foam_lo, foam_hi, web);
      col = mix(col, foam_col, foam);

      // bright sparkle where lace threads cross in sunlight
      col += vec3(1.0) * smoothstep(0.85, 1.0, web) * coverage * 0.35;

      // residual bubble scatter outside the patches
      float stray = holes_sfl(uv + 9.3, u_scale * 8.0) * (1.0 - coverage);
      col = mix(col, foam_hi * 0.9, stray * 0.30);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Lace Scale`,type:`float`,min:2,max:14,default:6},{id:`u_coverage`,name:`Foam Coverage`,type:`float`,min:.1,max:1,default:.55},{id:`u_foam_color`,name:`Foam Color`,type:`color`,default:[.96,.98,.97,1]},{id:`u_sea_color`,name:`Sea Color`,type:`color`,default:[.05,.3,.28,1]}]},tl=e({default:()=>nl}),nl={id:`sea_urchin_shell`,name:`Sea Urchin Shell`,category:`Ocean`,added:`2026-06-11`,description:`A bleached urchin test seen from above — five-fold sectors, beaded tubercle rows and pinprick pore pairs radiating from the apex.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float r = length(uv) * 2.0;
      float ang = atan(uv.y, uv.x);
      float turn = fract(ang / 6.28318 + 0.5);     // 0..1 around the apex

      vec3 shell = u_shell_color.rgb;

      // --- base test: domed shading, lighter at the apex ---
      float dome = sqrt(clamp(1.0 - r * r * 0.55, 0.0, 1.0));
      vec3 col = shell * (0.55 + 0.55 * dome);
      col += (noise(v_uv * 220.0) - 0.5) * 0.04;   // calcite grain

      // --- ten sectors: 5 ambulacral (pore) + 5 interambulacral (tubercle) ---
      float sectors = 10.0;
      float sec = turn * sectors;
      float sec_id = floor(sec);
      float sec_f = fract(sec);
      float is_amb = mod(sec_id, 2.0);             // alternate sector types

      // sector boundary sutures: fine pale zigzag lines
      float suture = smoothstep(0.05, 0.0, min(sec_f, 1.0 - sec_f));
      // sutures meander slightly with radius
      suture *= 0.7 + 0.3 * sin(r * 40.0 + sec_id);
      col = mix(col, shell * 1.30 + vec3(0.08), suture * 0.55 * step(0.06, r));

      // plate rows: faint concentric growth lines
      float plates = fract(r * u_plate_rows);
      float plate_line = smoothstep(0.08, 0.0, min(plates, 1.0 - plates));
      col = mix(col, shell * 0.80, plate_line * 0.30 * step(0.08, r));

      // --- interambulacral sectors: beaded tubercles (spine bosses) ---
      float ring_i = floor(r * u_plate_rows);
      float ring_f = fract(r * u_plate_rows) - 0.5;
      // tubercle sits mid-sector, one per plate ring, shrinking near apex
      float tub_size = (0.30 + 0.25 * r) * u_bump_size;
      vec2 tp = vec2((sec_f - 0.5) * (0.9 + r * 2.0), ring_f);
      float tub_d = length(tp) / max(tub_size, 0.01);
      float tub = smoothstep(1.0, 0.75, tub_d) * (1.0 - is_amb) * step(0.10, r);
      // domed boss: bright crown, shadowed base, dark areole ring
      float boss = sqrt(clamp(1.0 - tub_d * tub_d, 0.0, 1.0));
      vec3 tub_col = mix(shell * 0.65, shell * 1.45 + vec3(0.10), boss);
      tub_col = mix(tub_col, shell * 0.55, smoothstep(0.85, 1.0, tub_d) * 0.8);
      col = mix(col, tub_col, tub);
      // secondary mini-tubercles flanking the main row
      vec2 mp = vec2((abs(sec_f - 0.5) - 0.32) * (0.9 + r * 2.0), ring_f);
      float mini = smoothstep(0.18, 0.10, length(mp)) * (1.0 - is_amb) * step(0.15, r);
      col = mix(col, shell * 1.2, mini * 0.5);

      // --- ambulacral sectors: paired pore pinpricks marching outward ---
      float pore_y = fract(r * u_plate_rows * 2.0) - 0.5;
      float pore_x = abs(sec_f - 0.5) - 0.18;
      float pore = smoothstep(0.10, 0.04, length(vec2(pore_x * (1.0 + r * 2.0), pore_y)));
      col = mix(col, shell * 0.40, pore * is_amb * 0.8 * step(0.08, r));
      // ambulacral zones tinted slightly differently
      col = mix(col, col * vec3(0.93, 0.96, 1.02), is_amb * 0.5);

      // --- apex: madreporite button ---
      float apex = smoothstep(0.07, 0.03, r);
      col = mix(col, shell * 1.25 + vec3(0.05), apex);
      col = mix(col, shell * 0.5, smoothstep(0.02, 0.0, r));

      // outer edge falls away into shadow
      col *= 1.0 - smoothstep(0.85, 1.05, r) * 0.45;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_plate_rows`,name:`Plate Rows`,type:`float`,min:4,max:16,default:8},{id:`u_bump_size`,name:`Tubercle Size`,type:`float`,min:.3,max:1.5,default:.8},{id:`u_shell_color`,name:`Shell Color`,type:`color`,default:[.58,.42,.52,1]}]},rl=e({default:()=>il}),il={id:`seat_perforation_artisan`,name:`Seat Perforation`,category:`Racing`,added:`2026-04-16`,description:`Grid of fine ventilation holes found in professional bucket seats and luxury automotive leather.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.3, 0.28, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Hole Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Punch Hold`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Leather Surface`,type:`color`,default:[.1,.1,.1,1]}]},al=e({default:()=>ol}),ol={id:`seigaiha_wave`,name:`Seigaiha Waves`,category:`Geometric`,added:`2026-06-11`,description:`The classic Japanese seigaiha wave pattern: staggered overlapping fans of crisp concentric semicircle arcs, like a stylized sea.`,shader:`

    vec4 generate() {
      // Cell width 1.0, rows every 0.5 with alternate rows offset by half
      // a cell. Each fan is a circle of radius 0.8 whose visible part is
      // whatever the fans of the row in front (below) do not cover.
      vec2 p = v_uv * u_scale;
      float R = 0.8;
      float rowIdx = floor(p.y / 0.5);

      // Scan from the lowest row that can still reach this point upward;
      // the first covering fan is the one in front.
      float d = -1.0;
      for (int k = 0; k < 2; k++) {
        if (d < 0.0) {
          float j = rowIdx - 1.0 + float(k);
          float off = mod(j, 2.0) * 0.5;
          float cx = floor(p.x - off + 0.5) + off;
          vec2 c = vec2(cx, j * 0.5);
          float dd = distance(p, c);
          if (dd <= R) {
            d = dd;
          }
        }
      }
      if (d < 0.0) {
        d = 0.0;
      }

      // Concentric ring lines: one line per integer of f, including the
      // fan's outer rim. The innermost ring collapses into a solid dot.
      float rings = floor(u_rings + 0.5);
      float f = d / R * rings;
      float tri = abs(fract(f) - 0.5);

      // Crisp analytic anti-aliasing sized from the screen resolution.
      float aa = u_scale * rings * 1.5 / (R * u_resolution.y);
      float halfT = clamp(u_line * 0.5, 0.02, 0.45);
      float line = smoothstep(0.5 - halfT - aa, 0.5 - halfT + aa, tri);

      vec4 color = mix(u_color_bg, u_color_line, line);
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Indigo`,uniforms:{u_color_line:[.93,.96,.98,1],u_color_bg:[.1,.2,.42,1]}},{name:`Gold on Black`,uniforms:{u_color_line:[.85,.68,.25,1],u_color_bg:[.05,.05,.06,1]}},{name:`Sakura Pink`,uniforms:{u_color_line:[1,.96,.97,1],u_color_bg:[.91,.55,.67,1]}},{name:`Mono`,uniforms:{u_color_line:[.12,.12,.13,1],u_color_bg:[.93,.93,.92,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:2,max:16,default:6},{id:`u_rings`,name:`Rings Per Fan`,type:`float`,min:2,max:10,default:5},{id:`u_line`,name:`Line Thickness`,type:`float`,min:.06,max:.9,default:.36},{id:`u_color_line`,name:`Line Color`,type:`color`,default:[.93,.96,.98,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.1,.2,.42,1]}]},sl=e({default:()=>cl}),cl={id:`server_rack_mesh_artisan`,name:`Server Mesh`,category:`Industrial`,added:`2026-04-16`,description:`Industrial perforated metal mesh found on high-density enterprise server racks.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.45, 0.42, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Mesh Zoom`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Steel Rack`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Internal Shadow`,type:`color`,default:[0,0,0,1]}]},ll=e({default:()=>ul}),ul={id:`shark_denticles`,name:`Shark Denticles`,category:`Ocean`,added:`2026-06-11`,description:`Overlapping rows of ridged dermal denticles — microscopic shark-skin armor combed in one drag-cutting direction.`,shader:`
    // Signed shape of one denticle: tri-ridged teardrop pointing +x
    // Returns vec2(mask, ridge_height)
    vec2 denticle_shd(vec2 p, float ridge_amt) {
      // teardrop: wide head at x=-0.5 tapering to a point at x=+0.5
      float taper = smoothstep(0.55, -0.45, p.x);     // 1 head → 0 tip
      float half_w = 0.32 * taper + 0.04;
      float body = smoothstep(half_w, half_w - 0.10, abs(p.y))
                 * smoothstep(-0.52, -0.42, p.x)
                 * smoothstep(0.55, 0.40, p.x);

      // three longitudinal ridges across the crown
      float ridge = cos(clamp(p.y / max(half_w, 0.001), -1.0, 1.0) * 9.42477);
      ridge = ridge * 0.5 + 0.5;
      // crown height: domed along x, scalloped across y
      float dome = sin(clamp((p.x + 0.45) / 1.0, 0.0, 1.0) * 3.14159);
      float h = dome * (0.55 + ridge_amt * 0.45 * ridge);
      return vec2(body, h * body);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      vec3 base = u_skin_color.rgb;
      // skin between denticles: darker, slightly mottled
      float mottle = fbm(v_uv * 7.0) * 0.5 + 0.5;
      vec3 col = base * (0.35 + 0.15 * mottle);

      // staggered rows: each row offset half a cell, denticles overlap rows
      float best_h = 0.0;
      float best_m = 0.0;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 row_uv = uv;
          row_uv.x += mod(floor(uv.y + o.y), 2.0) * 0.5; // brick stagger
          vec2 id = floor(row_uv) + o;
          id.y = floor(uv.y) + o.y;
          id.x = floor(uv.x + mod(id.y, 2.0) * 0.5) + o.x;
          vec2 cuv = vec2(uv.x + mod(id.y, 2.0) * 0.5, uv.y);
          vec2 p = cuv - id - 0.5;
          // slight per-denticle jitter and size variance
          float hsh = hash(id);
          p += (vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5) * 0.10;
          p *= 1.0 / (0.95 + 0.25 * hsh);
          p.x *= 0.85; // elongate along flow direction

          vec2 dm = denticle_shd(p, u_ridges);
          if (dm.y > best_h) { best_h = dm.y; best_m = dm.x; }
          best_m = max(best_m, dm.x * 0.999);
        }
      }

      // shade the crown: height → lightness, plus front-lit gradient
      vec3 crown_lo = base * 0.55;
      vec3 crown_hi = base * 1.25 + vec3(0.06, 0.08, 0.10);
      vec3 dent_col = mix(crown_lo, crown_hi, clamp(best_h, 0.0, 1.0));

      // specular glint along ridge crests
      float glint = smoothstep(0.75, 0.95, best_h);
      dent_col += vec3(0.30, 0.34, 0.38) * glint;

      // ambient occlusion shadow in the gaps where denticles meet
      float gap = best_m * (1.0 - smoothstep(0.0, 0.25, best_h));
      dent_col = mix(dent_col, base * 0.30, gap * 0.5);

      col = mix(col, dent_col, best_m);

      // fine micro-texture over everything
      col += (noise(v_uv * 260.0) - 0.5) * 0.04;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Denticle Density`,type:`float`,min:6,max:40,default:18},{id:`u_ridges`,name:`Ridge Strength`,type:`float`,min:0,max:1,default:.7},{id:`u_skin_color`,name:`Skin Color`,type:`color`,default:[.42,.5,.58,1]}]},dl=e({default:()=>fl}),fl={id:`shift_boot_leather_artisan`,name:`Shift Boot Leather`,category:`Racing`,added:`2026-04-16`,description:`Organic crumpled leather folds and distressed textures found in shift boots and gaiters.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Leather High`,type:`color`,default:[.12,.1,.08,1]},{id:`u_secondary_color`,name:`Fold Shadow`,type:`color`,default:[.05,.04,.03,1]}]},pl=e({default:()=>ml}),ml={id:`shipwreck_hull`,name:`Shipwreck Hull`,category:`Ocean`,added:`2026-06-11`,description:`Riveted wreck plating decades under salt water — weeping rust streaks, blistered paint and creeping barnacle colonies.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      // --- plate grid: staggered courses of hull plating ---
      float py = uv.y * u_plates;
      float row = floor(py);
      float stag = mod(row, 2.0) * 0.5;
      float px = uv.x * u_plates * 1.6 + stag;
      vec2 plate_id = vec2(floor(px), row);
      vec2 pf = vec2(fract(px), fract(py));

      float ph = hash(plate_id);

      // --- base hull paint: per-plate tonal shift, blistered ---
      vec3 hull = u_hull_color.rgb;
      vec3 col = hull * (0.82 + ph * 0.30);
      float blister = fbm(uv * 14.0 + ph * 9.0) * 0.5 + 0.5;
      col *= 0.85 + blister * 0.25;
      col += (noise(uv * 260.0) - 0.5) * 0.05;          // surface grit

      // --- rust: blooms eating through the paint ---
      vec3 rust_dk = vec3(0.30, 0.13, 0.06);
      vec3 rust_lt = vec3(0.62, 0.32, 0.12);
      float bloom = fbm(uv * 6.0 + 31.0) * 0.5 + 0.5;
      float rust_mask = smoothstep(1.0 - u_rust, 1.0 - u_rust + 0.30, bloom);
      vec3 rust_col = mix(rust_dk, rust_lt, fbm(uv * 18.0) * 0.5 + 0.5);
      col = mix(col, rust_col, rust_mask * 0.9);

      // --- plate seams: dark recessed joints with rust bleeding out ---
      float seam_x = min(pf.x, 1.0 - pf.x);
      float seam_y = min(pf.y, 1.0 - pf.y);
      float seam = smoothstep(0.030, 0.0, min(seam_x, seam_y));
      col = mix(col, vec3(0.05, 0.04, 0.04), seam * 0.8);
      // rust halo along the seams
      float seam_halo = smoothstep(0.10, 0.0, min(seam_x, seam_y)) * (1.0 - seam);
      col = mix(col, rust_dk, seam_halo * 0.4 * u_rust);

      // --- rivets along the seams + weeping streaks below each ---
      float riv_n = 6.0;
      float rvx = fract(pf.x * riv_n) - 0.5;
      float rvy = pf.y - 0.06;                            // rivet line near plate top
      float riv_d = length(vec2(rvx / riv_n * 1.6, rvy) * u_plates);
      float rivet = smoothstep(0.10, 0.06, riv_d);
      // domed rivet shading: lit top-left, shadowed bottom-right
      float riv_lit = smoothstep(0.10, 0.02, length(vec2(rvx / riv_n * 1.6, rvy) * u_plates + 0.025));
      col = mix(col, vec3(0.16, 0.15, 0.14), rivet);
      col += vec3(0.18) * riv_lit * rivet;
      // weeping rust streak running down from the rivet
      float below = pf.y - 0.06;
      float streak_w = 0.018 + 0.02 * hash(plate_id + floor(pf.x * riv_n));
      float streak = exp(-rvx * rvx / (streak_w * streak_w * riv_n * riv_n * 0.08))
                   * step(0.0, below) * exp(-below * 3.0);
      streak *= 0.5 + 0.5 * noise(vec2(pf.x * 40.0, uv.y * 30.0));
      col = mix(col, rust_lt * 0.85, clamp(streak, 0.0, 1.0) * 0.7 * u_rust);

      // --- barnacle colonies: clustered pale domes ---
      float colony = smoothstep(0.70, 0.92, fbm(uv * 3.5 + 77.0) * 0.5 + 0.5) * u_growth;
      vec2 bg = uv * 70.0;
      vec2 bid = floor(bg);
      vec2 bf2 = fract(bg) - 0.5;
      float bd = length(bf2 - (vec2(hash(bid), hash(bid + 9.0)) - 0.5) * 0.5);
      float barn = smoothstep(0.30, 0.18, bd) * step(hash(bid + 4.0), colony);
      vec3 barn_col = mix(vec3(0.58, 0.56, 0.50), vec3(0.78, 0.76, 0.70),
                          smoothstep(0.25, 0.0, bd));
      barn_col *= 1.0 - smoothstep(0.10, 0.0, bd) * 0.5;  // dark aperture
      col = mix(col, barn_col, barn);

      // green slime sheen in damp lower areas of each plate
      float slime = smoothstep(0.5, 1.0, pf.y) * (fbm(uv * 9.0 + 13.0) * 0.5 + 0.5);
      col = mix(col, col * vec3(0.7, 0.95, 0.6), slime * 0.25 * u_growth);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_plates`,name:`Plate Scale`,type:`float`,min:2,max:10,default:4},{id:`u_rust`,name:`Rust Amount`,type:`float`,min:0,max:1,default:.55},{id:`u_growth`,name:`Marine Growth`,type:`float`,min:0,max:1,default:.5},{id:`u_hull_color`,name:`Hull Paint`,type:`color`,default:[.13,.2,.24,1]}]},hl=e({default:()=>gl}),gl={id:`sierpinski_carpet_artisan`,name:`Fractal Carpet`,category:`Abstract`,added:`2026-04-16`,description:`Recursive square fractal grid structures found in high-performance digital logic layouts.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv;
        float mask = 0.0;
        for (int i=0; i<4; i++) {
            vec2 gv = fract(uv * 3.0);
            if (gv.x > 1.0/3.0 && gv.x < 2.0/3.0 && gv.y > 1.0/3.0 && gv.y < 2.0/3.0) {
                mask = 1.0;
                break;
            }
            uv = gv;
        }
        return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Logic High`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Deep Silicon`,type:`color`,default:[0,.05,.1,1]}]},_l=e({default:()=>vl}),vl={id:`sierpinski_mesh_artisan`,name:`Fractal Mesh`,category:`Abstract`,added:`2026-04-16`,description:`Recursive Sierpinski triangle fractal structures found in high-performance lightweight parts.`,shader:`
    vec4 generate() {
        vec2 uv = v_uv;
        float mask = 0.0;
        for (int i=0; i<4; i++) {
            if (uv.x + uv.y > 1.0) {
                mask = 1.0;
                break;
            }
            uv *= 2.0;
            uv = fract(uv);
        }
        return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Fractal Web`,type:`color`,default:[0,1,.5,1]},{id:`u_secondary_color`,name:`Fractal Hole`,type:`color`,default:[0,.1,.05,1]}]},yl=e({default:()=>bl}),bl={id:`single_rivet_line_artisan`,name:`Single Rivet Row`,category:`Industrial`,added:`2026-04-16`,description:`A single linear row of industrial rivets for precision panel seams.`,shader:`
    vec4 generate() {
      // Create a vertical center mask
      float rowMask = step(0.45, v_uv.y) * step(v_uv.y, 0.55);
      
      // Spacing on X axis
      vec2 g = fract(v_uv * vec2(u_scale, 1.0)) - 0.5;
      float d = length(vec2(g.x, (v_uv.y - 0.5) * 10.0)); // Adjusted vertical scale for roundness
      
      float rivet = smoothstep(0.4, 0.35, d);
      float shadow = smoothstep(0.45, 0.4, d);
      
      vec4 col = mix(u_secondary_color, u_primary_color, rivet);
      return mix(col, vec4(0.0, 0.0, 0.0, 1.0), (shadow - rivet) * 0.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Rivet Count`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rivet Head`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.3,.3,.32,1]}]},xl=e({default:()=>Sl}),Sl={id:`skeletal_mesh_artisan`,name:`Skeletal Mesh`,category:`Abstract`,added:`2026-04-15`,description:`Periodic rib-like line patterns with organic jitter found in anatomical structures.`,shader:`
    vec4 generate() {
      float ribs = sin(v_uv.y * 50.0 * u_scale + sin(v_uv.x * 20.0));
      float mask = smoothstep(0.0, 0.1, ribs);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rib Frequency`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Bone`,type:`color`,default:[.9,.9,.85,1]},{id:`u_secondary_color`,name:`Marrow`,type:`color`,default:[.1,.05,.05,1]}]},Cl=e({default:()=>wl}),wl={id:`slate_rock_natural`,name:`Slate Rock`,category:`Natural`,added:`2026-05-01`,description:`Dark layered slate with parallel cleavage planes, fine horizontal grain, and occasional crossing fracture lines.`,shader:`
    float hash11(float p)  { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)   { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    // Wavy layer boundary — each layer is slightly undulated
    float layerWave(float y, float layerIdx) {
      float wave = smoothNoise1D(v_uv.x * 4.0 + layerIdx * 7.3) * 0.012;
      return y + wave;
    }

    vec4 generate() {
      float freq = u_layer_freq;

      // Layer index and local position within layer
      float rawY    = v_uv.y * freq;
      float layerI  = floor(rawY);
      float layerF  = fract(rawY);

      // Slight undulation per layer
      float wavY = layerWave(rawY, layerI);
      layerF = fract(wavY);
      layerI = floor(wavY);

      // Per-layer color variation
      float layerVar = hash11(layerI) * 0.12 - 0.06;

      // Fine horizontal grain noise within layer
      float grain = smoothNoise1D(v_uv.x * freq * 12.0 + layerI * 31.7) * 0.05;

      vec3 baseCol = u_base_color.rgb + layerVar + grain;

      // Thin dark line at layer boundary (cleavage plane)
      float boundary = 1.0 - smoothstep(0.0, 0.04, layerF) * smoothstep(1.0, 0.96, layerF);
      baseCol *= (1.0 - boundary * 0.45);

      // Fracture lines — near-vertical with slight diagonal
      float fracNum   = u_fracture * 12.0;
      float fracX     = v_uv.x * fracNum;
      float fracI     = floor(fracX);
      float fracF     = fract(fracX);

      // Only some cells have a fracture
      float hasFrac   = step(0.75, hash21(vec2(fracI, 0.0)));
      // Fracture meanders slightly in Y
      float fracBias  = hash21(vec2(fracI, 1.0)) * 0.4 - 0.2;  // x offset slope
      float fracLine  = fracF - 0.5 + fracBias * (v_uv.y - 0.5);
      float fracMask  = hasFrac * (1.0 - smoothstep(0.0, 0.012, abs(fracLine)));

      baseCol *= (1.0 - fracMask * 0.55);

      return vec4(clamp(baseCol, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_layer_freq`,name:`Layer Frequency`,type:`float`,min:4,max:40,default:16},{id:`u_base_color`,name:`Slate Color`,type:`color`,default:[.22,.24,.27,1]},{id:`u_fracture`,name:`Fracture Density`,type:`float`,min:0,max:1,default:.4}]},Tl=e({default:()=>El}),El={id:`slot_reels`,name:`Slot Reels`,category:`Retro`,added:`2026-06-11`,description:`One-armed-bandit reel strips behind glass — cherries, BAR plates, lucky sevens and gold bells on cream stock, each drum rounding away into chrome dividers.`,shader:`
    // distance from point to line segment
    float seg_sr(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a; vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }

    vec4 generate() {
      float reels = u_reel_count;
      float rx = v_uv.x * reels;
      float reel = floor(rx);
      float fx = fract(rx);

      // each reel scrolls to its own random offset
      float spin = hash(vec2(reel, 5.0));
      float ry = v_uv.y * reels + spin * 8.0;
      vec2 cell = vec2(reel, floor(ry));
      vec2 f = vec2(fx, fract(ry)) - 0.5;

      // --- chrome divider rails between reels ---
      float railw = 0.055;
      float rail = min(fx, 1.0 - fx);
      if (rail < railw) {
        float t = rail / railw;
        vec3 chrome = mix(vec3(0.85, 0.87, 0.90), vec3(0.25, 0.27, 0.30), abs(t - 0.55) * 2.2);
        chrome *= 0.9 + noise(v_uv * 500.0) * 0.12;
        return vec4(chrome, 1.0);
      }

      // --- reel strip stock with cylindrical shading ---
      vec3 stock = vec3(0.96, 0.93, 0.85);
      stock *= 0.97 + noise(v_uv * 380.0) * 0.05;
      float curve = sin(((fx - railw) / (1.0 - 2.0 * railw)) * 3.14159);
      stock *= mix(1.0, 0.45 + 0.55 * curve, u_shade);

      // gold separator band between symbol cells
      float band = min(abs(f.y - 0.5), abs(f.y + 0.5));
      vec3 gold = u_accent_color.rgb;
      vec3 col = mix(stock, gold * (0.8 + curve * 0.3), 1.0 - smoothstep(0.025, 0.045, band));

      // --- the symbol ---
      float pick = hash(cell + 23.0);
      vec3 inkdark = vec3(0.12, 0.10, 0.10);

      if (pick < 0.28) {
        // CHERRIES: two red globes on green stems
        vec2 c1 = f - vec2(-0.11, -0.10);
        vec2 c2 = f - vec2( 0.13, -0.06);
        float ch = min(length(c1) - 0.105, length(c2) - 0.095);
        float stem = min(seg_sr(f, vec2(-0.11, -0.02), vec2(0.03, 0.22)),
                         seg_sr(f, vec2( 0.13,  0.02), vec2(0.03, 0.22))) - 0.018;
        col = mix(col, vec3(0.18, 0.45, 0.12), 1.0 - smoothstep(0.0, 0.02, stem));
        vec3 cherry = vec3(0.78, 0.08, 0.10);
        cherry += vec3(0.35, 0.2, 0.15) * exp(-dot(c1 - 0.04, c1 - 0.04) * 250.0);
        col = mix(col, cherry, 1.0 - smoothstep(0.0, 0.02, ch));
      } else if (pick < 0.54) {
        // BAR: three stacked plates with white inner stripes
        for (int i = 0; i < 3; i++) {
          float oy = (float(i) - 1.0) * 0.155;
          vec2 bp = vec2(f.x, f.y - oy);
          float plate = step(abs(bp.x), 0.26) * step(abs(bp.y), 0.062);
          float stripe = step(abs(bp.x), 0.235) * step(abs(bp.y), 0.036);
          col = mix(col, inkdark, plate);
          col = mix(col, vec3(0.95, 0.92, 0.85), stripe);
          col = mix(col, inkdark, stripe * step(abs(bp.y), 0.018) * step(0.3, fract(bp.x * 14.0)));
        }
      } else if (pick < 0.78) {
        // LUCKY 7: top bar + diagonal stroke, red with dark keyline
        float top = seg_sr(f, vec2(-0.17, 0.20), vec2(0.18, 0.20)) - 0.055;
        float diag = seg_sr(f, vec2(0.16, 0.18), vec2(-0.06, -0.24)) - 0.062;
        float sv = min(top, diag);
        col = mix(col, inkdark, 1.0 - smoothstep(0.025, 0.045, sv));
        vec3 seven = vec3(0.82, 0.10, 0.12) * (0.85 + curve * 0.25);
        col = mix(col, seven, 1.0 - smoothstep(0.0, 0.02, sv));
      } else {
        // GOLD BELL: dome + lip + clapper
        vec2 bp = f - vec2(0.0, 0.02);
        float dome = length(bp * vec2(1.0, 1.15)) - 0.165;
        dome = max(dome, -(bp.y + 0.13));                  // flatten the bottom
        float lip = step(abs(bp.y + 0.145), 0.028) * step(abs(bp.x), 0.21);
        float clap = length(f - vec2(0.0, -0.215)) - 0.038;
        vec3 bell = gold * (0.9 + curve * 0.3);
        bell += vec3(0.4, 0.32, 0.1) * exp(-dot(bp - vec2(-0.05, 0.06), bp - vec2(-0.05, 0.06)) * 120.0);
        float bellm = 1.0 - smoothstep(0.0, 0.02, dome);
        col = mix(col, inkdark, 1.0 - smoothstep(0.02, 0.045, dome));
        col = mix(col, bell, bellm);
        col = mix(col, bell * 1.1, lip);
        col = mix(col, inkdark, 1.0 - smoothstep(0.0, 0.015, clap));
      }

      // glass reflection streak across the whole window
      col += vec3(0.10) * exp(-pow((v_uv.x + v_uv.y * 0.4 - 0.75) * 5.0, 2.0));

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_reel_count`,name:`Reels`,type:`float`,min:2,max:6,default:3},{id:`u_shade`,name:`Drum Curvature`,type:`float`,min:0,max:1,default:.6},{id:`u_accent_color`,name:`Gold Trim`,type:`color`,default:[.85,.65,.2,1]}]},Dl=e({default:()=>Ol}),Ol={id:`smpte_bars`,name:`SMPTE Bars`,category:`Retro`,added:`2026-06-11`,description:`The broadcast test card itself — 75% colour bars over castellations, -I/+Q chroma patches and the PLUGE strip, softened by a breath of analogue transmission noise.`,shader:`
    vec3 topbar_sb(float i, float lvl) {
      if (i < 0.5) return vec3(lvl);                 // grey
      if (i < 1.5) return vec3(lvl, lvl, 0.0);       // yellow
      if (i < 2.5) return vec3(0.0, lvl, lvl);       // cyan
      if (i < 3.5) return vec3(0.0, lvl, 0.0);       // green
      if (i < 4.5) return vec3(lvl, 0.0, lvl);       // magenta
      if (i < 5.5) return vec3(lvl, 0.0, 0.0);       // red
      return vec3(0.0, 0.0, lvl);                    // blue
    }

    vec3 castel_sb(float i, float lvl) {
      if (i < 0.5) return vec3(0.0, 0.0, lvl);       // blue
      if (i < 1.5) return vec3(0.0);                 // black
      if (i < 2.5) return vec3(lvl, 0.0, lvl);       // magenta
      if (i < 3.5) return vec3(0.0);                 // black
      if (i < 4.5) return vec3(0.0, lvl, lvl);       // cyan
      if (i < 5.5) return vec3(0.0);                 // black
      return vec3(lvl);                              // grey
    }

    vec3 bottom_sb(float x7) {
      if (x7 < 1.25) return vec3(0.0, 0.13, 0.30);   // -I
      if (x7 < 2.50) return vec3(1.0);               // 100% white
      if (x7 < 3.75) return vec3(0.20, 0.0, 0.42);   // +Q
      if (x7 < 5.00) return vec3(0.0);               // black
      // PLUGE: 3.5% / 7.5% / 11.5%
      if (x7 < 5.3333) return vec3(0.0);
      if (x7 < 5.6667) return vec3(0.075);
      if (x7 < 6.0)    return vec3(0.115);
      return vec3(0.0);                              // black
    }

    vec4 generate() {
      vec2 uv = fract(v_uv);
      float lvl = u_bar_level;

      // analogue horizontal smearing: jitter the sampled x per scanline
      float line = floor(uv.y * 486.0);
      float smear = (hash(vec2(line, 7.0)) - 0.5) * u_softness * 0.004;
      float x = fract(uv.x + smear);
      float x7 = x * 7.0;

      vec3 col;
      if (uv.y > 0.3333) {
        col = topbar_sb(floor(x7), lvl);
      } else if (uv.y > 0.25) {
        col = castel_sb(floor(x7), lvl);
      } else {
        col = bottom_sb(x7);
      }

      // chroma fringing on vertical edges (NTSC dot crawl ghost)
      float edge = abs(fract(x7) - 0.5);
      float fringe = (1.0 - smoothstep(0.42, 0.5, edge)) * u_softness;
      vec3 colR;
      float xr7 = fract(x + 0.0035 * u_softness) * 7.0;
      if (uv.y > 0.3333)      colR = topbar_sb(floor(xr7), lvl);
      else if (uv.y > 0.25)   colR = castel_sb(floor(xr7), lvl);
      else                    colR = bottom_sb(xr7);
      col.r = mix(col.r, colR.r, fringe * 0.8);

      // transmission noise: per-scanline luminance hiss
      float hiss = (hash(vec2(floor(uv.x * 640.0), line)) - 0.5) * u_signal_noise;
      col += hiss;

      // faint scanline structure
      col *= 0.96 + 0.04 * sin(uv.y * 486.0 * 3.14159);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_bar_level`,name:`Bar Level`,type:`float`,min:.5,max:1,default:.75},{id:`u_softness`,name:`Analogue Softness`,type:`float`,min:0,max:1,default:.4},{id:`u_signal_noise`,name:`Signal Noise`,type:`float`,min:0,max:.3,default:.06}]},kl=e({default:()=>Al}),Al={id:`snake_skin_artisan`,name:`Snake Skin`,category:`Natural`,added:`2026-04-15`,description:`Precisely interlocking reptilian scales with organic variance.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      
      float d = length(gv);
      float mask = smoothstep(0.45, 0.4, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Scale Color`,type:`color`,default:[.2,.4,.1,1]},{id:`u_secondary_color`,name:`Underlayer`,type:`color`,default:[.05,.1,.02,1]}]},jl=e({default:()=>Ml}),Ml={id:`snake_skin_v2_artisan`,name:`Viper Scales`,category:`Natural`,added:`2026-04-16`,description:`Interlocking diamond scales found in aggressive predatory reptilian hide.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Dorsal Scale`,type:`color`,default:[.1,.2,.1,1]},{id:`u_secondary_color`,name:`Inter-scale`,type:`color`,default:[0,0,0,1]}]},Nl=e({default:()=>Pl}),Pl={id:`soap_bubble_abstract`,name:`Soap Bubble`,category:`Abstract`,added:`2026-05-01`,description:`Iridescent soap film with thin-film interference hues, Newton ring bands, and a dark background.`,shader:`
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Hue to RGB — GLSL 1.0 compatible, no array indexing issues
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = clamp(abs(h * 6.0 - 3.0) - 1.0, 0.0, 1.0);
      float g = clamp(2.0 - abs(h * 6.0 - 2.0), 0.0, 1.0);
      float b = clamp(2.0 - abs(h * 6.0 - 4.0), 0.0, 1.0);
      return vec3(r, g, b);
    }

    vec4 generate() {
      vec2 center = vec2(0.5);
      vec2 uv     = (v_uv - center) / u_bubble_size;
      float dist  = length(uv);

      // Outside bubble → background
      float bubbleMask = 1.0 - smoothstep(0.44, 0.50, dist);

      // Thin-film interference: hue varies with radial distance
      // Blue→green→yellow→red as we go from center outward
      float filmPhase = dist * 2.8 * u_iridescence;

      // Gentle noise distortion of the hue bands
      float distortion = smoothNoise(uv * 6.0) * 0.12 - 0.06;

      float hue = fract(filmPhase + distortion);
      vec3  iridCol = hue2rgb(hue);

      // Saturation and brightness: near center is dimmer/more transparent look
      float sat = smoothstep(0.05, 0.45, dist);  // more colorful toward rim
      iridCol = mix(vec3(0.85), iridCol, sat * 0.9);

      // Newton ring overlay — concentric bands
      float rings = sin(dist * 60.0 * u_iridescence) * 0.5 + 0.5;
      float ringHue = fract(hue + rings * 0.15);
      vec3 ringCol = hue2rgb(ringHue);
      iridCol = mix(iridCol, ringCol, rings * 0.25 * sat);

      // Bright rim highlight
      float rim = smoothstep(0.30, 0.44, dist) * (1.0 - smoothstep(0.44, 0.50, dist));
      iridCol += vec3(0.4) * rim;

      // Transparent center (slightly washed out, near clear)
      float centerFade = 1.0 - smoothstep(0.0, 0.18, dist);
      iridCol = mix(iridCol, vec3(0.92, 0.95, 0.98), centerFade * 0.55);

      // Composite bubble over background
      vec3 finalCol = mix(u_background.rgb, iridCol, bubbleMask);

      return vec4(clamp(finalCol, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_bubble_size`,name:`Bubble Size`,type:`float`,min:.5,max:3,default:1.2},{id:`u_iridescence`,name:`Iridescence`,type:`float`,min:.5,max:3,default:1.8},{id:`u_background`,name:`Background Color`,type:`color`,default:[.02,.02,.04,1]}]},Fl=e({default:()=>Il}),Il={id:`solar_flare_pro`,name:`Solar Flare`,category:`Abstract`,added:`2026-04-15`,description:`Static plasma energy flux with high-intensity radiation centers.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time dependency
      float n = noise(uv);
      float flare = pow(n, 3.0) * 2.0;
      return mix(u_secondary_color, u_primary_color, flare);
    }
  `,uniforms:[{id:`u_scale`,name:`Flare Scale`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Plasma Heat`,type:`color`,default:[1,.8,.2,1]},{id:`u_secondary_color`,name:`Corona`,type:`color`,default:[.5,.1,0,1]}]},Ll=e({default:()=>Rl}),Rl={id:`solar_flares_v2_artisan`,name:`Solar Corona`,category:`Natural`,added:`2026-04-15`,description:`Abstract high-energy atmospheric flares and plasma smears from a stellar corona.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 10.0, 0.0));
      float mask = smoothstep(0.5, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Core`,type:`color`,default:[1,.9,.3,1]},{id:`u_secondary_color`,name:`Ejection`,type:`color`,default:[.8,.2,0,0]}]},zl=e({default:()=>Bl}),Bl={id:`sonar_ping`,name:`Sonar Ping`,category:`Ocean`,added:`2026-06-11`,description:`A submarine sonar scope mid-sweep: phosphor range rings, bearing spokes, a fading sweep wedge, and hot contact blips.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float r = length(uv) * 2.0;          // 0 centre → 1 scope edge
      float ang = atan(uv.y, uv.x);        // -pi..pi
      float bearing = fract(ang / 6.28318 + 0.5); // 0..1 around the dial

      vec3 phos = u_screen_color.rgb;

      // --- CRT base: dark green glass with phosphor grain ---
      vec3 col = phos * 0.045;
      col += phos * (noise(v_uv * 300.0) * 0.04);          // phosphor grain
      col += phos * 0.05 * exp(-r * r * 2.0);              // centre glow
      // faint horizontal raster lines
      col += phos * 0.025 * step(0.5, fract(v_uv.y * 180.0));

      // --- range rings ---
      float ringf = fract(r * u_rings);
      float ring = smoothstep(0.06, 0.0, abs(ringf - 0.5) - 0.44);
      col += phos * ring * 0.30 * step(r, 1.0);
      // bold outer bezel ring
      col += phos * smoothstep(0.02, 0.0, abs(r - 0.98)) * 0.8;

      // --- bearing spokes every 30 degrees ---
      float spoke = fract(bearing * 12.0);
      float spoke_l = smoothstep(0.035, 0.0, min(spoke, 1.0 - spoke)) * 0.14;
      col += phos * spoke_l * step(r, 0.98);
      // crosshair main axes brighter
      float axis = min(abs(uv.x), abs(uv.y));
      col += phos * smoothstep(0.004, 0.0, axis) * 0.20 * step(r, 0.98);

      // --- rotating sweep wedge with phosphor decay trail ---
      float sweep_pos = fract(u_sweep);
      float behind = fract(sweep_pos - bearing);   // 0 at the sweep line
      float trail = exp(-behind * 9.0);            // decays around the dial
      col += phos * trail * 0.35 * step(r, 0.97) * smoothstep(0.0, 0.08, r);
      // the sweep line itself, hot
      col += phos * 1.6 * smoothstep(0.012, 0.0, behind) * step(r, 0.97);

      // --- contact blips: lit when the sweep has recently passed ---
      float blip = 0.0;
      for (int j = 0; j < 3; j++) {
        for (int i = 0; i < 3; i++) {
          vec2 cell = vec2(float(i), float(j));
          float h = hash(cell * 17.3 + 5.1);
          if (h > u_contacts) continue;
          vec2 bp = vec2(hash(cell + 31.7), hash(cell + 57.2)) - 0.5;
          bp *= 1.6;
          float br = length(bp);
          if (br > 0.85 || br < 0.12) continue;
          float bb = fract(atan(bp.y, bp.x) / 6.28318 + 0.5);
          float fade = exp(-fract(sweep_pos - bb) * 5.0);
          vec2 d = uv - bp * 0.5;
          blip += exp(-dot(d, d) * 6000.0) * (0.4 + fade);
        }
      }
      col += mix(phos, vec3(1.0, 0.9, 0.5), 0.4) * blip * 1.4;

      // glass vignette and outside-the-scope falloff
      col *= 1.0 - smoothstep(0.98, 1.15, r) * 0.85;
      col += phos * 0.012; // ambient glass tint

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_rings`,name:`Range Rings`,type:`float`,min:2,max:10,default:5},{id:`u_sweep`,name:`Sweep Bearing`,type:`float`,min:0,max:1,default:.62},{id:`u_contacts`,name:`Contact Density`,type:`float`,min:0,max:1,default:.55},{id:`u_screen_color`,name:`Phosphor Color`,type:`color`,default:[.2,1,.45,1]}]},Vl=e({default:()=>Hl}),Hl={id:`sound_wave_eq`,name:`Sound Wave EQ`,category:`Abstract`,added:`2026-06-11`,description:`A frozen spectrum analyzer: vertical equalizer bars of random heights rising from the baseline, segmented into LED blocks with a hot peak tip.`,shader:`

    vec4 generate() {
      float bars = floor(u_bars + 0.5);
      float bx = v_uv.x * bars;
      float bi = floor(bx);
      float fx = fract(bx);

      // Bar height: smooth noise across bar indices so neighbours relate,
      // plus per-bar hash so it still jumps like real audio.
      float hN = noise(vec2(bi * 0.35 + 0.5, 3.7));
      float hH = hash(vec2(bi, 17.0));
      float h = clamp(0.10 + 0.85 * (hN * 0.6 + hH * 0.4), 0.06, 0.97);

      float g = u_gap * 0.5;
      float inBarX = step(g, fx) * (1.0 - step(1.0 - g, fx));

      float lit = 0.0;
      float tip = 0.0;
      float yMid = v_uv.y;

      if (u_segments >= 1.0) {
        // LED block mode: quantize the bar into stacked blocks.
        float segs = floor(u_segments + 0.5);
        float sy = v_uv.y * segs;
        float si = floor(sy);
        float fy = fract(sy);
        float topSeg = max(floor(h * segs), 1.0);
        float inSegY = step(g, fy) * (1.0 - step(1.0 - g, fy));
        lit = step(si + 0.5, topSeg) * inSegY;
        tip = step(abs(si - (topSeg - 1.0)), 0.25);
        yMid = (si + 0.5) / segs;
      } else {
        // Solid bar mode with a glowing tip band.
        lit = step(v_uv.y, h);
        tip = step(h - 0.05, v_uv.y);
      }

      lit *= inBarX;

      // Vertical gradient up the bar, then the hot tip overrides it.
      float grad = clamp(yMid / max(h, 0.001), 0.0, 1.0);
      vec3 barRGB = mix(u_color_bar.rgb * 0.4, u_color_bar.rgb, grad);
      vec3 rgb = mix(barRGB, u_color_tip.rgb, tip);
      float alpha = mix(u_color_bar.a, u_color_tip.a, tip);

      vec4 color = mix(u_color_bg, vec4(rgb, alpha), lit);
      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Neon Green`,uniforms:{u_color_bar:[.1,.9,.3,1],u_color_tip:[1,.3,.15,1],u_color_bg:[.03,.04,.04,1]}},{name:`Sunset Meter`,uniforms:{u_color_bar:[.98,.45,.12,1],u_color_tip:[1,.9,.4,1],u_color_bg:[.12,.04,.14,1]}},{name:`Ice Blue`,uniforms:{u_color_bar:[.25,.7,.95,1],u_color_tip:[.95,.99,1,1],u_color_bg:[.02,.04,.1,1]}},{name:`Magma`,uniforms:{u_color_bar:[.75,.12,.05,1],u_color_tip:[1,.85,.25,1],u_color_bg:[.04,.02,.02,1]}}],uniforms:[{id:`u_bars`,name:`Bar Count`,type:`float`,min:8,max:96,default:32},{id:`u_segments`,name:`LED Segments (0 = solid)`,type:`float`,min:0,max:40,default:18},{id:`u_gap`,name:`Gap Thickness`,type:`float`,min:0,max:.6,default:.25},{id:`u_color_bar`,name:`Bar Color`,type:`color`,default:[.1,.9,.3,1]},{id:`u_color_tip`,name:`Peak Tip Color`,type:`color`,default:[1,.3,.15,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.03,.04,.04,1]}]},Ul=e({default:()=>Wl}),Wl={id:`speed_trails_artisan`,name:`Speed Trails`,category:`Racing`,added:`2026-04-15`,description:`Horizontal motion-style smears representing velocity and aerodynamic flow.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(y);
      float trail = step(0.9, hash(v_uv.x * 0.1 + y));
      return mix(u_secondary_color, u_primary_color, trail);
    }
  `,uniforms:[{id:`u_scale`,name:`Trail Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Trail Lite`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[0,0,0,0]}]},Gl=e({default:()=>Kl}),Kl={id:`spider_lightning`,name:`Spider Lightning`,category:`Abstract`,added:`2026-06-11`,description:`A spider web spun from lightning: jagged electric bolts radiate from a glowing core, linked by sagging arcs of plasma and branching micro-filaments. Static render — Trading Paints safe.`,shader:`

    // Hot bolt core plus a soft electric halo around it
    float boltGlow(float dist, float thickness) {
      float core = smoothstep(thickness, thickness * 0.15, dist);
      float halo = exp(-dist * (22.0 / max(u_glow, 0.05)));
      return core + halo * 0.55;
    }

    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float ang = atan(uv.y, uv.x) / 6.28318530718 + 0.5; // 0..1 around the web

      // Jagged displacement fields — this is what turns clean geometry
      // into crackling electricity.
      float j1 = fbm(uv * u_chaos + vec2(13.7, 7.3));
      float j2 = fbm(uv * u_chaos * 1.7 + vec2(91.2, 33.8));

      // Radial bolts (web spokes)
      float spokeFrac = abs(fract(ang * u_strands + j1 * u_jitter) - 0.5) * 2.0;
      float spokeDist = spokeFrac * d * 6.28318 / u_strands;
      float spokes = boltGlow(spokeDist, u_thickness);

      // Concentric arcs that sag toward the centre between spokes,
      // like silk strands in a real web
      float sagMid = 1.0 - abs(fract(ang * u_strands) - 0.5) * 2.0;
      float ringField = d * u_rings + sagMid * sagMid * 0.35 + j2 * u_jitter * 3.0;
      float ringDist = abs(fract(ringField) - 0.5) / u_rings;
      float rings = boltGlow(ringDist, u_thickness);
      rings *= smoothstep(0.015, 0.07, d); // keep the core clean

      // Branching micro-arcs along noise zero-crossings
      float filaments = boltGlow(abs(snoise(uv * u_chaos * 3.0)) * 0.09, u_thickness * 0.5) * 0.3;

      float energy = spokes + rings + filaments;

      // Hot core where all the bolts converge
      energy += exp(-d * 14.0) * 1.2;

      vec4 color = u_color_bg;
      color = mix(color, u_color_glow, clamp(energy * 0.8, 0.0, 1.0));
      color = mix(color, u_color_bolt, clamp((energy - 0.75) * 1.6, 0.0, 1.0));
      color.rgb += vec3(1.0) * clamp((energy - 1.5) * 0.7, 0.0, 0.55); // white-hot peaks

      return vec4(color.rgb, color.a);
    }
  `,variants:[{name:`Storm Blue`,uniforms:{u_color_bolt:[.85,.95,1,1],u_color_glow:[.15,.45,1,1],u_color_bg:[.01,.02,.06,1]}},{name:`Plasma Purple`,uniforms:{u_color_bolt:[.95,.85,1,1],u_color_glow:[.55,.2,.95,1],u_color_bg:[.03,.01,.06,1]}},{name:`Venom Green`,uniforms:{u_color_bolt:[.9,1,.85,1],u_color_glow:[.25,.9,.2,1],u_color_bg:[.01,.04,.01,1]}},{name:`Hellfire`,uniforms:{u_color_bolt:[1,.95,.75,1],u_color_glow:[1,.35,.05,1],u_color_bg:[.05,.01,.01,1]}}],uniforms:[{id:`u_strands`,name:`Web Strands`,type:`float`,min:4,max:24,default:12},{id:`u_rings`,name:`Web Rings`,type:`float`,min:2,max:16,default:6},{id:`u_chaos`,name:`Bolt Chaos`,type:`float`,min:1,max:10,default:3.5},{id:`u_jitter`,name:`Bolt Jitter`,type:`float`,min:0,max:.6,default:.16},{id:`u_thickness`,name:`Bolt Thickness`,type:`float`,min:.001,max:.02,default:.004},{id:`u_glow`,name:`Glow Radius`,type:`float`,min:.1,max:3,default:1},{id:`u_color_bolt`,name:`Bolt Core`,type:`color`,default:[.85,.95,1,1]},{id:`u_color_glow`,name:`Electric Glow`,type:`color`,default:[.15,.45,1,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.01,.02,.06,1]}]},ql=e({default:()=>Jl}),Jl={id:`spider_web_artisan`,name:`Silk Web`,category:`Natural`,added:`2026-04-16`,description:`Radial-concentric silk networks found in professional predatory arachnid structures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float spoke_t = fract(angle * u_spokes / 6.28318530718);

      // 1.0 mid-span between spokes, 0.0 on a spoke — drives the ring sag
      float midspan = 1.0 - abs(spoke_t - 0.5) * 2.0;
      float sagged = d * (1.0 + u_sag * midspan * 0.12);

      float aa = 0.008;
      float rw = 0.02 * u_thickness;
      float cw = 0.05 * u_thickness;
      float radial = smoothstep(1.0 - rw - aa, 1.0 - rw + aa, spoke_t);
      float concentric = smoothstep(1.0 - cw - aa, 1.0 - cw + aa, fract(sagged * u_rings));

      vec4 color = mix(u_secondary_color, u_primary_color, clamp(radial, 0.0, 1.0));
      color = mix(color, u_accent_color, clamp(concentric * (1.0 - radial), 0.0, 1.0));
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.9,.9,1,1],u_accent_color:[.9,.9,1,1],u_secondary_color:[0,0,0,1],u_spokes:8,u_rings:10,u_thickness:1,u_sag:0}},{name:`Widow's Lair`,uniforms:{u_primary_color:[.85,.85,.85,1],u_accent_color:[.8,.1,.1,1],u_secondary_color:[.03,.02,.02,1],u_spokes:12,u_rings:12,u_thickness:1,u_sag:.6}},{name:`Frost Web`,uniforms:{u_primary_color:[.8,.92,1,1],u_accent_color:[.55,.75,.95,1],u_secondary_color:[.02,.05,.12,1],u_spokes:8,u_rings:14,u_thickness:.8,u_sag:.2}},{name:`Halloween`,uniforms:{u_primary_color:[1,.55,.1,1],u_accent_color:[1,.8,.2,1],u_secondary_color:[.05,0,.08,1],u_spokes:10,u_rings:9,u_thickness:1.4,u_sag:.45}}],uniforms:[{id:`u_spokes`,name:`Spoke Count`,type:`float`,min:3,max:24,default:8},{id:`u_rings`,name:`Ring Count`,type:`float`,min:2,max:30,default:10},{id:`u_thickness`,name:`Strand Thickness`,type:`float`,min:.3,max:3,default:1},{id:`u_sag`,name:`Silk Sag`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Silk Strand`,type:`color`,default:[.9,.9,1,1]},{id:`u_accent_color`,name:`Ring Silk`,type:`color`,default:[.9,.9,1,1]},{id:`u_secondary_color`,name:`Void Backdrop`,type:`color`,default:[0,0,0,1]}]},Yl=e({default:()=>Xl}),Xl={id:`splinter_camo`,name:`Splinter Camo`,category:`Geometric`,added:`2026-05-12`,description:`A non-digital but highly angular, geometric camouflage consisting of sharp intersecting polygons and shards.`,shader:`
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Create intersecting angular grids
      mat2 rot1 = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      mat2 rot2 = mat2(cos(-0.8), sin(-0.8), -sin(-0.8), cos(-0.8));
      mat2 rot3 = mat2(cos(1.2), sin(1.2), -sin(1.2), cos(1.2));
      
      vec2 g1 = floor(rot1 * uv);
      vec2 g2 = floor(rot2 * uv * 1.5 + vec2(10.0));
      vec2 g3 = floor(rot3 * uv * 2.0 + vec2(20.0));
      
      float h1 = hash(g1);
      float h2 = hash(g2);
      float h3 = hash(g3);
      
      // Combine to create shards
      float val = fract(h1 + h2 * 0.5 + h3 * 0.25);
      
      vec4 color = u_color_base;
      if (val > 0.3) color = u_color_1;
      if (val > 0.6) color = u_color_2;
      if (val > 0.85) color = u_color_3;
      
      return color;
    }
  `,variants:[{name:`Swedish M90`,uniforms:{u_color_base:[.65,.7,.55,1],u_color_1:[.35,.45,.3,1],u_color_2:[.15,.25,.15,1],u_color_3:[.1,.12,.1,1]}},{name:`Winter Splinter`,uniforms:{u_color_base:[.9,.9,.95,1],u_color_1:[.7,.7,.75,1],u_color_2:[.4,.45,.5,1],u_color_3:[.2,.2,.25,1]}},{name:`Urban Splinter`,uniforms:{u_color_base:[.55,.55,.55,1],u_color_1:[.4,.4,.4,1],u_color_2:[.2,.2,.2,1],u_color_3:[.05,.05,.05,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.1,.1,.1,1],u_color_2:[.05,.05,.05,1],u_color_3:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Grid Scale`,type:`float`,min:1,max:20,default:8},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.65,.7,.55,1]},{id:`u_color_1`,name:`Shard 1`,type:`color`,default:[.35,.45,.3,1]},{id:`u_color_2`,name:`Shard 2`,type:`color`,default:[.15,.25,.15,1]},{id:`u_color_3`,name:`Shard 3`,type:`color`,default:[.1,.12,.1,1]}]},Zl=e({default:()=>Ql}),Ql={id:`spray_drip_artisan`,name:`Spray Drip`,category:`Abstract`,added:`2026-04-15`,description:`Static vertical paint drip effect mimicking street-art application.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float x = floor(v_uv.x * u_scale);
      float h = hash(x);
      float mask = step(v_uv.y, h * 0.5 + 0.3);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Drip Count`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Drip Color`,type:`color`,default:[1,0,.2,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.05,.05,.05,1]}]},$l=e({default:()=>eu}),eu={id:`stained_glass`,name:`Stained Glass`,category:`Abstract`,added:`2026-04-16`,description:`Backlit stained glass window with vivid saturated color panels and thick dark lead came lines.`,shader:`
    // --- helpers BEFORE generate() ---

    vec2 voronoi_rand(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return fract(sin(p) * 43758.5453);
    }

    float hash1(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    // Low-frequency smooth noise for glass inhomogeneity
    float smoothnoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1(i);
      float b = hash1(i + vec2(1.0, 0.0));
      float c = hash1(i + vec2(0.0, 1.0));
      float d = hash1(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Pick one of 6 vivid stained-glass hues from a fixed palette
    vec3 glass_palette(float idx) {
      // 0: ruby red, 1: cobalt blue, 2: emerald green,
      // 3: amber gold, 4: violet, 5: teal
      if (idx < 0.5)       return vec3(0.82, 0.06, 0.08);   // ruby red
      else if (idx < 1.5)  return vec3(0.05, 0.12, 0.78);   // cobalt blue
      else if (idx < 2.5)  return vec3(0.04, 0.62, 0.14);   // emerald green
      else if (idx < 3.5)  return vec3(0.92, 0.58, 0.02);   // amber gold
      else if (idx < 4.5)  return vec3(0.48, 0.05, 0.75);   // violet
      else                 return vec3(0.02, 0.58, 0.62);    // teal
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);

      // Voronoi — find closest and second-closest cell
      float m_dist  = 10.0;
      float m2_dist = 10.0;
      vec2  m_id    = vec2(0.0);

      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 rng      = voronoi_rand(i_uv + neighbor);
          // Animate jitter slightly to feel alive
          rng = 0.5 + 0.5 * sin(6.2831 * rng);
          vec2 diff     = neighbor + rng - f_uv;
          float d       = length(diff);
          if (d < m_dist) {
            m2_dist = m_dist;
            m_dist  = d;
            m_id    = i_uv + neighbor;
          } else if (d < m2_dist) {
            m2_dist = d;
          }
        }
      }

      // Edge distance = difference between closest and second-closest
      float edge_dist = m2_dist - m_dist;

      // Lead came: narrow band near cell boundary
      float lead_mask = smoothstep(0.0, u_lead_width, edge_dist);

      // Pick palette color from cell hash
      float cell_hash = hash1(m_id);
      float palette_idx = floor(cell_hash * 6.0);
      vec3 glass_color = glass_palette(palette_idx);

      // Subtle brightness variation inside panel (±15%) — handblown glass
      float variation = smoothnoise(m_id * 1.7 + vec2(3.1, 7.4));
      float brightness = 1.0 + (variation - 0.5) * 0.30;

      // Backlit luminosity — boost saturation by squaring and scaling
      vec3 lit = glass_color * glass_color * brightness * u_brightness;

      // Lead came color: near-black dark grey
      vec3 lead_color = vec3(0.06, 0.06, 0.07);

      // Blend: inside cell = vivid glass, at boundary = lead
      vec3 col = mix(lead_color, lit, lead_mask);

      // Lead line itself gets a slight sheen highlight at its center
      float lead_sheen = (1.0 - lead_mask) * smoothstep(0.0, u_lead_width * 0.35, edge_dist);
      col += lead_sheen * 0.08;

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_scale`,name:`Glass Sections`,type:`float`,min:2,max:20,default:7},{id:`u_lead_width`,name:`Lead Thickness`,type:`float`,min:.01,max:.12,default:.04},{id:`u_brightness`,name:`Panel Luminosity`,type:`float`,min:.3,max:2,default:1.3}]},tu=e({default:()=>nu}),nu={id:`star_field_artisan`,name:`Star Field Static`,category:`Natural`,added:`2026-04-15`,description:`High-density thresholded noise clusters representing deep-space star fields.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      float mask = step(0.99, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cluster Density`,type:`float`,min:100,max:2e3,default:800},{id:`u_primary_color`,name:`Star Alpha`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Deep Space`,type:`color`,default:[0,0,.02,1]}]},ru=e({default:()=>iu}),iu={id:`starlight_drive_artisan`,name:`Star Drive`,category:`Abstract`,added:`2026-04-16`,description:`Streaked starfield with motion blur effects found in high-speed space transit simulations.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float h = hash(y);
      float dash = step(0.9, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, dash * h);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Star Streak`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Deep Space`,type:`color`,default:[0,0,0,1]}]},au=e({default:()=>ou}),ou={id:`steel_wool_artisan`,name:`Steel Wool`,category:`Industrial`,added:`2026-04-15`,description:`Chaos-line noise mimicking tangled metal strands found in industrial abrasives.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 1000.0) * hash(v_uv * 100.0);
      float mask = smoothstep(0.0, 0.2, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Steel Strand`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Internal Shadow`,type:`color`,default:[.1,.1,.15,1]}]},su=e({default:()=>cu}),cu={id:`stitched_leather_pro`,name:`Stitched Leather`,category:`Organic`,added:`2026-04-15`,description:`Premium pebbled leather texture with perimeter stitching simulation.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float pebble = smoothstep(0.4, 0.5, d);
      
      float stitch_v = step(0.98, fract(v_uv.x * 100.0)) * step(0.01, v_uv.y) * step(v_uv.y, 0.99);
      float stitch_h = step(0.98, fract(v_uv.y * 100.0)) * step(0.01, v_uv.x) * step(v_uv.x, 0.99);
      float stitch = max(stitch_v, stitch_h) * u_show_stitch;
      
      vec4 leather = vec4(0.15, 0.08, 0.05, 1.0);
      vec4 thread = vec4(0.8, 0.7, 0.1, 1.0);
      
      vec4 color = mix(leather, leather * 0.8, pebble);
      return mix(color, thread, stitch);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:10,max:100,default:40},{id:`u_show_stitch`,name:`Show Stitch`,type:`float`,min:0,max:1,default:1}]},lu=e({default:()=>uu}),uu={id:`supernova_remnant`,name:`Supernova Remnant`,category:`Cosmos`,added:`2026-06-11`,description:`Lace-like filamentary shells of a stellar explosion — interlocking ribbons of glowing oxygen teal and sulfur crimson around a hollow blast cavity.`,shader:`
    // Ridged turbulence: |snoise| folded into sharp filament crests
    float ridge_snr(vec2 p) {
      float v = 0.0;
      float a = 0.55;
      for (int i = 0; i < 5; i++) {
        v += a * (1.0 - abs(snoise(p)));
        p = p * 2.07 + vec2(13.7, 7.3);
        a *= 0.52;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      vec3 space = vec3(0.008, 0.008, 0.020);
      vec3 col = space;

      // Background stars
      vec2 sg = floor(v_uv * 80.0);
      float star = smoothstep(0.965, 1.0, hash(sg + 6.6)) *
                   smoothstep(0.09, 0.0, length(fract(v_uv * 80.0) - vec2(hash(sg), hash(sg + 21.0))));
      col += vec3(0.85, 0.88, 1.0) * star;

      // --- Shell geometry: blast wave radius perturbed per-angle ---
      float wob = snoise(vec2(cos(theta), sin(theta)) * 2.2) * 0.10
                + snoise(vec2(cos(theta), sin(theta)) * 5.5 + 9.0) * 0.045;
      float shellR = u_shell_size + wob;

      // Distance from the shell surface
      float sd = r - shellR;

      // --- Filaments: ridged turbulence concentrated in the shell band ---
      vec2 fuv = uv * (6.5 * u_filament_scale);
      float fil = ridge_snr(fuv);
      float filFine = ridge_snr(fuv * 2.6 + 31.0);
      float lace = pow(clamp(fil * 0.65 + filFine * 0.45 - 0.35, 0.0, 1.0), 2.2);

      // Shell band envelope: thick rim, hollow interior, fading exterior
      float band = exp(-pow(sd / 0.16, 2.0));
      float inner = exp(-pow((sd + 0.22) / 0.18, 2.0)) * 0.5; // trailing inner wisps
      float cavity = smoothstep(shellR * 0.55, shellR * 0.15, r);   // hollow centre

      // --- Two emission species woven through the lace ---
      float species = fbm(uv * 4.0 + 53.0) * 0.5 + 0.5;
      vec3 oxygen = u_teal_color.rgb;   // [O III] teal-green ribbons
      vec3 sulfur = u_red_color.rgb;    // [S II] crimson ribbons
      vec3 ribbon = mix(sulfur, oxygen, smoothstep(0.35, 0.65, species));

      float emission = lace * (band + inner) * (1.0 - cavity * 0.85);
      col += ribbon * emission * 1.7;

      // Bright knots where filaments crowd at the shock front
      float knots = pow(lace, 3.0) * band;
      col += vec3(0.95, 0.92, 0.85) * knots * 0.8;

      // Sharp leading shock edge: thin pale arc just outside the shell
      float shock = exp(-pow((sd - 0.07) / 0.022, 2.0));
      float shockBreaks = smoothstep(0.3, 0.6, noise(vec2(theta * 5.0, 2.2)));
      col += vec3(0.65, 0.78, 0.95) * shock * shockBreaks * 0.7;

      // Faint synchrotron haze filling the cavity
      float haze = cavity * (fbm(uv * 7.0 + 17.0) * 0.5 + 0.5);
      col += vec3(0.18, 0.12, 0.30) * haze * 0.45;

      // Central neutron star: tiny hard blue point
      float pulsarDot = exp(-r * r * 1800.0);
      col += vec3(0.6, 0.8, 1.0) * pulsarDot * 1.6;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_shell_size`,name:`Shell Size`,type:`float`,min:.3,max:.9,default:.62},{id:`u_filament_scale`,name:`Filament Scale`,type:`float`,min:.4,max:2.5,default:1},{id:`u_teal_color`,name:`Oxygen Teal`,type:`color`,default:[.15,.8,.7,1]},{id:`u_red_color`,name:`Sulfur Red`,type:`color`,default:[.85,.18,.12,1]}]},du=e({default:()=>fu}),fu={id:`synaptic_spark_artisan`,name:`Synaptic Spark`,category:`Organic`,added:`2026-05-13`,description:`A network of neurons and dendrites with high-contrast electrical impulses.`,shader:`
    vec2 random2( vec2 p ) {
        return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
    }
    float voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);
        float res = 8.0;
        for(int j=-1; j<=1; j++)
        for(int i=-1; i<=1; i++) {
            vec2 b = vec2(i, j);
            vec2 r = vec2(b) - f + random2(n + b);
            float d = dot(r, r);
            res = min(res, d);
        }
        return sqrt(res);
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        // Base Voronoi for cellular structure
        float v1 = voronoi(uv);
        float v2 = voronoi(uv + vec2(1.5));
        
        // Neurons (soma) are the inverted voronoi centers
        float soma = smoothstep(0.3, 0.1, v1);
        
        // Dendrites are the edges of the voronoi cells, warped by noise
        float warp = noise(uv * 5.0) * 0.2;
        float vWarp = voronoi(uv + warp);
        float dendrites = smoothstep(0.05, 0.0, abs(vWarp - 0.2));
        
        // Synaptic sparks (moving along dendrites)
        float sparkPhase = u_flow * 2.0 + vWarp * 10.0;
        float spark = fract(sparkPhase);
        float sparkGlow = smoothstep(0.95, 1.0, spark) * dendrites;
        
        vec4 network = mix(u_bg_color, u_neuron_color, max(soma, dendrites * 0.5));
        
        return network + u_spark_color * sparkGlow * 2.0;
    }
  `,uniforms:[{id:`u_scale`,name:`Network Scale`,type:`float`,min:2,max:20,default:6},{id:`u_bg_color`,name:`Brain Matter`,type:`color`,default:[.05,.02,.08,1]},{id:`u_neuron_color`,name:`Neurons`,type:`color`,default:[.4,.2,.6,1]},{id:`u_spark_color`,name:`Electrical Impulse`,type:`color`,default:[.4,1,1,1]},{id:`u_flow`,name:`Synapse Fire`,type:`float`,min:0,max:100,default:0}]},pu=e({default:()=>mu}),mu={id:`tech_fractal_artisan`,name:`Logic Fractal`,category:`Abstract`,added:`2026-04-16`,description:`Geometric recursive logic patterns mimicking complex computational architectures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;
      float d = 0.0;
      for (int i=0; i<3; i++) {
        uv = abs(uv - 0.5) * 2.0;
        d += length(uv - 0.5);
      }
      float mask = step(1.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Pattern Edge`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Deep Core`,type:`color`,default:[0,.1,.15,1]}]},hu=e({default:()=>gu}),gu={id:`tech_hex_v2_artisan`,name:`Tech Hex v2`,category:`Technology`,added:`2026-04-15`,description:`Advanced geometric hex-grid with internal subdivided offsets for sci-fi panels.`,shader:`
    vec2 hexCoords(vec2 uv) {
      vec2 r = vec2(1.0, 1.73);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      return length(a) < length(b) ? a : b;
    }
    vec4 generate() {
      vec2 gv = hexCoords(v_uv * u_scale);
      float mask = smoothstep(0.45, 0.42, length(gv));
      float inner = smoothstep(0.3, 0.28, length(gv));
      return mix(u_secondary_color, u_primary_color, mask - inner);
    }
  `,uniforms:[{id:`u_scale`,name:`Module Count`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Housing`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Frame`,type:`color`,default:[.05,.05,.08,1]}]},_u=e({default:()=>vu}),vu={id:`teletext_blocks`,name:`Teletext Blocks`,category:`Retro`,added:`2026-06-11`,description:`Ceefax page 888 mosaic graphics — 2×3 sixel blocks clustering into saturated seven-colour shapes on broadcast black, with the faint shimmer of a tuned-in telly.`,shader:`
    vec3 ttpal_tt(float k) {
      if (k < 1.0) return vec3(1.0, 1.0, 1.0);     // white
      if (k < 2.0) return vec3(1.0, 1.0, 0.0);     // yellow
      if (k < 3.0) return vec3(0.0, 1.0, 1.0);     // cyan
      if (k < 4.0) return vec3(0.0, 1.0, 0.0);     // green
      if (k < 5.0) return vec3(1.0, 0.0, 1.0);     // magenta
      if (k < 6.0) return vec3(1.0, 0.1, 0.1);     // red
      return vec3(0.25, 0.25, 1.0);                // blue
    }

    vec4 generate() {
      float cols = u_cols;
      float rows = floor(cols * 0.75);             // teletext chars are tall
      vec2 guv = vec2(v_uv.x * cols, v_uv.y * rows);
      vec2 cell = floor(guv);
      vec2 cf = fract(guv);

      // sixel sub-block inside the character cell: 2 wide x 3 tall
      vec2 sub = vec2(floor(cf.x * 2.0), floor(cf.y * 3.0));
      // centre of this sixel in page coordinates
      vec2 sixel = cell + (sub + 0.5) / vec2(2.0, 3.0);

      // mosaic artwork: smooth field decides which sixels are set,
      // per-sixel hash roughens the contour into chunky steps
      float field = snoise(sixel / vec2(cols, rows) * 4.5) * 0.5 + 0.5;
      field += snoise(sixel / vec2(cols, rows) * 11.0 + 31.0) * 0.18;
      float rough = (hash(sixel * 3.7) - 0.5) * 0.22;
      float on = step(1.0 - u_fill, field + rough);

      // colour runs in bands, the way control codes paint whole regions
      float cband = snoise(vec2(cell.x * 0.06, cell.y * 0.21) + 7.7) * 0.5 + 0.5;
      float k = floor(clamp(cband * 6.999, 0.0, 6.999));
      vec3 fg = ttpal_tt(k);

      // every few rows, a "double-height headline" stripe forces yellow
      float headline = step(0.92, hash(vec2(floor(cell.y / 2.0), 13.0)));
      fg = mix(fg, vec3(1.0, 1.0, 0.0), headline);

      // a sparse scatter of set sixels in empty space — background chatter
      float chatter = step(0.965, hash(sixel + 99.0)) * (1.0 - on);

      vec3 bg = u_bg_color.rgb;
      vec3 col = mix(bg, fg, on);
      col = mix(col, fg * 0.55, chatter);

      // 1-pixel-ish gap shading between character rows (raster structure)
      float rowedge = smoothstep(0.0, 0.06, cf.y) * smoothstep(1.0, 0.94, cf.y);
      col *= 0.82 + 0.18 * rowedge;

      // soft phosphor bleed: set blocks glow very slightly past their edge
      vec2 bf = fract(guv * vec2(2.0, 3.0));
      float inner = min(min(bf.x, 1.0 - bf.x), min(bf.y, 1.0 - bf.y));
      col += fg * on * (1.0 - smoothstep(0.0, 0.4, inner)) * 0.10;

      // tuned-in shimmer
      col *= 0.95 + 0.05 * hash(vec2(floor(v_uv.y * 600.0), 3.0));

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_cols`,name:`Character Columns`,type:`float`,min:10,max:60,default:26},{id:`u_fill`,name:`Mosaic Fill`,type:`float`,min:.15,max:.9,default:.55},{id:`u_bg_color`,name:`Broadcast Black`,type:`color`,default:[.02,.02,.03,1]}]},yu=e({default:()=>bu}),bu={id:`terrazzo_chip_artisan`,name:`Terrazzo Chip`,category:`Industrial`,added:`2026-04-16`,description:`Scattered irregular stone flakes and marble chips mimicking professional terrazzo flooring.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float n = hash(i_uv);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      float mask = step(0.6, hash(i_uv * 1.5));
      return mix(u_secondary_color, vec4(col, 1.0), mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Density`,type:`float`,min:10,max:100,default:50},{id:`u_secondary_color`,name:`Binding Resin`,type:`color`,default:[.1,.1,.12,1]}]},xu=e({default:()=>Su}),Su={id:`terrazzo_stone_artisan`,name:`Terrazzo Stone`,category:`Industrial`,added:`2026-04-15`,description:`Multi-colored irregular stone chunks embedded in a polished composite base.`,shader:`
    vec2 rand2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float m_dist = 1.0;
      vec2 m_point;
      for (int y= -1; y <= 1; y++) {
        for (int x= -1; x <= 1; x++) {
          vec2 neighbor = vec2(float(x), float(y));
          vec2 point = rand2(i_uv + neighbor);
          float dist = length(neighbor + point - f_uv);
          if (dist < m_dist) {
            m_dist = dist;
            m_point = point;
          }
        }
      }
      float mask = step(0.1, m_dist);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stone Chip`,type:`color`,default:[.6,.62,.65,1]},{id:`u_secondary_color`,name:`Base Mortar`,type:`color`,default:[.8,.8,.82,1]}]},Cu=e({default:()=>wu}),wu={id:`thermal_tile_scorch_artisan`,name:`Thermal Tile Scorch`,category:`Industrial`,added:`2026-05-13`,description:`Heat-ablated spacecraft tiles showing directional plasma scorch marks and edge wear.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    float fbm(vec2 p) {
      float f = 0.0;
      f += 0.5000 * noise(p); p *= 2.02;
      f += 0.2500 * noise(p); p *= 2.03;
      f += 0.1250 * noise(p); p *= 2.01;
      f += 0.0625 * noise(p);
      return f;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv);
      
      // Tile borders
      float border = smoothstep(0.95, 1.0, gv.x) + smoothstep(0.05, 0.0, gv.x) + 
                     smoothstep(0.95, 1.0, gv.y) + smoothstep(0.05, 0.0, gv.y);
      border = clamp(border, 0.0, 1.0);
      
      // Directional Scorch (stretched noise along Y)
      vec2 scorchUV = vec2(v_uv.x * u_scale * 0.5, v_uv.y * u_scale * 5.0);
      float scorchNoise = fbm(scorchUV + vec2(hash(id)*5.0, 0.0)); // offset per tile
      
      // Focus scorch on trailing edge of tile (top edge)
      float scorchMask = scorchNoise * smoothstep(0.3, 1.0, gv.y);
      
      // Micro-fractures
      float crack = smoothstep(0.6, 0.8, fbm(uv * 5.0)) * border;
      
      vec4 tileColor = mix(u_tile_color, u_scorch_color, scorchMask * 1.5);
      vec4 finalColor = mix(tileColor, vec4(0.0,0.0,0.0,1.0), border); // Dark grout
      return mix(finalColor, u_scorch_color, crack); // Wear on edges
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Scale`,type:`float`,min:2,max:20,default:8},{id:`u_tile_color`,name:`Clean Tile`,type:`color`,default:[.85,.85,.8,1]},{id:`u_scorch_color`,name:`Plasma Scorch`,type:`color`,default:[.15,.1,.08,1]}]},Tu=e({default:()=>Eu}),Eu={id:`threaded_screw_artisan`,name:`Threaded Bolt`,category:`Industrial`,added:`2026-04-15`,description:`Helical metal grooves representing industrial fasteners and bolts.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float thread = sin(uv.y * 10.0 - uv.x * 2.0);
      float mask = smoothstep(-0.1, 0.1, thread);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Thread Pitch`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Peak Metal`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Valley`,type:`color`,default:[.1,.1,.15,1]}]},Du=e({default:()=>Ou}),Ou={id:`ticket_roll`,name:`Ticket Roll`,category:`Retro`,added:`2026-06-11`,description:`Carnival admit-one tickets unspooled in brick-laid rows — perforated ends, punched side notches, inset keyline panels and serial-number blocks on sunfaded red stock.`,shader:`
    vec4 generate() {
      float rows = u_rows;
      // tickets are roughly 2:1 — half as many columns as rows
      vec2 uv = vec2(v_uv.x * rows * 0.5, v_uv.y * rows);
      float row = floor(uv.y);
      uv.x += mod(row, 2.0) * 0.5;          // brick stagger
      vec2 cell = floor(uv);
      vec2 f = fract(uv);

      float seed = hash(cell);

      // --- ticket stock ---
      vec3 stock = u_ticket_color.rgb;
      stock *= 0.92 + noise(uv * 220.0) * 0.14;                       // pulp grain
      stock *= 1.0 - u_wear * smoothstep(0.45, 0.95, fbm(uv * 1.7 + seed * 9.0) * 0.5 + 0.5) * 0.35;
      stock *= 0.92 + seed * 0.14;                                    // roll-to-roll dye drift

      vec3 inkdark = stock * 0.30;
      vec3 panel   = mix(stock, vec3(0.96, 0.92, 0.80), 0.55);        // lighter print panel

      vec3 col = stock;

      // --- inset double keyline border ---
      float bx = min(f.x, 1.0 - f.x);
      float by = min(f.y, 1.0 - f.y);
      float inset = min(bx * 0.5, by);       // x distances scaled for the 2:1 aspect
      float line1 = step(0.060, inset) - step(0.075, inset);
      float line2 = step(0.090, inset) - step(0.115, inset);
      col = mix(col, inkdark, clamp(line1 + line2, 0.0, 1.0));

      // --- central panel with "ADMIT ONE" type bars ---
      bool inPanel = f.x > 0.30 && f.x < 0.70 && f.y > 0.26 && f.y < 0.74;
      if (inPanel) {
        col = panel;
        // panel keyline
        float pb = min(min(f.x - 0.30, 0.70 - f.x) * 0.5, min(f.y - 0.26, 0.74 - f.y));
        col = mix(col, inkdark, 1.0 - smoothstep(0.008, 0.018, pb));
        // two rows of blocky type dashes
        float trow = step(0.40, f.y) * step(f.y, 0.48) + step(0.55, f.y) * step(f.y, 0.66);
        float dash = step(0.30, fract(f.x * 22.0)) * step(f.x, 0.66) * step(0.34, f.x);
        col = mix(col, inkdark, trow * dash * 0.85);
      }

      // --- serial-number blocks near each perforated end ---
      float endzone = step(abs(f.x - 0.5), 0.46) * (step(f.x, 0.21) + step(0.79, f.x));
      float srow = step(0.34, f.y) * step(f.y, 0.66);
      vec2 sg = vec2(fract(f.x * 24.0), fract(f.y * 8.0));
      float digit = step(0.25, sg.x) * step(sg.x, 0.8) * step(0.25, sg.y) * step(sg.y, 0.8);
      digit *= step(0.45, hash(floor(vec2(f.x * 24.0, f.y * 8.0)) + cell * 17.0));
      col = mix(col, inkdark, endzone * srow * digit * 0.8);

      // --- perforation: punched dots along ticket ends ---
      float ex = min(f.x, 1.0 - f.x) * 2.0;            // distance to nearest end, aspect-corrected
      float perf = 1.0 - smoothstep(0.05, 0.09, length(vec2(ex, fract(f.y * 9.0) - 0.5) - vec2(0.0, 0.0)));
      vec3 behind = vec3(0.12, 0.10, 0.09);            // dark beneath the roll
      col = mix(col, behind, perf * 0.85);

      // --- side half-moon notch at each end's midpoint ---
      float notch = 1.0 - smoothstep(0.14, 0.18, length(vec2(ex, (f.y - 0.5) * 1.6)));
      col = mix(col, behind, notch);

      // row separation shadow
      col *= 0.90 + 0.10 * smoothstep(0.0, 0.05, by);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_rows`,name:`Ticket Rows`,type:`float`,min:3,max:10,default:5},{id:`u_wear`,name:`Pocket Wear`,type:`float`,min:0,max:1,default:.35},{id:`u_ticket_color`,name:`Ticket Stock`,type:`color`,default:[.82,.18,.12,1]}]},ku=e({default:()=>Au}),Au={id:`tide_pool_rings`,name:`Tide Pool Rings`,category:`Ocean`,added:`2026-06-11`,description:`Mineral water-level rings receding into rocky tide pools — salt-crust lines, algae stains and rust bands around each basin.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv;

      // --- rock base: weathered grey-brown with grain ---
      vec3 rock = u_rock_color.rgb;
      float wear = fbm(uv * 5.0) * 0.5 + 0.5;
      vec3 col = mix(rock * 0.70, rock * 1.15, wear);
      col += (noise(uv * 240.0) - 0.5) * 0.06;
      // darker fissures across the rock
      float fis = pow(1.0 - abs(snoise(uv * 6.0 + 41.0)), 10.0);
      col *= 1.0 - fis * 0.35;

      // --- pools: 2x2 grid of basins, jittered centres ---
      vec2 g = uv * 2.0;
      vec2 id = floor(g);
      // check the 3x3 neighbourhood so pools can spill across cells
      float best = 1e6;
      vec2 best_id = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 cid = id + o;
          vec2 wid = vec2(mod(cid.x, 2.0), mod(cid.y, 2.0)); // wrap for tiling
          vec2 c = cid + 0.5 + (vec2(hash(wid + 3.3), hash(wid + 7.1)) - 0.5) * 0.5;
          // warp distance so the basins are irregular, not circular
          vec2 dp = g - c;
          float warp = fbm(dp * 2.0 + hash(wid) * 19.0) * u_warp;
          float d = length(dp) + warp;
          if (d < best) { best = d; best_id = wid; }
        }
      }

      float pool_h = hash(best_id + 11.0);

      // --- water-level rings: bands of mineral residue ---
      float ringd = best * u_ring_freq;
      float band = floor(ringd);
      float bf = fract(ringd);

      // each band gets its own mineral tint
      float bh = hash(vec2(band, pool_h * 91.0));
      vec3 salt  = vec3(0.90, 0.89, 0.84);             // white salt crust
      vec3 algae = vec3(0.25, 0.38, 0.20);             // green algal stain
      vec3 rust  = vec3(0.55, 0.32, 0.18);             // iron oxide band
      vec3 tint = mix(rust, algae, step(0.4, bh));
      tint = mix(tint, rock * 0.8, 0.45);              // weathered into the rock

      // ring zone: only inside the basin's reach
      float basin = smoothstep(0.85, 0.25, best);
      // mineral band staining between salt lines
      col = mix(col, tint, basin * 0.40 * smoothstep(0.15, 0.45, bf) * smoothstep(0.95, 0.65, bf));
      // crisp salt-crust line at each level mark
      float line = smoothstep(0.10, 0.0, abs(bf - 0.04)) + smoothstep(0.10, 0.0, abs(bf - 0.96));
      col = mix(col, salt, basin * line * 0.55);

      // --- standing water in the basin centre ---
      float water = smoothstep(0.30, 0.12, best);
      vec3 water_col = vec3(0.10, 0.28, 0.30) * (0.8 + 0.4 * pool_h);
      // submerged rock shows through the shallows
      water_col = mix(col * 0.55 + water_col * 0.3, water_col, smoothstep(0.25, 0.05, best));
      // sky glint on the still surface
      water_col += vec3(0.20, 0.24, 0.26) * pow(1.0 - abs(snoise(uv * 14.0 + 9.0)), 8.0) * 0.6;
      col = mix(col, water_col, water * 0.9);

      // wet sheen just above the waterline
      col *= 1.0 + smoothstep(0.36, 0.30, best) * (1.0 - water) * 0.12;

      // barnacle specks on the dry rock
      float barn = step(0.985, hash(floor(uv * 90.0) + 5.0)) * (1.0 - basin * 0.6);
      col = mix(col, vec3(0.75, 0.73, 0.68), barn * 0.6);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_ring_freq`,name:`Ring Frequency`,type:`float`,min:3,max:16,default:8},{id:`u_warp`,name:`Basin Irregularity`,type:`float`,min:0,max:.5,default:.22},{id:`u_rock_color`,name:`Rock Color`,type:`color`,default:[.42,.38,.33,1]}]},ju=e({default:()=>Mu}),Mu={id:`tig_weld`,name:`TIG Weld Bead`,category:`Industrial`,added:`2026-05-01`,description:`TIG weld bead running horizontally with characteristic stacked-coin ripple arcs, hot bright center, and heat-affected steel.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_tw(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_tw(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_tw(i);
      float b = hash1_tw(i + vec2(1.0, 0.0));
      float c = hash1_tw(i + vec2(0.0, 1.0));
      float d = hash1_tw(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Vertical distance from horizontal center line
      float dy = uv.y - 0.5;
      float abs_dy = abs(dy);

      // Bead half-width in UV space
      float half_bead = u_bead_width * 0.5;

      // --- Ripple pattern ---
      // fract along x gives position within one ripple period
      float ripple_x = fract(uv.x * u_bead_freq);
      // Arc: distance from the trailing edge center of each coin
      // Each coin arc is centered at (ripple_x=0, dy=0)
      float arc_dist = length(vec2(ripple_x, dy / half_bead));

      // The stacked-coin ripple: rings of arc distance
      float ring = fract(arc_dist * 2.2);
      float ripple_band = smoothstep(0.35, 0.5, ring) * smoothstep(0.85, 0.7, ring);

      // Bead cross-section envelope: Gaussian falloff from center
      float bead_env = exp(-3.5 * (abs_dy / half_bead) * (abs_dy / half_bead));
      bead_env = clamp(bead_env, 0.0, 1.0);

      // Inside bead flag
      float in_bead = smoothstep(half_bead * 1.1, half_bead * 0.7, abs_dy);

      // --- Colors ---
      // Hot center: near-white/yellow-white
      vec3 hot_center   = vec3(1.00, 0.98, 0.90);
      // Ripple color: warm amber / gold
      vec3 ripple_color = vec3(0.88, 0.62, 0.18);
      // Edge of bead: transition to blue-steel
      vec3 bead_edge    = vec3(0.38, 0.48, 0.58);
      // Steel base: blue-grey
      vec3 steel_base   = vec3(0.55, 0.57, 0.60);
      // HAZ (heat affected zone): slight straw/blue tint
      vec3 haz_color    = vec3(0.52, 0.54, 0.62);

      // Micro surface noise on steel
      float micro = smoothnoise_tw(uv * 120.0) * 0.06 - 0.03;

      // --- Bead interior color ---
      // Blend from hot center outward through ripple amber to bead edge
      float center_t = clamp(abs_dy / half_bead, 0.0, 1.0);
      vec3 bead_col = mix(hot_center, ripple_color, smoothstep(0.0, 0.5, center_t));
      bead_col      = mix(bead_col,   bead_edge,    smoothstep(0.5, 1.0, center_t));

      // Add ripple bands on top (visible on mid-section of bead)
      float ripple_strength = (1.0 - center_t * center_t) * 0.30;
      bead_col = mix(bead_col, ripple_color * 0.7, ripple_band * ripple_strength);

      // --- HAZ gradient either side ---
      // HAZ width controlled by u_heat_spread
      float haz_width = half_bead * u_heat_spread;
      float haz_t = smoothstep(half_bead, haz_width, abs_dy);
      vec3 steel_col = mix(steel_base + micro, haz_color, haz_t);

      // --- Composite bead over steel ---
      vec3 col = mix(steel_col, bead_col, in_bead * bead_env);

      // Slight surface gloss highlight along bead center
      float gloss = exp(-80.0 * dy * dy) * exp(-4.0 * (ripple_x - 0.5) * (ripple_x - 0.5));
      col += gloss * 0.12 * in_bead;

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_bead_freq`,name:`Ripple Frequency`,type:`float`,min:4,max:40,default:16},{id:`u_bead_width`,name:`Bead Width`,type:`float`,min:.05,max:.4,default:.18},{id:`u_heat_spread`,name:`Heat Affected Zone`,type:`float`,min:.5,max:3,default:1.5}]},Nu=e({default:()=>Pu}),Pu={id:`tiger_stripe_camo`,name:`Tiger Stripe Camo`,category:`Organic`,added:`2026-05-12`,description:`Aggressive, horizontally flowing organic stripes characteristic of jungle warfare uniforms.`,shader:`
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      // Stretch horizontally and add vertical noise to create tiger stripes
      vec2 distorted_uv = vec2(uv.x, uv.y * 5.0 + snoise(uv * 2.0) * 1.5);
      
      float n1 = snoise(distorted_uv);
      float n2 = snoise(distorted_uv * 1.5 + vec2(10.0, 5.0));
      float n3 = snoise(distorted_uv * 2.0 + vec2(20.0, 10.0));
      
      vec4 color = u_color_base;
      if (n1 > 0.2) color = u_color_1;
      if (n2 > 0.4) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,variants:[{name:`Jungle Tiger`,uniforms:{u_color_base:[.35,.38,.25,1],u_color_1:[.2,.25,.15,1],u_color_2:[.45,.35,.2,1],u_color_3:[.08,.08,.08,1]}},{name:`Desert Tiger`,uniforms:{u_color_base:[.85,.75,.55,1],u_color_1:[.65,.55,.4,1],u_color_2:[.45,.35,.25,1],u_color_3:[.25,.15,.1,1]}},{name:`Snow Tiger`,uniforms:{u_color_base:[.95,.95,.95,1],u_color_1:[.75,.75,.78,1],u_color_2:[.45,.45,.5,1],u_color_3:[.15,.15,.18,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.12,1],u_color_1:[.08,.08,.08,1],u_color_2:[.05,.05,.05,1],u_color_3:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Stripe Scale`,type:`float`,min:1,max:20,default:4},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.35,.38,.25,1]},{id:`u_color_1`,name:`Stripe 1`,type:`color`,default:[.2,.25,.15,1]},{id:`u_color_2`,name:`Stripe 2`,type:`color`,default:[.45,.35,.2,1]},{id:`u_color_3`,name:`Stripe 3`,type:`color`,default:[.08,.08,.08,1]}]},Fu=e({default:()=>Iu}),Iu={id:`tiger_stripes_artisan`,name:`Predator Stripes`,category:`Organic`,added:`2026-04-15`,description:`Organic predator-style tiger stripes with tapered edges.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(vec2(uv.x * 0.2 * u_breakup, uv.y * 2.0));
      float s = max(u_softness, 0.005);
      float mask = smoothstep(u_coverage - s, u_coverage + s, n + sin(uv.x * 2.0) * u_wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.05,.05,.05,1],u_secondary_color:[1,.45,.05,1],u_coverage:.5,u_softness:.1,u_wave:.2,u_breakup:1}},{name:`White Tiger`,uniforms:{u_primary_color:[.25,.28,.32,1],u_secondary_color:[.93,.94,.96,1],u_coverage:.52,u_softness:.08,u_wave:.2,u_breakup:1.2}},{name:`Jungle Ghost`,uniforms:{u_primary_color:[.05,.09,.04,1],u_secondary_color:[.32,.42,.2,1],u_coverage:.45,u_softness:.14,u_wave:.3,u_breakup:1.6}},{name:`Synthwave`,uniforms:{u_primary_color:[.95,.1,.6,1],u_secondary_color:[.08,.02,.15,1],u_coverage:.5,u_softness:.04,u_wave:.35,u_breakup:.8}}],uniforms:[{id:`u_scale`,name:`Stripe Spacing`,type:`float`,min:2,max:20,default:8},{id:`u_coverage`,name:`Stripe Coverage`,type:`float`,min:.2,max:.8,default:.5},{id:`u_softness`,name:`Edge Taper`,type:`float`,min:.005,max:.3,default:.1},{id:`u_wave`,name:`Stripe Waviness`,type:`float`,min:0,max:.6,default:.2},{id:`u_breakup`,name:`Stripe Break-up`,type:`float`,min:.2,max:4,default:1},{id:`u_primary_color`,name:`Stripe Color`,type:`color`,default:[.05,.05,.05,1]},{id:`u_secondary_color`,name:`Base Color`,type:`color`,default:[1,.45,.05,1]}]},Lu=e({default:()=>Ru}),Ru={id:`tinted_carbon`,name:`Tinted Carbon Fibre`,category:`Racing`,added:`2026-05-13`,description:`Colour-tinted resin carbon fibre — gold, blue, and red carbon as seen on real motorsport bodywork.`,shader:`
    float hash_tc(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Standard 45-degree twill orientation
      float ca = 0.70711, sa = 0.70711;
      uv = mat2(ca, -sa, sa, ca) * uv;

      vec2 cell = fract(uv);
      vec2 cid  = floor(uv);

      // 2x2 twill: diagonal over/under alternation
      float warpTop = step(0.5, mod(cid.x - cid.y, 2.0));

      // Fiber cross-section profiles
      float fR = 0.42;
      float fS = 0.07;
      float warpP = smoothstep(fR, fR - fS, abs(cell.y - 0.5));
      float weftP = smoothstep(fR, fR - fS, abs(cell.x - 0.5));

      float topP = mix(weftP, warpP, warpTop);
      float btmP = mix(warpP, weftP, warpTop);

      // Specular streak along fiber axis
      float warpSpec = max(0.0, pow(1.0 - abs(cell.x - 0.5) * 3.0, 2.5)) * warpP;
      float weftSpec = max(0.0, pow(1.0 - abs(cell.y - 0.5) * 3.0, 2.5)) * weftP;
      float topSpec  = mix(weftSpec, warpSpec, warpTop);

      // Per-bundle luminance variation
      float towVar = hash_tc(warpTop > 0.5 ? vec2(cid.x, 0.0) : vec2(0.0, cid.y)) * 0.05;

      // Carbon fiber is almost black — small brightness with specular pop
      float lum = topP * (0.08 + towVar) + topSpec * 0.28 + btmP * 0.035;

      vec3 fiberCol = vec3(lum);

      // Resin occupies the gap zones — tinted by user colour
      float fiberPresence = clamp(topP + btmP * 0.35, 0.0, 1.0);
      float resinMask     = 1.0 - fiberPresence;

      vec3 col = fiberCol + u_tint.rgb * resinMask * u_tint_strength * 0.55;
      col += u_tint.rgb * btmP * (1.0 - topP) * u_tint_strength * 0.18;

      if (u_is_spec > 0.5) {
        // Weave-modulated metallic; fibre spec streaks glossier than resin gaps
        float metallic = mix(0.3, 0.5, clamp(topP + topSpec * 0.5, 0.0, 1.0));
        float roughness = clamp(0.18 - topP * 0.04 - topSpec * 0.06, 0.08, 0.2);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale`,type:`float`,default:24,min:8,max:64},{id:`u_tint`,name:`Resin Tint`,type:`color`,default:[.85,.62,.08,1]},{id:`u_tint_strength`,name:`Tint Strength`,type:`float`,default:.65,min:0,max:1}]},zu=e({default:()=>Bu}),Bu={id:`tire_marbles_artisan`,name:`Tire Marbles`,category:`Racing`,added:`2026-04-16`,description:`Clumpy rubber debris and "offline" track grit formed during high-heat racing conditions.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.8, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grit Size`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Rubber Clump`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Track Surface`,type:`color`,default:[.2,.2,.2,1]}]},Vu=e({default:()=>Hu}),Hu={id:`tire_sidewall_artisan`,name:`Tire Sidewall`,category:`Racing`,added:`2026-04-16`,description:`Raised geometric patterns and grip ridges found on professional racing tires.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.4) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Detail Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rubber High`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Rubber Base`,type:`color`,default:[.08,.08,.08,1]}]},Uu=e({default:()=>Wu}),Wu={id:`tire_tread_rain`,name:`Rain Tire Tread`,category:`Racing`,added:`2026-04-15`,description:`Deep directional grooves for wet weather conditions.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float x = abs(fract(uv.x) - 0.5);
      float y = fract(uv.y);
      float mask = step(0.15, abs(x - y * 0.5)) * step(0.05, x);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Rubber`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Groove`,type:`color`,default:[.05,.05,.05,1]}]},Gu=e({default:()=>Ku}),Ku={id:`topographic_pro`,name:`Topographic Map`,category:`Abstract`,added:`2026-04-15`,description:`Technical contour lines mimicking elevation mapping.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float line = fract(n * u_layers);
      float mask = step(0.9, line);
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.1, 0.4, 1.0, 1.0);
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Territory Size`,type:`float`,min:1,max:10,default:3},{id:`u_layers`,name:`Contour Detail`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Line Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Land Color`,type:`color`,default:[.1,.1,.1,1]}]},qu=e({default:()=>Ju}),Ju={id:`travertine_natural`,name:`Travertine`,category:`Natural`,added:`2026-05-01`,description:`Layered travertine limestone with wavy cream-to-tan sedimentary bands and occasional trapped gas-bubble void pockets.`,shader:`
    float hash11(float p)  { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)   { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x); float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    float smoothNoise2D(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal Brownian Motion — 3 octaves for wavy bands
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * smoothNoise2D(p);
        p  = p * 2.1 + vec2(3.7, 1.3);
        a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      // Wavy band: distort the Y coordinate with fbm noise
      float warp  = fbm(v_uv * 2.5) * 0.18 - 0.09;
      float bandY = (v_uv.y + warp) * u_band_freq;

      float layerI = floor(bandY);
      float layerF = fract(bandY);

      // Per-layer color — cycle through cream → beige → tan → light brown
      float colCycle = fract(layerI * 0.137 + hash11(layerI) * 0.4);
      // Map 0→1 through the warm tone range
      vec3 warmA = u_base_color.rgb;                              // cream
      vec3 warmB = u_base_color.rgb * vec3(0.88, 0.82, 0.70);   // tan
      vec3 warmC = u_base_color.rgb * vec3(0.76, 0.67, 0.52);   // light brown
      vec3 warmD = u_base_color.rgb * vec3(0.94, 0.91, 0.84);   // warm off-white

      vec3 layerCol;
      if (colCycle < 0.25) {
        layerCol = mix(warmA, warmB, colCycle * 4.0);
      } else if (colCycle < 0.5) {
        layerCol = mix(warmB, warmC, (colCycle - 0.25) * 4.0);
      } else if (colCycle < 0.75) {
        layerCol = mix(warmC, warmD, (colCycle - 0.5) * 4.0);
      } else {
        layerCol = mix(warmD, warmA, (colCycle - 0.75) * 4.0);
      }

      // Micro surface texture within layer
      float surf = smoothNoise2D(v_uv * 40.0) * 0.04 - 0.02;
      layerCol  += surf;

      // Layer boundary — slight darkening at the stratum transition
      float boundary = (1.0 - smoothstep(0.0, 0.08, layerF)) + (1.0 - smoothstep(1.0, 0.92, layerF));
      layerCol *= (1.0 - boundary * 0.18);

      // Void pockets (gas bubble holes) — scattered dark ellipses
      float voidCount = u_void_density;
      float voidMask  = 0.0;

      // Sample a grid of potential void cells
      vec2 voidUV = v_uv * vec2(voidCount * 1.5, voidCount);
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 cell  = floor(voidUV) + vec2(float(dx), float(dy));
          float rnd  = hash21(cell);
          // Only ~40% of cells have a void
          if (rnd > 0.60) {
            vec2 jitter  = vec2(hash21(cell + 7.3), hash21(cell + 13.7));
            vec2 center  = cell + jitter;
            vec2 diff    = voidUV - center;
            // Elliptical void (wider than tall)
            float voidR  = 0.08 + hash21(cell + 3.1) * 0.14;
            float aspect = 1.4 + hash21(cell + 5.0) * 0.8;
            float vd     = length(diff * vec2(1.0 / aspect, 1.0)) / voidR;
            float vm     = 1.0 - smoothstep(0.7, 1.0, vd);
            voidMask     = max(voidMask, vm);
          }
        }
      }

      // Void interior is dark brownish-grey
      vec3 voidCol = u_base_color.rgb * vec3(0.18, 0.14, 0.10);
      vec3 col     = mix(layerCol, voidCol, voidMask);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,uniforms:[{id:`u_band_freq`,name:`Band Frequency`,type:`float`,min:2,max:20,default:8},{id:`u_base_color`,name:`Travertine Color`,type:`color`,default:[.88,.8,.67,1]},{id:`u_void_density`,name:`Void Density`,type:`float`,min:0,max:10,default:3}]},Yu=e({default:()=>Xu}),Xu={id:`truchet_tiles_artisan`,name:`Truchet Arc`,category:`Abstract`,added:`2026-04-16`,description:`Interlocking arc-based tiles mimicking complex organic circuitry and decorative pavement.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      if (hash(i_uv) > 0.5) f_uv.x = 1.0 - f_uv.x;
      float d = abs(length(f_uv) - 0.5);
      float mask = smoothstep(0.02, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Arc Ribbon`,type:`color`,default:[1,.4,0,1]},{id:`u_secondary_color`,name:`Tile Depth`,type:`color`,default:[.1,.1,.15,1]}]},Zu=e({default:()=>Qu}),Qu={id:`turbo_fan_artisan`,name:`Turbo Turbine`,category:`Technology`,added:`2026-04-16`,description:`Radial blades of a high-boost turbocharger compressor wheel.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float blades = sin(angle * u_blades);
      float mask = smoothstep(-0.5, 0.5, blades);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_blades`,name:`Blade Count`,type:`float`,min:6,max:24,default:12},{id:`u_primary_color`,name:`Blade Top`,type:`color`,default:[.9,.92,.95,1]},{id:`u_secondary_color`,name:`Blade Void`,type:`color`,default:[.1,.1,.15,1]}]},$u=e({default:()=>ed}),ed={id:`twill_carbon_pro`,name:`Pro Twill Carbon`,category:`Racing`,added:`2026-04-15`,description:`Classic high-detail 2x2 carbon fiber weave.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      float checker = mod(id.x + id.y, 2.0);
      float pattern = step(0.5, abs(gv.x - gv.y));
      if (checker > 0.5) pattern = 1.0 - pattern;
      vec4 col = mix(u_secondary_color, u_primary_color, pattern);
      if (u_is_spec > 0.5) {
        // Lacquered carbon weave: metallic and roughness follow the twill so it reads in reflections
        return vec4(mix(0.3, 0.5, pattern), mix(0.2, 0.12, pattern), 0.0, col.a);
      }
      return col;
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Primary`,type:`color`,default:[.12,.12,.12,1]},{id:`u_secondary_color`,name:`Secondary`,type:`color`,default:[.05,.05,.05,1]}]},td=e({default:()=>nd}),nd={id:`tyre_burnout`,name:`Tyre Burnout`,category:`Racing`,added:`2026-05-01`,description:`Dark rubber burnout and skid marks on asphalt with irregular fuzzy edges, lighter internal streaks, and visible tyre tread impressions.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * noise(p);
        p *= 2.2; a *= 0.5;
      }
      return v;
    }

    // Tread imprint — parallel lateral bars (simulate tread blocks)
    float treadPattern(vec2 uv, float width) {
      // Tread bars run across the track width (X), repeat in Y
      float bar = fract(uv.y * 18.0);
      bar = step(0.3, bar) * step(bar, 0.7); // alternating blocks
      // Only show tread within the track band
      float xDist = abs(uv.x - 0.5) / (width * 0.5);
      float inTrack = smoothstep(1.0, 0.85, xDist);
      return bar * inTrack * 0.6;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Track envelope along X ---
      // Lateral distance from track centre, normalised
      float xDist = abs(uv.x - 0.5) / (u_width * 0.5);

      // Fuzzy track edge — warp xDist with low-freq noise
      float edgeWarp = fbm(vec2(uv.y * 3.0, uv.x * 1.5)) * 0.25 - 0.125;
      float warpedX = xDist + edgeWarp;

      // Core track mask — dark rubber is densest in the middle
      float trackCore = smoothstep(1.0, 0.4, warpedX);

      // Outer fringe — lighter smear at the edge
      float fringe = smoothstep(1.3, 0.9, warpedX) - trackCore;
      fringe = max(fringe, 0.0);

      // --- Longitudinal variation (acceleration / partial grip) ---
      float longVar = fbm(vec2(uv.x * 4.0, uv.y * 6.0));
      // Patches of lighter rubber (partial grip: partial deposit)
      float partialGrip = smoothstep(0.45, 0.65, longVar);

      // Tread imprint within track
      float tread = treadPattern(uv, u_width);
      // Only show where trackCore is present
      tread *= trackCore * 0.7;

      // --- Combine rubber deposit ---
      float rubberDeposit = trackCore * mix(0.5, 1.0, partialGrip) * u_intensity;
      rubberDeposit = clamp(rubberDeposit, 0.0, 1.0);

      // Asphalt base
      vec3 col = u_asphalt.rgb;
      // Add surface noise to asphalt
      float aspNoise = noise(uv * 120.0) * 0.05 - 0.025;
      col += vec3(aspNoise);

      // Fringe — partially deposited rubber, lighter mix
      vec3 fringeColor = mix(u_asphalt.rgb, u_rubber_color.rgb, 0.5);
      col = mix(col, fringeColor, fringe * u_intensity * 0.6);

      // Core rubber
      col = mix(col, u_rubber_color.rgb, rubberDeposit);

      // Partial grip lighter streaks (less rubber on lighter areas)
      float streakLight = (1.0 - partialGrip) * trackCore * 0.4 * u_intensity;
      col = mix(col, u_asphalt.rgb * 1.15, streakLight);

      // Tread imprint — very slightly lighter within deposit
      col += vec3(tread * 0.06);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_asphalt`,name:`Asphalt`,type:`color`,default:[.18,.17,.16,1]},{id:`u_rubber_color`,name:`Rubber`,type:`color`,default:[.04,.03,.03,1]},{id:`u_intensity`,name:`Intensity`,type:`float`,min:.2,max:2,default:1},{id:`u_width`,name:`Track Width`,type:`float`,min:.05,max:.5,default:.25}]},rd=e({default:()=>id}),id={id:`vaporwave_sun_artisan`,name:`Retro Sun`,category:`Abstract`,added:`2026-04-16`,description:`Segmented radial retro sun patterns found in 80s synthwave and vaporwave aesthetics.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float mask = step(d, 0.4);
      float stripes = step(0.1, fract(v_uv.y * 10.0));
      return mix(u_secondary_color, u_primary_color, mask * stripes);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Sun Core`,type:`color`,default:[1,.6,0,1]},{id:`u_secondary_color`,name:`Atmosphere`,type:`color`,default:[1,0,.5,1]}]},ad=e({default:()=>od}),od={id:`velvet_pile`,name:`Velvet Pile`,category:`Industrial`,added:`2026-05-01`,description:`Velvet fabric with directional pile sheen â€” bright along the pile, dark against it, with a dramatic direction effect.`,shader:`
    // Hash noise for micro-fibre variation
    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float smoothNoise(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    vec4 generate() {
      vec3  baseCol  = u_base_color.rgb;
      float pileAngle = u_pile_direction;
      float sheen    = u_sheen;

      // Pile direction vector (unit vector in direction of pile lay)
      vec2 pileDir = vec2(cos(pileAngle), sin(pileAngle));

      // UV centred
      vec2 uv = v_uv - 0.5;

      // "View direction" approximation: simulate looking straight down at the fabric
      // The effective highlight depends on the angle between the pile direction
      // and the gradient of UV â€” simulating a raking light from upper-left
      vec2 lightDir = normalize(vec2(0.6, 0.8));

      // Pile orientation factor: how much the pile faces the light
      float pileDot = dot(pileDir, lightDir);

      // Micro-variation in pile direction (velvet is never perfectly uniform)
      float microNoise = smoothNoise(v_uv * 28.0) * 2.0 - 1.0;
      float microNoise2 = smoothNoise(v_uv * 7.0) * 2.0 - 1.0;

      // Local pile angle variation
      float localAngle = pileAngle + microNoise * 0.25 + microNoise2 * 0.08;
      vec2 localPile   = vec2(cos(localAngle), sin(localAngle));
      float localDot   = dot(localPile, lightDir);

      // Sheen factor: cos^n of angle between pile and view
      // Bright when pile faces light, dark when it faces away
      float sheenFactor = localDot * 0.5 + 0.5;   // [0,1]
      sheenFactor = pow(sheenFactor, 1.0 / max(sheen, 0.01));

      // Velvet characteristic: bright saturation in highlight direction
      // dark with increased saturation in shadow direction
      float bright = sheenFactor;
      float dark   = 1.0 - sheenFactor;

      // Luminance-preserving colour shift
      vec3 lightened = mix(baseCol, baseCol + (1.0 - baseCol) * 0.6, bright * sheen * 0.5);
      vec3 darkened  = baseCol * (0.22 + 0.78 * (1.0 - dark * sheen * 0.6));

      vec3 col = mix(darkened, lightened, sheenFactor);

      // Micro-fibre sparkle at highlight peak
      float sparkle = hash21(floor(v_uv * 140.0)) * pow(sheenFactor, 4.0) * sheen * 0.15;
      col += sparkle;

      // Fine micro-texture from pile tips
      float micro = smoothNoise(v_uv * 80.0) * 0.04 - 0.02;
      col += micro * sheenFactor;

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_base_color`,type:`color`,default:[.35,.05,.08,1],name:`Velvet Colour`},{id:`u_pile_direction`,type:`float`,default:.785,min:0,max:6.28,name:`Pile Direction (rad)`},{id:`u_sheen`,type:`float`,default:1.2,min:.3,max:2,name:`Sheen Intensity`}]},sd=e({default:()=>cd}),cd={id:`verdigris_patina`,name:`Verdigris Patina`,category:`Industrial`,added:`2026-05-01`,description:`Aged copper or bronze with green-blue verdigris oxidation pooling in recesses over warm reddish copper.`,shader:`
    // --- helpers BEFORE generate() ---

    float hash1_vp(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float smoothnoise_vp(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash1_vp(i);
      float b = hash1_vp(i + vec2(1.0, 0.0));
      float c = hash1_vp(i + vec2(0.0, 1.0));
      float d = hash1_vp(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // FBM for patina coverage mask
    float fbm_vp(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2  s = vec2(1.0);
      for (int i = 0; i < 5; i++) {
        v += a * smoothnoise_vp(p * s);
        s *= 2.03;
        a *= 0.50;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Primary patina coverage mask
      float mask = fbm_vp(uv);

      // Secondary relief noise — surface topology (raised/recessed areas)
      float relief = fbm_vp(uv * 1.6 + vec2(5.2, 3.7));

      // Patina pools in recesses (low relief = low areas = more patina)
      // Bias mask by relief: high relief = less oxidation
      float patina_amount = mask - (relief - 0.5) * 0.35;
      patina_amount = clamp(patina_amount, 0.0, 1.0);

      // Apply coverage control — shift threshold
      float coverage_threshold = 1.0 - u_patina_coverage;
      float patina_t = smoothstep(coverage_threshold - 0.15, coverage_threshold + 0.25, patina_amount);

      // Bare copper threshold — very low mask = polished copper glimpse
      float bare_t = smoothstep(coverage_threshold - 0.3, coverage_threshold - 0.15, patina_amount);

      // Colors
      vec3 copper_base    = vec3(0.72, 0.35, 0.15);   // reddish-orange raw copper
      vec3 copper_polish  = vec3(0.85, 0.48, 0.20);   // brighter polished copper highlight
      vec3 transition     = vec3(0.35, 0.52, 0.40);   // intermediate blue-green
      vec3 verdigris      = u_patina_color.rgb;        // vivid verdigris green-blue

      // Copper base: mix polished and base by relief (raised = more polish)
      float polish_t = smoothstep(0.4, 0.7, relief);
      vec3  copper   = mix(copper_base, copper_polish, polish_t);

      // Transition zone: copper -> blue-green -> verdigris
      vec3 col = copper;
      col = mix(col, transition, smoothstep(0.0, 0.5, patina_t));
      col = mix(col, verdigris,  smoothstep(0.4, 1.0, patina_t));

      // Where mask is very low: bare copper gleam
      col = mix(col, copper_polish, (1.0 - bare_t) * (1.0 - patina_t) * 0.5);

      // Subtle metallic surface grain
      float grain = smoothnoise_vp(uv * 12.0) * 0.06 - 0.03;
      col += grain;

      // Add slight depth variation from relief (recessed = slightly darker)
      float depth = mix(0.80, 1.05, smoothstep(0.3, 0.7, relief));
      col *= depth;

      col = clamp(col, 0.0, 1.0);

      return vec4(col * u_opacity, u_opacity);
    }
  `,uniforms:[{id:`u_patina_coverage`,name:`Patina Coverage`,type:`float`,min:0,max:1,default:.6},{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:15,default:5},{id:`u_patina_color`,name:`Verdigris Color`,type:`color`,default:[.18,.52,.42,1]}]},ld=e({default:()=>ud}),ud={id:`vinyl_grooves`,name:`Vinyl Grooves`,category:`Retro`,added:`2026-06-11`,description:`A 45 fresh out of the sleeve — micro-groove rings catching twin anisotropic light streaks, track-gap bands, dead wax and a paper label around the spindle hole.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_tiles;
      vec2 cell = floor(uv);
      vec2 f = (fract(uv) - 0.5) * 2.0;     // -1..1 inside each tile
      float r = length(f);
      float an = atan(f.y, f.x);

      // matte sleeve backdrop in the tile corners
      vec3 sleeve = vec3(0.10, 0.10, 0.11) * (0.9 + noise(uv * 70.0) * 0.2);
      vec3 col = sleeve;

      float disc = 1.0 - smoothstep(0.965, 0.985, r);

      // --- vinyl body ---
      vec3 wax = vec3(0.035, 0.035, 0.040);

      // micro-grooves: fine radial rings
      float groove = sin(r * u_groove_density * 6.2831);

      // anisotropic sheen: two opposing light streaks across the grooves
      float a1 = pow(abs(cos(an - 0.95)), 10.0);
      float a2 = pow(abs(cos(an + 2.20)), 10.0) * 0.6;
      float sheen = (a1 + a2) * (0.45 + 0.55 * groove) * u_sheen;
      sheen *= smoothstep(0.33, 0.42, r) * smoothstep(1.0, 0.85, r);

      // track-gap bands: wider unmodulated rings at fixed radii
      float gaps = exp(-pow((r - 0.52) * 60.0, 2.0))
                 + exp(-pow((r - 0.68) * 60.0, 2.0))
                 + exp(-pow((r - 0.83) * 60.0, 2.0));
      gaps = clamp(gaps, 0.0, 1.0);

      vec3 vinyl = wax + vec3(0.05) * groove * 0.25 * (1.0 - gaps);
      vinyl += vec3(0.42, 0.44, 0.50) * sheen * (1.0 - gaps * 0.7);
      vinyl += vec3(0.02) * gaps;          // gaps read slightly glossier-flat
      // pressing-plant micro dust
      vinyl += vec3(noise(uv * 700.0)) * 0.015;

      // --- dead wax / runout: smooth band with a faint etched scrawl ---
      float runout = smoothstep(0.40, 0.38, r) * smoothstep(0.325, 0.345, r);
      vinyl = mix(vinyl, wax + vec3(0.025), runout);
      float etch = step(0.97, noise(vec2(an * 9.0 + cell.x * 7.0, r * 200.0)));
      vinyl += vec3(0.06) * etch * runout;

      col = mix(col, vinyl, disc);

      // --- paper label ---
      float label = 1.0 - smoothstep(0.325, 0.335, r);
      vec3 labc = u_label_color.rgb * (0.95 + noise(uv * 300.0) * 0.09);
      // printed concentric type rings
      float typering = step(0.75, fract(r * 22.0)) * smoothstep(0.10, 0.13, r) * smoothstep(0.31, 0.29, r);
      labc = mix(labc, labc * 0.35, typering * 0.8);
      // alternate label tone per tile (A-side / B-side)
      labc = mix(labc, labc.brg * 0.9 + labc * 0.1, step(0.5, hash(cell)) * 0.35);
      col = mix(col, labc, label);

      // spindle hole + pressing ring
      col = mix(col, sleeve * 0.6, 1.0 - smoothstep(0.030, 0.040, r));
      col = mix(col, labc * 0.7, (1.0 - smoothstep(0.004, 0.010, abs(r - 0.055))) * label);

      // disc edge highlight
      col += vec3(0.10) * (1.0 - smoothstep(0.006, 0.018, abs(r - 0.965))) * (a1 + a2) * 0.8;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_tiles`,name:`Records Across`,type:`float`,min:1,max:5,default:2},{id:`u_groove_density`,name:`Groove Density`,type:`float`,min:20,max:140,default:70},{id:`u_sheen`,name:`Light Sheen`,type:`float`,min:0,max:1.5,default:.8},{id:`u_label_color`,name:`Label Paper`,type:`color`,default:[.85,.25,.15,1]}]},dd=e({default:()=>fd}),fd={id:`vinyl_wrap`,name:`Vinyl Wrap Film`,category:`Racing`,added:`2026-05-13`,description:`Matte vinyl wrap film with characteristic micro-pebble surface texture and subtle directional sheen. Excellent as a spec or normal-map source for flat paint finishes.`,shader:`
    float hash_vw(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise_vw(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash_vw(i), hash_vw(i+vec2(1,0)), f.x),
                 mix(hash_vw(i+vec2(0,1)), hash_vw(i+vec2(1,1)), f.x), f.y);
    }

    // Voronoi cell for micro-pebble
    float voronoi_vw(vec2 uv) {
      vec2 cell = floor(uv);
      vec2 frac  = fract(uv);
      float minDist = 8.0;
      for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
          vec2 nb  = vec2(float(x), float(y));
          vec2 pt  = nb + vec2(hash_vw(cell + nb + 0.17), hash_vw(cell + nb + 0.89)) - frac;
          minDist  = min(minDist, dot(pt, pt));
        }
      }
      return sqrt(minDist);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // ---- Micro-pebble surface ----
      // Two scales of voronoi create the fine orange-peel texture of vinyl
      float pebble  = voronoi_vw(uv * u_pebble_scale);
      float pebble2 = voronoi_vw(uv * u_pebble_scale * 2.8 + 3.7);
      float surface = pebble * 0.65 + pebble2 * 0.35;

      // Convert to a gentle bump map luminance
      float bump = smoothstep(0.0, 0.55, surface) * u_texture_depth;

      // ---- Directional sheen (vinyl has a slight gloss in one direction) ----
      float sheen = pow(max(0.0, 1.0 - abs(uv.x - 0.5) * 2.0), 6.0) * 0.10 * u_sheen;

      // ---- Compose with base colour ----
      vec3 base   = u_base_color.rgb;
      // Shadow in pebble valleys, highlight on ridges
      vec3 shadow = base * 0.78;
      vec3 col    = mix(shadow, base, bump) + vec3(sheen);

      // Fine noise for printing grain
      float grain = (noise_vw(uv * 320.0) - 0.5) * 0.012;
      col += vec3(grain);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,uniforms:[{id:`u_base_color`,name:`Base Colour`,type:`color`,default:[.12,.12,.15,1]},{id:`u_pebble_scale`,name:`Pebble Scale`,type:`float`,default:80,min:20,max:200},{id:`u_texture_depth`,name:`Texture Depth`,type:`float`,default:.7,min:0,max:1},{id:`u_sheen`,name:`Gloss Sheen`,type:`float`,default:.6,min:0,max:1}]},pd=e({default:()=>md}),md={id:`viral_capsid_artisan`,name:`Viral Capsid`,category:`Organic`,added:`2026-05-13`,description:`Geometric, icosahedral protein structures interlocking to form complex biological shells.`,shader:`
    // Hexagonal grid basis to simulate icosahedral unwrapping
    float hexDist(vec2 p) {
      p = abs(p);
      float c = dot(p, normalize(vec2(1.0, 1.732)));
      return max(c, p.x);
    }
    vec2 hexCoords(vec2 uv) {
      vec2 r = vec2(1.0, 1.732);
      vec2 h = r * 0.5;
      vec2 a = mod(uv, r) - h;
      vec2 b = mod(uv - h, r) - h;
      vec2 gv = dot(a, a) < dot(b,b) ? a : b;
      return gv;
    }
    vec4 generate() {
        vec2 uv = v_uv * u_scale;
        
        vec2 gv = hexCoords(uv);
        float d = hexDist(gv);
        
        // Protein subunits (hexamers and pentamers)
        // Divide each hex into 6 triangles
        float angle = atan(gv.y, gv.x);
        float sector = floor(angle / (3.14159 / 3.0));
        
        // Add internal detail per sector
        float innerDist = length(gv);
        float subunit = smoothstep(0.45, 0.4, innerDist) - smoothstep(0.15, 0.1, innerDist);
        
        // Spike proteins at the center of some hexes
        float spikeMask = smoothstep(0.1, 0.05, innerDist);
        
        // Ambient occlusion on edges
        float edgeAO = smoothstep(0.5, 0.4, d);
        
        // Viral envelope color
        vec4 capsidLayer = mix(u_shell_dark, u_shell_light, subunit * edgeAO);
        
        // Add spike protein color
        return mix(capsidLayer, u_spike_color, spikeMask);
    }
  `,uniforms:[{id:`u_scale`,name:`Capsid Scale`,type:`float`,min:2,max:20,default:8},{id:`u_shell_dark`,name:`Capsid Shadow`,type:`color`,default:[.1,.2,.15,1]},{id:`u_shell_light`,name:`Capsid Surface`,type:`color`,default:[.4,.7,.5,1]},{id:`u_spike_color`,name:`Spike Protein`,type:`color`,default:[.8,.2,.3,1]}]},hd=e({default:()=>gd}),gd={id:`void_grid_artisan`,name:`Void Grid`,category:`Abstract`,added:`2026-04-16`,description:`Infinite perspective grid reminiscent of 1980s retro-futuristic digital visualization.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Grid Glow`,type:`color`,default:[1,0,1,1]},{id:`u_secondary_color`,name:`Void Base`,type:`color`,default:[0,0,.05,1]}]},_d=e({default:()=>vd}),vd={id:`volcanic_basalt_artisan`,name:`Basalt Pillar`,category:`Geology`,added:`2026-04-16`,description:`Pitted, geometric volcanic rock found in hexagonal basalt formations.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pillar Scale`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rock Face`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Pillar Joint`,type:`color`,default:[0,0,.05,1]}]},yd=e({default:()=>bd}),bd={id:`voronoi_cells_pro`,name:`Voronoi Cells`,category:`Abstract`,added:`2026-04-15`,description:`Mathematical fractured cell structures often found in biological and geological formations.`,shader:`
    vec2 hash2(vec2 p) {
      return vec2(hash(p), hash(p + 1.0));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 id = floor(uv);
      vec2 gv = fract(uv);
      
      float minDist = 1.0;
      for(int y=-1; y<=1; y++) {
        for(int x=-1; x<=1; x++) {
          vec2 offset = vec2(float(x), float(y));
          vec2 p = hash2(id + offset);
          float d = length(gv - (offset + p));
          minDist = min(minDist, d);
        }
      }
      
      float mask = smoothstep(0.0, 1.0, minDist);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cell Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Cell Center`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Cell Border`,type:`color`,default:[.1,.1,.12,1]}]},xd=e({default:()=>Sd}),Sd={id:`washi_paper`,name:`Washi Paper`,category:`Natural`,added:`2026-05-01`,description:`Japanese handmade washi paper with long random fibres, mottled translucency, and cream base.`,shader:`
    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float noise2(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Anisotropic fibre noise: stretched heavily in one direction to simulate long fibres
    float fibreNoise(vec2 uv, float angle, float stretch) {
      float c = cos(angle);
      float s = sin(angle);
      vec2 rotUV = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      // Stretch along the fibre direction, keep thin across
      vec2 stretchedUV = vec2(rotUV.x / stretch, rotUV.y * 80.0);
      float n = noise2(stretchedUV * u_fiber_density);
      // Threshold to get distinct fibre lines rather than a wash
      return smoothstep(0.55, 0.75, n);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Mottled base — low-frequency unevenness of handmade paper
      float mottling = noise2(uv * 3.5) * 0.06
                     + noise2(uv * 9.0)  * 0.03
                     + noise2(uv * 28.0) * 0.015;

      vec3 base = u_paper_color.rgb + (mottling - 0.055);

      // Three fibre layers at slightly different angles (paper screen is mostly horizontal)
      float f1 = fibreNoise(uv, 0.0,    12.0);          // horizontal fibres
      float f2 = fibreNoise(uv, 0.18,   10.0);          // slight right bias
      float f3 = fibreNoise(uv, -0.22,   9.0);          // slight left bias
      float f4 = fibreNoise(uv, 0.55,    6.0) * 0.4;   // occasional diagonal crossing fibre

      float fibreAcc = clamp(f1 * 0.5 + f2 * 0.4 + f3 * 0.35 + f4, 0.0, 1.0);

      // Fine surface grain
      float grain = noise2(uv * 120.0) * 0.02;
      base += grain - 0.01;

      vec3 col = mix(base, u_fiber_color.rgb, fibreAcc * 0.7);

      // Subtle warm variation across the sheet
      float warmth = noise2(uv * 2.0) * 0.025;
      col.r += warmth;
      col.g += warmth * 0.5;

      col = clamp(col, 0.0, 1.0);
      return vec4(col, 1.0) * u_opacity;
    }
  `,uniforms:[{id:`u_fiber_density`,name:`Fibre Density`,type:`float`,min:1,max:12,default:4},{id:`u_paper_color`,name:`Paper Colour`,type:`color`,default:[.93,.91,.85,1]},{id:`u_fiber_color`,name:`Fibre Colour`,type:`color`,default:[.6,.54,.44,1]}]},Cd=e({default:()=>wd}),wd={id:`water_ripples_artisan`,name:`Water Ripples`,category:`Natural`,added:`2026-04-15`,description:`Static concentric liquid wave interference patterns.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      // Removed time from ripple function
      float ripple = sin(d * 20.0);
      float mask = smoothstep(-0.1, 0.1, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Scale`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Peak Color`,type:`color`,default:[.1,.6,1,1]},{id:`u_secondary_color`,name:`Deep Water`,type:`color`,default:[0,.2,.4,1]}]},Td=e({default:()=>Ed}),Ed={id:`watercolor_bleed_artisan`,name:`Watercolor Flow`,category:`Abstract`,added:`2026-04-15`,description:`Soft organic color spreads and bleeding textures mimicking paint on high-fidelity wet paper.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 5.0 + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Ink Bleed`,type:`color`,default:[.2,.4,.8,.8]},{id:`u_secondary_color`,name:`Pulp Base`,type:`color`,default:[.95,.95,.9,1]}]},Dd=e({default:()=>Od}),Od={id:`wavy_checkers_artisan`,name:`Wavy Checkers`,category:`Racing`,added:`2026-04-15`,description:`Flowing, distorted racing flags mimicking a waving checkered banner.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      uv.x += sin(uv.y * u_wave_freq) * u_wave_amp;
      uv.y += cos(uv.x * u_wave_freq * 0.6667) * u_wave_amp * 0.5;

      // Anti-aliased checker via soft-XOR of triangle waves
      float s = max(u_softness, 0.0005);
      float tx = abs(fract((uv.x + 0.5) * 0.5) * 2.0 - 1.0);
      float ty = abs(fract((uv.y + 0.5) * 0.5) * 2.0 - 1.0);
      float mx = smoothstep(0.5 - s, 0.5 + s, tx);
      float my = smoothstep(0.5 - s, 0.5 + s, ty);
      float mask = mx + my - 2.0 * mx * my;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,1,1,1],u_secondary_color:[0,0,0,1],u_wave_freq:3,u_wave_amp:.2}},{name:`Victory Gold`,uniforms:{u_primary_color:[.95,.78,.2,1],u_secondary_color:[.07,.06,.05,1],u_wave_freq:3,u_wave_amp:.35}},{name:`Ocean Flag`,uniforms:{u_primary_color:[.92,.95,.97,1],u_secondary_color:[.05,.12,.3,1],u_wave_freq:4.5,u_wave_amp:.15}},{name:`Heat Shimmer`,uniforms:{u_primary_color:[.9,.2,.08,1],u_secondary_color:[.1,.02,.02,1],u_wave_freq:6,u_wave_amp:.3,u_softness:.05}}],uniforms:[{id:`u_scale`,name:`Check Size`,type:`float`,min:2,max:20,default:8},{id:`u_wave_freq`,name:`Wave Frequency`,type:`float`,min:0,max:10,default:3},{id:`u_wave_amp`,name:`Wave Amplitude`,type:`float`,min:0,max:.8,default:.2},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.2,default:.015},{id:`u_primary_color`,name:`Checker A`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Checker B`,type:`color`,default:[0,0,0,1]}]},kd=e({default:()=>Ad}),Ad={id:`weathered_paint_artisan`,name:`Weathered Paint`,category:`Industrial`,added:`2026-04-15`,description:`Chipped and peeling paint flakes mimicking aged industrial surfaces.`,shader:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = step(0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Detail`,type:`float`,min:5,max:50,default:10},{id:`u_primary_color`,name:`Paint`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Exposed Metal`,type:`color`,default:[.3,.3,.35,1]}]},jd=e({default:()=>Md}),Md={id:`weathered_rust_pro`,name:`Weathered Rust`,category:`Industrial`,added:`2026-04-15`,description:`Pro-grade oxidizing metallic surface with realistic pitting and oxidation layers.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n1 = noise(uv);
      float n2 = noise(uv * 2.5 + n1);
      float mask = smoothstep(0.4, 0.6, n1 * 0.5 + n2 * 0.3);
      
      vec4 steel = vec4(0.4, 0.4, 0.42, 1.0);
      vec4 rust = vec4(0.5, 0.2, 0.1, 1.0);
      
      return mix(steel, rust, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rust Intensity`,type:`float`,min:1,max:20,default:5}]},Nd=e({default:()=>Pd}),Pd={id:`whale_song_spectrogram`,name:`Whale Song Spectrogram`,category:`Ocean`,added:`2026-06-11`,description:`A hydrophone spectrogram of humpback calls — sweeping harmonic arcs and low moans burning through cold analysis-grade noise.`,shader:`
    // Heat palette: black → deep violet → magma orange → white-hot
    vec3 heat_wss(float t) {
      t = clamp(t, 0.0, 1.0);
      vec3 c = mix(vec3(0.01, 0.01, 0.04), vec3(0.25, 0.04, 0.35), smoothstep(0.0, 0.30, t));
      c = mix(c, vec3(0.85, 0.25, 0.10), smoothstep(0.30, 0.62, t));
      c = mix(c, vec3(1.00, 0.80, 0.30), smoothstep(0.62, 0.85, t));
      c = mix(c, vec3(1.00, 1.00, 0.92), smoothstep(0.85, 1.0, t));
      return c;
    }

    // Energy of one call: a frequency contour with harmonics above it
    float call_wss(vec2 uv, float idx) {
      float h = hash(vec2(idx, 13.7));
      float x0 = hash(vec2(idx, 5.3));              // start time (wraps)
      float len = 0.12 + 0.20 * hash(vec2(idx, 9.1));
      float t = fract(uv.x - x0);                   // wrapped time since onset
      if (t > len) return 0.0;
      float ph = t / len;                            // 0..1 through the call

      // contour: rising moan, falling cry, or arched whoop per call
      float kind = floor(h * 3.0);
      float f0 = 0.10 + 0.30 * hash(vec2(idx, 21.9));
      float swp = 0.10 + 0.22 * hash(vec2(idx, 31.3));
      float fc = f0;
      if (kind < 1.0)      fc = f0 + swp * ph;                       // upsweep
      else if (kind < 2.0) fc = f0 + swp * (1.0 - ph);               // downsweep
      else                 fc = f0 + swp * sin(ph * 3.14159);        // arch

      // amplitude envelope: fast attack, slow release
      float env = smoothstep(0.0, 0.10, ph) * smoothstep(1.0, 0.55, ph);

      // fundamental + 3 harmonics, weakening upward
      float e = 0.0;
      for (int m = 1; m <= 4; m++) {
        float fm = fc * float(m);
        float w = 0.00045 * float(m);  // harmonics slightly broader
        float d = uv.y - fm;
        e += exp(-d * d / w) * env / (float(m) * 0.9);
      }
      return e;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- background: cold hydrophone noise floor ---
      float floor_n = fbm(uv * vec2(40.0, 14.0)) * 0.5 + 0.5;
      float hiss = noise(uv * vec2(300.0, 90.0));
      float energy = floor_n * 0.10 + hiss * 0.06;
      // low-frequency rumble band along the bottom
      energy += exp(-uv.y * 14.0) * (0.20 + 0.15 * noise(uv * vec2(60.0, 8.0)));

      // --- whale calls ---
      float n_calls = u_calls;
      for (int c = 0; c < 9; c++) {
        if (float(c) >= n_calls) break;
        energy += call_wss(uv, float(c) * 7.31 + 2.0) * u_intensity;
      }

      vec3 col = heat_wss(energy);

      // --- analysis grid: faint time and frequency rules ---
      vec3 grid_col = u_grid_color.rgb;
      float gx = smoothstep(0.012, 0.0, abs(fract(uv.x * 8.0) - 0.5) - 0.485);
      float gy = smoothstep(0.012, 0.0, abs(fract(uv.y * 6.0) - 0.5) - 0.485);
      col = mix(col, grid_col, max(gx, gy) * 0.18);

      // scanline shimmer of the display
      col *= 0.96 + 0.04 * sin(uv.y * 700.0);

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_calls`,name:`Call Count`,type:`float`,min:1,max:9,default:6},{id:`u_intensity`,name:`Signal Gain`,type:`float`,min:.3,max:2.5,default:1.2},{id:`u_grid_color`,name:`Grid Color`,type:`color`,default:[.25,.55,.65,1]}]},Fd=e({default:()=>Id}),Id={id:`wicker_weave_artisan`,name:`Wicker Weave`,category:`Natural`,added:`2026-04-15`,description:`Interlocking thick strands of woven wood found in traditional basketry.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float w = floor(uv.y);
      if (mod(w, 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Wicker Slat`,type:`color`,default:[.7,.5,.3,1]},{id:`u_secondary_color`,name:`Joint Deep`,type:`color`,default:[.2,.1,.05,1]}]},Ld=e({default:()=>Rd}),Rd={id:`wire_wound`,name:`Wire Wound`,category:`Industrial`,added:`2026-05-01`,description:`Tightly wound coil seen from above — concentric oval rings from wire turns with bright highlights and trailing-edge shadows, as in a solenoid cross-section.`,shader:`

    // Oval ring radius: slight Y compression gives wound-coil perspective
    float ovalRadius(vec2 uv) {
      vec2 p = uv - 0.5;
      // Compress Y slightly to give an oblique view of the coil axis
      p.y *= 1.35;
      return length(p);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float r = ovalRadius(uv);

      // Map radius to coil turns
      // r goes 0 (centre) to ~0.7 (corners); scale to turns count
      float rNorm = r * 2.0; // 0..1 across half-width
      float ring = fract(rNorm * u_turns);

      // Wire cross-section profile: bright lit top, dark shadow underneath
      // ring 0 = wire top (bright), ring 0.5 = gap (dark), ring ~0.8 = shadow underside
      // Smooth cosine-like profile
      float wireProfile = (cos(ring * 6.2832) * 0.5 + 0.5);

      // Shadow asymmetry — trailing edge (ring 0.5–1.0) is darker (self-shadow)
      float shadow = smoothstep(0.5, 0.85, ring) * 0.5;

      // Blend wire colour and gap colour
      // Gap is not zero — you see the gap shadow and the previous wire layer beneath
      vec3 wireCol = u_wire_color.rgb;
      vec3 gapCol  = u_gap_color.rgb;

      // Lit top
      vec3 lit    = wireCol * mix(0.75, 1.35, wireProfile);
      // Shadow fade on trailing side
      lit -= vec3(shadow * 0.35);

      // Mix wire face vs gap
      float gapMask = smoothstep(0.45, 0.55, ring); // gap at ring ~0.5
      vec3 col = mix(lit, gapCol, gapMask * 0.85);

      // Fine surface micro-noise on the wire (surface texture)
      float micro = noise(uv * 80.0) * 0.03 - 0.015;
      col += vec3(micro);

      // Vignette towards edges (coil out-of-frame)
      float vig = smoothstep(0.72, 0.48, rNorm);
      col = mix(gapCol * 0.6, col, vig);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_turns`,name:`Coil Turns`,type:`float`,min:4,max:30,default:12},{id:`u_wire_color`,name:`Wire Color`,type:`color`,default:[.75,.73,.68,1]},{id:`u_gap_color`,name:`Gap Color`,type:`color`,default:[.1,.09,.08,1]}]},zd=e({default:()=>Bd}),Bd={id:`wood_block_print_artisan`,name:`Wood Print`,category:`Abstract`,added:`2026-04-16`,description:`Coarse carved relief texture mimicking traditional wood block printing techniques.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * 80.0);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 5.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Relief High`,type:`color`,default:[.2,.2,.2,1]},{id:`u_secondary_color`,name:`Carved Wood`,type:`color`,default:[.1,.05,0,1]}]},Vd=e({default:()=>Hd}),Hd={id:`wood_grain_artisan`,name:`Wood Grain Pro`,category:`Natural`,added:`2026-04-15`,description:`High-detail procedural timber with concentric growth rings and knots.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv * 0.1);
      float ring = fract(length(uv - n * 2.0) * 5.0);
      float mask = smoothstep(0.4, 0.6, ring);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wood density`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Grain Color`,type:`color`,default:[.3,.15,.05,1]},{id:`u_secondary_color`,name:`Base Timber`,type:`color`,default:[.45,.25,.1,1]}]},Ud=e({default:()=>Wd}),Wd={id:`wood_parquet_artisan`,name:`Wood Parquet`,category:`Industrial`,added:`2026-04-15`,description:`Complex interlocking geometric floor planks for premium interior design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Mosaic Size`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Plank A`,type:`color`,default:[.5,.3,.1,1]},{id:`u_secondary_color`,name:`Plank B`,type:`color`,default:[.4,.25,.08,1]}]},Gd=e({default:()=>Kd}),Kd={id:`woodland_classic_camo`,name:`Woodland Classic Camo`,category:`Organic`,added:`2026-05-12`,description:`Classic M81 style camouflage with large organic blobs overlapping each other.`,shader:`
    

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      
      float n1 = fbm(uv);
      float n2 = fbm(uv + vec2(5.2, 1.3));
      float n3 = fbm(uv + vec2(10.1, -3.4));
      
      vec4 color = u_color_base;
      if (n1 > 0.1) color = u_color_1;
      if (n2 > 0.3) color = u_color_2;
      if (n3 > 0.5) color = u_color_3;
      
      return color;
    }
  `,variants:[{name:`Classic Woodland`,uniforms:{u_color_base:[.63,.56,.45,1],u_color_1:[.28,.35,.22,1],u_color_2:[.35,.26,.18,1],u_color_3:[.08,.08,.08,1]}},{name:`Desert Recon`,uniforms:{u_color_base:[.82,.75,.61,1],u_color_1:[.73,.62,.47,1],u_color_2:[.55,.44,.31,1],u_color_3:[.35,.25,.15,1]}},{name:`Urban Stealth`,uniforms:{u_color_base:[.7,.7,.75,1],u_color_1:[.45,.45,.5,1],u_color_2:[.25,.25,.3,1],u_color_3:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.14,1],u_color_1:[.08,.08,.1,1],u_color_2:[.04,.04,.05,1],u_color_3:[.01,.01,.01,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base (Tan)`,type:`color`,default:[.63,.56,.45,1]},{id:`u_color_1`,name:`Layer 1 (Green)`,type:`color`,default:[.28,.35,.22,1]},{id:`u_color_2`,name:`Layer 2 (Brown)`,type:`color`,default:[.35,.26,.18,1]},{id:`u_color_3`,name:`Layer 3 (Black)`,type:`color`,default:[.08,.08,.08,1]}]},qd=e({default:()=>Jd}),Jd={id:`wormhole_tunnel`,name:`Wormhole Tunnel`,category:`Cosmos`,added:`2026-06-11`,description:`Staring down a spacetime throat — twisting concentric energy rings telescoping toward a blinding singularity, walls streaked with infalling starlight.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv) - 0.5;
      float r = length(uv) * 2.0;
      float theta = atan(uv.y, uv.x);

      // --- Tunnel coordinate: 1/r gives infinite telescoping depth ---
      float depth = 1.0 / max(r, 0.02);
      // Twist: angle shears with depth so rings corkscrew inward
      float twTheta = theta + depth * u_twist * 0.35;

      // --- Concentric ring structure marching down the throat ---
      float ringPh = fract(depth * u_ring_density * 0.35);
      float rings = smoothstep(0.0, 0.35, ringPh) * smoothstep(0.85, 0.5, ringPh);
      // Secondary fine ribs between major rings
      float ribs = pow(abs(sin(depth * u_ring_density * 2.2)), 6.0);

      // --- Wall streaks: starlight smeared along the infall direction ---
      float streaks = noise(vec2(twTheta * 6.0, depth * 1.4));
      float fineStreaks = noise(vec2(twTheta * 18.0 + 31.0, depth * 2.6));
      float wallTex = streaks * 0.6 + fineStreaks * 0.4;

      // Turbulent energy sheets rippling around the wall
      float sheets = fbm(vec2(twTheta * 2.0, depth * 0.8)) * 0.5 + 0.5;

      // --- Depth fading: far rings dim and compress ---
      float fade = exp(-r * 0.8) * smoothstep(0.025, 0.12, r);

      // --- Palette ---
      vec3 voidCol  = vec3(0.010, 0.008, 0.030);
      vec3 ringCol  = u_energy_color.rgb;            // electric ring energy
      vec3 deepCol  = ringCol * vec3(0.35, 0.30, 0.8); // colour-shifted depths
      vec3 white    = vec3(1.0, 0.98, 0.95);

      vec3 col = voidCol;

      // Wall glow: sheets of energy coloured by depth
      vec3 wall = mix(ringCol, deepCol, clamp(depth * 0.12, 0.0, 1.0));
      col += wall * sheets * fade * 0.55;

      // Major rings: bright hoops with streak modulation
      col += ringCol * rings * fade * (0.6 + 0.7 * wallTex) * 1.3;
      col += deepCol * ribs * fade * 0.45;

      // Starlight filaments smeared along the walls
      col += white * pow(wallTex, 3.0) * fade * 0.55;

      // --- Singularity: blinding core with chromatic bloom ---
      float core = exp(-r * r * 90.0);
      float bloom = exp(-r * 4.5);
      col += white * core * 2.4;
      col += mix(ringCol, white, 0.5) * bloom * 0.7;

      // Outer mouth: lensed starfield stretched into arcs around the rim
      float rim = smoothstep(0.75, 1.0, r);
      float arcs = smoothstep(0.92, 1.0, noise(vec2(theta * 10.0, r * 6.0)));
      col += vec3(0.75, 0.82, 1.0) * arcs * rim * 0.8;

      // Outside the mouth: calm space with sparse stars
      vec2 sg = floor(v_uv * 80.0);
      float star = smoothstep(0.97, 1.0, hash(sg + 4.4)) *
                   smoothstep(0.09, 0.0, length(fract(v_uv * 80.0) - vec2(hash(sg), hash(sg + 19.0))));
      col += vec3(0.8, 0.85, 1.0) * star * rim;

      return vec4(col, 1.0);
    }
  `,uniforms:[{id:`u_ring_density`,name:`Ring Density`,type:`float`,min:1,max:8,default:3},{id:`u_twist`,name:`Throat Twist`,type:`float`,min:0,max:4,default:1.5},{id:`u_energy_color`,name:`Energy Hue`,type:`color`,default:[.3,.65,1,1]}]},Yd=e({default:()=>Xd}),Xd={id:`worn_asphalt`,name:`Worn Asphalt`,category:`Racing`,added:`2026-05-01`,description:`Heavily worn racing asphalt with exposed aggregate, oil-stained patches, crack lines, and rubber marbling from racing tyres.`,shader:`
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    // Crack lines — thin dark lines following noise gradient breaks
    float crackMap(vec2 uv, float density) {
      // Use fbm derivatives to find steep gradients = cracks
      vec2 q = uv * density;
      float f1 = fbm(q);
      float f2 = fbm(q + vec2(0.01, 0.0));
      float f3 = fbm(q + vec2(0.0, 0.01));
      float grad = length(vec2(f2 - f1, f3 - f1)) * 80.0;
      // Crack = high gradient region
      return smoothstep(0.6, 1.2, grad);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- Base worn asphalt ---
      // Exposed aggregate: lighter grey where tar is worn away
      float wearMap = fbm(uv * 3.5);
      wearMap = smoothstep(0.35, 0.65, wearMap);
      // Apply wear amount — u_wear 1.0 = maximum exposure
      float aggregateExpose = wearMap * u_wear;

      // Aggregate colour is lighter (stone grey) vs tar (dark)
      vec3 tarColor       = u_base_color.rgb;
      vec3 aggregateColor = u_base_color.rgb * 1.45 + vec3(0.05, 0.05, 0.04);

      vec3 col = mix(tarColor, aggregateColor, aggregateExpose);

      // Fine asphalt grain noise
      float grain = noise(uv * 200.0) * 0.07 - 0.035;
      col += vec3(grain);

      // --- Oil stains ---
      // Dark, slightly iridescent patches; positioned by low-freq noise
      float oilMap = fbm(uv * 2.2 + vec2(3.1, 7.4));
      oilMap = smoothstep(0.58, 0.72, oilMap) * u_wear * 0.8;
      // Oil is very dark with slight rainbow shimmer (handled as dark brownish)
      vec3 oilColor = vec3(0.07, 0.065, 0.05);
      col = mix(col, oilColor, oilMap);
      // Faint iridescent tinge at oil edges
      float oilEdge = smoothstep(0.55, 0.58, fbm(uv * 2.2 + vec2(3.1, 7.4)));
      col += vec3(oilEdge * 0.03, oilEdge * 0.02, oilEdge * 0.04) * u_wear;

      // --- Rubber marbling from tyres ---
      // Dark rubber smears — streaky near the racing line (varies with Y mostly)
      float rubberMap = fbm(vec2(uv.x * 6.0, uv.y * 2.0) + vec2(1.7, 0.9));
      rubberMap = smoothstep(0.58, 0.70, rubberMap) * u_wear * 0.65;
      vec3 rubberColor = vec3(0.06, 0.055, 0.05);
      col = mix(col, rubberColor, rubberMap);

      // --- Crack lines ---
      float cracks = crackMap(uv, u_crack_density) * u_wear;
      // Cracks are very dark, thin
      col = mix(col, vec3(0.05, 0.05, 0.04), cracks * 0.85);

      // --- Patch repairs (occasional lighter grey patches) ---
      float patch = fbm(uv * 1.8 + vec2(5.5, 2.2));
      patch = step(0.70, patch) * step(patch, 0.75) * u_wear * 0.5;
      vec3 patchColor = vec3(0.35, 0.34, 0.33);
      col = mix(col, patchColor, patch);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,uniforms:[{id:`u_wear`,name:`Wear Level`,type:`float`,min:0,max:1,default:.7},{id:`u_base_color`,name:`Asphalt Base`,type:`color`,default:[.28,.27,.26,1]},{id:`u_crack_density`,name:`Crack Density`,type:`float`,min:1,max:10,default:4}]},Zd=e({default:()=>Qd}),Qd={id:`woven_fiberglass`,name:`Woven Fiberglass`,category:`Industrial`,added:`2026-04-30`,description:`E-glass plain-weave fiberglass cloth with cream tow bundles, glass-sheen highlights, and amber resin pockets.`,shader:`
    // Smooth Hermite profile for a tow cross-section.
    // Returns 1.0 at the crown (phase == 0) and 0.0 at the flanks.
    float towProfile(float phase) {
      float c = cos(phase * 3.14159265);
      return clamp(c * 0.5 + 0.5, 0.0, 1.0);
    }

    // High-freq hash for fine fiber surface noise
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv * u_weave_scale;

      // ---- Warp tows (running along Y, repeat in X) ----
      float warpPhase = fract(uv.x);           // 0-1 across each warp tow column
      float warpHeight = towProfile(warpPhase * 2.0 - 1.0); // crown at x=0.5

      // Over-under interlace: warp tow rises and sinks based on weft grid cell parity
      float weftCell = floor(uv.y);
      float warpInterlace = mod(weftCell, 2.0) < 1.0 ? 1.0 : 0.0;
      // Height of warp tow above surface: high when warpInterlace=1
      float warpZ = warpHeight * mix(0.3, 1.0, warpInterlace);

      // ---- Weft tows (running along X, repeat in Y) ----
      float weftPhase = fract(uv.y);
      float weftHeight = towProfile(weftPhase * 2.0 - 1.0);

      float warpCell = floor(uv.x);
      float weftInterlace = mod(warpCell, 2.0) < 1.0 ? 0.0 : 1.0;
      float weftZ = weftHeight * mix(0.3, 1.0, weftInterlace);

      // ---- Determine which tow is on top ----
      // Whichever tow has higher Z wins the pixel; blend gently near crossover
      float zDiff = warpZ - weftZ;
      float blend = smoothstep(-0.15, 0.15, zDiff); // 1 = warp on top, 0 = weft on top
      float topZ   = mix(weftZ, warpZ, blend);

      // ---- Specular highlight on tow crown ----
      // Crown of the top tow catches light
      float spec = pow(clamp(topZ, 0.0, 1.0), 3.0) * u_sheen;

      // ---- Fine fiber surface noise ----
      float fiberNoise = noise(uv * 6.0) * 0.04 - 0.02;

      // ---- Resin pocket brightness ----
      // Where both tows are low (intersection valleys), resin is visible
      float resinMask = (1.0 - clamp(warpZ + weftZ, 0.0, 1.0));
      resinMask = pow(resinMask, 3.0);

      // ---- Compose colors ----
      vec3 fiberCol = u_fiber_color.rgb + fiberNoise;
      vec3 col = mix(fiberCol, u_resin_color.rgb, resinMask * 0.7);

      // Add glass-sheen specular highlight (white-ish)
      col += vec3(spec * 0.55, spec * 0.55, spec * 0.58);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_fiber_color.a * u_opacity);
    }
  `,uniforms:[{id:`u_weave_scale`,name:`Weave Scale`,type:`float`,min:2,max:30,default:12},{id:`u_fiber_color`,name:`Fiber Color`,type:`color`,default:[.88,.88,.84,1]},{id:`u_resin_color`,name:`Resin Color`,type:`color`,default:[.55,.52,.47,1]},{id:`u_sheen`,name:`Glass Specularity`,type:`float`,min:0,max:2,default:1}]},$d=e({default:()=>ef}),ef={id:`zebra_camo_v2_artisan`,name:`Zebra Camo v2`,category:`Abstract`,added:`2026-04-15`,description:`High-contrast geometric distortion variant of precision camouflages.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x + sin(uv.y * 2.0)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`High Contrast (Default)`,uniforms:{u_primary_color:[0,0,0,1],u_secondary_color:[1,1,1,1]}},{name:`Blackout Stealth`,uniforms:{u_primary_color:[.02,.02,.02,1],u_secondary_color:[.15,.15,.15,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Stripe A`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Stripe B`,type:`color`,default:[1,1,1,1]}]};export{ru as $,te as $a,tn as $i,no as $n,ni as $r,rc as $t,Yu as A,qe as Aa,Jn as Ai,Yo as An,Ji as Ar,Yc as At,ku as B,De as Ba,On as Bi,ko as Bn,Oi as Br,kc as Bt,ld as C,st as Ca,cr as Ci,ls as Cn,s as Co,ca as Cr,ll as Ct,td as D,$e as Da,er as Di,ts as Dn,ea as Dr,tl as Dt,rd as E,tt as Ea,nr as Ei,rs as En,t as Eo,na as Er,rl as Et,zu as F,Le as Fa,Rn as Fi,zo as Fn,Ri as Fr,zc as Ft,yu as G,_e as Ga,vn as Gi,yo as Gn,vi as Gr,yc as Gt,Tu as H,Ce as Ha,wn as Hi,To as Hn,wi as Hr,Tc as Ht,Lu as I,Fe as Ia,In as Ii,Lo as In,Ii as Ir,Lc as It,pu as J,de as Ja,fn as Ji,po as Jn,fi as Jr,pc as Jt,_u as K,he as Ka,gn as Ki,_o as Kn,gi as Kr,_c as Kt,Fu as L,Ne as La,Pn as Li,Fo as Ln,Pi as Lr,Fc as Lt,Gu as M,Ue as Ma,Wn as Mi,Go as Mn,Wi as Mr,Gc as Mt,Uu as N,Ve as Na,Hn as Ni,Uo as Nn,Hi as Nr,Uc as Nt,$u as O,Ze as Oa,Qn as Oi,$o as On,Qi as Or,$c as Ot,Vu as P,ze as Pa,Bn as Pi,Vo as Pn,Bi as Pr,Vc as Pt,au as Q,re as Qa,rn as Qi,io as Qn,ii as Qr,ac as Qt,Nu as R,je as Ra,Mn as Ri,No as Rn,Mi as Rr,Nc as Rt,dd as S,lt as Sa,ur as Si,ds as Sn,l as So,ua as Sr,dl as St,ad as T,rt as Ta,ir as Ti,as as Tn,r as To,ia as Tr,al as Tt,Cu as U,xe as Ua,Sn as Ui,Co as Un,Si as Ur,Cc as Ut,Du as V,Te as Va,En as Vi,Do as Vn,Ei as Vr,Dc as Vt,xu as W,ye as Wa,bn as Wi,xo as Wn,bi as Wr,xc as Wt,lu as X,se as Xa,cn as Xi,co as Xn,ci as Xr,lc as Xt,du as Y,le as Ya,un as Yi,uo as Yn,ui as Yr,dc as Yt,su as Z,ae as Za,on as Zi,oo as Zn,oi as Zr,sc as Zt,xd as _,yt as _a,br as _i,xs as _n,y as _o,ba as _r,xl as _t,Gd as a,Ut as aa,Wr as ai,Gs as an,U as ao,Wa as ar,Gl as at,hd as b,pt as ba,mr as bi,hs as bn,p as bo,ma as br,hl as bt,zd as c,Lt as ca,Rr as ci,zs as cn,L as co,Ra as cr,zl as ct,Nd as d,jt as da,Mr as di,Ns as dn,j as do,Ma as dr,Nl as dt,$t as ea,ei,tc as en,$ as eo,eo as er,tu as et,jd as f,kt as fa,Ar as fi,js as fn,k as fo,Aa as fr,jl as ft,Cd as g,xt as ga,Sr as gi,Cs as gn,x as go,Sa as gr,Cl as gt,Td as h,Ct as ha,wr as hi,Ts as hn,C as ho,wa as hr,Tl as ht,qd as i,Gt as ia,Kr as ii,qs as in,G as io,Ka as ir,ql as it,qu as j,Ge as ja,Kn as ji,qo as jn,Ki as jr,qc as jt,Zu as k,Ye as ka,Xn as ki,Zo as kn,Xi as kr,Zc as kt,Ld as l,Ft as la,Ir as li,Ls as ln,F as lo,Ia as lr,Ll as lt,Dd as m,Tt as ma,Er as mi,Ds as mn,T as mo,Ea as mr,Dl as mt,Zd as n,Yt as na,Xr as ni,Zs as nn,Y as no,Xa as nr,Zl as nt,Ud as o,Vt as oa,Hr as oi,Us as on,V as oo,Ha as or,Ul as ot,kd as p,Dt as pa,Or as pi,ks as pn,D as po,Oa as pr,kl as pt,hu as q,pe as qa,mn as qi,ho as qn,mi as qr,hc as qt,Yd as r,qt as ra,Jr as ri,Ys as rn,q as ro,Ja as rr,Yl as rt,Vd as s,zt as sa,Br as si,Vs as sn,z as so,Ba as sr,Vl as st,$d as t,Zt as ta,Qr as ti,$s as tn,Z as to,Qa as tr,$l as tt,Fd as u,Nt as ua,Pr as ui,Fs as un,N as uo,Pa as ur,Fl as ut,yd as v,_t as va,vr as vi,ys as vn,_ as vo,va as vr,yl as vt,sd as w,at as wa,or as wi,ss as wn,a as wo,oa as wr,sl as wt,pd as x,dt as xa,fr as xi,ps as xn,d as xo,fa as xr,pl as xt,_d as y,ht as ya,gr as yi,_s as yn,h as yo,ga as yr,_l as yt,ju as z,ke as za,An as zi,jo as zn,Ai as zr,jc as zt};
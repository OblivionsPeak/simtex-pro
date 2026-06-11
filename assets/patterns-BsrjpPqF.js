import{n as e}from"./rolldown-runtime-Dw2cE7zH.js";var t=e({default:()=>n}),n={id:`acid_etch_artisan`,name:`Acid Etch`,category:`Industrial`,added:`2026-04-15`,description:`High-contrast stylized chemical erosion patterns found in weathered metals.`,shader:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Acid Detail`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Etch Deep`,type:`color`,default:[.15,.12,.1,1]},{id:`u_secondary_color`,name:`Original Plane`,type:`color`,default:[.4,.4,.45,1]}]},r=e({default:()=>i}),i={id:`aero_ablative_coating_artisan`,name:`Aero-Ablative Coating`,category:`Racing`,added:`2026-05-13`,description:`A smooth surface that sheds layers under high velocity, showing directional wind streak lines and gradient wear.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Streak Scale`,type:`float`,min:1,max:20,default:5},{id:`u_base_color`,name:`Pristine Coating`,type:`color`,default:[.9,.9,.95,1]},{id:`u_ablated_color`,name:`Ablated Core`,type:`color`,default:[.2,.2,.25,1]},{id:`u_wear_offset`,name:`Wear Offset`,type:`float`,min:0,max:10,default:0}]},a=e({default:()=>o}),o={id:`aero_riblets`,name:`Aerodynamic Riblets`,category:`Racing`,added:`2026-05-13`,description:`Microscale V-groove riblets machined into aerodynamic surfaces to reduce turbulent drag — as used on F1 cars, aircraft, and high-performance bodywork.`,shader:`
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
  `,uniforms:[{id:`u_surface_color`,name:`Surface Colour`,type:`color`,default:[.72,.72,.74,1]},{id:`u_density`,name:`Riblet Density`,type:`float`,default:120,min:20,max:400},{id:`u_angle`,name:`Direction`,type:`float`,default:0,min:-.5,max:.5},{id:`u_sharpness`,name:`Ridge Sharpness`,type:`float`,default:.7,min:.1,max:1}]},s=e({default:()=>c}),c={id:`alcantara_suede_artisan`,name:`Alcantara Suede`,category:`Racing`,added:`2026-04-16`,description:`Soft, directional fiber nap mimicking professional racing steering wheels and seats.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 0.5);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Fiber Density`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Fiber Top`,type:`color`,default:[.2,.2,.22,1]},{id:`u_secondary_color`,name:`Fiber Base`,type:`color`,default:[.1,.1,.1,1]}]},l=e({default:()=>u}),u={id:`amethyst_natural`,name:`Amethyst Crystal`,category:`Natural`,added:`2026-05-01`,description:`Amethyst crystal cluster cross-section with elongated Voronoi cells, anisotropic face shading, and lavender-to-violet color range.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Crystal Density`,type:`float`,min:2,max:12,default:6},{id:`u_color_light`,name:`Pale Amethyst`,type:`color`,default:[.78,.55,.9,1]},{id:`u_color_deep`,name:`Deep Violet`,type:`color`,default:[.32,.08,.55,1]}]},d=e({default:()=>f}),f={id:`anodized_blue`,name:`Anodized Blue`,category:`Industrial`,added:`2026-04-30`,description:`Anodized aluminum in deep cobalt/sapphire blue with subtle directional streaking from the anodizing bath.`,shader:`

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
  `,uniforms:[{id:`u_shade`,name:`Shade`,type:`float`,min:0,max:1,default:.5},{id:`u_streak`,name:`Streak Frequency`,type:`float`,min:1,max:10,default:4}]},p=e({default:()=>m}),m={id:`anodized_bronze`,name:`Anodized Bronze`,category:`Industrial`,added:`2026-04-30`,description:`Anodized aluminum in a warm bronze/gold tone with micro-grain texture and subtle colour banding from bath imperfections.`,shader:`
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
  `,uniforms:[{id:`u_tone`,name:`Tone`,type:`float`,min:0,max:1,default:.6},{id:`u_grain`,name:`Micro Grain`,type:`float`,min:.5,max:8,default:3}]},h=e({default:()=>g}),g={id:`anodized_red`,name:`Anodized Red`,category:`Industrial`,added:`2026-05-01`,description:`Red anodized aluminum in cherry/crimson with a smooth satin finish and subtle micro-streaks from the anodizing bath process.`,shader:`
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
  `,uniforms:[{id:`u_shade`,name:`Shade`,type:`float`,min:0,max:1,default:.5},{id:`u_streak`,name:`Streak`,type:`float`,min:1,max:10,default:4},{id:`u_red_tone`,name:`Red Tone`,type:`color`,default:[.78,.06,.06,1]}]},_=e({default:()=>v}),v={id:`anodized_titanium_artisan`,name:`Anodized Titanium`,category:`Industrial`,added:`2026-04-16`,description:`Multi-colored prismatic heat distribution and electrochemical finish for high-performance components.`,shader:`
    vec4 generate() {
      float n = v_uv.x + v_uv.y;
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      return vec4(col, 1.0);
    }
  `,uniforms:[]},y=e({default:()=>b}),b={id:`apex_curbing_artisan`,name:`Track Curbing`,category:`Racing`,added:`2026-04-15`,description:`Classic circuit apex curbing with tire wear marks.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x));
      float wear = hash(v_uv * 10.0) * 0.2;
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      color.rgb -= wear;
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Curb Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Color A`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Color B`,type:`color`,default:[1,1,1,1]}]},x=e({default:()=>S}),S={id:`argyle_knit_artisan`,name:`Argyle Knit`,category:`Abstract`,added:`2026-04-15`,description:`Classic diamond-checkered textile pattern with structural crossing threads.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Diamond Zoom`,type:`float`,min:2,max:20,default:6},{id:`u_primary_color`,name:`Primary Knit`,type:`color`,default:[.1,.2,.4,1]},{id:`u_secondary_color`,name:`Secondary Knit`,type:`color`,default:[.15,.25,.5,1]}]},C=e({default:()=>w}),w={id:`armco_barrier`,name:`Armco Barrier`,category:`Racing`,added:`2026-05-13`,description:`Corrugated W-beam steel Armco safety barrier as found lining every racing circuit — with bolt holes, panel seams, and galvanized steel surface.`,shader:`
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
  `,uniforms:[{id:`u_paint_color`,name:`Steel Colour`,type:`color`,default:[.75,.77,.74,1]},{id:`u_beam_scale`,name:`Beam Scale`,type:`float`,default:3.5,min:1,max:8},{id:`u_panel_repeat`,name:`Panel Width`,type:`float`,default:2.5,min:1,max:6},{id:`u_weathering`,name:`Weathering`,type:`float`,default:.2,min:0,max:1}]},T=e({default:()=>E}),E={id:`asphalt_pro_artisan`,name:`Asphalt Pro`,category:`Racing`,added:`2026-04-15`,description:`High-detail granular road surface noise found on professional track layouts.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Detail`,type:`float`,min:100,max:1e3,default:400},{id:`u_primary_color`,name:`Stone Grey`,type:`color`,default:[.3,.3,.32,1]},{id:`u_secondary_color`,name:`Tar Base`,type:`color`,default:[.1,.1,.12,1]}]},D=e({default:()=>O}),O={id:`autumn_leaves_artisan`,name:`Fallen Leaves`,category:`Natural`,added:`2026-04-16`,description:`Clumped organic leaf-like shapes mimicking a forest floor in autumn.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.7, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Leaf Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Maple Red`,type:`color`,default:[.8,.2,.1,1]},{id:`u_secondary_color`,name:`Damp Soil`,type:`color`,default:[.2,.1,.05,1]}]},k=e({default:()=>A}),A={id:`banded_agate_artisan`,name:`Banded Agate`,category:`Geology`,added:`2026-04-16`,description:`Concentric mineral rings and gemstone strata found in polished agate slices.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Band Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Gemstone Top`,type:`color`,default:[.4,.2,.5,1]},{id:`u_secondary_color`,name:`Mineral Deep`,type:`color`,default:[.2,.1,.3,1]}]},j=e({default:()=>M}),M={id:`barbed_wire_artisan`,name:`Barbed Wire`,category:`Industrial`,added:`2026-04-15`,description:`Twisted metal strands and sharp interlocking barbs for security motifs.`,shader:`
    vec4 generate() {
      float wire = abs(sin(v_uv.y * 50.0 + v_uv.x * 10.0));
      float barb = step(0.95, fract(v_uv.x * 10.0)) * step(0.9, wire);
      float mask = smoothstep(0.1, 0.0, wire - 0.1) + barb;
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Steel`,type:`color`,default:[.6,.6,.65,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.1,.1,.1,0]}]},N=e({default:()=>P}),P={id:`bioluminescent_mycelium_artisan`,name:`Bioluminescent Mycelium`,category:`Organic`,added:`2026-05-13`,description:`Glowing fungal networks pulsing with neon light against a dark, porous substrate.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Network Scale`,type:`float`,min:2,max:20,default:8},{id:`u_bg_dark`,name:`Substrate Deep`,type:`color`,default:[.05,.08,.05,1]},{id:`u_bg_light`,name:`Substrate Surface`,type:`color`,default:[.15,.2,.15,1]},{id:`u_glow_color`,name:`Bioluminescence`,type:`color`,default:[.2,1,.5,1]},{id:`u_pulse`,name:`Pulse Animate`,type:`float`,min:0,max:100,default:0}]},F=e({default:()=>I}),I={id:`bird_plumage_artisan`,name:`Bird Plumage`,category:`Natural`,added:`2026-04-15`,description:`Soft, overlapping organic feather vane shapes found in avian wings.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 0.8));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Feather Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Feather Vane`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Shaft`,type:`color`,default:[.05,.05,.05,1]}]},L=e({default:()=>R}),R={id:`bismuth_crystal_natural`,name:`Bismuth Crystal`,category:`Natural`,added:`2026-05-01`,description:`Iridescent metallic bismuth hopper crystals with staircase terraced surfaces and rainbow oxide interference colors.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Crystal Scale`,type:`float`,min:1,max:10,default:4},{id:`u_iridescence`,name:`Iridescence`,type:`float`,min:.5,max:2,default:1.4},{id:`u_metal_base`,name:`Metal Base Color`,type:`color`,default:[.68,.62,.58,1]}]},z=e({default:()=>B}),B={id:`bismuth_labyrinth_artisan`,name:`Bismuth Labyrinth`,category:`Natural`,added:`2026-05-13`,description:`Right-angled, stair-step crystal growth with extreme iridescent oxide layer coloring.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Crystal Size`,type:`float`,min:2,max:30,default:10},{id:`u_color_a`,name:`Oxide Pink`,type:`color`,default:[.9,.2,.6,1]},{id:`u_color_b`,name:`Oxide Gold`,type:`color`,default:[.8,.7,.1,1]},{id:`u_color_c`,name:`Oxide Blue`,type:`color`,default:[.1,.4,.9,1]},{id:`u_phase`,name:`Growth Phase`,type:`float`,min:0,max:100,default:0}]},V=e({default:()=>H}),H={id:`blueprint_grid_tech`,name:`Blueprint Grid`,category:`Technology`,added:`2026-04-15`,description:`Technical structural alignment grid.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_line_color:[0,.8,1,1],u_paper_color:[.02,.05,.15,1],u_line_width:.02,u_minor_strength:0}},{name:`Drafting White`,uniforms:{u_line_color:[.25,.35,.55,1],u_paper_color:[.93,.94,.96,1],u_line_width:.015,u_minor_strength:.6}},{name:`Redline`,uniforms:{u_line_color:[.78,.12,.1,1],u_paper_color:[.96,.93,.86,1],u_line_width:.018,u_minor_strength:.45}},{name:`Phosphor`,uniforms:{u_line_color:[.2,1,.4,1],u_paper_color:[.01,.03,.01,1],u_line_width:.025,u_minor_strength:.7}}],uniforms:[{id:`u_scale`,name:`Grid Count`,type:`float`,min:5,max:100,default:20},{id:`u_line_width`,name:`Line Width`,type:`float`,min:.005,max:.1,default:.02},{id:`u_minor_div`,name:`Minor Subdivisions`,type:`float`,min:2,max:10,default:5},{id:`u_minor_strength`,name:`Minor Grid Strength`,type:`float`,min:0,max:1,default:0},{id:`u_line_color`,name:`Grid Line`,type:`color`,default:[0,.8,1,1]},{id:`u_paper_color`,name:`Paper`,type:`color`,default:[.02,.05,.15,1]}]},U=e({default:()=>W}),W={id:`bone_pores_artisan`,name:`Bone Pores`,category:`Natural`,added:`2026-04-15`,description:`Porous trabecular organic network found in skeletal sections.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Porosity Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Bone White`,type:`color`,default:[.95,.95,.9,1]},{id:`u_secondary_color`,name:`Pore Void`,type:`color`,default:[.1,.05,0,1]}]},G=e({default:()=>K}),K={id:`braided_cord_artisan`,name:`Braided Cord`,category:`Industrial`,added:`2026-04-15`,description:`Overlapping thick strands of woven tactical rope found in automotive and maritime gear.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Braid Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Strand Top`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Seam Shadow`,type:`color`,default:[.05,.05,.1,1]}]},q=e({default:()=>J}),J={id:`brain_coral_pro`,name:`Brain Coral`,category:`Natural`,added:`2026-04-15`,description:`Labyrinthine organic structure mimicking undersea brain coral.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv);
      float maze = abs(sin(n * 20.0 + uv.x * 2.0));
      float mask = smoothstep(0.4, 0.5, maze);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Folding Size`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Ridge`,type:`color`,default:[1,.8,.8,1]},{id:`u_secondary_color`,name:`Deep Crevice`,type:`color`,default:[.4,.1,.2,1]}]},Y=e({default:()=>X}),X={id:`brake_dust_artisan`,name:`Brake Dust`,category:`Racing`,added:`2026-04-16`,description:`Fine anisotropic dark grit and metallic shavings found on race-worn wheel rims.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Dust Fleck`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Base Rim`,type:`color`,default:[.3,.3,.32,1]}]},Z=e({default:()=>Q}),Q={id:`brake_rotor_wear_artisan`,name:`Brake Rotor Wear`,category:`Racing`,added:`2026-04-16`,description:`Circular friction streaks and heat scarring found on high-performance ceramic and steel rotors.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float streaks = hash(floor(d * u_scale));
      return mix(u_secondary_color, u_primary_color, streaks);
    }
  `,uniforms:[{id:`u_scale`,name:`Wear Density`,type:`float`,min:200,max:2e3,default:1e3},{id:`u_primary_color`,name:`Metal Body`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Scuff Mark`,type:`color`,default:[.5,.5,.55,1]}]},$=e({default:()=>ee}),ee={id:`brake_rotors_artisan`,name:`Brake Rotors`,category:`Industrial`,added:`2026-04-15`,description:`Concentric heat-etched metal grooves found on high-performance brake discs.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float r = length(uv);
      float mask = sin(r * 100.0 * (1.0 + u_intensity)) * 0.5 + 0.5;
      mask *= step(0.1, r) * step(r, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_intensity`,name:`Groove Density`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Etched Steel`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Burnish`,type:`color`,default:[.2,.2,.25,1]}]},te=e({default:()=>ne}),ne={id:`brick_masonry_artisan`,name:`Classic Bricks`,category:`Industrial`,added:`2026-04-15`,description:`Staggered rectangular masonry with structural mortar joints.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      
      vec2 gv = fract(uv);
      float mask = step(0.05, gv.x) * step(gv.x, 0.95) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rows`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Brick`,type:`color`,default:[.7,.2,.1,1]},{id:`u_secondary_color`,name:`Mortar`,type:`color`,default:[.4,.4,.4,1]}]},re=e({default:()=>ie}),ie={id:`brushed_aluminum_artisan`,name:`Brushed Metal`,category:`Industrial`,added:`2026-04-15`,description:`High-frequency linear streaks mimicking professional metal brushing and finishing.`,shader:`
    vec4 generate() {
      float n = hash(vec2(v_uv.y * 1000.0, 0.0));
      vec4 col = mix(u_secondary_color, u_primary_color, n);
      if (u_is_spec > 0.5) {
        // Brushed metal: fully metallic, anisotropic-feel roughness following streak intensity
        return vec4(0.9, mix(0.3, 0.5, n), 0.0, col.a);
      }
      return col;
    }
  `,uniforms:[{id:`u_primary_color`,name:`Grain`,type:`color`,default:[.8,.8,.82,1]},{id:`u_secondary_color`,name:`Base Metal`,type:`color`,default:[.6,.6,.65,1]}]},ae=e({default:()=>oe}),oe={id:`brushed_gold`,name:`Brushed Gold`,category:`Industrial`,added:`2026-05-01`,description:`Directional brushed gold metal with fine horizontal linear grain and a subtle specular sheen, as found on machined jewelry and trim.`,shader:`

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
  `,uniforms:[{id:`u_grain`,name:`Grain Frequency`,type:`float`,min:10,max:150,default:60},{id:`u_base_color`,name:`Base Gold`,type:`color`,default:[.85,.68,.18,1]},{id:`u_sheen`,name:`Sheen`,type:`float`,min:0,max:1,default:.5}]},se=e({default:()=>ce}),ce={id:`bubblewrap`,name:`Bubble Wrap`,category:`Abstract`,added:`2026-05-01`,description:`Air-filled plastic bubble wrap with hemispherical highlights, rim Fresnel, and clear film between bubbles.`,shader:`
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
  `,uniforms:[{id:`u_bubble_size`,type:`float`,default:14,min:4,max:30,name:`Bubble Scale`},{id:`u_film_color`,type:`color`,default:[.88,.9,.82,1],name:`Plastic Film`},{id:`u_tint`,type:`color`,default:[.75,.85,.92,1],name:`Bubble Tint`}]},le=e({default:()=>ue}),ue={id:`burlap_sack_artisan`,name:`Burlap Sack`,category:`Abstract`,added:`2026-04-15`,description:`Coarse, wide-gap organic woven fibers used in heavy storage bags.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float h = step(0.7, fract(uv.x)) + step(0.7, fract(uv.y));
      float mask = clamp(h, 0.0, 1.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fibre Size`,type:`float`,min:5,max:40,default:15},{id:`u_primary_color`,name:`Fibre`,type:`color`,default:[.6,.5,.35,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[.15,.1,.05,1]}]},de=e({default:()=>fe}),fe={id:`butterfly_wing_artisan`,name:`Chitin Scale`,category:`Natural`,added:`2026-04-16`,description:`Microscopic chitinous scales mimicking the vibrant iridescent patterns of exotic lepidoptera.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.1, f_uv.x) * step(f_uv.x, 0.9) * step(0.1, f_uv.y) * step(f_uv.y, 0.9);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (v_uv.x + v_uv.y + vec3(0, 0.33, 0.67)));
      return vec4(col * mask, 1.0);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:20,max:200,default:80}]},pe=e({default:()=>me}),me={id:`cactus_needles_artisan`,name:`Cactus Spine`,category:`Natural`,added:`2026-04-16`,description:`Geometric star-cluster spines found on high-fidelity xerophytic vegetation.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Spine Clusters`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Sharp Needle`,type:`color`,default:[.9,.9,.8,1]},{id:`u_secondary_color`,name:`Cactus Base`,type:`color`,default:[.2,.4,.1,1]}]},he=e({default:()=>ge}),ge={id:`candy_paint`,name:`Candy Paint`,category:`Racing`,added:`2026-04-30`,description:`Deep glossy candy-coat automotive paint with a saturated translucent hue over a dark metallic base.`,shader:`

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
  `,uniforms:[{id:`u_hue`,name:`Hue`,type:`float`,min:0,max:1,default:.02},{id:`u_depth`,name:`Depth`,type:`float`,min:.5,max:3,default:1.5}]},_e=e({default:()=>ve}),ve={id:`canvas_rip_artisan`,name:`Canvas Rip`,category:`Abstract`,added:`2026-04-15`,description:`Rough, crossing threads with a torn opening mimicking shredded heavy canvas.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = step(0.8, hash(floor(uv.xx * 2.0))) * step(0.8, hash(floor(uv.yy * 2.0)));
      float rip = step(0.5 + hash(v_uv * 5.0) * 0.2, v_uv.x);
      return mix(u_secondary_color, u_primary_color, lines * rip);
    }
  `,uniforms:[{id:`u_scale`,name:`Thread Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Thread`,type:`color`,default:[.9,.85,.8,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.1,.1,.1,0]}]},ye=e({default:()=>be}),be={id:`carpet_velour_artisan`,name:`Velour Carpet`,category:`Racing`,added:`2026-04-16`,description:`Soft, deep pile industrial carpet found in premium grand touring interiors.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale) + hash(v_uv * u_scale * 0.5) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Pile Density`,type:`float`,min:50,max:500,default:200},{id:`u_primary_color`,name:`絨毯 (Carpet Top)`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Pile Base`,type:`color`,default:[.05,.05,.08,1]}]},xe=e({default:()=>Se}),Se={id:`cast_iron`,name:`Cast Iron`,category:`Industrial`,added:`2026-05-01`,description:`Raw cast iron with a coarse sand-mold grain, dark matte grey surface, and occasional small porosity dimples from casting.`,shader:`
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
  `,uniforms:[{id:`u_grain`,name:`Grain`,type:`float`,min:5,max:50,default:22},{id:`u_base_color`,name:`Iron Color`,type:`color`,default:[.28,.27,.26,1]},{id:`u_roughness`,name:`Roughness`,type:`float`,min:.3,max:2,default:1}]},Ce=e({default:()=>we}),we={id:`cephalopod_chromatophores_artisan`,name:`Cephalopod Chromatophores`,category:`Organic`,added:`2026-05-13`,description:`Dynamic, cellular color-changing spots that vary in size and density over a fleshy base layer.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Cell Scale`,type:`float`,min:2,max:30,default:12},{id:`u_base_color`,name:`Fleshy Base`,type:`color`,default:[.7,.3,.3,1]},{id:`u_spot_color`,name:`Chromatophore`,type:`color`,default:[.1,.1,.1,1]},{id:`u_pulse`,name:`Pulse Phase`,type:`float`,min:0,max:100,default:0}]},Te=e({default:()=>Ee}),Ee={id:`chain_mail_artisan`,name:`Chain Mail`,category:`Industrial`,added:`2026-04-15`,description:`Interlocking metal ring structures used in protective armor and fencing.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(length(gv) - 0.35);
      float mask = smoothstep(0.05, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Ring Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Wire Metal`,type:`color`,default:[.7,.7,.72,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.02,.02,.02,1]}]},De=e({default:()=>Oe}),Oe={id:`chalkboard_dust_artisan`,name:`Chalk Dust`,category:`Abstract`,added:`2026-04-16`,description:`Smudged powdery residue and chalk markings found on weathered racing boards.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 1000.0);
      return mix(u_secondary_color, u_primary_color, n * 0.5);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Chalk Mark`,type:`color`,default:[.9,.9,.9,1]},{id:`u_secondary_color`,name:`Slate Base`,type:`color`,default:[.1,.1,.12,1]}]},ke=e({default:()=>Ae}),Ae={id:`charcoal_sketch_artisan`,name:`Charcoal Sketch`,category:`Abstract`,added:`2026-04-15`,description:`Cross-hatched noise lines mimicking hand-drawn charcoal or graphite sketches.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.9, hash(uv));
      mask += step(0.95, hash(uv.yx + 10.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:50,max:200,default:100},{id:`u_primary_color`,name:`Pencil Lead`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[.95,.95,.92,1]}]},je=e({default:()=>Me}),Me={id:`chitinous_exoskeleton_artisan`,name:`Chitinous Exoskeleton`,category:`Organic`,added:`2026-05-13`,description:`Iridescent, segmented insectoid armor plating with deep, structural color shifting.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Plate Scale`,type:`float`,min:2,max:20,default:6},{id:`u_color_a`,name:`Iridescence Base`,type:`color`,default:[.1,.2,.5,1]},{id:`u_color_b`,name:`Iridescence Mid`,type:`color`,default:[.5,.1,.6,1]},{id:`u_color_c`,name:`Iridescence High`,type:`color`,default:[.1,.8,.4,1]}]},Ne=e({default:()=>Pe}),Pe={id:`choc_chip_camo`,name:`Chocolate Chip Camo`,category:`Organic`,added:`2026-05-12`,description:`Broad waves of base color overlaid with small, high-contrast pebbles to mimic a rocky desert floor.`,shader:`
    
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
  `,variants:[{name:`Desert Storm`,uniforms:{u_color_base:[.75,.65,.5,1],u_color_1:[.6,.5,.35,1],u_color_2:[.45,.35,.25,1],u_color_chip:[.9,.85,.75,1],u_color_shadow:[.1,.08,.05,1]}},{name:`Mars Surface`,uniforms:{u_color_base:[.65,.3,.15,1],u_color_1:[.5,.2,.1,1],u_color_2:[.8,.45,.25,1],u_color_chip:[.95,.65,.4,1],u_color_shadow:[.15,.05,.02,1]}},{name:`Urban Rubble`,uniforms:{u_color_base:[.55,.55,.6,1],u_color_1:[.4,.4,.45,1],u_color_2:[.3,.3,.35,1],u_color_chip:[.85,.85,.9,1],u_color_shadow:[.1,.1,.15,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.14,1],u_color_1:[.08,.08,.1,1],u_color_2:[.05,.05,.06,1],u_color_chip:[.2,.2,.22,1],u_color_shadow:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base Sand`,type:`color`,default:[.75,.65,.5,1]},{id:`u_color_1`,name:`Wave 1`,type:`color`,default:[.6,.5,.35,1]},{id:`u_color_2`,name:`Wave 2`,type:`color`,default:[.45,.35,.25,1]},{id:`u_color_chip`,name:`Pebble Color`,type:`color`,default:[.9,.85,.75,1]},{id:`u_color_shadow`,name:`Shadow Color`,type:`color`,default:[.1,.08,.05,1]}]},Fe=e({default:()=>Ie}),Ie={id:`chopped_carbon_artisan`,name:`Chopped Carbon`,category:`Industrial`,added:`2026-04-15`,description:`Randomly oriented forged carbon fragments mimicking premium high-performance composites.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Fragment Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Resin Deep`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Fiber Flake`,type:`color`,default:[.2,.2,.25,1]}]},Le=e({default:()=>Re}),Re={id:`chrome_mirror`,name:`Chrome Mirror`,category:`Industrial`,added:`2026-04-30`,description:`Mirror-polished chrome finish with gradient reflection bands simulating sky, horizon, and ground environment.`,shader:`

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
  `,uniforms:[{id:`u_contrast`,name:`Reflection Contrast`,type:`float`,min:.5,max:3,default:2},{id:`u_band_count`,name:`Band Count`,type:`float`,min:2,max:12,default:6}]},ze=e({default:()=>Be}),Be={id:`circuit_traces_pro`,name:`Circuit Traces`,category:`Technology`,added:`2026-04-15`,description:`Pro-grade PCB layout with branching traces and circular nodes.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Logic Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Trace Color`,type:`color`,default:[0,.8,.4,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[.02,.05,.02,1]}]},Ve=e({default:()=>He}),He={id:`coral_reef_artisan`,name:`Coral Branch`,category:`Natural`,added:`2026-04-16`,description:`Branching organic calcium structures mimicking underwater coral reef formations.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Reef Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Polyps`,type:`color`,default:[1,.5,.4,1]},{id:`u_secondary_color`,name:`Ocean Depth`,type:`color`,default:[0,.2,.4,1]}]},Ue=e({default:()=>We}),We={id:`corduroy_rib_artisan`,name:`Corduroy Rib`,category:`Abstract`,added:`2026-04-15`,description:`Parallel fuzzy ridges of heavy fabric used in durable workwear.`,shader:`
    vec4 generate() {
      float rib = sin(v_uv.x * 100.0 * u_scale);
      float mask = smoothstep(-0.5, 0.5, rib);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rib Frequency`,type:`float`,min:.1,max:2,default:.8},{id:`u_primary_color`,name:`Rib Ridge`,type:`color`,default:[.4,.3,.2,1]},{id:`u_secondary_color`,name:`Rib Valley`,type:`color`,default:[.15,.1,.05,1]}]},Ge=e({default:()=>Ke}),Ke={id:`corroded_aluminum`,name:`Corroded Aluminum`,category:`Industrial`,added:`2026-05-01`,description:`Pitted and oxidized aluminum with dull grey-white aluminum oxide patches over a matte base, with small darker corrosion pits.`,shader:`
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
  `,uniforms:[{id:`u_corrosion`,name:`Corrosion Coverage`,type:`float`,min:0,max:1,default:.6},{id:`u_scale`,name:`Scale`,type:`float`,min:2,max:20,default:8},{id:`u_base_color`,name:`Aluminum Base`,type:`color`,default:[.65,.65,.63,1]}]},qe=e({default:()=>Je}),Je={id:`corrugated_steel_artisan`,name:`Corrugated Steel`,category:`Industrial`,added:`2026-04-15`,description:`Wavy metal sheet textures used in industrial construction and containers.`,shader:`
    vec4 generate() {
      float wave = sin(v_uv.x * 30.0 * (1.0 + u_scale));
      float mask = smoothstep(-0.8, 0.8, wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Frequency`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Highlight`,type:`color`,default:[.7,.75,.8,1]},{id:`u_secondary_color`,name:`Recess`,type:`color`,default:[.15,.15,.2,1]}]},Ye=e({default:()=>Xe}),Xe={id:`cow_print`,name:`Cow Print`,category:`Organic`,added:`2026-06-11`,description:`Classic Holstein cow hide: irregular organic black blotches scattered over white, with a second smaller blotch layer for natural variety.`,shader:`

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
  `,variants:[{name:`Holstein`,uniforms:{u_color_blotch:[.05,.05,.06,1],u_color_base:[.96,.95,.93,1]}},{name:`Brown Swiss`,uniforms:{u_color_blotch:[.33,.2,.11,1],u_color_base:[.92,.87,.78,1]}},{name:`Pink Moo`,uniforms:{u_color_blotch:[.95,.35,.62,1],u_color_base:[1,.94,.97,1]}},{name:`Inverse`,uniforms:{u_color_blotch:[.96,.95,.93,1],u_color_base:[.05,.05,.06,1]}}],uniforms:[{id:`u_scale`,name:`Blotch Scale`,type:`float`,min:1,max:12,default:3.5},{id:`u_coverage`,name:`Blotch Coverage`,type:`float`,min:0,max:1,default:.45},{id:`u_soft`,name:`Edge Softness`,type:`float`,min:.002,max:.4,default:.05},{id:`u_color_blotch`,name:`Blotch Color`,type:`color`,default:[.05,.05,.06,1]},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.96,.95,.93,1]}]},Ze=e({default:()=>Qe}),Qe={id:`crocodile_hide_artisan`,name:`Crocodile Hide`,category:`Natural`,added:`2026-04-15`,description:`Large rectangular blocky scales with organic gap jitter found in reptilian leather.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Zoom`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Leather Top`,type:`color`,default:[.15,.1,.05,1]},{id:`u_secondary_color`,name:`Scale Gap`,type:`color`,default:[.05,.03,.01,1]}]},$e=e({default:()=>et}),et={id:`crt_phosphor_mask_artisan`,name:`CRT Phosphor Mask`,category:`Technology`,added:`2026-05-13`,description:`Macro view of an old tube monitor featuring RGB sub-pixels and scanlines.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Grille Scale`,type:`float`,min:10,max:200,default:80},{id:`u_brightness`,name:`Phosphor Brightness`,type:`float`,min:.5,max:3,default:1.5},{id:`u_ambient_glare`,name:`Screen Glass`,type:`color`,default:[.05,.05,.05,1]},{id:`u_phase`,name:`Signal Phase`,type:`float`,min:0,max:100,default:0}]},tt=e({default:()=>nt}),nt={id:`cyber_grid_pro`,name:`Cyber Grid`,category:`Technology`,added:`2026-04-15`,description:`Pro-grade data-matrix style grid with secondary interference lines.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Grid Resolution`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Grid Glow`,type:`color`,default:[0,.6,1,1]},{id:`u_secondary_color`,name:`Base Void`,type:`color`,default:[.02,.02,.05,1]}]},rt=e({default:()=>it}),it={id:`cyber_leather_artisan`,name:`Cyber Leather`,category:`Technology`,added:`2026-04-16`,description:`Synthetic high-performance leather with integrated glowing micro-circuitry pores.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 100.0;
      float mask = step(0.9, hash(floor(uv)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Circuit Glow`,type:`color`,default:[1,0,.5,1]},{id:`u_secondary_color`,name:`Synthetic Skin`,type:`color`,default:[.05,.05,.06,1]}]},at=e({default:()=>ot}),ot={id:`cyber_twill_artisan`,name:`Cyber Twill`,category:`Technology`,added:`2026-04-16`,description:`Advanced glowing-edge carbon fiber weave for high-performance cybernetic components.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Glow Edge`,type:`color`,default:[0,1,.8,1]},{id:`u_secondary_color`,name:`Carbon Body`,type:`color`,default:[.05,.05,.05,1]}]},st=e({default:()=>ct}),ct={id:`cyber_wiring_artisan`,name:`Cyber Bundle`,category:`Technology`,added:`2026-04-16`,description:`Dense, tangled bundles of high-speed digital wiring and fiber-optic strands.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * u_scale + sin(v_uv.x * 5.0));
      float n = hash(vec2(y, y));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Wire Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Wire Signal`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Insulation`,type:`color`,default:[.1,.1,.1,1]}]},lt=e({default:()=>ut}),ut={id:`damask_lace_artisan`,name:`Damask Lace`,category:`Abstract`,added:`2026-04-16`,description:`Complex organic floral symmetry and decorative lace patterns.`,shader:`
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
  `,uniforms:[{id:`u_primary_color`,name:`Lace High`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Sheer Base`,type:`color`,default:[.1,.1,.1,1]}]},dt=e({default:()=>ft}),ft={id:`damask_silk_artisan`,name:`Damask Silk`,category:`Abstract`,added:`2026-04-15`,description:`Floral symmetrical weave with high-end fabric sheen found in luxury upholstery.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = length(uv - sin(uv.x * 5.0) * 0.1);
      float mask = smoothstep(0.4, 0.35, fract(d * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Silk Pattern`,type:`color`,default:[.8,.5,.2,1]},{id:`u_secondary_color`,name:`Base Satin`,type:`color`,default:[.4,.2,.1,1]}]},pt=e({default:()=>mt}),mt={id:`data_matrix_artisan`,name:`Data Matrix`,category:`Technology`,added:`2026-04-16`,description:`Stacked digital data blocks mimicking high-density computer storage and visualization.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.5, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Data Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Active Bit`,type:`color`,default:[0,1,.5,1]},{id:`u_secondary_color`,name:`Zero Bit`,type:`color`,default:[0,.1,.05,1]}]},ht=e({default:()=>gt}),gt={id:`dazzle_camo`,name:`Dazzle Camo`,category:`Geometric`,added:`2026-06-11`,description:`WWI battleship razzle-dazzle: bold irregular geometric zones, each filled with hard-edged two-tone stripes at its own clashing angle and frequency, plus occasional accent zones.`,shader:`

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
  `,variants:[{name:`Classic B&W`,uniforms:{u_color_a:[.95,.95,.94,1],u_color_b:[.06,.06,.07,1],u_color_accent:[.3,.32,.36,1]}},{name:`Navy`,uniforms:{u_color_a:[.78,.83,.88,1],u_color_b:[.07,.13,.26,1],u_color_accent:[.32,.45,.62,1]}},{name:`Magenta Pop`,uniforms:{u_color_a:[.97,.96,.97,1],u_color_b:[.1,.08,.12,1],u_color_accent:[.92,.1,.55,1]}},{name:`Ghost Grey`,uniforms:{u_color_a:[.82,.83,.85,1],u_color_b:[.55,.57,.61,1],u_color_accent:[.38,.4,.45,1]}}],uniforms:[{id:`u_zone_scale`,name:`Zone Scale`,type:`float`,min:1.5,max:10,default:4},{id:`u_stripe_freq`,name:`Stripe Frequency`,type:`float`,min:5,max:60,default:18},{id:`u_color_a`,name:`Stripe Light`,type:`color`,default:[.95,.95,.94,1]},{id:`u_color_b`,name:`Stripe Dark`,type:`color`,default:[.06,.06,.07,1]},{id:`u_color_accent`,name:`Accent`,type:`color`,default:[.3,.32,.36,1]}]},_t=e({default:()=>vt}),vt={id:`demon_scales_artisan`,name:`Demon Scales`,category:`Natural`,added:`2026-04-15`,description:`Overlapping pointed organic scales with depth found in mythical beast armor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.3));
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Size`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Scale Top`,type:`color`,default:[.3,0,0,1]},{id:`u_secondary_color`,name:`Under Scale`,type:`color`,default:[.1,0,0,1]}]},yt=e({default:()=>bt}),bt={id:`denim_weave_artisan`,name:`Denim Fabric`,category:`Abstract`,added:`2026-04-15`,description:`Iconic indigo-stained twill weave with micro-directional thread noise.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float twill = sin((uv.x + uv.y) * 20.0);
      float noise = hash(v_uv * 500.0) * 0.2;
      float mask = step(0.0, twill + noise);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Twill Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Fade Blue`,type:`color`,default:[.3,.4,.6,1]},{id:`u_secondary_color`,name:`Indigo Deep`,type:`color`,default:[.1,.15,.3,1]}]},xt=e({default:()=>St}),St={id:`desert_dunes_artisan`,name:`Desert Dunes`,category:`Natural`,added:`2026-04-16`,description:`Wavy ripple-sand patterns mimicking windswept desert landscapes.`,shader:`
    vec4 generate() {
      float ripple = sin(v_uv.x * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dune Frequency`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Sunlit Sand`,type:`color`,default:[.9,.7,.4,1]},{id:`u_secondary_color`,name:`Dune Shadow`,type:`color`,default:[.7,.5,.3,1]}]},Ct=e({default:()=>wt}),wt={id:`diamond_plate_pro`,name:`Diamond Plate`,category:`Industrial`,added:`2026-04-15`,description:`Classic anti-slip safety metal floor texture.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Plate Scale`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Diamond Face`,type:`color`,default:[.7,.7,.72,1]},{id:`u_secondary_color`,name:`Plate Base`,type:`color`,default:[.4,.4,.42,1]}]},Tt=e({default:()=>Et}),Et={id:`diamond_quilt_artisan`,name:`Diamond Quilt`,category:`Abstract`,added:`2026-04-15`,description:`Stitched padded fabric effect with soft surface shading for luxury upholstery.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = fract(uv);
      float d = length(gv - 0.5);
      float mask = smoothstep(0.5, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stitch Size`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Padding`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Stitch Deep`,type:`color`,default:[.5,.5,.6,1]}]},Dt=e({default:()=>Ot}),Ot={id:`diamond_stitch_v2_artisan`,name:`Pro Diamond Stitch`,category:`Racing`,added:`2026-04-16`,description:`Advanced padded upholstery with individual cross-stitching detail found in luxury GT cockpits.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Diamond Size`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Padding`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Stitch Line`,type:`color`,default:[.4,0,0,1]}]},kt=e({default:()=>At}),At={id:`diatom_shells_artisan`,name:`Diatom Shells`,category:`Natural`,added:`2026-04-15`,description:`Intricate microscopic silicate shells found in marine plankton formations.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float mask = sin(d * 10.0 + sin(angle * 8.0));
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,uniforms:[{id:`u_scale`,name:`Shell Scale`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Silicate`,type:`color`,default:[.8,.9,1,1]},{id:`u_secondary_color`,name:`Marine Deep`,type:`color`,default:[0,.1,.2,1]}]},jt=e({default:()=>Mt}),Mt={id:`diffraction_grating_artisan`,name:`Diffraction Grating`,category:`Abstract`,added:`2026-04-15`,description:`Rainbow-like spectral interference bands mimicking light diffraction on surfaces.`,shader:`
    vec4 generate() {
      float d = sin(v_uv.x * 500.0 + v_uv.y * 50.0);
      vec3 rainbow = vec3(0.5) + 0.5 * cos(vec3(0,2,4) + d * 3.14);
      return vec4(rainbow, 1.0);
    }
  `,uniforms:[]},Nt=e({default:()=>Pt}),Pt={id:`digi_camo_urban`,name:`Urban Digi Camo`,category:`Racing`,added:`2026-04-15`,description:`High-contrast city digital camouflage.`,shader:`
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      vec4 color = u_color_base;
      if (n > 0.8) color = u_color_1;
      else if (n > 0.5) color = u_color_2;
      else if (n > 0.2) color = u_color_3;
      return color;
    }
  `,variants:[{name:`Urban (Default)`,uniforms:{u_color_base:[.5,.5,.5,1],u_color_1:[.1,.1,.1,1],u_color_2:[.3,.3,.3,1],u_color_3:[.7,.7,.7,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.08,.08,.09,1],u_color_1:[0,0,0,1],u_color_2:[.04,.04,.05,1],u_color_3:[.12,.12,.14,1]}}],uniforms:[{id:`u_scale`,name:`Detail`,type:`float`,min:10,max:100,default:50},{id:`u_color_base`,name:`Base`,type:`color`,default:[.5,.5,.5,1]},{id:`u_color_1`,name:`Dark`,type:`color`,default:[.1,.1,.1,1]},{id:`u_color_2`,name:`Mid`,type:`color`,default:[.3,.3,.3,1]},{id:`u_color_3`,name:`Light`,type:`color`,default:[.7,.7,.7,1]}]},Ft=e({default:()=>It}),It={id:`digital_camo_v2_artisan`,name:`Ghost Camo`,category:`Racing`,added:`2026-04-16`,description:`Advanced multi-scale digital camouflage with low-visibility spectral patterns.`,shader:`
    vec4 generate() {
      float n = hash(floor(v_uv * 10.0)) + hash(floor(v_uv * 40.0)) * 0.5;
      return mix(u_secondary_color, u_primary_color, n / 1.5);
    }
  `,variants:[{name:`Ghost (Default)`,uniforms:{u_primary_color:[.3,.3,.35,1],u_secondary_color:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_primary_color:[.08,.08,.09,1],u_secondary_color:[0,0,0,1]}}],uniforms:[{id:`u_primary_color`,name:`Camo High`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Camo Deep`,type:`color`,default:[.1,.1,.12,1]}]},Lt=e({default:()=>Rt}),Rt={id:`digital_glitch_pro`,name:`Digital Glitch`,category:`Abstract`,added:`2026-04-15`,description:`Static pixel shift and signal interference simulation.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      // Removed time dependency from shift
      float shift = hash(y) * 0.2;
      float x = v_uv.x + shift;
      
      float mask = step(0.9, hash(floor(x * 10.0) + y));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Glitch Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Signal`,type:`color`,default:[0,1,.3,1]},{id:`u_secondary_color`,name:`Noise`,type:`color`,default:[.05,.05,.08,1]}]},zt=e({default:()=>Bt}),Bt={id:`door_panel_fabric_artisan`,name:`Panel Fabric`,category:`Racing`,added:`2026-04-16`,description:`Coarse interior textile weave found in lightweight door cards and racing interiors.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x * 2.0) * sin(uv.y * 2.0);
      float mask = smoothstep(-0.2, 0.2, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:50,max:300,default:150},{id:`u_primary_color`,name:`Fiber Grain`,type:`color`,default:[.3,.3,.35,1]},{id:`u_secondary_color`,name:`Fabric Base`,type:`color`,default:[.15,.15,.2,1]}]},Vt=e({default:()=>Ht}),Ht={id:`dragon_plate_artisan`,name:`Dragon Plate`,category:`Natural`,added:`2026-04-15`,description:`Thick, overlapping pointed armor-like scales with depth found in mythical creature hide.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.4));
      float mask = smoothstep(0.5, 0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Plate Size`,type:`float`,min:5,max:25,default:12},{id:`u_primary_color`,name:`Plate Top`,type:`color`,default:[.3,0,.1,1]},{id:`u_secondary_color`,name:`Under Rim`,type:`color`,default:[.1,0,0,1]}]},Ut=e({default:()=>Wt}),Wt={id:`energy_shield_artisan`,name:`Phase Shield`,category:`Abstract`,added:`2026-04-16`,description:`Hexagonal-linked energy barrier pattern with high-frequency interference patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Shield Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Ion Glow`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Hardlight Base`,type:`color`,default:[0,.1,.2,1]}]},Gt=e({default:()=>Kt}),Kt={id:`etched_brass_artisan`,name:`Etched Brass`,category:`Industrial`,added:`2026-04-16`,description:`Victorian-style chemical etching and ornate brass panel patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 10.0;
      float lines = sin(uv.x) * sin(uv.y) + sin(uv.x * 2.0) * cos(uv.y * 2.0);
      float mask = step(0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Brass High`,type:`color`,default:[.8,.6,.2,1]},{id:`u_secondary_color`,name:`Etched Deep`,type:`color`,default:[.4,.3,.1,1]}]},qt=e({default:()=>Jt}),Jt={id:`exhaust_heat_artisan`,name:`Exhaust Bluing`,category:`Industrial`,added:`2026-04-16`,description:`Wavy prismatic heat seasoning found on high-temperature titanium and steel exhaust systems.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 5.0);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.2, 0.4)));
      return vec4(col, 1.0);
    }
  `,uniforms:[]},Yt=e({default:()=>Xt}),Xt={id:`expanded_grating_pro`,name:`Expanded Metal`,category:`Industrial`,added:`2026-04-15`,description:`Heavy industrial walkway grating with diamond-slotted apertures.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Mesh Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Steel Rib`,type:`color`,default:[.3,.3,.33,1]},{id:`u_secondary_color`,name:`Aperture`,type:`color`,default:[0,0,0,1]}]},Zt=e({default:()=>Qt}),Qt={id:`exposed_aggregate`,name:`Exposed Aggregate`,category:`Natural`,added:`2026-05-01`,description:`Exposed aggregate concrete with embedded smooth pebbles in warm stone colors set in a dark cement matrix.`,shader:`
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
  `,uniforms:[{id:`u_stone_size`,name:`Aggregate Density`,type:`float`,min:2,max:20,default:8},{id:`u_cement_color`,name:`Cement Color`,type:`color`,default:[.25,.24,.23,1]},{id:`u_grout_width`,name:`Cement Gap Width`,type:`float`,min:.02,max:.15,default:.06}]},$t=e({default:()=>en}),en={id:`fiber_optic_bundle_artisan`,name:`Fiber Bundle`,category:`Technology`,added:`2026-04-16`,description:`Glowing bundles of light-conducting strands found in high-speed data transmission systems.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float n = hash(vec2(y, y));
      float strand = step(0.1, fract(v_uv.x * 5.0 + n));
      return mix(u_secondary_color, u_primary_color, strand);
    }
  `,uniforms:[{id:`u_scale`,name:`Strand Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Optic Glow`,type:`color`,default:[.2,1,1,1]},{id:`u_secondary_color`,name:`Dark Cladding`,type:`color`,default:[0,.05,.1,1]}]},tn=e({default:()=>nn}),nn={id:`fingerprint_swirls_artisan`,name:`Fingerprint Swirls`,category:`Natural`,added:`2026-04-15`,description:`Swirling organic ridge patterns mimicking human dermatoglyphics.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 5.0) * 2.0);
      float mask = sin(n * 20.0);
      return mix(u_secondary_color, u_primary_color, smoothstep(-0.5, 0.5, mask));
    }
  `,uniforms:[{id:`u_scale`,name:`Ridge Detail`,type:`float`,min:2,max:15,default:5},{id:`u_primary_color`,name:`Ridge`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Valley`,type:`color`,default:[.95,.9,.85,1]}]},rn=e({default:()=>an}),an={id:`fish_scales_artisan`,name:`Fish Scales`,category:`Natural`,added:`2026-04-15`,description:`Round, thin overlapping semi-circles found in aquatic life and reflective armor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Scale Body`,type:`color`,default:[.4,.6,.7,.8]},{id:`u_secondary_color`,name:`Joint Shadow`,type:`color`,default:[.1,.2,.3,1]}]},on=e({default:()=>sn}),sn={id:`flecktarn_camo`,name:`Flecktarn Camo`,category:`Organic`,added:`2026-05-12`,description:`A complex pattern consisting of small, densely packed spots and dots that create a disruptive, noisy texture.`,shader:`
    
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
  `,variants:[{name:`Flecktarn (Woodland)`,uniforms:{u_color_base:[.35,.4,.25,1],u_color_1:[.25,.3,.2,1],u_color_2:[.45,.35,.25,1],u_color_3:[.25,.15,.1,1],u_color_4:[.1,.1,.1,1]}},{name:`Tropentarn (Desert)`,uniforms:{u_color_base:[.75,.65,.5,1],u_color_1:[.65,.55,.4,1],u_color_2:[.45,.5,.35,1],u_color_3:[.35,.25,.15,1],u_color_4:[.15,.15,.15,1]}},{name:`Urban Mottled`,uniforms:{u_color_base:[.6,.6,.65,1],u_color_1:[.4,.4,.45,1],u_color_2:[.3,.3,.35,1],u_color_3:[.2,.2,.25,1],u_color_4:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.12,.12,.12,1],u_color_2:[.08,.08,.08,1],u_color_3:[.05,.05,.05,1],u_color_4:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Spot Scale`,type:`float`,min:5,max:40,default:15},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.35,.4,.25,1]},{id:`u_color_1`,name:`Blob Color`,type:`color`,default:[.25,.3,.2,1]},{id:`u_color_2`,name:`Spot 1`,type:`color`,default:[.45,.35,.25,1]},{id:`u_color_3`,name:`Spot 2`,type:`color`,default:[.25,.15,.1,1]},{id:`u_color_4`,name:`Spot 3`,type:`color`,default:[.1,.1,.1,1]}]},cn=e({default:()=>ln}),ln={id:`fluid_marbling_pro`,name:`Fluid Marbling`,category:`Abstract`,added:`2026-04-15`,description:`Organic static liquid flow with colorful mineral-like marbling.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offsets
      float n = noise(uv);
      float n2 = noise(uv * 2.0 - n);
      float mask = smoothstep(0.3, 0.7, n * 0.5 + n2 * 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flow Scale`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Mineral A`,type:`color`,default:[.4,.1,.8,1]},{id:`u_secondary_color`,name:`Mineral B`,type:`color`,default:[.1,.4,.5,1]}]},un=e({default:()=>dn}),dn={id:`folded_damascus_steel_artisan`,name:`Folded Damascus Steel`,category:`Industrial`,added:`2026-05-13`,description:`Swirling, wavy folded steel patterns with high-contrast acid bath etching.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Grain Scale`,type:`float`,min:1,max:10,default:3},{id:`u_fold_density`,name:`Fold Density`,type:`float`,min:5,max:30,default:15},{id:`u_dark_steel`,name:`Etched Layer`,type:`color`,default:[.15,.15,.16,1]},{id:`u_light_steel`,name:`Polished Layer`,type:`color`,default:[.6,.6,.65,1]}]},fn=e({default:()=>pn}),pn={id:`forest_litter_artisan`,name:`Forest Litter`,category:`Natural`,added:`2026-04-15`,description:`Dense organic debris and varying leaf shapes found on a forest floor.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float d = length(fract(uv) - 0.5);
      float mask = smoothstep(0.4, 0.1, d * (0.8 + n * 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Debris Density`,type:`float`,min:2,max:20,default:12},{id:`u_primary_color`,name:`Leaf Dust`,type:`color`,default:[.4,.3,.1,1]},{id:`u_secondary_color`,name:`Soil`,type:`color`,default:[.1,.08,.05,1]}]},mn=e({default:()=>hn}),hn={id:`forged_carbon`,name:`Forged Carbon`,category:`Organic`,added:`2026-04-15`,description:`Randomized carbon shred pattern used in hypercars.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Flake Size`,type:`float`,min:1,max:20,default:8},{id:`u_primary_color`,name:`High Carbon`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Base Carbon`,type:`color`,default:[.05,.05,.05,1]}]},gn=e({default:()=>_n}),_n={id:`frost_crystals_artisan`,name:`Frost Crystals`,category:`Natural`,added:`2026-04-15`,description:`Crystalline window-ice patterns and frost blooms found in extreme cold.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 10.0);
      float crystal = step(0.9, hash(v_uv * 20.0 + n));
      return mix(u_secondary_color, u_primary_color, crystal);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Frost`,type:`color`,default:[.9,.95,1,1]},{id:`u_secondary_color`,name:`Glass`,type:`color`,default:[.1,.2,.3,1]}]},vn=e({default:()=>yn}),yn={id:`frozen_lake_artisan`,name:`Ice Fractures`,category:`Natural`,added:`2026-04-16`,description:`Angular ice cracks and crystalline fractures found in frozen lake and arctic simulation environments.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Ice Shard`,type:`color`,default:[.8,.9,1,1]},{id:`u_secondary_color`,name:`Deep Lake`,type:`color`,default:[0,.1,.2,1]}]},bn=e({default:()=>xn}),xn={id:`fusion_panel_artisan`,name:`Fusion Plating`,category:`Technology`,added:`2026-04-16`,description:`Complex geometric panel lines and "greebles" found on high-energy reactor housings.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      float mask = step(0.02, f_uv.x) * step(f_uv.x, 0.98) * step(0.02, f_uv.y) * step(f_uv.y, 0.98);
      float n = hash(i_uv);
      return mix(u_secondary_color, u_primary_color, mask * n);
    }
  `,uniforms:[{id:`u_scale`,name:`Panel Detail`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Alloy Surface`,type:`color`,default:[.12,.12,.15,1]},{id:`u_secondary_color`,name:`Panel Joint`,type:`color`,default:[0,0,0,1]}]},Sn=e({default:()=>Cn}),Cn={id:`galvanized_steel_artisan`,name:`Galvanized Steel`,category:`Industrial`,added:`2026-04-15`,description:`Spangled crystalline industrial coating found in heavy-duty utility equipment.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Spangle Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Zinc High`,type:`color`,default:[.9,.9,.92,1]},{id:`u_secondary_color`,name:`Zinc Deep`,type:`color`,default:[.5,.5,.55,1]}]},wn=e({default:()=>Tn}),Tn={id:`gauge_cluster_artisan`,name:`Gauge Finish`,category:`Racing`,added:`2026-04-16`,description:`Concentric circular brushed finish found on high-end analog gauge clusters and trim panels.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * 1000.0);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Brushed Rim`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Brushed Deep`,type:`color`,default:[.5,.5,.55,1]}]},En=e({default:()=>Dn}),Dn={id:`geometric_camo_ops`,name:`Geometric Camo (Ops)`,category:`Geometric`,added:`2026-05-12`,description:`A modern, sharp geometric splinter camouflage designed for high-performance racing liveries with vibrant accent capabilities.`,shader:`
    
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
  `,variants:[{name:`Woodland (Ops)`,uniforms:{u_color_base:[.22,.27,.2,1],u_color_1:[.15,.16,.15,1],u_color_2:[.05,.05,.05,1],u_color_3:[.35,.35,.35,1],u_color_accent:[.35,.28,.18,1]}},{name:`Desert Recon`,uniforms:{u_color_base:[.76,.69,.5,1],u_color_1:[.55,.47,.33,1],u_color_2:[.25,.28,.2,1],u_color_3:[.1,.1,.1,1],u_color_accent:[.6,.4,.1,1]}},{name:`Urban Stealth`,uniforms:{u_color_base:[.9,.9,.92,1],u_color_1:[.6,.6,.65,1],u_color_2:[.15,.15,.18,1],u_color_3:[.3,.3,.35,1],u_color_accent:[.25,.28,.35,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.08,.08,.09,1],u_color_1:[.03,.03,.04,1],u_color_2:[0,0,0,1],u_color_3:[.15,.15,.16,1],u_color_accent:[.05,.05,.06,1]}}],uniforms:[{id:`u_scale`,name:`Camo Scale`,type:`float`,min:1,max:50,default:12},{id:`u_color_base`,name:`Base Green`,type:`color`,default:[.22,.27,.2,1]},{id:`u_color_1`,name:`Dark Grey`,type:`color`,default:[.15,.16,.15,1]},{id:`u_color_2`,name:`Black`,type:`color`,default:[.05,.05,.05,1]},{id:`u_color_3`,name:`Light Grey`,type:`color`,default:[.35,.35,.35,1]},{id:`u_color_accent`,name:`Accent Line`,type:`color`,default:[.35,.28,.18,1]},{id:`u_accent_amount`,name:`Accent Amount`,type:`float`,min:0,max:1,default:.5}]},On=e({default:()=>kn}),kn={id:`geometric_fracture_artisan`,name:`Shatter Shard`,category:`Abstract`,added:`2026-04-16`,description:`Sharp angular procedural shards and crystalline fractures mimicking high-speed impact surfaces.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Fracture Edge`,type:`color`,default:[.9,.9,1,1]},{id:`u_secondary_color`,name:`Fracture Void`,type:`color`,default:[.1,.1,.2,1]}]},An=e({default:()=>jn}),jn={id:`glacier_ice_artisan`,name:`Glacier Ice`,category:`Natural`,added:`2026-04-15`,description:`Crackled crystalline planes with directional depth found in Arctic ice formations.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv));
      float crack = step(0.9, hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, (n + crack) * 0.5);
    }
  `,uniforms:[{id:`u_scale`,name:`Shelf Scale`,type:`float`,min:1,max:20,default:5},{id:`u_primary_color`,name:`Clean Ice`,type:`color`,default:[.9,.95,1,.8]},{id:`u_secondary_color`,name:`Deep Freeze`,type:`color`,default:[.1,.3,.5,1]}]},Mn=e({default:()=>Nn}),Nn={id:`glass_shards_artisan`,name:`Glass Shards`,category:`Abstract`,added:`2026-04-15`,description:`Sharp, non-animated geometric fragmentation mimicking shattered glass.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Shard Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Glass Highlight`,type:`color`,default:[.8,.9,1,.5]},{id:`u_secondary_color`,name:`Shard Depth`,type:`color`,default:[.1,.2,.4,.8]}]},Pn=e({default:()=>Fn}),Fn={id:`glitch_interference_artisan`,name:`Signal Glitch`,category:`Abstract`,added:`2026-04-16`,description:`Chaotic horizontal interference and data-stream glitch patterns.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float x = v_uv.x + hash(y);
      float mask = step(0.5, fract(x * 2.0));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Signal Peak`,type:`color`,default:[0,1,0,1]},{id:`u_secondary_color`,name:`Static Floor`,type:`color`,default:[0,.05,0,1]}]},In=e({default:()=>Ln}),Ln={id:`glitch_text_logic_artisan`,name:`Logic Glitch`,category:`Abstract`,added:`2026-04-16`,description:`Abstract blocks of logic-like symbols and corrupted data stream visualizations.`,shader:`
    vec4 generate() {
      vec2 uv = floor(v_uv * 40.0);
      float n = hash(uv);
      float mask = step(0.7, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Bit Glow`,type:`color`,default:[0,1,.8,1]},{id:`u_secondary_color`,name:`Buffer Black`,type:`color`,default:[0,.01,0,1]}]},Rn=e({default:()=>zn}),zn={id:`gold_leaf_artisan`,name:`Gold Leaf`,category:`Abstract`,added:`2026-04-15`,description:`Irregular metallic foil noise and gold leaf textures for premium accents.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 100.0) * hash(v_uv * 10.0);
      float mask = smoothstep(0.1, 0.3, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Gilded`,type:`color`,default:[1,.8,.3,1]},{id:`u_secondary_color`,name:`Underneath`,type:`color`,default:[.2,.1,0,1]}]},Bn=e({default:()=>Vn}),Vn={id:`gold_leaf_flake_artisan`,name:`Gold Flake`,category:`Abstract`,added:`2026-04-16`,description:`Thin, irregular metallic foil fragments and gold leaf flakes mimicking luxurious textured finishes.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.95, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flake Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Gold Leaf`,type:`color`,default:[1,.8,.2,1]},{id:`u_secondary_color`,name:`Base Resin`,type:`color`,default:[.1,.1,.1,1]}]},Hn=e({default:()=>Un}),Un={id:`gothic_filigree_artisan`,name:`Gothic Filigree`,category:`Abstract`,added:`2026-04-15`,description:`Intricate iron-like symmetrical swirls and ornate architectural blackwork.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * u_scale;
      float d = sin(uv.x * 10.0 + sin(uv.y * 10.0));
      float mask = smoothstep(0.1, 0.0, abs(d - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Detail Zoom`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Iron`,type:`color`,default:[.1,.1,.15,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.9,.85,.8,1]}]},Wn=e({default:()=>Gn}),Gn={id:`granite_speckle_natural`,name:`Granite Speckle`,category:`Natural`,added:`2026-05-01`,description:`Classic grey granite with randomly scattered feldspar, quartz, biotite mica, and hornblende mineral grains.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:2,max:20,default:8},{id:`u_light_mineral`,name:`Light Mineral`,type:`color`,default:[.9,.88,.85,1]},{id:`u_dark_mineral`,name:`Dark Mineral`,type:`color`,default:[.08,.08,.09,1]}]},Kn=e({default:()=>qn}),qn={id:`graphene_nanotubes_artisan`,name:`Graphene Nanotubes`,category:`Industrial`,added:`2026-05-13`,description:`Hexagonal carbon lattices at a molecular scale with metallic glowing points.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Lattice Scale`,type:`float`,min:2,max:40,default:15},{id:`u_bg_color`,name:`Background`,type:`color`,default:[.05,.05,.05,1]},{id:`u_line_color`,name:`Bond Lines`,type:`color`,default:[.3,.3,.35,1]},{id:`u_glow_color`,name:`Node Glow`,type:`color`,default:[0,.8,1,1]}]},Jn=e({default:()=>Yn}),Yn={id:`gravel_trap_artisan`,name:`Gravel Trap`,category:`Racing`,added:`2026-04-15`,description:`Irregular sharp cellular noise mimicking track-side runoff gravel.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv * (0.5 + hash(floor(uv)) * 0.5));
      float mask = smoothstep(0.4, 0.3, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Stone Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Gravel`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Dust`,type:`color`,default:[.3,.3,.32,1]}]},Xn=e({default:()=>Zn}),Zn={id:`greek_key_artisan`,name:`Greek Key`,category:`Abstract`,added:`2026-04-15`,description:`Classic ancient geometric meander border patterns found in historic architecture.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale);
      float mask = step(0.1, uv.x) * step(uv.x, 0.9) * step(0.1, uv.y) * step(uv.y, 0.9);
      mask -= step(0.3, uv.x) * step(uv.x, 0.7) * step(0.3, uv.y) * step(uv.y, 0.7);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Key Rows`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Meander`,type:`color`,default:[.8,.7,.3,1]},{id:`u_secondary_color`,name:`Plinth`,type:`color`,default:[.1,.1,.1,1]}]},Qn=e({default:()=>$n}),$n={id:`halftone_dots_artisan`,name:`CMYK Halftone`,category:`Abstract`,added:`2026-04-16`,description:`Professional offset color dots and halftone patterns used in high-end graphic design.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[0,1,1,1],u_secondary_color:[1,1,1,1],u_dot_size:.4,u_angle:0,u_fade:0}},{name:`Comic Pop`,uniforms:{u_primary_color:[.95,.1,.5,1],u_secondary_color:[1,.92,.3,1],u_dot_size:.35,u_angle:45,u_fade:.5}},{name:`Newsprint`,uniforms:{u_primary_color:[.08,.08,.08,1],u_secondary_color:[.94,.92,.87,1],u_dot_size:.3,u_angle:22,u_fade:0}},{name:`Neon Fade`,uniforms:{u_primary_color:[.1,1,.5,1],u_secondary_color:[.02,.02,.05,1],u_dot_size:.42,u_angle:30,u_fade:.8}}],uniforms:[{id:`u_scale`,name:`Dot Density`,type:`float`,min:10,max:100,default:50},{id:`u_dot_size`,name:`Dot Size`,type:`float`,min:.05,max:.7,default:.4},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.3,default:.01},{id:`u_angle`,name:`Screen Angle`,type:`float`,min:0,max:90,default:0},{id:`u_fade`,name:`Tonal Fade`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Ink Dot`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[1,1,1,1]}]},er=e({default:()=>tr}),tr={id:`halftone_pop_artisan`,name:`Halftone Pop-Art`,category:`Abstract`,added:`2026-04-15`,description:`Classic CMYK-style dot matrix textures found in pop-art and comic books.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      
      float intensity = sin(v_uv.x * 5.0) * 0.5 + 0.5;
      float d = length(gv);
      float mask = smoothstep(intensity * 0.5, intensity * 0.45, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Dot Color`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Paper Base`,type:`color`,default:[1,1,.95,1]}]},nr=e({default:()=>rr}),rr={id:`hammered_copper_artisan`,name:`Hammered Copper`,category:`Industrial`,added:`2026-04-15`,description:`Indented, concave specular surfaces found in artisanal hammered metalwork.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Dents`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rim Shine`,type:`color`,default:[.9,.6,.4,1]},{id:`u_secondary_color`,name:`Copper Deep`,type:`color`,default:[.4,.2,.1,1]}]},ir=e({default:()=>ar}),ar={id:`harlequin_diamond`,name:`Harlequin Diamond`,category:`Geometric`,added:`2026-04-15`,description:`Classic high-contrast diagonal diamond pattern.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,.1,.1,1],u_secondary_color:[.1,.1,.1,1],u_accent_color:[.95,.85,.4,1],u_angle:45,u_aspect:1,u_outline:0}},{name:`Jester`,uniforms:{u_primary_color:[.5,.12,.6,1],u_secondary_color:[.08,.08,.1,1],u_accent_color:[.95,.78,.2,1],u_angle:45,u_aspect:1.4,u_outline:.9}},{name:`Carnival`,uniforms:{u_primary_color:[.85,.1,.15,1],u_secondary_color:[.95,.92,.85,1],u_accent_color:[.95,.85,.4,1],u_angle:45,u_aspect:1,u_outline:0}},{name:`Ivory Lattice`,uniforms:{u_primary_color:[.92,.9,.85,1],u_secondary_color:[.85,.82,.75,1],u_accent_color:[.4,.3,.2,1],u_angle:45,u_aspect:1.8,u_outline:1}}],uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:50,default:12},{id:`u_angle`,name:`Rotation`,type:`float`,min:0,max:90,default:45},{id:`u_aspect`,name:`Diamond Stretch`,type:`float`,min:.4,max:2.5,default:1},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.008},{id:`u_outline`,name:`Outline Strength`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Color A`,type:`color`,default:[1,.1,.1,1]},{id:`u_secondary_color`,name:`Color B`,type:`color`,default:[.1,.1,.1,1]},{id:`u_accent_color`,name:`Outline`,type:`color`,default:[.95,.85,.4,1]}]},or=e({default:()=>sr}),sr={id:`headliner_mesh_artisan`,name:`Headliner Mesh`,category:`Racing`,added:`2026-04-16`,description:`Breathable ceiling textile with hexagonal micro-pores found in modern automotive interiors.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pore Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Textile Surface`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Pore Shade`,type:`color`,default:[.05,.05,.1,1]}]},cr=e({default:()=>lr}),lr={id:`heat_blued_titanium`,name:`Heat-Blued Titanium`,category:`Industrial`,added:`2026-05-13`,description:`Titanium heat-oxidation colour bands — the characteristic silver → straw → gold → purple → blue gradient on exhaust systems and racing hardware.`,shader:`
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
  `,uniforms:[{id:`u_heat_bias`,name:`Heat Level`,type:`float`,default:.4,min:0,max:1},{id:`u_spread`,name:`Band Spread`,type:`float`,default:.85,min:.2,max:1.5},{id:`u_direction`,name:`Direction`,type:`float`,default:0,min:0,max:1}]},ur=e({default:()=>dr}),dr={id:`herringbone_weave_pro`,name:`Herringbone`,category:`Geometric`,added:`2026-04-15`,description:`Pro-grade chevron-style herringbone weave pattern.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.1,.1,.1,1],u_secondary_color:[.05,.05,.05,1],u_balance:.5,u_grain:0}},{name:`Grey Tweed`,uniforms:{u_primary_color:[.55,.53,.5,1],u_secondary_color:[.32,.3,.28,1],u_balance:.5,u_grain:.18}},{name:`Oak Parquet`,uniforms:{u_primary_color:[.55,.38,.22,1],u_secondary_color:[.4,.26,.14,1],u_scale:12,u_balance:.5,u_grain:.22}},{name:`Racing Green`,uniforms:{u_primary_color:[.04,.25,.14,1],u_secondary_color:[.02,.12,.07,1],u_balance:.45,u_grain:.08}}],uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:2,max:100,default:20},{id:`u_balance`,name:`Chevron Balance`,type:`float`,min:.2,max:.8,default:.5},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.005},{id:`u_grain`,name:`Fiber Grain`,type:`float`,min:0,max:.4,default:0},{id:`u_primary_color`,name:`Primary Weave`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Secondary Weave`,type:`color`,default:[.05,.05,.05,1]}]},fr=e({default:()=>pr}),pr={id:`hex_basalt_natural`,name:`Hex Basalt`,category:`Natural`,added:`2026-05-01`,description:`Hexagonal columnar basalt cross-sections like the Giants Causeway, with dark joints and per-column tonal variation.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Column Density`,type:`float`,min:2,max:16,default:7},{id:`u_rock_color`,name:`Basalt Color`,type:`color`,default:[.38,.38,.36,1]},{id:`u_joint_width`,name:`Joint Width`,type:`float`,min:.01,max:.1,default:.04}]},mr=e({default:()=>hr}),hr={id:`hex_fade`,name:`Hex Fade`,category:`Geometric`,added:`2026-06-11`,description:`The signature modern GT livery motif: a crisp honeycomb hexagon grid that shrinks and dissolves to nothing along a controllable fade direction with dithered per-cell dropout.`,shader:`

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
  `,variants:[{name:`Carbon Fade`,uniforms:{u_color_hex:[.16,.17,.19,1],u_color_bg:[.05,.05,.06,1]}},{name:`Victory Red`,uniforms:{u_color_hex:[.82,.07,.1,1],u_color_bg:[.96,.96,.96,1]}},{name:`Electric Blue`,uniforms:{u_color_hex:[.05,.55,1,1],u_color_bg:[.02,.04,.1,1]}},{name:`Stealth`,uniforms:{u_color_hex:[.1,.1,.11,1],u_color_bg:[.2,.21,.23,1]}}],uniforms:[{id:`u_scale`,name:`Hex Scale`,type:`float`,min:4,max:40,default:14},{id:`u_fade_angle`,name:`Fade Angle (deg)`,type:`float`,min:0,max:360,default:0},{id:`u_fade_start`,name:`Fade Start`,type:`float`,min:0,max:1,default:.2},{id:`u_fade_length`,name:`Fade Length`,type:`float`,min:.05,max:1,default:.6},{id:`u_border`,name:`Hex Border`,type:`float`,min:0,max:.3,default:.08},{id:`u_color_hex`,name:`Hex Color`,type:`color`,default:[.16,.17,.19,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.05,.05,.06,1]}]},gr=e({default:()=>_r}),_r={id:`hex_mesh_pro`,name:`Aerodynamic Hex`,category:`Technology`,added:`2026-04-15`,description:`Technical high-airflow hexagonal mesh grid.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.35,.35,.4,1],u_secondary_color:[.02,.02,.02,1],u_inset:.43,u_bevel:0}},{name:`Stealth Mesh`,uniforms:{u_primary_color:[.08,.08,.09,1],u_secondary_color:[0,0,0,1],u_inset:.43,u_bevel:.5}},{name:`Radiator Brass`,uniforms:{u_primary_color:[.72,.55,.25,1],u_secondary_color:[.06,.04,.02,1],u_inset:.4,u_bevel:.6}},{name:`Tron Grid`,uniforms:{u_primary_color:[.04,.05,.07,1],u_secondary_color:[.1,.9,1,1],u_inset:.45,u_bevel:0}}],uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:10,max:100,default:40},{id:`u_inset`,name:`Cell Size`,type:`float`,min:.2,max:.49,default:.43},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.08,default:.008},{id:`u_bevel`,name:`Bevel Shading`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Mesh`,type:`color`,default:[.35,.35,.4,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.02,.02,.02,1]}]},vr=e({default:()=>yr}),yr={id:`holographic_foil_artisan`,name:`Holographic Foil`,category:`Abstract`,added:`2026-05-13`,description:`Multi-layered, shifting prismatic gradients reminiscent of rare trading cards.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:5,max:50,default:20},{id:`u_foil_intensity`,name:`Spectral Saturation`,type:`float`,min:0,max:2,default:1},{id:`u_pattern_brightness`,name:`Foil Glint`,type:`float`,min:0,max:2,default:1.2},{id:`u_shift`,name:`Angle Shift`,type:`float`,min:0,max:10,default:0}]},br=e({default:()=>xr}),xr={id:`holographic_glitch_artisan`,name:`Hologlitch`,category:`Abstract`,added:`2026-04-16`,description:`Chromatic offset stripes and holographic artifacts mimicking digital interference.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 40.0);
      float offset = hash(y);
      float r = step(0.5, fract(v_uv.x * 10.0 + offset));
      return mix(u_secondary_color, u_primary_color, r);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Cyan Beam`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Magenta Blur`,type:`color`,default:[1,0,1,1]}]},Sr=e({default:()=>Cr}),Cr={id:`honeycomb_bio`,name:`HoneyComb Bio`,category:`Natural`,added:`2026-04-15`,description:`Precise hexagonal organic cell wall structure.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Cell Count`,type:`float`,min:2,max:40,default:12},{id:`u_primary_color`,name:`Honey Fill`,type:`color`,default:[1,.7,0,1]},{id:`u_secondary_color`,name:`Wax Wall`,type:`color`,default:[.2,.1,0,1]}]},wr=e({default:()=>Tr}),Tr={id:`honeycomb_metal`,name:`Honeycomb Metal`,category:`Industrial`,added:`2026-05-01`,description:`Aerospace aluminium honeycomb panel â€” machine-perfect hexagonal cells with bright thin walls and deep dark interiors.`,shader:`
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
  `,uniforms:[{id:`u_scale`,type:`float`,default:14,min:4,max:30,name:`Cell Scale`},{id:`u_wall_color`,type:`color`,default:[.78,.8,.82,1],name:`Wall Colour`},{id:`u_cell_depth`,type:`float`,default:.85,min:.2,max:1,name:`Cell Depth`}]},Er=e({default:()=>Dr}),Dr={id:`hotrod_flames`,name:`Hot Rod Flames`,category:`Racing`,added:`2026-06-11`,description:`Classic hot rod flame licks streaming left to right: fbm-warped tongues that taper and curl, layered outer, mid and hot-core colours for the traditional outlined look.`,shader:`

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
  `,variants:[{name:`Classic Orange`,uniforms:{u_color_outer:[.75,.05,.02,1],u_color_mid:[1,.45,.02,1],u_color_core:[1,.9,.25,1],u_color_bg:[.03,.03,.04,1]}},{name:`Blue Flame`,uniforms:{u_color_outer:[.05,.1,.45,1],u_color_mid:[.1,.45,.95,1],u_color_core:[.8,.95,1,1],u_color_bg:[.02,.02,.05,1]}},{name:`Green Envy`,uniforms:{u_color_outer:[.04,.3,.06,1],u_color_mid:[.2,.8,.1,1],u_color_core:[.85,1,.4,1],u_color_bg:[.02,.04,.02,1]}},{name:`Purple Haze`,uniforms:{u_color_outer:[.28,.04,.45,1],u_color_mid:[.65,.2,.95,1],u_color_core:[.95,.75,1,1],u_color_bg:[.04,.02,.06,1]}}],uniforms:[{id:`u_scale`,name:`Flame Scale`,type:`float`,min:2,max:12,default:5},{id:`u_length`,name:`Lick Length`,type:`float`,min:.3,max:1.5,default:.95},{id:`u_stretch`,name:`Lick Stretch`,type:`float`,min:.4,max:3,default:1.2},{id:`u_turbulence`,name:`Turbulence`,type:`float`,min:0,max:1.5,default:.6},{id:`u_color_outer`,name:`Outer Flame`,type:`color`,default:[.75,.05,.02,1]},{id:`u_color_mid`,name:`Mid Flame`,type:`color`,default:[1,.45,.02,1]},{id:`u_color_core`,name:`Hot Core`,type:`color`,default:[1,.9,.25,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.03,.03,.04,1]}]},Or=e({default:()=>kr}),kr={id:`houndstooth`,name:`Houndstooth`,category:`Geometric`,added:`2026-04-15`,description:`Pro-grade textile pattern for classic racing interiors.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,1,1,1],u_secondary_color:[.05,.05,.05,1],u_rotate:0,u_weave:0}},{name:`Camel Coat`,uniforms:{u_primary_color:[.82,.66,.45,1],u_secondary_color:[.25,.16,.1,1],u_rotate:0,u_weave:.5}},{name:`Grey Tweed`,uniforms:{u_primary_color:[.75,.75,.78,1],u_secondary_color:[.12,.12,.14,1],u_rotate:0,u_weave:.35}},{name:`Speed Punch`,uniforms:{u_primary_color:[.95,.25,.1,1],u_secondary_color:[.05,.05,.06,1],u_rotate:45,u_weave:0}}],uniforms:[{id:`u_scale`,name:`Pattern Size`,type:`float`,min:5,max:100,default:40},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.05,default:.004},{id:`u_rotate`,name:`Rotation`,type:`float`,min:0,max:90,default:0},{id:`u_weave`,name:`Thread Texture`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Primary Thread`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Secondary Thread`,type:`color`,default:[.05,.05,.05,1]}]},Ar=e({default:()=>jr}),jr={id:`hunting_camo_forest`,name:`Forest Hunting Camo`,category:`Racing`,added:`2026-04-15`,description:`Pro-grade wilderness camouflage with organic branch and leaf shapes.`,shader:`
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
  `,variants:[{name:`Forest (Default)`,uniforms:{u_color_green:[.1,.15,.05,1],u_color_tan:[.5,.45,.3,1],u_color_brown:[.25,.15,.1,1],u_color_dark:[.05,.05,.02,1]}},{name:`Blackout Stealth`,uniforms:{u_color_green:[.06,.06,.07,1],u_color_tan:[.15,.15,.16,1],u_color_brown:[.03,.03,.04,1],u_color_dark:[0,0,0,1]}}],uniforms:[{id:`u_scale`,name:`Detail Density`,type:`float`,min:1,max:10,default:3.5},{id:`u_color_green`,name:`Greenish`,type:`color`,default:[.1,.15,.05,1]},{id:`u_color_tan`,name:`Tan Base`,type:`color`,default:[.5,.45,.3,1]},{id:`u_color_brown`,name:`Brown`,type:`color`,default:[.25,.15,.1,1]},{id:`u_color_dark`,name:`Dark`,type:`color`,default:[.05,.05,.02,1]}]},Mr=e({default:()=>Nr}),Nr={id:`impasto_paint_artisan`,name:`Impasto Paint`,category:`Abstract`,added:`2026-04-16`,description:`Thick, textured brush strokes and heavy oil paint impasto effects.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Paint Peak`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Canvas Base`,type:`color`,default:[.4,0,0,1]}]},Pr=e({default:()=>Fr}),Fr={id:`infinite_spiral_pro`,name:`Infinite Spiral`,category:`Abstract`,added:`2026-04-15`,description:`Mathematical spirograph with static interlocking floral loops.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float r = length(uv);
      float a = atan(uv.y, uv.x);
      
      // Removed time from spiral function
      float spiral = sin(r * 10.0 - a * 5.0);
      float mask = smoothstep(0.0, 0.1, abs(spiral) - 0.1);
      
      return mix(u_secondary_color, u_primary_color, 1.0 - mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Spiral Power`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Ink Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[0,0,0,1]}]},Ir=e({default:()=>Lr}),Lr={id:`ink_blot_test_artisan`,name:`Ink Blot`,category:`Abstract`,added:`2026-04-16`,description:`Symmetrical organic Rorschach blobs mimicking organic ink flow on folded paper.`,shader:`
    vec4 generate() {
      vec2 uv = abs(v_uv - 0.5) * 2.0;
      float n = noise(uv * 5.0 + noise(uv * 10.0));
      float mask = step(0.5, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Ink Body`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Paper White`,type:`color`,default:[.95,.95,.9,1]}]},Rr=e({default:()=>zr}),zr={id:`interference_rings`,name:`Interference Rings`,category:`Abstract`,added:`2026-05-01`,description:`Newton's rings â€” concentric iridescent interference fringes radiating from a contact point.`,shader:`
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
  `,uniforms:[{id:`u_fringe_freq`,type:`float`,default:18,min:4,max:40,name:`Fringe Frequency`},{id:`u_iridescence`,type:`float`,default:1.2,min:0,max:2,name:`Iridescence`},{id:`u_center`,type:`float`,default:.5,min:.1,max:.9,name:`Ring Centre X`}]},Br=e({default:()=>Vr}),Vr={id:`iris_fibers_artisan`,name:`Iris Fibers`,category:`Natural`,added:`2026-04-15`,description:`Radial organic fibrous patterns found in the human eye iris.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 50.0, 0.0));
      float mask = smoothstep(0.1, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Pupil Edge`,type:`color`,default:[.1,.3,.6,1]},{id:`u_secondary_color`,name:`Outer Stroma`,type:`color`,default:[0,.05,.1,1]}]},Hr=e({default:()=>Ur}),Ur={id:`julia_fractal`,name:`Julia Set`,category:`Abstract`,added:`2026-04-15`,description:`High-symmetry mathematical fractal based on complex number seeds.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Fractal Size`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Core Color`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Outer Space`,type:`color`,default:[0,0,.1,1]}]},Wr=e({default:()=>Gr}),Gr={id:`kers_containment_core_artisan`,name:`KERS Containment Core`,category:`Technology`,added:`2026-05-13`,description:`Glowing, high-energy plasma cells wrapped in intricate copper coiling.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Core Scale`,type:`float`,min:2,max:20,default:5},{id:`u_bg_color`,name:`Housing`,type:`color`,default:[.05,.05,.08,1]},{id:`u_plasma_color`,name:`Plasma Energy`,type:`color`,default:[0,.8,1,1]},{id:`u_copper_light`,name:`Copper Coil Highlight`,type:`color`,default:[.8,.4,.2,1]},{id:`u_copper_dark`,name:`Copper Coil Shadow`,type:`color`,default:[.3,.1,.05,1]},{id:`u_flow`,name:`Energy Flow`,type:`float`,min:0,max:100,default:0}]},Kr=e({default:()=>qr}),qr={id:`kevlar_grid_artisan`,name:`Kevlar Weave`,category:`Industrial`,added:`2026-04-15`,description:`Heavy tactical weave used in protective armor and performance gear.`,shader:`
    vec4 generate() {
      float lines = sin(v_uv.x * u_scale) * sin(v_uv.y * u_scale);
      float mask = smoothstep(-u_softness, u_softness, lines);
      vec4 color = mix(u_secondary_color, u_primary_color, mask);

      // Directional sheen along the raised tows
      float sheen = pow(max(lines, 0.0), 3.0) * u_sheen;
      color.rgb += sheen * 0.35;
      return color;
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.8,.7,.2,1],u_secondary_color:[.1,.1,.1,1],u_scale:400,u_softness:.5,u_sheen:0}},{name:`Black Ops`,uniforms:{u_primary_color:[.16,.16,.17,1],u_secondary_color:[.04,.04,.05,1],u_scale:500,u_softness:.45,u_sheen:.3}},{name:`Blue Aramid`,uniforms:{u_primary_color:[.15,.35,.75,1],u_secondary_color:[.03,.05,.1,1],u_scale:400,u_softness:.5,u_sheen:.35}},{name:`Crimson Hybrid`,uniforms:{u_primary_color:[.7,.1,.12,1],u_secondary_color:[.06,.04,.04,1],u_scale:320,u_softness:.55,u_sheen:.4}}],uniforms:[{id:`u_scale`,name:`Weave Density`,type:`float`,min:100,max:1e3,default:400},{id:`u_softness`,name:`Weave Softness`,type:`float`,min:.05,max:1,default:.5},{id:`u_sheen`,name:`Tow Sheen`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Kevlar Gold`,type:`color`,default:[.8,.7,.2,1]},{id:`u_secondary_color`,name:`Outer Mesh`,type:`color`,default:[.1,.1,.1,1]}]},Jr=e({default:()=>Yr}),Yr={id:`knurl_grip`,name:`Knurl Grip`,category:`Racing`,added:`2026-05-01`,description:`Diamond knurl grip pattern — two sets of diagonal machined ridges crossing at 45 degrees to form sharp pyramid diamonds with bright tips and dark valleys.`,shader:`
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
  `,uniforms:[{id:`u_density`,name:`Diamond Density`,type:`float`,min:4,max:40,default:16},{id:`u_base_color`,name:`Base Metal`,type:`color`,default:[.55,.55,.57,1]},{id:`u_depth`,name:`Ridge Depth`,type:`float`,min:.2,max:2,default:1}]},Xr=e({default:()=>Zr}),Zr={id:`laser_etch`,name:`Laser Etch`,category:`Technology`,added:`2026-05-01`,description:`Laser-engraved geometric lines on dark anodized metal, revealing bright bare aluminium in precise 45-degree patterns.`,shader:`
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
  `,uniforms:[{id:`u_line_density`,name:`Line Density`,type:`float`,min:4,max:40,default:16},{id:`u_background`,name:`Background`,type:`color`,default:[.08,.08,.1,1]},{id:`u_etch_color`,name:`Etch Color`,type:`color`,default:[.85,.87,.88,1]},{id:`u_line_width`,name:`Line Width`,type:`float`,min:.01,max:.2,default:.06}]},Qr=e({default:()=>$r}),$r={id:`lava_crust_pro`,name:`Lava Crust`,category:`Natural`,added:`2026-04-15`,description:`Static volcanic cooling patterns with high-heat emission cracks.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time from noise offset
      float n = noise(uv);
      float mask = smoothstep(0.4, 0.6, n);
      
      vec4 heat = vec4(1.0, 0.2, 0.0, 1.0);
      vec4 rock = vec4(0.1, 0.1, 0.12, 1.0);
      
      return mix(heat, rock, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Flow Intensity`,type:`float`,min:1,max:10,default:4}]},ei=e({default:()=>ti}),ti={id:`leaf_skeleton_pro`,name:`Leaf Skeleton`,category:`Natural`,added:`2026-04-15`,description:`Technical vein structure mimicking a decaying leaf skeleton.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      vec2 id = floor(uv);
      
      float mask = step(0.95, hash(id + gv.x * 0.1));
      mask += step(0.98, max(gv.x, gv.y));
      
      return mix(u_secondary_color, u_primary_color, clamp(mask, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Vein Detail`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Vein Color`,type:`color`,default:[.95,.95,.9,1]},{id:`u_secondary_color`,name:`Void Space`,type:`color`,default:[.05,.05,.05,1]}]},ni=e({default:()=>ri}),ri={id:`leopard_print`,name:`Leopard Print`,category:`Organic`,added:`2026-06-11`,description:`Classic leopard rosettes: irregular broken dark rings around tan centres scattered with hash jitter over a cream-gold base, with noise-driven ring break-up and size variance.`,shader:`

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
  `,variants:[{name:`Classic`,uniforms:{u_color_base:[.87,.76,.55,1],u_color_ring:[.1,.07,.05,1],u_color_center:[.72,.51,.28,1]}},{name:`Snow Leopard`,uniforms:{u_color_base:[.93,.93,.95,1],u_color_ring:[.15,.15,.18,1],u_color_center:[.65,.65,.7,1]}},{name:`Pink Pop`,uniforms:{u_color_base:[.98,.8,.88,1],u_color_ring:[.22,.02,.12,1],u_color_center:[.95,.35,.6,1]}},{name:`Midnight`,uniforms:{u_color_base:[.1,.11,.15,1],u_color_ring:[.01,.01,.02,1],u_color_center:[.22,.24,.33,1]}}],uniforms:[{id:`u_scale`,name:`Spot Scale`,type:`float`,min:2,max:15,default:6},{id:`u_rosette`,name:`Rosette Size`,type:`float`,min:.15,max:.6,default:.38},{id:`u_break`,name:`Ring Break-Up`,type:`float`,min:0,max:1,default:.45},{id:`u_color_base`,name:`Base Coat`,type:`color`,default:[.87,.76,.55,1]},{id:`u_color_ring`,name:`Rosette Ring`,type:`color`,default:[.1,.07,.05,1]},{id:`u_color_center`,name:`Spot Center`,type:`color`,default:[.72,.51,.28,1]}]},ii=e({default:()=>ai}),ai={id:`lichen_growth_artisan`,name:`Lichen Moss`,category:`Natural`,added:`2026-04-16`,description:`Splotchy organic crust and symbiotic growths found on weathered rocks and trees.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 20.0));
      return mix(u_secondary_color, u_primary_color, step(0.5, n));
    }
  `,uniforms:[{id:`u_primary_color`,name:`Lichen High`,type:`color`,default:[.7,.8,.5,1]},{id:`u_secondary_color`,name:`Rock Base`,type:`color`,default:[.2,.2,.2,1]}]},oi=e({default:()=>si}),si={id:`lichtenberg_trees_artisan`,name:`Lichtenberg Trees`,category:`Abstract`,added:`2026-04-15`,description:`Fractal electrical discharge patterns found in high-voltage dielectric breakdown.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 100.0);
      float branch = step(0.98, n * hash(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, branch);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Discharge`,type:`color`,default:[.4,.8,1,1]},{id:`u_secondary_color`,name:`Insulator`,type:`color`,default:[.05,.05,.08,1]}]},ci=e({default:()=>li}),li={id:`linear_gradient_artisan`,name:`Master Linear`,category:`Abstract`,added:`2026-04-15`,description:`High-precision linear gradient for base transitions.`,shader:`
    vec4 generate() {
      float mask = v_uv.x;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Start Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`End Color`,type:`color`,default:[0,0,0,1]}]},ui=e({default:()=>di}),di={id:`linen_weave`,name:`Linen Weave`,category:`Industrial`,added:`2026-05-01`,description:`Natural linen plain weave with organic fibre slubs and warm ecru tones.`,shader:`
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
  `,uniforms:[{id:`u_weave_scale`,type:`float`,default:18,min:4,max:40,name:`Weave Scale`},{id:`u_base_color`,type:`color`,default:[.82,.75,.58,1],name:`Warp Colour`},{id:`u_warp_color`,type:`color`,default:[.72,.64,.48,1],name:`Weft Colour`}]},fi=e({default:()=>pi}),pi={id:`liquid_mercury_artisan`,name:`Liquid Mercury`,category:`Abstract`,added:`2026-04-15`,description:`Smooth, blobby metallic shapes with high specularity mimicking liquid metal.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Blob Size`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Mercury`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[.1,.1,.12,1]}]},mi=e({default:()=>hi}),hi={id:`louis_check_artisan`,name:`Louis Check`,category:`Abstract`,added:`2026-04-15`,description:`Luxury designer-style checkered leather pattern with premium soft shading.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.3,.2,.15,1],u_secondary_color:[.6,.45,.35,1],u_edge_shade:.2,u_grain:0}},{name:`Noir Damier`,uniforms:{u_primary_color:[.05,.05,.06,1],u_secondary_color:[.22,.22,.24,1],u_edge_shade:.25,u_grain:.1}},{name:`Burgundy Lux`,uniforms:{u_primary_color:[.3,.06,.1,1],u_secondary_color:[.55,.2,.22,1],u_edge_shade:.2,u_grain:.12}},{name:`Cream Canvas`,uniforms:{u_primary_color:[.78,.7,.58,1],u_secondary_color:[.92,.87,.76,1],u_edge_shade:.3,u_grain:.06}}],uniforms:[{id:`u_scale`,name:`Check Zoom`,type:`float`,min:2,max:20,default:8},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.01},{id:`u_edge_shade`,name:`Edge Shading`,type:`float`,min:0,max:.6,default:.2},{id:`u_grain`,name:`Leather Grain`,type:`float`,min:0,max:.4,default:0},{id:`u_primary_color`,name:`Leather Dark`,type:`color`,default:[.3,.2,.15,1]},{id:`u_secondary_color`,name:`Leather Tan`,type:`color`,default:[.6,.45,.35,1]}]},gi=e({default:()=>_i}),_i={id:`low_poly_facets`,name:`Low-Poly Facets`,category:`Geometric`,added:`2026-06-11`,description:`Triangulated low-poly mosaic with flat per-face shading: hash-jittered facet brightness over a large-scale lighting gradient so the surface reads like a faceted 3D render.`,shader:`

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
  `,variants:[{name:`Ice`,uniforms:{u_color_a:[.25,.38,.55,1],u_color_b:[.92,.97,1,1]}},{name:`Gunmetal`,uniforms:{u_color_a:[.09,.1,.12,1],u_color_b:[.48,.51,.56,1]}},{name:`Sunset`,uniforms:{u_color_a:[.45,.08,.25,1],u_color_b:[1,.62,.2,1]}},{name:`Emerald`,uniforms:{u_color_a:[.02,.18,.1,1],u_color_b:[.25,.85,.5,1]}}],uniforms:[{id:`u_scale`,name:`Facet Scale`,type:`float`,min:3,max:30,default:9},{id:`u_contrast`,name:`Shading Contrast`,type:`float`,min:0,max:1,default:.55},{id:`u_border`,name:`Border Strength`,type:`float`,min:0,max:1,default:.35},{id:`u_color_a`,name:`Shadow Color`,type:`color`,default:[.25,.38,.55,1]},{id:`u_color_b`,name:`Highlight Color`,type:`color`,default:[.92,.97,1,1]}]},vi=e({default:()=>yi}),yi={id:`machined_wheel`,name:`Machined Wheel`,category:`Racing`,added:`2026-04-30`,description:`CNC machined aluminum wheel face with concentric lathe rings, radial spoke shadows, and a polished centre hub.`,shader:`

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
  `,uniforms:[{id:`u_ring_freq`,name:`Ring Density`,type:`float`,min:10,max:60,default:30},{id:`u_spoke_count`,name:`Spoke Count`,type:`float`,min:3,max:10,default:5}]},bi=e({default:()=>xi}),xi={id:`macrame_knot_artisan`,name:`Macrame Knot`,category:`Abstract`,added:`2026-04-15`,description:`Interlocking geometric square knots found in traditional fiber crafts.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = smoothstep(0.4, 0.5, abs(gv.x - 0.5) + abs(gv.y - 0.5));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Knot Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Cotton Rope`,type:`color`,default:[.95,.9,.85,1]},{id:`u_secondary_color`,name:`Knot Deep`,type:`color`,default:[.6,.55,.5,1]}]},Si=e({default:()=>Ci}),Ci={id:`mandala_radial_artisan`,name:`Mandala Radial`,category:`Abstract`,added:`2026-04-16`,description:`Harmonic geometric recurrence and radial symmetry patterns.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float d = length(uv);
      float pulses = sin(d * 40.0) * sin(angle * 8.0);
      float mask = step(0.0, pulses);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Geometry Glow`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Mental Void`,type:`color`,default:[0,0,0,1]}]},wi=e({default:()=>Ti}),Ti={id:`mandelbrot_fractal`,name:`Mandelbrot Explorer`,category:`Abstract`,added:`2026-04-15`,description:`Pure mathematical fractal boundary with high-precision iteration.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Zoom Level`,type:`float`,min:1,max:20,default:2},{id:`u_primary_color`,name:`Inner Glow`,type:`color`,default:[1,.4,0,1]},{id:`u_secondary_color`,name:`Void Depth`,type:`color`,default:[.05,0,.05,1]}]},Ei=e({default:()=>Di}),Di={id:`maple_leaves_artisan`,name:`Maple Leaf Scatter`,category:`Natural`,added:`2026-04-15`,description:`Randomly distributed maple leaf shapes with rotation and scale variance.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:15,default:6},{id:`u_primary_color`,name:`Leaf Color`,type:`color`,default:[1,.4,.1,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.1,.1,.05,1]}]},Oi=e({default:()=>ki}),ki={id:`marble_stone_artisan`,name:`Marbled Stone`,category:`Organic`,added:`2026-04-15`,description:`Natural stone texture with randomized crystalline veins.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv + noise(uv * 2.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Vein Density`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Vein Color`,type:`color`,default:[.95,.95,1,1]},{id:`u_secondary_color`,name:`Stone Base`,type:`color`,default:[.3,.3,.35,1]}]},Ai=e({default:()=>ji}),ji={id:`matte_clearcoat`,name:`Matte Clearcoat`,category:`Racing`,added:`2026-04-30`,description:`Flat/satin automotive paint finish with micro-surface grain, mimicking matte-wrapped or flat-painted race cars.`,shader:`
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
  `,uniforms:[{id:`u_paint_color`,name:`Paint Color`,type:`color`,default:[.08,.08,.08,1]},{id:`u_noise_scale`,name:`Grain Scale`,type:`float`,min:.5,max:20,default:8},{id:`u_sheen`,name:`Satin Sheen`,type:`float`,min:0,max:1,default:.15}]},Mi=e({default:()=>Ni}),Ni={id:`mesh_jersey`,name:`Mesh Jersey`,category:`Industrial`,added:`2026-05-01`,description:`Open-hole sports jersey knit mesh with rounded thread loops forming a regular grid of holes.`,shader:`
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
  `,uniforms:[{id:`u_scale`,type:`float`,default:14,min:4,max:30,name:`Mesh Scale`},{id:`u_thread_color`,type:`color`,default:[.9,.9,.9,1],name:`Thread Colour`},{id:`u_hole_size`,type:`float`,default:.45,min:.2,max:.7,name:`Hole Size`}]},Pi=e({default:()=>Fi}),Fi={id:`metal_flake`,name:`Metal Flake`,category:`Racing`,added:`2026-04-30`,description:`Automotive metallic flake base coat with dense randomly oriented aluminium flakes sparkling in a tinted binder.`,shader:`
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
  `,uniforms:[{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.08,.15,.35,1]},{id:`u_flake_density`,name:`Flake Density`,type:`float`,min:200,max:2e3,default:800},{id:`u_flake_brightness`,name:`Flake Brightness`,type:`float`,min:.3,max:1.5,default:1}]},Ii=e({default:()=>Li}),Li={id:`micro_cells_artisan`,name:`Micro Cells`,category:`Natural`,added:`2026-04-15`,description:`Biological cellular membranes and nuclei mimicking microscopic organic life.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Cell Magnification`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Organelle`,type:`color`,default:[.8,.4,.6,1]},{id:`u_secondary_color`,name:`Cytoplasm`,type:`color`,default:[.1,.05,.1,1]}]},Ri=e({default:()=>zi}),zi={id:`micro_logic_grid_artisan`,name:`Logic Array`,category:`Technology`,added:`2026-04-16`,description:`Microscopic grid of semiconductor logic gates and data-bus structures.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Gate Matrix`,type:`float`,min:10,max:200,default:80},{id:`u_primary_color`,name:`Bus Copper`,type:`color`,default:[.8,1,0,1]},{id:`u_secondary_color`,name:`Silicon Base`,type:`color`,default:[.05,.05,.1,1]}]},Bi=e({default:()=>Vi}),Vi={id:`microchip_wafer_pro`,name:`Microchip Die`,category:`Technology`,added:`2026-04-15`,description:`High-density silicon wafer etching with localized circuit density.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Wafer Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Etched Metal`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Silicon`,type:`color`,default:[.1,.1,.12,1]}]},Hi=e({default:()=>Ui}),Ui={id:`moire_silk_artisan`,name:`Moire Silk`,category:`Abstract`,added:`2026-04-15`,description:`Water-like wavy fabric interference patterns found in heavy silk moire.`,shader:`
    vec4 generate() {
      float lines1 = sin(v_uv.x * 400.0);
      float lines2 = sin((v_uv.x + v_uv.y * 0.1) * 405.0);
      float mask = smoothstep(-0.5, 0.5, lines1 * lines2);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Sheen`,type:`color`,default:[.3,.35,.5,1]},{id:`u_secondary_color`,name:`Deep Silk`,type:`color`,default:[.1,.1,.2,1]}]},Wi=e({default:()=>Gi}),Gi={id:`molten_tungsten_artisan`,name:`Molten Tungsten`,category:`Industrial`,added:`2026-05-13`,description:`Superheated, cracked metal surface glowing intensely white-hot in the deep fissures.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Crack Scale`,type:`float`,min:2,max:15,default:5},{id:`u_cool_metal`,name:`Cooled Surface`,type:`color`,default:[.1,.1,.12,1]},{id:`u_hot_metal`,name:`Warm Surface`,type:`color`,default:[.4,.1,.05,1]},{id:`u_heat_core`,name:`Fissure Core`,type:`color`,default:[1,.4,0,1]},{id:`u_heat`,name:`Heat Pulse`,type:`float`,min:0,max:100,default:0}]},Ki=e({default:()=>qi}),qi={id:`monstera_leaf_artisan`,name:`Monstera Split-Leaf`,category:`Natural`,added:`2026-04-15`,description:`The iconic tropical split-leaf silhouette with decorative voids.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Leaf Size`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Foliage Color`,type:`color`,default:[0,.5,.2,1]},{id:`u_secondary_color`,name:`Negative Space`,type:`color`,default:[0,0,0,0]}]},Ji=e({default:()=>Yi}),Yi={id:`morpho_iridescence_natural`,name:`Morpho Iridescence`,category:`Natural`,added:`2026-05-01`,description:`Deep structural blue iridescence of the Morpho butterfly wing — pure nanostructure diffraction blue with fine scale-row banding and angle-dependent shimmer.`,shader:`
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
  `,uniforms:[{id:`u_base_blue`,name:`Morpho Blue`,type:`color`,default:[.05,.15,.92,1]},{id:`u_scale_freq`,name:`Scale Row Frequency`,type:`float`,min:10,max:80,default:40},{id:`u_shimmer`,name:`Shimmer Intensity`,type:`float`,min:0,max:1,default:.7}]},Xi=e({default:()=>Zi}),Zi={id:`mother_of_pearl_artisan`,name:`Mother of Pearl`,category:`Natural`,added:`2026-04-15`,description:`Iridescent-like wavy organic noise smears mimicking biological nacre.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float m = noise(v_uv * u_scale * 2.0 + n);
      return mix(u_secondary_color, u_primary_color, m);
    }
  `,uniforms:[{id:`u_scale`,name:`Iridescence Detail`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Shell Pearl`,type:`color`,default:[.9,.95,1,1]},{id:`u_secondary_color`,name:`Shell Deep`,type:`color`,default:[.8,.85,.9,1]}]},Qi=e({default:()=>$i}),$i={id:`mud_cracks_artisan`,name:`Dried Mud`,category:`Natural`,added:`2026-04-15`,description:`High-fidelity organic polygonal fissures mimicking cracked desert earth.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Crack Density`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Earth`,type:`color`,default:[.4,.3,.2,1]},{id:`u_secondary_color`,name:`Fissure`,type:`color`,default:[.15,.1,.05,1]}]},ea=e({default:()=>ta}),ta={id:`mud_splatter`,name:`Mud Splatter`,category:`Racing`,added:`2026-04-30`,description:`Dried mud and dirt splatter with organic layered blobs of varying size and opacity, typical of rally or race car bodywork.`,shader:`
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
  `,uniforms:[{id:`u_mud_color`,name:`Mud Color`,type:`color`,default:[.3,.22,.12,1]},{id:`u_substrate`,name:`Substrate`,type:`color`,default:[.15,.13,.12,1]},{id:`u_density`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_size`,name:`Blob Size`,type:`float`,min:.5,max:3,default:1}]},na=e({default:()=>ra}),ra={id:`multi_env_camo`,name:`Multi-Environment Camo`,category:`Organic`,added:`2026-05-12`,description:`An advanced shader that uses smooth gradients and soft blending between layers rather than hard edges, creating a highly modern, versatile camouflage.`,shader:`

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
  `,variants:[{name:`Arid (Default)`,uniforms:{u_color_base:[.65,.6,.5,1],u_color_1:[.55,.5,.4,1],u_color_2:[.45,.4,.35,1],u_color_3:[.3,.25,.2,1],u_color_4:[.8,.75,.65,1]}},{name:`Tropic`,uniforms:{u_color_base:[.35,.45,.25,1],u_color_1:[.25,.35,.15,1],u_color_2:[.15,.25,.1,1],u_color_3:[.05,.15,.05,1],u_color_4:[.55,.65,.4,1]}},{name:`Alpine`,uniforms:{u_color_base:[.85,.85,.9,1],u_color_1:[.7,.7,.75,1],u_color_2:[.55,.55,.6,1],u_color_3:[.3,.3,.35,1],u_color_4:[.95,.95,1,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.12,.12,.12,1],u_color_2:[.09,.09,.09,1],u_color_3:[.05,.05,.05,1],u_color_4:[.25,.25,.25,1]}}],uniforms:[{id:`u_scale`,name:`Blend Scale`,type:`float`,min:1,max:20,default:4},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.65,.6,.5,1]},{id:`u_color_1`,name:`Gradient 1`,type:`color`,default:[.55,.5,.4,1]},{id:`u_color_2`,name:`Gradient 2`,type:`color`,default:[.45,.4,.35,1]},{id:`u_color_3`,name:`Dark Accent`,type:`color`,default:[.3,.25,.2,1]},{id:`u_color_4`,name:`Light Accent`,type:`color`,default:[.8,.75,.65,1]}]},ia=e({default:()=>aa}),aa={id:`multicam`,name:`MultiCam`,category:`Organic`,added:`2026-06-11`,description:`The modern multi-terrain camouflage standard: a drifting tan-to-cream base gradient layered with organic olive and brown blobs and the signature small dark and cream spots.`,shader:`

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
  `,variants:[{name:`Original`,uniforms:{u_color_base:[.62,.56,.43,1],u_color_light:[.85,.81,.69,1],u_color_olive:[.42,.43,.3,1],u_color_brown:[.49,.39,.28,1],u_color_dark:[.27,.21,.15,1]}},{name:`Black`,uniforms:{u_color_base:[.2,.2,.21,1],u_color_light:[.38,.38,.4,1],u_color_olive:[.13,.13,.14,1],u_color_brown:[.24,.23,.25,1],u_color_dark:[.05,.05,.06,1]}},{name:`Tropic`,uniforms:{u_color_base:[.3,.4,.22,1],u_color_light:[.55,.62,.38,1],u_color_olive:[.18,.28,.13,1],u_color_brown:[.32,.27,.17,1],u_color_dark:[.08,.14,.07,1]}},{name:`Arid`,uniforms:{u_color_base:[.72,.65,.5,1],u_color_light:[.89,.85,.73,1],u_color_olive:[.55,.5,.36,1],u_color_brown:[.6,.49,.35,1],u_color_dark:[.38,.3,.21,1]}},{name:`Alpine`,uniforms:{u_color_base:[.78,.79,.82,1],u_color_light:[.94,.94,.96,1],u_color_olive:[.58,.6,.65,1],u_color_brown:[.66,.66,.7,1],u_color_dark:[.4,.41,.46,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base Tan`,type:`color`,default:[.62,.56,.43,1]},{id:`u_color_light`,name:`Highlight Cream`,type:`color`,default:[.85,.81,.69,1]},{id:`u_color_olive`,name:`Olive Blobs`,type:`color`,default:[.42,.43,.3,1]},{id:`u_color_brown`,name:`Brown Blobs`,type:`color`,default:[.49,.39,.28,1]},{id:`u_color_dark`,name:`Dark Spots`,type:`color`,default:[.27,.21,.15,1]}]},oa=e({default:()=>sa}),sa={id:`mushroom_gills_artisan`,name:`Fungi Gills`,category:`Natural`,added:`2026-04-16`,description:`Radiant organic ridges found on the underside of exotic fungal caps.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float gills = sin(angle * u_scale);
      float mask = step(0.0, gills);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Gill Count`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Gill Ridge`,type:`color`,default:[.8,.75,.7,1]},{id:`u_secondary_color`,name:`Cap Depth`,type:`color`,default:[.4,.35,.3,1]}]},ca=e({default:()=>la}),la={id:`mylar_heatshield`,name:`Mylar Heat Shield`,category:`Racing`,added:`2026-05-01`,description:`Crinkled mylar or aluminium heat shield foil with bright specular hotspots and crinkle shadow valleys.`,shader:`
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
  `,uniforms:[{id:`u_foil_color`,name:`Foil Color`,type:`color`,default:[.92,.75,.25,1]},{id:`u_crinkle`,name:`Crinkle Intensity`,type:`float`,min:1,max:10,default:4},{id:`u_reflectivity`,name:`Highlight Brightness`,type:`float`,min:.3,max:2,default:1.4}]},ua=e({default:()=>da}),da={id:`nanotech_cells_artisan`,name:`Nano Plating`,category:`Technology`,added:`2026-04-16`,description:`Microscopic hexagonal active plating designed for dynamic aerodynamic surfaces.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Nano Zoom`,type:`float`,min:10,max:100,default:60},{id:`u_primary_color`,name:`Plate Surface`,type:`color`,default:[.15,.15,.18,1]},{id:`u_secondary_color`,name:`Nano Joint`,type:`color`,default:[0,.8,1,1]}]},fa=e({default:()=>pa}),pa={id:`nappa_leather_artisan`,name:`Nappa Leather`,category:`Racing`,added:`2026-04-16`,description:`Smooth premium leather grain with subtle organic pores found in high-end bucket seats.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Zoom`,type:`float`,min:50,max:200,default:100},{id:`u_primary_color`,name:`Leather Top`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Pore Deep`,type:`color`,default:[.05,.05,.05,1]}]},ma=e({default:()=>ha}),ha={id:`nebula_dust_artisan`,name:`Nebula Dust`,category:`Natural`,added:`2026-04-15`,description:`Soft, colored organic dust clouds found in interstellar gas formations.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Gas Density`,type:`float`,min:1,max:10,default:3},{id:`u_primary_color`,name:`Ionized Gas`,type:`color`,default:[.6,.1,.8,1]},{id:`u_secondary_color`,name:`Vacuum`,type:`color`,default:[0,0,.05,1]}]},ga=e({default:()=>_a}),_a={id:`neon_tubes_artisan`,name:`Neon Path`,category:`Abstract`,added:`2026-04-16`,description:`Glowing tubular neon paths mimicking high-fidelity urban lighting rigs.`,shader:`
    vec4 generate() {
      float y = fract(v_uv.y * u_scale);
      float mask = smoothstep(0.1, 0.2, y) * smoothstep(0.9, 0.8, y);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tube Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Neon Glow`,type:`color`,default:[1,0,.5,1]},{id:`u_secondary_color`,name:`Vacuum Background`,type:`color`,default:[.05,0,.05,1]}]},va=e({default:()=>ya}),ya={id:`neoprene`,name:`Neoprene`,category:`Industrial`,added:`2026-05-01`,description:`Dense rubber neoprene with a characteristic small-cell foam surface texture and slightly glossy matte finish, as used in wetsuits and padding.`,shader:`

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
  `,uniforms:[{id:`u_cell_size`,name:`Cell Size`,type:`float`,min:5,max:40,default:18},{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.05,.05,.05,1]},{id:`u_sheen`,name:`Sheen`,type:`float`,min:0,max:1,default:.3}]},ba=e({default:()=>xa}),xa={id:`neural_net_artisan`,name:`Neural Network`,category:`Technology`,added:`2026-04-16`,description:`Interconnected nodes and synthetic logic lines mimicking artificial intelligence structures.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Node Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Synapse`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Neural Base`,type:`color`,default:[.01,.02,.05,1]}]},Sa=e({default:()=>Ca}),Ca={id:`nomex_weave`,name:`Nomex Fire Suit Weave`,category:`Racing`,added:`2026-05-13`,description:`FIA-grade Nomex aramid weave as found on fire suits, helmet liners, and race car interiors. Tight 2/1 diagonal twill structure.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Scale`,type:`float`,default:90,min:30,max:220},{id:`u_angle`,name:`Weave Angle`,type:`float`,default:.5,min:0,max:1},{id:`u_fiber_color`,name:`Fibre Colour`,type:`color`,default:[.92,.84,.62,1]}]},wa=e({default:()=>Ta}),Ta={id:`obsidian_fracture_artisan`,name:`Obsidian Flow`,category:`Geology`,added:`2026-04-16`,description:`Sharp, mirror-like volcanic glass fractures found in fresh obsidian flows.`,shader:`
    vec4 generate() {
      float n = hash(floor(v_uv * u_scale));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Fracture Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Glass High`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Glass Shore`,type:`color`,default:[0,0,0,1]}]},Ea=e({default:()=>Da}),Da={id:`oil_canvas_artisan`,name:`Oil Canvas Strokes`,category:`Abstract`,added:`2026-04-15`,description:`Directional brush-stroke noise mimicking thick oil paint on canvas.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = hash(floor(uv.y * 50.0) + vec2(floor(uv.x * 2.0), 0.0));
      float mask = smoothstep(0.4, 0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Canvas Zoom`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Paint Color`,type:`color`,default:[.6,.1,.2,1]},{id:`u_secondary_color`,name:`Canvas Weave`,type:`color`,default:[.8,.75,.7,1]}]},Oa=e({default:()=>ka}),ka={id:`oil_slick`,name:`Oil Slick`,category:`Natural`,added:`2026-05-01`,description:`Thin-film oil interference on wet dark tarmac — rainbow iridescence bands in sinuous organic puddles.`,shader:`
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
  `,uniforms:[{id:`u_band_scale`,name:`Band Scale`,type:`float`,min:1,max:10,default:3},{id:`u_iridescence`,name:`Color Intensity`,type:`float`,min:0,max:2,default:1.2},{id:`u_wetness`,name:`Puddle Coverage`,type:`float`,min:0,max:1,default:.8}]},Aa=e({default:()=>ja}),ja={id:`oil_stain`,name:`Oil Stain`,category:`Industrial`,added:`2026-04-30`,description:`Dark oil and grease stains on a concrete substrate with irregular pooling and thin-film iridescence at dried edges.`,shader:`
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
  `,uniforms:[{id:`u_stain_count`,name:`Stain Count`,type:`float`,min:1,max:8,default:3},{id:`u_substrate`,name:`Substrate`,type:`color`,default:[.25,.23,.22,1]}]},Ma=e({default:()=>Na}),Na={id:`olive_branch_artisan`,name:`Olive Branch`,category:`Natural`,added:`2026-04-15`,description:`Symmetrical leaf layering along a spine, symbolizing peace and precision.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Branch Length`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Branch Color`,type:`color`,default:[.4,.5,.2,1]},{id:`u_secondary_color`,name:`Base`,type:`color`,default:[.05,.05,.02,1]}]},Pa=e({default:()=>Fa}),Fa={id:`optical_fiber_bundle_artisan`,name:`Optical Fiber Bundle`,category:`Technology`,added:`2026-05-13`,description:`Glowing fiber optic cables of varying diameters, bleeding light into a dark resin matrix.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Bundle Scale`,type:`float`,min:2,max:20,default:8},{id:`u_resin_matrix`,name:`Resin Base`,type:`color`,default:[.05,.05,.05,1]},{id:`u_cladding`,name:`Fiber Cladding`,type:`color`,default:[.2,.2,.25,1]},{id:`u_fiber_glow`,name:`Light Transmission`,type:`color`,default:[0,.8,1,1]},{id:`u_fiber_dark`,name:`Inactive Fiber`,type:`color`,default:[.1,.1,.2,1]},{id:`u_flow`,name:`Data Flow`,type:`float`,min:0,max:100,default:0}]},Ia=e({default:()=>La}),La={id:`origami_fold`,name:`Origami Fold`,category:`Geometric`,added:`2026-05-01`,description:`Origami crease pattern with radiating mountain and valley fold lines on cream paper.`,shader:`
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
  `,uniforms:[{id:`u_complexity`,type:`float`,default:2.5,min:1,max:5,name:`Complexity`},{id:`u_paper_color`,type:`color`,default:[.96,.94,.9,1],name:`Paper Colour`},{id:`u_crease_color`,type:`color`,default:[.55,.5,.45,1],name:`Crease Colour`}]},Ra=e({default:()=>za}),za={id:`paint_chips`,name:`Paint Chips`,category:`Industrial`,added:`2026-04-30`,description:`Chipped and scratched paint surface revealing bare metal substrate through irregular chips and long directional scratches.`,shader:`
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
  `,uniforms:[{id:`u_chip_density`,name:`Chip Density`,type:`float`,min:1,max:20,default:8},{id:`u_base_color`,name:`Metal Substrate`,type:`color`,default:[.15,.15,.18,1]},{id:`u_paint_color`,name:`Paint Color`,type:`color`,default:[.3,.05,.05,1]}]},Ba=e({default:()=>Va}),Va={id:`paisley_bandana`,name:`Paisley Bandana`,category:`Abstract`,added:`2026-06-11`,description:`Bandana-style repeat of curled paisley boteh teardrops with echo outlines, center dots and dotted halo rings, alternating orientation on a staggered grid.`,shader:`

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
  `,variants:[{name:`Bandana Red`,uniforms:{u_color_motif:[.97,.95,.92,1],u_color_accent:[.12,.05,.05,1],u_color_bg:[.62,.1,.12,1]}},{name:`Bandana Blue`,uniforms:{u_color_motif:[.96,.96,.97,1],u_color_accent:[.04,.05,.12,1],u_color_bg:[.12,.2,.45,1]}},{name:`Black & Gold`,uniforms:{u_color_motif:[.88,.71,.28,1],u_color_accent:[.55,.42,.15,1],u_color_bg:[.06,.06,.07,1]}},{name:`Ivory`,uniforms:{u_color_motif:[.35,.3,.26,1],u_color_accent:[.62,.54,.44,1],u_color_bg:[.94,.91,.84,1]}}],uniforms:[{id:`u_scale`,name:`Motif Scale`,type:`float`,min:2,max:14,default:5},{id:`u_dots`,name:`Dot Detail`,type:`float`,min:0,max:1,default:1},{id:`u_line`,name:`Line Thickness`,type:`float`,min:.005,max:.05,default:.016},{id:`u_color_motif`,name:`Motif Color`,type:`color`,default:[.97,.95,.92,1]},{id:`u_color_accent`,name:`Accent Color`,type:`color`,default:[.12,.05,.05,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.62,.1,.12,1]}]},Ha=e({default:()=>Ua}),Ua={id:`palm_fronds_artisan`,name:`Palm Fronds`,category:`Natural`,added:`2026-04-15`,description:`Fan-like radial leaf structures found in tropical palm trees.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float a = atan(uv.y, uv.x);
      float r = length(uv);
      
      float frond = sin(a * 15.0) * step(r, 1.0) * step(0.1, r);
      float mask = smoothstep(0.0, 0.1, frond);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Frond Length`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Palm Leaf`,type:`color`,default:[.1,.6,.2,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[0,0,0,1]}]},Wa=e({default:()=>Ga}),Ga={id:`paper_tear_artisan`,name:`Aggressive Tear`,category:`Abstract`,added:`2026-04-15`,description:`High-intensity directional shreds and jagged ruptures mimicking ripped metal or heavy cardstock.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Shred Scale`,type:`float`,min:1,max:10,default:3},{id:`u_intensity`,name:`Aggression`,type:`float`,min:.1,max:5,default:2},{id:`u_primary_color`,name:`Top Layer`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Deep Tear`,type:`color`,default:[.95,.95,.95,1]}]},Ka=e({default:()=>qa}),qa={id:`pcb_traces_v3_artisan`,name:`Pro PCB Logic`,category:`Technology`,added:`2026-04-16`,description:`Triple-layer circuit logic with advanced bus-routing and microscopic trace detail.`,shader:`
    vec4 generate() {
      float lines = sin(v_uv.x * 400.0) * sin(v_uv.y * 400.0);
      float mask = step(0.1, abs(lines));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Trace Copper`,type:`color`,default:[1,.6,.1,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[0,.15,.05,1]}]},Ja=e({default:()=>Ya}),Ya={id:`peacock_eyes_artisan`,name:`Peacock Eyes`,category:`Natural`,added:`2026-04-15`,description:`Ornate organic pattern mimicking the "eyes" found in peacock feathers.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      vec4 col = u_secondary_color;
      col = mix(col, u_primary_color, smoothstep(0.4, 0.35, d));
      col = mix(col, vec4(0.0, 0.0, 0.5, 1.0), smoothstep(0.25, 0.2, d));
      col = mix(col, vec4(0.0, 1.0, 1.0, 1.0), smoothstep(0.1, 0.05, d));
      return col;
    }
  `,uniforms:[{id:`u_scale`,name:`Eye Count`,type:`float`,min:2,max:20,default:6},{id:`u_primary_color`,name:`Eye Border`,type:`color`,default:[.1,.8,.3,1]},{id:`u_secondary_color`,name:`Feather Base`,type:`color`,default:[.05,.2,.05,1]}]},Xa=e({default:()=>Za}),Za={id:`pearl_flake_paint`,name:`Pearl Flake Paint`,category:`Racing`,added:`2026-04-30`,description:`Iridescent pearl automotive paint with hue-shifting colour across the surface and fine mica flake shimmer.`,shader:`

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
  `,uniforms:[{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.95,.93,.9,1]},{id:`u_shift_amount`,name:`Colour Shift`,type:`float`,min:0,max:1,default:.4},{id:`u_flake_density`,name:`Mica Density`,type:`float`,min:100,max:1e3,default:400}]},Qa=e({default:()=>$a}),$a={id:`peat_moss_artisan`,name:`Peat Moss`,category:`Natural`,added:`2026-04-16`,description:`Dense organic clumpy sprawl mimicking professional landscape and high-fidelity vegetation.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * u_scale + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Moss Density`,type:`float`,min:20,max:200,default:80},{id:`u_primary_color`,name:`Moss High`,type:`color`,default:[.3,.4,.2,1]},{id:`u_secondary_color`,name:`Moss Deep`,type:`color`,default:[.1,.15,.05,1]}]},eo=e({default:()=>to}),to={id:`penrose_tiling_artisan`,name:`Penrose Mesh`,category:`Abstract`,added:`2026-04-16`,description:`Aperiodic, non-repeating tiling lines mimicking complex mathematical quasicrystal structures.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Penrose Detail`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Tiling Line`,type:`color`,default:[1,.8,0,1]},{id:`u_secondary_color`,name:`Void Space`,type:`color`,default:[.05,.05,.1,1]}]},no=e({default:()=>ro}),ro={id:`perforated_leather`,name:`Perforated Leather`,category:`Industrial`,added:`2026-05-01`,description:`Smooth leather with a regular diamond punched-hole pattern over a contrasting backing, as used in racing seats and steering wheel grips.`,shader:`

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
  `,uniforms:[{id:`u_hole_density`,name:`Hole Density`,type:`float`,min:4,max:30,default:14},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.2,max:.7,default:.45},{id:`u_leather_color`,name:`Leather Color`,type:`color`,default:[.12,.1,.08,1]},{id:`u_backing_color`,name:`Backing Color`,type:`color`,default:[.85,.05,.05,1]}]},io=e({default:()=>ao}),ao={id:`perforated_sheet`,name:`Perforated Sheet`,category:`Industrial`,added:`2026-04-30`,description:`CNC-perforated aluminium sheet with round punched-through holes and chamfer highlights on hole rims.`,shader:`
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
  `,uniforms:[{id:`u_density`,name:`Hole Density`,type:`float`,min:2,max:40,default:16},{id:`u_hole_size`,name:`Hole Size`,type:`float`,min:.2,max:.85,default:.55},{id:`u_metal_color`,name:`Metal Color`,type:`color`,default:[.78,.8,.82,1]}]},oo=e({default:()=>so}),so={id:`petrified_wood_artisan`,name:`Petrified Wood`,category:`Geology`,added:`2026-04-16`,description:`Fossilized wood grain with vibrant mineral staining and crystalized structures.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Chert High`,type:`color`,default:[.8,.4,.2,1]},{id:`u_secondary_color`,name:`Silt Deep`,type:`color`,default:[.4,.2,.1,1]}]},co=e({default:()=>lo}),lo={id:`pine_bark_artisan`,name:`Pine Bark`,category:`Natural`,added:`2026-04-16`,description:`Rough, vertical flaky ridges found on mature pine trees.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,uniforms:[{id:`u_scale`,name:`Bark Detail`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Bark High`,type:`color`,default:[.3,.2,.15,1]},{id:`u_secondary_color`,name:`Bark Crevice`,type:`color`,default:[.15,.1,.08,1]}]},uo=e({default:()=>fo}),fo={id:`piston_top_artisan`,name:`Piston Head`,category:`Racing`,added:`2026-04-16`,description:`Concentric rings of machined high-performance aluminum with heat seasoning.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float rings = sin(d * u_scale);
      float mask = smoothstep(-0.5, 0.5, rings);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Ring Density`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Alloy High`,type:`color`,default:[.8,.8,.85,1]},{id:`u_secondary_color`,name:`Alloy Deep`,type:`color`,default:[.6,.6,.65,1]}]},po=e({default:()=>mo}),mo={id:`pixel_art_canvas_artisan`,name:`Pixel Grid`,category:`Abstract`,added:`2026-04-16`,description:`Large-block quantized color grid mimicking retro 8-bit digital canvases.`,shader:`
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Pixel Size`,type:`float`,min:8,max:128,default:32},{id:`u_primary_color`,name:`Pixel High`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Pixel Dark`,type:`color`,default:[.5,.5,.5,1]}]},ho=e({default:()=>go}),go={id:`plaid_tartan_artisan`,name:`Plaid Tartan`,category:`Abstract`,added:`2026-04-15`,description:`Multi-colored interlocking textile grid found in classic Scottish kilts.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,0,0,1],u_secondary_color:[0,.2,.1,1],u_accent_color:[.95,.9,.3,1],u_band:.3,u_accent_width:0}},{name:`Royal Stewart`,uniforms:{u_primary_color:[.08,.1,.3,1],u_secondary_color:[.6,.07,.1,1],u_accent_color:[.95,.85,.25,1],u_band:.28,u_accent_width:.02}},{name:`Blackwatch`,uniforms:{u_primary_color:[.05,.22,.12,1],u_secondary_color:[.05,.12,.2,1],u_accent_color:[.08,.08,.1,1],u_band:.35,u_accent_width:.025}},{name:`Grey Flannel`,uniforms:{u_primary_color:[.2,.2,.22,1],u_secondary_color:[.45,.45,.47,1],u_accent_color:[.7,.15,.15,1],u_band:.3,u_accent_width:.015}}],uniforms:[{id:`u_scale`,name:`Grid Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_band`,name:`Band Width`,type:`float`,min:.05,max:.6,default:.3},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.1,default:.008},{id:`u_accent_width`,name:`Overcheck Width`,type:`float`,min:0,max:.1,default:0},{id:`u_primary_color`,name:`Stripe`,type:`color`,default:[1,0,0,1]},{id:`u_secondary_color`,name:`Base Wool`,type:`color`,default:[0,.2,.1,1]},{id:`u_accent_color`,name:`Overcheck`,type:`color`,default:[.95,.9,.3,1]}]},_o=e({default:()=>vo}),vo={id:`plant_cells_artisan`,name:`Plant Cells`,category:`Natural`,added:`2026-04-15`,description:`Geometric hexagonal-ish stacked cells mimicking biological plant structures.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Cell Magnification`,type:`float`,min:2,max:15,default:8},{id:`u_primary_color`,name:`Chlorophyll`,type:`color`,default:[.2,.5,.1,1]},{id:`u_secondary_color`,name:`Cell Wall`,type:`color`,default:[.1,.2,.05,1]}]},yo=e({default:()=>bo}),bo={id:`plasma_core_artisan`,name:`Plasma Core`,category:`Abstract`,added:`2026-04-16`,description:`Pulsing radial energy patterns mimicking high-energy physics experiment cores.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale - 1.5708);
      float mask = smoothstep(0.2, 0.5, pulse * (1.0 - d));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pulse Speed`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Plasma Glow`,type:`color`,default:[1,.4,1,1]},{id:`u_secondary_color`,name:`Plasma Void`,type:`color`,default:[.1,0,.1,1]}]},xo=e({default:()=>So}),So={id:`pleated_fabric`,name:`Pleated Fabric`,category:`Industrial`,added:`2026-05-01`,description:`Accordion-pleated fabric with lit faces, shadowed valleys, and specular fold edges.`,shader:`
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
  `,uniforms:[{id:`u_pleat_count`,type:`float`,default:12,min:4,max:30,name:`Pleat Count`},{id:`u_fabric_color`,type:`color`,default:[.15,.15,.18,1],name:`Fabric Colour`},{id:`u_depth`,type:`float`,default:1,min:.2,max:2,name:`Fold Depth`}]},Co=e({default:()=>wo}),wo={id:`polka_dot_artisan`,name:`Pro Polka Dots`,category:`Organic`,added:`2026-04-15`,description:`Precision uniform polka dots with adjustable spacing and edge softness.`,shader:`
    vec4 generate() {
      vec2 uv = fract(v_uv * u_scale) - 0.5;
      float d = length(uv);
      float mask = smoothstep(u_radius, u_radius - 0.02, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dot Count`,type:`float`,min:2,max:50,default:10},{id:`u_radius`,name:`Dot Size`,type:`float`,min:.1,max:.5,default:.3},{id:`u_primary_color`,name:`Dot Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Base Color`,type:`color`,default:[.05,.05,.1,1]}]},To=e({default:()=>Eo}),Eo={id:`powder_coat`,name:`Powder Coat`,category:`Industrial`,added:`2026-05-13`,description:`Powder coat finish with characteristic orange-peel micro-texture. Common on roll cages, wheel centres, and suspension components.`,shader:`
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
  `,uniforms:[{id:`u_coat_color`,name:`Coat Colour`,type:`color`,default:[.08,.08,.09,1]},{id:`u_peel_scale`,name:`Peel Scale`,type:`float`,default:60,min:10,max:150},{id:`u_depth`,name:`Texture Depth`,type:`float`,default:.6,min:0,max:1},{id:`u_gloss`,name:`Gloss Level`,type:`float`,default:.4,min:0,max:1}]},Do=e({default:()=>Oo}),Oo={id:`prism_shards_artisan`,name:`Prism Shards`,category:`Abstract`,added:`2026-04-15`,description:`Sharp refracted geometric light cells with internal color shifts across the spectrum.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Refraction Density`,type:`float`,min:2,max:15,default:8}]},ko=e({default:()=>Ao}),Ao={id:`prismatic_flip`,name:`Prismatic Flip Paint`,category:`Racing`,added:`2026-05-13`,description:`Colour-shifting flip paint that sweeps through the spectrum across the surface — as seen on modern motorsport liveries and special-edition road cars.`,shader:`
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
  `,uniforms:[{id:`u_base_hue`,name:`Base Hue`,type:`float`,default:0,min:0,max:1},{id:`u_range`,name:`Hue Range`,type:`float`,default:.55,min:.05,max:2},{id:`u_direction`,name:`Direction`,type:`float`,default:.3,min:0,max:1},{id:`u_saturation`,name:`Saturation`,type:`float`,default:.88,min:.1,max:1},{id:`u_brightness`,name:`Brightness`,type:`float`,default:.88,min:.2,max:1},{id:`u_turbulence`,name:`Turbulence`,type:`float`,default:.28,min:0,max:1}]},jo=e({default:()=>Mo}),Mo={id:`pulsar_radial_artisan`,name:`Pulsar Radial`,category:`Abstract`,added:`2026-04-16`,description:`High-frequency radial pulses mimicking deep-space electromagnetic emissions.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5);
      float pulse = sin(d * u_scale);
      float mask = step(0.5, pulse);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pulse Freq`,type:`float`,min:50,max:500,default:200},{id:`u_primary_color`,name:`Pulsar Beam`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Space Void`,type:`color`,default:[0,0,0,1]}]},No=e({default:()=>Po}),Po={id:`quantum_foam_artisan`,name:`Quantum Foam`,category:`Abstract`,added:`2026-04-15`,description:`Abstract probability interference and grain noise mimicking fluctuations at the Planck scale.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale) * hash(v_uv * u_scale * 1.1);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_scale`,name:`Planck Resolution`,type:`float`,min:100,max:1e3,default:500},{id:`u_primary_color`,name:`Fluctuation`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Vacuum`,type:`color`,default:[0,0,.05,1]}]},Fo=e({default:()=>Io}),Io={id:`quartz_crystal_artisan`,name:`Quartz Plane`,category:`Geology`,added:`2026-04-16`,description:`Sharp geometric crystalline planes and internal mineral prisms.`,shader:`
    vec4 generate() {
      float d = abs(v_uv.x - 0.5) + abs(v_uv.y - 0.5);
      float mask = step(0.4, fract(d * u_scale));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Crystal Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Quartz Face`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Prism Core`,type:`color`,default:[.8,.8,.9,1]}]},Lo=e({default:()=>Ro}),Ro={id:`racing_livery_stripe`,name:`Racing Livery Stripe`,category:`Racing`,added:`2026-05-01`,description:`Dual-tone diagonal speed stripe with gradient fade and crisp edges â€” a classic motorsport livery element.`,shader:`
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
  `,uniforms:[{id:`u_stripe_color`,type:`color`,default:[.9,.1,.1,1],name:`Stripe Colour`},{id:`u_bg_color`,type:`color`,default:[.05,.05,.05,1],name:`Background Colour`},{id:`u_stripe_width`,type:`float`,default:.45,min:.1,max:.9,name:`Stripe Width`},{id:`u_angle`,type:`float`,default:.3,min:-1,max:1,name:`Stripe Angle`}]},zo=e({default:()=>Bo}),Bo={id:`radial_gradient_artisan`,name:`Master Radial`,category:`Abstract`,added:`2026-04-15`,description:`Focus-aligned radial gradient transition.`,shader:`
    vec4 generate() {
      float d = length(v_uv - 0.5) * 2.0;
      float mask = smoothstep(0.0, 1.0, d);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Center Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Outer Color`,type:`color`,default:[0,0,0,1]}]},Vo=e({default:()=>Ho}),Ho={id:`radiolarian_skeletons_artisan`,name:`Radiolarian Skeletons`,category:`Organic`,added:`2026-05-13`,description:`Intricate, symmetrical, perforated silica shells based on microscopic marine zooplankton.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Plankton Scale`,type:`float`,min:2,max:20,default:5},{id:`u_fluid_bg`,name:`Marine Fluid`,type:`color`,default:[.05,.15,.2,1]},{id:`u_silica_shadow`,name:`Silica Core`,type:`color`,default:[.7,.75,.8,1]},{id:`u_silica_highlight`,name:`Silica Edge`,type:`color`,default:[.95,.95,1,1]}]},Uo=e({default:()=>Wo}),Wo={id:`rain_on_glass`,name:`Rain on Glass`,category:`Natural`,added:`2026-04-30`,description:`Rainwater on a tinted glass windshield — beaded droplets with meniscus rim highlights and wavy vertical rivulets.`,shader:`
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
  `,uniforms:[{id:`u_glass_color`,name:`Glass Tint`,type:`color`,default:[.1,.13,.16,1]},{id:`u_drop_density`,name:`Drop Density`,type:`float`,min:2,max:20,default:8},{id:`u_rivulet_count`,name:`Rivulet Count`,type:`float`,min:2,max:20,default:8},{id:`u_wetness`,name:`Wetness`,type:`float`,min:0,max:1,default:.7}]},Go=e({default:()=>Ko}),Ko={id:`reaction_diffusion_artisan`,name:`Reaction Diffusion`,category:`Abstract`,added:`2026-04-15`,description:`Organic biological growth and coral-like patterns mimicking chemical morphogenesis.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Growth Scale`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Organism`,type:`color`,default:[.8,.4,.2,1]},{id:`u_secondary_color`,name:`Substrate`,type:`color`,default:[.1,.05,0,1]}]},qo=e({default:()=>Jo}),Jo={id:`realistic_viper_artisan`,name:`Realistic Viper`,category:`Natural`,added:`2026-04-15`,description:`Small, diamond-shaped high-fidelity interlocking scales mimicking viper skin.`,shader:`
    vec4 generate() {
      mat2 m = mat2(0.707, -0.707, 0.707, 0.707);
      vec2 uv = m * v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:10,max:80,default:40},{id:`u_primary_color`,name:`Scales`,type:`color`,default:[.1,.15,.05,1]},{id:`u_secondary_color`,name:`Skin Deep`,type:`color`,default:[0,.05,0,1]}]},Yo=e({default:()=>Xo}),Xo={id:`rim_spoke_carbon_artisan`,name:`Spoke Carbon`,category:`Racing`,added:`2026-04-16`,description:`Multi-layered carbon strands optimized for high-strength wheel spokes.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float lines = sin(uv.x + uv.y) * sin(uv.x - uv.y);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Fiber Top`,type:`color`,default:[.2,.2,.22,1]},{id:`u_secondary_color`,name:`Resin Base`,type:`color`,default:[.1,.1,.12,1]}]},Zo=e({default:()=>Qo}),Qo={id:`river_cobble_artisan`,name:`River Cobble`,category:`Natural`,added:`2026-04-15`,description:`Smooth, irregular organic stone clusters mimicking riverbed masonry.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stone Grey`,type:`color`,default:[.6,.6,.65,1]},{id:`u_secondary_color`,name:`Joint`,type:`color`,default:[.1,.1,.1,1]}]},$o=e({default:()=>es}),es={id:`river_stone_artisan`,name:`River Stones`,category:`Natural`,added:`2026-04-16`,description:`Smooth rounded pebble shapes mimicking naturally eroded riverbed stones.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Stone Size`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Pebble Surface`,type:`color`,default:[.5,.5,.5,1]},{id:`u_secondary_color`,name:`Joint Sediment`,type:`color`,default:[.3,.3,.3,1]}]},ts=e({default:()=>ns}),ns={id:`rivet_lines_pro`,name:`Panel Rivets`,category:`Industrial`,added:`2026-04-15`,description:`Structural rivet seams for automotive panels.`,shader:`
    vec4 generate() {
      vec2 g = fract(v_uv * u_scale) - 0.5;
      float d = length(g);
      float mask = step(0.3, d) * step(d, 0.35);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rivet Spacing`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Rivet`,type:`color`,default:[.6,.6,.6,1]},{id:`u_secondary_color`,name:`Panel`,type:`color`,default:[.35,.35,.35,1]}]},rs=e({default:()=>is}),is={id:`rivet_plate_elite`,name:`Rivet Plate Elite`,category:`Industrial`,added:`2026-04-15`,description:`Overlapping heavy armor sections with structural corner rivets.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Plate Count`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Armor Steel`,type:`color`,default:[.5,.5,.55,1]},{id:`u_secondary_color`,name:`Seam`,type:`color`,default:[.1,.1,.12,1]}]},as=e({default:()=>os}),os={id:`roll_cage_foam_artisan`,name:`Roll Cage Foam`,category:`Racing`,added:`2026-04-16`,description:`Dense, pitted cellular protective foam found on professional roll cage padding.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Cell Density`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Foam Body`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Pore Shade`,type:`color`,default:[.05,.05,.05,1]}]},ss=e({default:()=>cs}),cs={id:`roof_shingles_artisan`,name:`Scalloped Shingles`,category:`Industrial`,added:`2026-04-15`,description:`Overlapping curved roofing tiles used in architectural design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = step(d, 0.5);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Rows`,type:`float`,min:5,max:30,default:15},{id:`u_primary_color`,name:`Shingle`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Rim`,type:`color`,default:[.4,.4,.45,1]}]},ls=e({default:()=>us}),us={id:`root_system_artisan`,name:`Root System`,category:`Natural`,added:`2026-04-16`,description:`Branching procedural line networks found in organic root systems and neural pathways.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Branching`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Root Fiber`,type:`color`,default:[.5,.4,.3,1]},{id:`u_secondary_color`,name:`Soil Deep`,type:`color`,default:[.1,.08,.05,1]}]},ds=e({default:()=>fs}),fs={id:`rose_gold_brushed`,name:`Rose Gold Brushed`,category:`Industrial`,added:`2026-05-01`,description:`Directional brushed rose gold metal with warm pink-gold grain streaks and a subtle specular sheen band.`,shader:`
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
  `,uniforms:[{id:`u_grain`,name:`Grain Density`,type:`float`,min:5,max:100,default:40},{id:`u_sheen`,name:`Sheen Intensity`,type:`float`,min:0,max:1,default:.6},{id:`u_base_color`,name:`Base Color`,type:`color`,default:[.88,.65,.55,1]}]},ps=e({default:()=>ms}),ms={id:`rubber_compound`,name:`Rubber Compound`,category:`Racing`,added:`2026-05-01`,description:`Fresh vulcanised racing tyre rubber — near-black carbon grain, subtle mould-release sheen, and low-frequency press flow marks.`,shader:`
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
  `,uniforms:[{id:`u_compound_color`,name:`Rubber Color`,type:`color`,default:[.06,.05,.04,1]},{id:`u_grain`,name:`Surface Grain`,type:`float`,min:5,max:50,default:20},{id:`u_sheen`,name:`Rubber Gloss`,type:`float`,min:0,max:1,default:.4}]},hs=e({default:()=>gs}),gs={id:`safety_harness_artisan`,name:`Safety Harness`,category:`Racing`,added:`2026-04-16`,description:`Heavy-duty nylon web weave found in 5-point and 6-point racing harnesses.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * 40.0;
      float lines = sin(uv.x) * sin(uv.y * 5.0);
      float mask = smoothstep(-0.5, 0.5, lines);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Nylon Web`,type:`color`,default:[.5,0,0,1]},{id:`u_secondary_color`,name:`Weave Gap`,type:`color`,default:[.1,0,0,1]}]},_s=e({default:()=>vs}),vs={id:`sakura_petals`,name:`Sakura Petals`,category:`Natural`,added:`2026-06-11`,description:`Scattered cherry-blossom petals drifting across the surface at three depths, each petal a softly notched teardrop with its own size, tilt and tint.`,shader:`

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
  `,variants:[{name:`Spring Pink`,uniforms:{u_color_petal:[.99,.78,.85,1],u_color_accent:[.88,.45,.62,1],u_color_bg:[1,.96,.96,1]}},{name:`White Blossom`,uniforms:{u_color_petal:[.99,.98,.97,1],u_color_accent:[.82,.76,.8,1],u_color_bg:[.66,.78,.82,1]}},{name:`Night Bloom`,uniforms:{u_color_petal:[.85,.55,.75,1],u_color_accent:[.55,.25,.5,1],u_color_bg:[.05,.04,.1,1]}},{name:`Autumn Gold`,uniforms:{u_color_petal:[.94,.72,.3,1],u_color_accent:[.72,.4,.12,1],u_color_bg:[.16,.09,.06,1]}}],uniforms:[{id:`u_density`,name:`Petal Density`,type:`float`,min:2,max:14,default:6},{id:`u_var`,name:`Size Variation`,type:`float`,min:0,max:1,default:.55},{id:`u_chaos`,name:`Rotation Chaos`,type:`float`,min:0,max:1,default:1},{id:`u_color_petal`,name:`Petal Color`,type:`color`,default:[.99,.78,.85,1]},{id:`u_color_accent`,name:`Petal Accent`,type:`color`,default:[.88,.45,.62,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[1,.96,.96,1]}]},ys=e({default:()=>bs}),bs={id:`salt_crystal_natural`,name:`Salt Crystal`,category:`Natural`,added:`2026-05-01`,description:`Cubic salt crystal formations of varying size seen from above, white and translucent on a dark substrate.`,shader:`
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
  `,uniforms:[{id:`u_density`,name:`Crystal Density`,type:`float`,min:4,max:30,default:14},{id:`u_crystal_color`,name:`Crystal Color`,type:`color`,default:[.92,.93,.95,1]},{id:`u_background`,name:`Background`,type:`color`,default:[.08,.06,.08,1]}]},xs=e({default:()=>Ss}),Ss={id:`sand_dunes_artisan`,name:`Sand Dunes`,category:`Natural`,added:`2026-04-15`,description:`Rippling wave-like ridges found in vast desert wastelands and oceanic floors.`,shader:`
    vec4 generate() {
      float waves = sin(v_uv.x * 20.0 * u_scale + sin(v_uv.y * 10.0));
      float mask = smoothstep(-0.5, 0.5, waves);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Dune Frequency`,type:`float`,min:.5,max:3,default:1},{id:`u_primary_color`,name:`Sunlight`,type:`color`,default:[.9,.7,.4,1]},{id:`u_secondary_color`,name:`Shadow`,type:`color`,default:[.4,.3,.15,1]}]},Cs=e({default:()=>ws}),ws={id:`sandblasted_steel`,name:`Sandblasted Steel`,category:`Industrial`,added:`2026-05-01`,description:`Bead-blasted aluminium or steel with uniform isotropic micro-crater texture and soft satin sheen.`,shader:`
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
  `,uniforms:[{id:`u_metal_color`,name:`Metal Color`,type:`color`,default:[.72,.72,.72,1]},{id:`u_grit`,name:`Grit Size`,type:`float`,min:20,max:200,default:80},{id:`u_sheen`,name:`Surface Sheen`,type:`float`,min:0,max:1,default:.3}]},Ts=e({default:()=>Es}),Es={id:`sandstone_layers_artisan`,name:`Sandstone Strata`,category:`Geology`,added:`2026-04-16`,description:`Fine horizontal layers and sediments found in weathered sandstone walls.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = v_uv.y * u_scale;
      float strata = hash(floor(y));
      return mix(u_secondary_color, u_primary_color, strata);
    }
  `,uniforms:[{id:`u_scale`,name:`Strata Density`,type:`float`,min:20,max:200,default:100},{id:`u_primary_color`,name:`Sediment High`,type:`color`,default:[.8,.6,.4,1]},{id:`u_secondary_color`,name:`Sediment Deep`,type:`color`,default:[.6,.4,.3,1]}]},Ds=e({default:()=>Os}),Os={id:`seat_perforation_artisan`,name:`Seat Perforation`,category:`Racing`,added:`2026-04-16`,description:`Grid of fine ventilation holes found in professional bucket seats and luxury automotive leather.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.3, 0.28, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Hole Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Punch Hold`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Leather Surface`,type:`color`,default:[.1,.1,.1,1]}]},ks=e({default:()=>As}),As={id:`seigaiha_wave`,name:`Seigaiha Waves`,category:`Geometric`,added:`2026-06-11`,description:`The classic Japanese seigaiha wave pattern: staggered overlapping fans of crisp concentric semicircle arcs, like a stylized sea.`,shader:`

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
  `,variants:[{name:`Indigo`,uniforms:{u_color_line:[.93,.96,.98,1],u_color_bg:[.1,.2,.42,1]}},{name:`Gold on Black`,uniforms:{u_color_line:[.85,.68,.25,1],u_color_bg:[.05,.05,.06,1]}},{name:`Sakura Pink`,uniforms:{u_color_line:[1,.96,.97,1],u_color_bg:[.91,.55,.67,1]}},{name:`Mono`,uniforms:{u_color_line:[.12,.12,.13,1],u_color_bg:[.93,.93,.92,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:2,max:16,default:6},{id:`u_rings`,name:`Rings Per Fan`,type:`float`,min:2,max:10,default:5},{id:`u_line`,name:`Line Thickness`,type:`float`,min:.06,max:.9,default:.36},{id:`u_color_line`,name:`Line Color`,type:`color`,default:[.93,.96,.98,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.1,.2,.42,1]}]},js=e({default:()=>Ms}),Ms={id:`server_rack_mesh_artisan`,name:`Server Mesh`,category:`Industrial`,added:`2026-04-16`,description:`Industrial perforated metal mesh found on high-density enterprise server racks.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.45, 0.42, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Mesh Zoom`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Steel Rack`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Internal Shadow`,type:`color`,default:[0,0,0,1]}]},Ns=e({default:()=>Ps}),Ps={id:`shift_boot_leather_artisan`,name:`Shift Boot Leather`,category:`Racing`,added:`2026-04-16`,description:`Organic crumpled leather folds and distressed textures found in shift boots and gaiters.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 10.0 + noise(v_uv * 5.0) * 2.0);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Leather High`,type:`color`,default:[.12,.1,.08,1]},{id:`u_secondary_color`,name:`Fold Shadow`,type:`color`,default:[.05,.04,.03,1]}]},Fs=e({default:()=>Is}),Is={id:`sierpinski_carpet_artisan`,name:`Fractal Carpet`,category:`Abstract`,added:`2026-04-16`,description:`Recursive square fractal grid structures found in high-performance digital logic layouts.`,shader:`
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
  `,uniforms:[{id:`u_primary_color`,name:`Logic High`,type:`color`,default:[0,1,1,1]},{id:`u_secondary_color`,name:`Deep Silicon`,type:`color`,default:[0,.05,.1,1]}]},Ls=e({default:()=>Rs}),Rs={id:`sierpinski_mesh_artisan`,name:`Fractal Mesh`,category:`Abstract`,added:`2026-04-16`,description:`Recursive Sierpinski triangle fractal structures found in high-performance lightweight parts.`,shader:`
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
  `,uniforms:[{id:`u_primary_color`,name:`Fractal Web`,type:`color`,default:[0,1,.5,1]},{id:`u_secondary_color`,name:`Fractal Hole`,type:`color`,default:[0,.1,.05,1]}]},zs=e({default:()=>Bs}),Bs={id:`single_rivet_line_artisan`,name:`Single Rivet Row`,category:`Industrial`,added:`2026-04-16`,description:`A single linear row of industrial rivets for precision panel seams.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Rivet Count`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rivet Head`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.3,.3,.32,1]}]},Vs=e({default:()=>Hs}),Hs={id:`skeletal_mesh_artisan`,name:`Skeletal Mesh`,category:`Abstract`,added:`2026-04-15`,description:`Periodic rib-like line patterns with organic jitter found in anatomical structures.`,shader:`
    vec4 generate() {
      float ribs = sin(v_uv.y * 50.0 * u_scale + sin(v_uv.x * 20.0));
      float mask = smoothstep(0.0, 0.1, ribs);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Rib Frequency`,type:`float`,min:.1,max:2,default:1},{id:`u_primary_color`,name:`Bone`,type:`color`,default:[.9,.9,.85,1]},{id:`u_secondary_color`,name:`Marrow`,type:`color`,default:[.1,.05,.05,1]}]},Us=e({default:()=>Ws}),Ws={id:`slate_rock_natural`,name:`Slate Rock`,category:`Natural`,added:`2026-05-01`,description:`Dark layered slate with parallel cleavage planes, fine horizontal grain, and occasional crossing fracture lines.`,shader:`
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
  `,uniforms:[{id:`u_layer_freq`,name:`Layer Frequency`,type:`float`,min:4,max:40,default:16},{id:`u_base_color`,name:`Slate Color`,type:`color`,default:[.22,.24,.27,1]},{id:`u_fracture`,name:`Fracture Density`,type:`float`,min:0,max:1,default:.4}]},Gs=e({default:()=>Ks}),Ks={id:`snake_skin_artisan`,name:`Snake Skin`,category:`Natural`,added:`2026-04-15`,description:`Precisely interlocking reptilian scales with organic variance.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      
      float d = length(gv);
      float mask = smoothstep(0.45, 0.4, d);
      
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Density`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Scale Color`,type:`color`,default:[.2,.4,.1,1]},{id:`u_secondary_color`,name:`Underlayer`,type:`color`,default:[.05,.1,.02,1]}]},qs=e({default:()=>Js}),Js={id:`snake_skin_v2_artisan`,name:`Viper Scales`,category:`Natural`,added:`2026-04-16`,description:`Interlocking diamond scales found in aggressive predatory reptilian hide.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Scale Zoom`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Dorsal Scale`,type:`color`,default:[.1,.2,.1,1]},{id:`u_secondary_color`,name:`Inter-scale`,type:`color`,default:[0,0,0,1]}]},Ys=e({default:()=>Xs}),Xs={id:`soap_bubble_abstract`,name:`Soap Bubble`,category:`Abstract`,added:`2026-05-01`,description:`Iridescent soap film with thin-film interference hues, Newton ring bands, and a dark background.`,shader:`
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
  `,uniforms:[{id:`u_bubble_size`,name:`Bubble Size`,type:`float`,min:.5,max:3,default:1.2},{id:`u_iridescence`,name:`Iridescence`,type:`float`,min:.5,max:3,default:1.8},{id:`u_background`,name:`Background Color`,type:`color`,default:[.02,.02,.04,1]}]},Zs=e({default:()=>Qs}),Qs={id:`solar_flare_pro`,name:`Solar Flare`,category:`Abstract`,added:`2026-04-15`,description:`Static plasma energy flux with high-intensity radiation centers.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // Removed time dependency
      float n = noise(uv);
      float flare = pow(n, 3.0) * 2.0;
      return mix(u_secondary_color, u_primary_color, flare);
    }
  `,uniforms:[{id:`u_scale`,name:`Flare Scale`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Plasma Heat`,type:`color`,default:[1,.8,.2,1]},{id:`u_secondary_color`,name:`Corona`,type:`color`,default:[.5,.1,0,1]}]},$s=e({default:()=>ec}),ec={id:`solar_flares_v2_artisan`,name:`Solar Corona`,category:`Natural`,added:`2026-04-15`,description:`Abstract high-energy atmospheric flares and plasma smears from a stellar corona.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * 2.0;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float n = hash(vec2(angle * 10.0, 0.0));
      float mask = smoothstep(0.5, 0.8, d + n * 0.2);
      return mix(u_primary_color, u_secondary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Core`,type:`color`,default:[1,.9,.3,1]},{id:`u_secondary_color`,name:`Ejection`,type:`color`,default:[.8,.2,0,0]}]},tc=e({default:()=>nc}),nc={id:`sound_wave_eq`,name:`Sound Wave EQ`,category:`Abstract`,added:`2026-06-11`,description:`A frozen spectrum analyzer: vertical equalizer bars of random heights rising from the baseline, segmented into LED blocks with a hot peak tip.`,shader:`

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
  `,variants:[{name:`Neon Green`,uniforms:{u_color_bar:[.1,.9,.3,1],u_color_tip:[1,.3,.15,1],u_color_bg:[.03,.04,.04,1]}},{name:`Sunset Meter`,uniforms:{u_color_bar:[.98,.45,.12,1],u_color_tip:[1,.9,.4,1],u_color_bg:[.12,.04,.14,1]}},{name:`Ice Blue`,uniforms:{u_color_bar:[.25,.7,.95,1],u_color_tip:[.95,.99,1,1],u_color_bg:[.02,.04,.1,1]}},{name:`Magma`,uniforms:{u_color_bar:[.75,.12,.05,1],u_color_tip:[1,.85,.25,1],u_color_bg:[.04,.02,.02,1]}}],uniforms:[{id:`u_bars`,name:`Bar Count`,type:`float`,min:8,max:96,default:32},{id:`u_segments`,name:`LED Segments (0 = solid)`,type:`float`,min:0,max:40,default:18},{id:`u_gap`,name:`Gap Thickness`,type:`float`,min:0,max:.6,default:.25},{id:`u_color_bar`,name:`Bar Color`,type:`color`,default:[.1,.9,.3,1]},{id:`u_color_tip`,name:`Peak Tip Color`,type:`color`,default:[1,.3,.15,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.03,.04,.04,1]}]},rc=e({default:()=>ic}),ic={id:`speed_trails_artisan`,name:`Speed Trails`,category:`Racing`,added:`2026-04-15`,description:`Horizontal motion-style smears representing velocity and aerodynamic flow.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * u_scale);
      float h = hash(y);
      float trail = step(0.9, hash(v_uv.x * 0.1 + y));
      return mix(u_secondary_color, u_primary_color, trail);
    }
  `,uniforms:[{id:`u_scale`,name:`Trail Density`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Trail Lite`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Void`,type:`color`,default:[0,0,0,0]}]},ac=e({default:()=>oc}),oc={id:`spider_lightning`,name:`Spider Lightning`,category:`Abstract`,added:`2026-06-11`,description:`A spider web spun from lightning: jagged electric bolts radiate from a glowing core, linked by sagging arcs of plasma and branching micro-filaments. Static render — Trading Paints safe.`,shader:`

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
  `,variants:[{name:`Storm Blue`,uniforms:{u_color_bolt:[.85,.95,1,1],u_color_glow:[.15,.45,1,1],u_color_bg:[.01,.02,.06,1]}},{name:`Plasma Purple`,uniforms:{u_color_bolt:[.95,.85,1,1],u_color_glow:[.55,.2,.95,1],u_color_bg:[.03,.01,.06,1]}},{name:`Venom Green`,uniforms:{u_color_bolt:[.9,1,.85,1],u_color_glow:[.25,.9,.2,1],u_color_bg:[.01,.04,.01,1]}},{name:`Hellfire`,uniforms:{u_color_bolt:[1,.95,.75,1],u_color_glow:[1,.35,.05,1],u_color_bg:[.05,.01,.01,1]}}],uniforms:[{id:`u_strands`,name:`Web Strands`,type:`float`,min:4,max:24,default:12},{id:`u_rings`,name:`Web Rings`,type:`float`,min:2,max:16,default:6},{id:`u_chaos`,name:`Bolt Chaos`,type:`float`,min:1,max:10,default:3.5},{id:`u_jitter`,name:`Bolt Jitter`,type:`float`,min:0,max:.6,default:.16},{id:`u_thickness`,name:`Bolt Thickness`,type:`float`,min:.001,max:.02,default:.004},{id:`u_glow`,name:`Glow Radius`,type:`float`,min:.1,max:3,default:1},{id:`u_color_bolt`,name:`Bolt Core`,type:`color`,default:[.85,.95,1,1]},{id:`u_color_glow`,name:`Electric Glow`,type:`color`,default:[.15,.45,1,1]},{id:`u_color_bg`,name:`Background`,type:`color`,default:[.01,.02,.06,1]}]},sc=e({default:()=>cc}),cc={id:`spider_web_artisan`,name:`Silk Web`,category:`Natural`,added:`2026-04-16`,description:`Radial-concentric silk networks found in professional predatory arachnid structures.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.9,.9,1,1],u_accent_color:[.9,.9,1,1],u_secondary_color:[0,0,0,1],u_spokes:8,u_rings:10,u_thickness:1,u_sag:0}},{name:`Widow's Lair`,uniforms:{u_primary_color:[.85,.85,.85,1],u_accent_color:[.8,.1,.1,1],u_secondary_color:[.03,.02,.02,1],u_spokes:12,u_rings:12,u_thickness:1,u_sag:.6}},{name:`Frost Web`,uniforms:{u_primary_color:[.8,.92,1,1],u_accent_color:[.55,.75,.95,1],u_secondary_color:[.02,.05,.12,1],u_spokes:8,u_rings:14,u_thickness:.8,u_sag:.2}},{name:`Halloween`,uniforms:{u_primary_color:[1,.55,.1,1],u_accent_color:[1,.8,.2,1],u_secondary_color:[.05,0,.08,1],u_spokes:10,u_rings:9,u_thickness:1.4,u_sag:.45}}],uniforms:[{id:`u_spokes`,name:`Spoke Count`,type:`float`,min:3,max:24,default:8},{id:`u_rings`,name:`Ring Count`,type:`float`,min:2,max:30,default:10},{id:`u_thickness`,name:`Strand Thickness`,type:`float`,min:.3,max:3,default:1},{id:`u_sag`,name:`Silk Sag`,type:`float`,min:0,max:1,default:0},{id:`u_primary_color`,name:`Silk Strand`,type:`color`,default:[.9,.9,1,1]},{id:`u_accent_color`,name:`Ring Silk`,type:`color`,default:[.9,.9,1,1]},{id:`u_secondary_color`,name:`Void Backdrop`,type:`color`,default:[0,0,0,1]}]},lc=e({default:()=>uc}),uc={id:`splinter_camo`,name:`Splinter Camo`,category:`Geometric`,added:`2026-05-12`,description:`A non-digital but highly angular, geometric camouflage consisting of sharp intersecting polygons and shards.`,shader:`
    
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
  `,variants:[{name:`Swedish M90`,uniforms:{u_color_base:[.65,.7,.55,1],u_color_1:[.35,.45,.3,1],u_color_2:[.15,.25,.15,1],u_color_3:[.1,.12,.1,1]}},{name:`Winter Splinter`,uniforms:{u_color_base:[.9,.9,.95,1],u_color_1:[.7,.7,.75,1],u_color_2:[.4,.45,.5,1],u_color_3:[.2,.2,.25,1]}},{name:`Urban Splinter`,uniforms:{u_color_base:[.55,.55,.55,1],u_color_1:[.4,.4,.4,1],u_color_2:[.2,.2,.2,1],u_color_3:[.05,.05,.05,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.15,.15,.15,1],u_color_1:[.1,.1,.1,1],u_color_2:[.05,.05,.05,1],u_color_3:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Grid Scale`,type:`float`,min:1,max:20,default:8},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.65,.7,.55,1]},{id:`u_color_1`,name:`Shard 1`,type:`color`,default:[.35,.45,.3,1]},{id:`u_color_2`,name:`Shard 2`,type:`color`,default:[.15,.25,.15,1]},{id:`u_color_3`,name:`Shard 3`,type:`color`,default:[.1,.12,.1,1]}]},dc=e({default:()=>fc}),fc={id:`spray_drip_artisan`,name:`Spray Drip`,category:`Abstract`,added:`2026-04-15`,description:`Static vertical paint drip effect mimicking street-art application.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float x = floor(v_uv.x * u_scale);
      float h = hash(x);
      float mask = step(v_uv.y, h * 0.5 + 0.3);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Drip Count`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Drip Color`,type:`color`,default:[1,0,.2,1]},{id:`u_secondary_color`,name:`Background`,type:`color`,default:[.05,.05,.05,1]}]},pc=e({default:()=>mc}),mc={id:`stained_glass`,name:`Stained Glass`,category:`Abstract`,added:`2026-04-16`,description:`Backlit stained glass window with vivid saturated color panels and thick dark lead came lines.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Glass Sections`,type:`float`,min:2,max:20,default:7},{id:`u_lead_width`,name:`Lead Thickness`,type:`float`,min:.01,max:.12,default:.04},{id:`u_brightness`,name:`Panel Luminosity`,type:`float`,min:.3,max:2,default:1.3}]},hc=e({default:()=>gc}),gc={id:`star_field_artisan`,name:`Star Field Static`,category:`Natural`,added:`2026-04-15`,description:`High-density thresholded noise clusters representing deep-space star fields.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * u_scale);
      float mask = step(0.99, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Cluster Density`,type:`float`,min:100,max:2e3,default:800},{id:`u_primary_color`,name:`Star Alpha`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Deep Space`,type:`color`,default:[0,0,.02,1]}]},_c=e({default:()=>vc}),vc={id:`starlight_drive_artisan`,name:`Star Drive`,category:`Abstract`,added:`2026-04-16`,description:`Streaked starfield with motion blur effects found in high-speed space transit simulations.`,shader:`
    float hash(float n) { return fract(sin(n) * 43758.5453); }
    vec4 generate() {
      float y = floor(v_uv.y * 100.0);
      float h = hash(y);
      float dash = step(0.9, fract(v_uv.x * 2.0 + h));
      return mix(u_secondary_color, u_primary_color, dash * h);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Star Streak`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Deep Space`,type:`color`,default:[0,0,0,1]}]},yc=e({default:()=>bc}),bc={id:`steel_wool_artisan`,name:`Steel Wool`,category:`Industrial`,added:`2026-04-15`,description:`Chaos-line noise mimicking tangled metal strands found in industrial abrasives.`,shader:`
    vec4 generate() {
      float n = hash(v_uv * 1000.0) * hash(v_uv * 100.0);
      float mask = smoothstep(0.0, 0.2, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Steel Strand`,type:`color`,default:[.7,.7,.75,1]},{id:`u_secondary_color`,name:`Internal Shadow`,type:`color`,default:[.1,.1,.15,1]}]},xc=e({default:()=>Sc}),Sc={id:`stitched_leather_pro`,name:`Stitched Leather`,category:`Organic`,added:`2026-04-15`,description:`Premium pebbled leather texture with perimeter stitching simulation.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Grain Density`,type:`float`,min:10,max:100,default:40},{id:`u_show_stitch`,name:`Show Stitch`,type:`float`,min:0,max:1,default:1}]},Cc=e({default:()=>wc}),wc={id:`synaptic_spark_artisan`,name:`Synaptic Spark`,category:`Organic`,added:`2026-05-13`,description:`A network of neurons and dendrites with high-contrast electrical impulses.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Network Scale`,type:`float`,min:2,max:20,default:6},{id:`u_bg_color`,name:`Brain Matter`,type:`color`,default:[.05,.02,.08,1]},{id:`u_neuron_color`,name:`Neurons`,type:`color`,default:[.4,.2,.6,1]},{id:`u_spark_color`,name:`Electrical Impulse`,type:`color`,default:[.4,1,1,1]},{id:`u_flow`,name:`Synapse Fire`,type:`float`,min:0,max:100,default:0}]},Tc=e({default:()=>Ec}),Ec={id:`tech_fractal_artisan`,name:`Logic Fractal`,category:`Abstract`,added:`2026-04-16`,description:`Geometric recursive logic patterns mimicking complex computational architectures.`,shader:`
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
  `,uniforms:[{id:`u_primary_color`,name:`Pattern Edge`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Deep Core`,type:`color`,default:[0,.1,.15,1]}]},Dc=e({default:()=>Oc}),Oc={id:`tech_hex_v2_artisan`,name:`Tech Hex v2`,category:`Technology`,added:`2026-04-15`,description:`Advanced geometric hex-grid with internal subdivided offsets for sci-fi panels.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Module Count`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Housing`,type:`color`,default:[0,.8,1,1]},{id:`u_secondary_color`,name:`Frame`,type:`color`,default:[.05,.05,.08,1]}]},kc=e({default:()=>Ac}),Ac={id:`terrazzo_chip_artisan`,name:`Terrazzo Chip`,category:`Industrial`,added:`2026-04-16`,description:`Scattered irregular stone flakes and marble chips mimicking professional terrazzo flooring.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float n = hash(i_uv);
      vec3 col = 0.5 + 0.5 * cos(3.14159 * (n + vec3(0, 0.33, 0.67)));
      float mask = step(0.6, hash(i_uv * 1.5));
      return mix(u_secondary_color, vec4(col, 1.0), mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Density`,type:`float`,min:10,max:100,default:50},{id:`u_secondary_color`,name:`Binding Resin`,type:`color`,default:[.1,.1,.12,1]}]},jc=e({default:()=>Mc}),Mc={id:`terrazzo_stone_artisan`,name:`Terrazzo Stone`,category:`Industrial`,added:`2026-04-15`,description:`Multi-colored irregular stone chunks embedded in a polished composite base.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Chip Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Stone Chip`,type:`color`,default:[.6,.62,.65,1]},{id:`u_secondary_color`,name:`Base Mortar`,type:`color`,default:[.8,.8,.82,1]}]},Nc=e({default:()=>Pc}),Pc={id:`thermal_tile_scorch_artisan`,name:`Thermal Tile Scorch`,category:`Industrial`,added:`2026-05-13`,description:`Heat-ablated spacecraft tiles showing directional plasma scorch marks and edge wear.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Tile Scale`,type:`float`,min:2,max:20,default:8},{id:`u_tile_color`,name:`Clean Tile`,type:`color`,default:[.85,.85,.8,1]},{id:`u_scorch_color`,name:`Plasma Scorch`,type:`color`,default:[.15,.1,.08,1]}]},Fc=e({default:()=>Ic}),Ic={id:`threaded_screw_artisan`,name:`Threaded Bolt`,category:`Industrial`,added:`2026-04-15`,description:`Helical metal grooves representing industrial fasteners and bolts.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float thread = sin(uv.y * 10.0 - uv.x * 2.0);
      float mask = smoothstep(-0.1, 0.1, thread);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Thread Pitch`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Peak Metal`,type:`color`,default:[.9,.9,.95,1]},{id:`u_secondary_color`,name:`Valley`,type:`color`,default:[.1,.1,.15,1]}]},Lc=e({default:()=>Rc}),Rc={id:`tig_weld`,name:`TIG Weld Bead`,category:`Industrial`,added:`2026-05-01`,description:`TIG weld bead running horizontally with characteristic stacked-coin ripple arcs, hot bright center, and heat-affected steel.`,shader:`
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
  `,uniforms:[{id:`u_bead_freq`,name:`Ripple Frequency`,type:`float`,min:4,max:40,default:16},{id:`u_bead_width`,name:`Bead Width`,type:`float`,min:.05,max:.4,default:.18},{id:`u_heat_spread`,name:`Heat Affected Zone`,type:`float`,min:.5,max:3,default:1.5}]},zc=e({default:()=>Bc}),Bc={id:`tiger_stripe_camo`,name:`Tiger Stripe Camo`,category:`Organic`,added:`2026-05-12`,description:`Aggressive, horizontally flowing organic stripes characteristic of jungle warfare uniforms.`,shader:`
    
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
  `,variants:[{name:`Jungle Tiger`,uniforms:{u_color_base:[.35,.38,.25,1],u_color_1:[.2,.25,.15,1],u_color_2:[.45,.35,.2,1],u_color_3:[.08,.08,.08,1]}},{name:`Desert Tiger`,uniforms:{u_color_base:[.85,.75,.55,1],u_color_1:[.65,.55,.4,1],u_color_2:[.45,.35,.25,1],u_color_3:[.25,.15,.1,1]}},{name:`Snow Tiger`,uniforms:{u_color_base:[.95,.95,.95,1],u_color_1:[.75,.75,.78,1],u_color_2:[.45,.45,.5,1],u_color_3:[.15,.15,.18,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.12,1],u_color_1:[.08,.08,.08,1],u_color_2:[.05,.05,.05,1],u_color_3:[.02,.02,.02,1]}}],uniforms:[{id:`u_scale`,name:`Stripe Scale`,type:`float`,min:1,max:20,default:4},{id:`u_color_base`,name:`Base Color`,type:`color`,default:[.35,.38,.25,1]},{id:`u_color_1`,name:`Stripe 1`,type:`color`,default:[.2,.25,.15,1]},{id:`u_color_2`,name:`Stripe 2`,type:`color`,default:[.45,.35,.2,1]},{id:`u_color_3`,name:`Stripe 3`,type:`color`,default:[.08,.08,.08,1]}]},Vc=e({default:()=>Hc}),Hc={id:`tiger_stripes_artisan`,name:`Predator Stripes`,category:`Organic`,added:`2026-04-15`,description:`Organic predator-style tiger stripes with tapered edges.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(vec2(uv.x * 0.2 * u_breakup, uv.y * 2.0));
      float s = max(u_softness, 0.005);
      float mask = smoothstep(u_coverage - s, u_coverage + s, n + sin(uv.x * 2.0) * u_wave);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[.05,.05,.05,1],u_secondary_color:[1,.45,.05,1],u_coverage:.5,u_softness:.1,u_wave:.2,u_breakup:1}},{name:`White Tiger`,uniforms:{u_primary_color:[.25,.28,.32,1],u_secondary_color:[.93,.94,.96,1],u_coverage:.52,u_softness:.08,u_wave:.2,u_breakup:1.2}},{name:`Jungle Ghost`,uniforms:{u_primary_color:[.05,.09,.04,1],u_secondary_color:[.32,.42,.2,1],u_coverage:.45,u_softness:.14,u_wave:.3,u_breakup:1.6}},{name:`Synthwave`,uniforms:{u_primary_color:[.95,.1,.6,1],u_secondary_color:[.08,.02,.15,1],u_coverage:.5,u_softness:.04,u_wave:.35,u_breakup:.8}}],uniforms:[{id:`u_scale`,name:`Stripe Spacing`,type:`float`,min:2,max:20,default:8},{id:`u_coverage`,name:`Stripe Coverage`,type:`float`,min:.2,max:.8,default:.5},{id:`u_softness`,name:`Edge Taper`,type:`float`,min:.005,max:.3,default:.1},{id:`u_wave`,name:`Stripe Waviness`,type:`float`,min:0,max:.6,default:.2},{id:`u_breakup`,name:`Stripe Break-up`,type:`float`,min:.2,max:4,default:1},{id:`u_primary_color`,name:`Stripe Color`,type:`color`,default:[.05,.05,.05,1]},{id:`u_secondary_color`,name:`Base Color`,type:`color`,default:[1,.45,.05,1]}]},Uc=e({default:()=>Wc}),Wc={id:`tinted_carbon`,name:`Tinted Carbon Fibre`,category:`Racing`,added:`2026-05-13`,description:`Colour-tinted resin carbon fibre — gold, blue, and red carbon as seen on real motorsport bodywork.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Scale`,type:`float`,default:24,min:8,max:64},{id:`u_tint`,name:`Resin Tint`,type:`color`,default:[.85,.62,.08,1]},{id:`u_tint_strength`,name:`Tint Strength`,type:`float`,default:.65,min:0,max:1}]},Gc=e({default:()=>Kc}),Kc={id:`tire_marbles_artisan`,name:`Tire Marbles`,category:`Racing`,added:`2026-04-16`,description:`Clumpy rubber debris and "offline" track grit formed during high-heat racing conditions.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      float mask = step(0.8, hash(i_uv));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Grit Size`,type:`float`,min:10,max:100,default:50},{id:`u_primary_color`,name:`Rubber Clump`,type:`color`,default:[.1,.1,.1,1]},{id:`u_secondary_color`,name:`Track Surface`,type:`color`,default:[.2,.2,.2,1]}]},qc=e({default:()=>Jc}),Jc={id:`tire_sidewall_artisan`,name:`Tire Sidewall`,category:`Racing`,added:`2026-04-16`,description:`Raised geometric patterns and grip ridges found on professional racing tires.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.4) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Detail Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rubber High`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Rubber Base`,type:`color`,default:[.08,.08,.08,1]}]},Yc=e({default:()=>Xc}),Xc={id:`tire_tread_rain`,name:`Rain Tire Tread`,category:`Racing`,added:`2026-04-15`,description:`Deep directional grooves for wet weather conditions.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float x = abs(fract(uv.x) - 0.5);
      float y = fract(uv.y);
      float mask = step(0.15, abs(x - y * 0.5)) * step(0.05, x);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Rubber`,type:`color`,default:[.15,.15,.15,1]},{id:`u_secondary_color`,name:`Groove`,type:`color`,default:[.05,.05,.05,1]}]},Zc=e({default:()=>Qc}),Qc={id:`topographic_pro`,name:`Topographic Map`,category:`Abstract`,added:`2026-04-15`,description:`Technical contour lines mimicking elevation mapping.`,shader:`
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float line = fract(n * u_layers);
      float mask = step(0.9, line);
      
      vec4 color = mix(u_secondary_color, u_primary_color, mask);
      if (u_is_spec > 0.5) return vec4(0.1, 0.4, 1.0, 1.0);
      return color;
    }
  `,uniforms:[{id:`u_scale`,name:`Territory Size`,type:`float`,min:1,max:10,default:3},{id:`u_layers`,name:`Contour Detail`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Line Color`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Land Color`,type:`color`,default:[.1,.1,.1,1]}]},$c=e({default:()=>el}),el={id:`travertine_natural`,name:`Travertine`,category:`Natural`,added:`2026-05-01`,description:`Layered travertine limestone with wavy cream-to-tan sedimentary bands and occasional trapped gas-bubble void pockets.`,shader:`
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
  `,uniforms:[{id:`u_band_freq`,name:`Band Frequency`,type:`float`,min:2,max:20,default:8},{id:`u_base_color`,name:`Travertine Color`,type:`color`,default:[.88,.8,.67,1]},{id:`u_void_density`,name:`Void Density`,type:`float`,min:0,max:10,default:3}]},tl=e({default:()=>nl}),nl={id:`truchet_tiles_artisan`,name:`Truchet Arc`,category:`Abstract`,added:`2026-04-16`,description:`Interlocking arc-based tiles mimicking complex organic circuitry and decorative pavement.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      if (hash(i_uv) > 0.5) f_uv.x = 1.0 - f_uv.x;
      float d = abs(length(f_uv) - 0.5);
      float mask = smoothstep(0.02, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Tile Zoom`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Arc Ribbon`,type:`color`,default:[1,.4,0,1]},{id:`u_secondary_color`,name:`Tile Depth`,type:`color`,default:[.1,.1,.15,1]}]},rl=e({default:()=>il}),il={id:`turbo_fan_artisan`,name:`Turbo Turbine`,category:`Technology`,added:`2026-04-16`,description:`Radial blades of a high-boost turbocharger compressor wheel.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float blades = sin(angle * u_blades);
      float mask = smoothstep(-0.5, 0.5, blades);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_blades`,name:`Blade Count`,type:`float`,min:6,max:24,default:12},{id:`u_primary_color`,name:`Blade Top`,type:`color`,default:[.9,.92,.95,1]},{id:`u_secondary_color`,name:`Blade Void`,type:`color`,default:[.1,.1,.15,1]}]},al=e({default:()=>ol}),ol={id:`twill_carbon_pro`,name:`Pro Twill Carbon`,category:`Racing`,added:`2026-04-15`,description:`Classic high-detail 2x2 carbon fiber weave.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Weave Size`,type:`float`,min:10,max:100,default:40},{id:`u_primary_color`,name:`Primary`,type:`color`,default:[.12,.12,.12,1]},{id:`u_secondary_color`,name:`Secondary`,type:`color`,default:[.05,.05,.05,1]}]},sl=e({default:()=>cl}),cl={id:`tyre_burnout`,name:`Tyre Burnout`,category:`Racing`,added:`2026-05-01`,description:`Dark rubber burnout and skid marks on asphalt with irregular fuzzy edges, lighter internal streaks, and visible tyre tread impressions.`,shader:`
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
  `,uniforms:[{id:`u_asphalt`,name:`Asphalt`,type:`color`,default:[.18,.17,.16,1]},{id:`u_rubber_color`,name:`Rubber`,type:`color`,default:[.04,.03,.03,1]},{id:`u_intensity`,name:`Intensity`,type:`float`,min:.2,max:2,default:1},{id:`u_width`,name:`Track Width`,type:`float`,min:.05,max:.5,default:.25}]},ll=e({default:()=>ul}),ul={id:`vaporwave_sun_artisan`,name:`Retro Sun`,category:`Abstract`,added:`2026-04-16`,description:`Segmented radial retro sun patterns found in 80s synthwave and vaporwave aesthetics.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float mask = step(d, 0.4);
      float stripes = step(0.1, fract(v_uv.y * 10.0));
      return mix(u_secondary_color, u_primary_color, mask * stripes);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Sun Core`,type:`color`,default:[1,.6,0,1]},{id:`u_secondary_color`,name:`Atmosphere`,type:`color`,default:[1,0,.5,1]}]},dl=e({default:()=>fl}),fl={id:`velvet_pile`,name:`Velvet Pile`,category:`Industrial`,added:`2026-05-01`,description:`Velvet fabric with directional pile sheen â€” bright along the pile, dark against it, with a dramatic direction effect.`,shader:`
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
  `,uniforms:[{id:`u_base_color`,type:`color`,default:[.35,.05,.08,1],name:`Velvet Colour`},{id:`u_pile_direction`,type:`float`,default:.785,min:0,max:6.28,name:`Pile Direction (rad)`},{id:`u_sheen`,type:`float`,default:1.2,min:.3,max:2,name:`Sheen Intensity`}]},pl=e({default:()=>ml}),ml={id:`verdigris_patina`,name:`Verdigris Patina`,category:`Industrial`,added:`2026-05-01`,description:`Aged copper or bronze with green-blue verdigris oxidation pooling in recesses over warm reddish copper.`,shader:`
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
  `,uniforms:[{id:`u_patina_coverage`,name:`Patina Coverage`,type:`float`,min:0,max:1,default:.6},{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:15,default:5},{id:`u_patina_color`,name:`Verdigris Color`,type:`color`,default:[.18,.52,.42,1]}]},hl=e({default:()=>gl}),gl={id:`vinyl_wrap`,name:`Vinyl Wrap Film`,category:`Racing`,added:`2026-05-13`,description:`Matte vinyl wrap film with characteristic micro-pebble surface texture and subtle directional sheen. Excellent as a spec or normal-map source for flat paint finishes.`,shader:`
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
  `,uniforms:[{id:`u_base_color`,name:`Base Colour`,type:`color`,default:[.12,.12,.15,1]},{id:`u_pebble_scale`,name:`Pebble Scale`,type:`float`,default:80,min:20,max:200},{id:`u_texture_depth`,name:`Texture Depth`,type:`float`,default:.7,min:0,max:1},{id:`u_sheen`,name:`Gloss Sheen`,type:`float`,default:.6,min:0,max:1}]},_l=e({default:()=>vl}),vl={id:`viral_capsid_artisan`,name:`Viral Capsid`,category:`Organic`,added:`2026-05-13`,description:`Geometric, icosahedral protein structures interlocking to form complex biological shells.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Capsid Scale`,type:`float`,min:2,max:20,default:8},{id:`u_shell_dark`,name:`Capsid Shadow`,type:`color`,default:[.1,.2,.15,1]},{id:`u_shell_light`,name:`Capsid Surface`,type:`color`,default:[.4,.7,.5,1]},{id:`u_spike_color`,name:`Spike Protein`,type:`color`,default:[.8,.2,.3,1]}]},yl=e({default:()=>bl}),bl={id:`void_grid_artisan`,name:`Void Grid`,category:`Abstract`,added:`2026-04-16`,description:`Infinite perspective grid reminiscent of 1980s retro-futuristic digital visualization.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float grid = step(0.95, fract(uv.x)) + step(0.95, fract(uv.y));
      return mix(u_secondary_color, u_primary_color, clamp(grid, 0.0, 1.0));
    }
  `,uniforms:[{id:`u_scale`,name:`Grid Density`,type:`float`,min:5,max:50,default:20},{id:`u_primary_color`,name:`Grid Glow`,type:`color`,default:[1,0,1,1]},{id:`u_secondary_color`,name:`Void Base`,type:`color`,default:[0,0,.05,1]}]},xl=e({default:()=>Sl}),Sl={id:`volcanic_basalt_artisan`,name:`Basalt Pillar`,category:`Geology`,added:`2026-04-16`,description:`Pitted, geometric volcanic rock found in hexagonal basalt formations.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = step(0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Pillar Scale`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Rock Face`,type:`color`,default:[.1,.1,.12,1]},{id:`u_secondary_color`,name:`Pillar Joint`,type:`color`,default:[0,0,.05,1]}]},Cl=e({default:()=>wl}),wl={id:`voronoi_cells_pro`,name:`Voronoi Cells`,category:`Abstract`,added:`2026-04-15`,description:`Mathematical fractured cell structures often found in biological and geological formations.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Cell Count`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Cell Center`,type:`color`,default:[.2,.2,.25,1]},{id:`u_secondary_color`,name:`Cell Border`,type:`color`,default:[.1,.1,.12,1]}]},Tl=e({default:()=>El}),El={id:`washi_paper`,name:`Washi Paper`,category:`Natural`,added:`2026-05-01`,description:`Japanese handmade washi paper with long random fibres, mottled translucency, and cream base.`,shader:`
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
  `,uniforms:[{id:`u_fiber_density`,name:`Fibre Density`,type:`float`,min:1,max:12,default:4},{id:`u_paper_color`,name:`Paper Colour`,type:`color`,default:[.93,.91,.85,1]},{id:`u_fiber_color`,name:`Fibre Colour`,type:`color`,default:[.6,.54,.44,1]}]},Dl=e({default:()=>Ol}),Ol={id:`water_ripples_artisan`,name:`Water Ripples`,category:`Natural`,added:`2026-04-15`,description:`Static concentric liquid wave interference patterns.`,shader:`
    vec4 generate() {
      vec2 uv = (v_uv - 0.5) * u_scale;
      float d = length(uv);
      // Removed time from ripple function
      float ripple = sin(d * 20.0);
      float mask = smoothstep(-0.1, 0.1, ripple);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wave Scale`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Peak Color`,type:`color`,default:[.1,.6,1,1]},{id:`u_secondary_color`,name:`Deep Water`,type:`color`,default:[0,.2,.4,1]}]},kl=e({default:()=>Al}),Al={id:`watercolor_bleed_artisan`,name:`Watercolor Flow`,category:`Abstract`,added:`2026-04-15`,description:`Soft organic color spreads and bleeding textures mimicking paint on high-fidelity wet paper.`,shader:`
    vec4 generate() {
      float n = noise(v_uv * 5.0 + noise(v_uv * 10.0));
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Ink Bleed`,type:`color`,default:[.2,.4,.8,.8]},{id:`u_secondary_color`,name:`Pulp Base`,type:`color`,default:[.95,.95,.9,1]}]},jl=e({default:()=>Ml}),Ml={id:`wavy_checkers_artisan`,name:`Wavy Checkers`,category:`Racing`,added:`2026-04-15`,description:`Flowing, distorted racing flags mimicking a waving checkered banner.`,shader:`
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
  `,variants:[{name:`Classic`,uniforms:{u_primary_color:[1,1,1,1],u_secondary_color:[0,0,0,1],u_wave_freq:3,u_wave_amp:.2}},{name:`Victory Gold`,uniforms:{u_primary_color:[.95,.78,.2,1],u_secondary_color:[.07,.06,.05,1],u_wave_freq:3,u_wave_amp:.35}},{name:`Ocean Flag`,uniforms:{u_primary_color:[.92,.95,.97,1],u_secondary_color:[.05,.12,.3,1],u_wave_freq:4.5,u_wave_amp:.15}},{name:`Heat Shimmer`,uniforms:{u_primary_color:[.9,.2,.08,1],u_secondary_color:[.1,.02,.02,1],u_wave_freq:6,u_wave_amp:.3,u_softness:.05}}],uniforms:[{id:`u_scale`,name:`Check Size`,type:`float`,min:2,max:20,default:8},{id:`u_wave_freq`,name:`Wave Frequency`,type:`float`,min:0,max:10,default:3},{id:`u_wave_amp`,name:`Wave Amplitude`,type:`float`,min:0,max:.8,default:.2},{id:`u_softness`,name:`Edge Softness`,type:`float`,min:0,max:.2,default:.015},{id:`u_primary_color`,name:`Checker A`,type:`color`,default:[1,1,1,1]},{id:`u_secondary_color`,name:`Checker B`,type:`color`,default:[0,0,0,1]}]},Nl=e({default:()=>Pl}),Pl={id:`weathered_paint_artisan`,name:`Weathered Paint`,category:`Industrial`,added:`2026-04-15`,description:`Chipped and peeling paint flakes mimicking aged industrial surfaces.`,shader:`
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      return mix(mix(hash(i), hash(i+vec2(1,0)), f.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
    }
    vec4 generate() {
      float n = noise(v_uv * u_scale);
      float mask = step(0.6, n);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Chip Detail`,type:`float`,min:5,max:50,default:10},{id:`u_primary_color`,name:`Paint`,type:`color`,default:[.8,.1,.1,1]},{id:`u_secondary_color`,name:`Exposed Metal`,type:`color`,default:[.3,.3,.35,1]}]},Fl=e({default:()=>Il}),Il={id:`weathered_rust_pro`,name:`Weathered Rust`,category:`Industrial`,added:`2026-04-15`,description:`Pro-grade oxidizing metallic surface with realistic pitting and oxidation layers.`,shader:`
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
  `,uniforms:[{id:`u_scale`,name:`Rust Intensity`,type:`float`,min:1,max:20,default:5}]},Ll=e({default:()=>Rl}),Rl={id:`wicker_weave_artisan`,name:`Wicker Weave`,category:`Natural`,added:`2026-04-15`,description:`Interlocking thick strands of woven wood found in traditional basketry.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float w = floor(uv.y);
      if (mod(w, 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float mask = step(0.1, gv.x) * step(gv.x, 0.9) * step(0.1, gv.y) * step(gv.y, 0.9);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Weave Density`,type:`float`,min:2,max:20,default:8},{id:`u_primary_color`,name:`Wicker Slat`,type:`color`,default:[.7,.5,.3,1]},{id:`u_secondary_color`,name:`Joint Deep`,type:`color`,default:[.2,.1,.05,1]}]},zl=e({default:()=>Bl}),Bl={id:`wire_wound`,name:`Wire Wound`,category:`Industrial`,added:`2026-05-01`,description:`Tightly wound coil seen from above — concentric oval rings from wire turns with bright highlights and trailing-edge shadows, as in a solenoid cross-section.`,shader:`

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
  `,uniforms:[{id:`u_turns`,name:`Coil Turns`,type:`float`,min:4,max:30,default:12},{id:`u_wire_color`,name:`Wire Color`,type:`color`,default:[.75,.73,.68,1]},{id:`u_gap_color`,name:`Gap Color`,type:`color`,default:[.1,.09,.08,1]}]},Vl=e({default:()=>Hl}),Hl={id:`wood_block_print_artisan`,name:`Wood Print`,category:`Abstract`,added:`2026-04-16`,description:`Coarse carved relief texture mimicking traditional wood block printing techniques.`,shader:`
    vec4 generate() {
      float y = floor(v_uv.y * 80.0);
      float h = hash(vec2(y, y));
      float bark = step(0.5, fract(v_uv.x * 5.0 + h));
      return mix(u_secondary_color, u_primary_color, bark);
    }
  `,uniforms:[{id:`u_primary_color`,name:`Relief High`,type:`color`,default:[.2,.2,.2,1]},{id:`u_secondary_color`,name:`Carved Wood`,type:`color`,default:[.1,.05,0,1]}]},Ul=e({default:()=>Wl}),Wl={id:`wood_grain_artisan`,name:`Wood Grain Pro`,category:`Natural`,added:`2026-04-15`,description:`High-detail procedural timber with concentric growth rings and knots.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float n = noise(uv * 0.1);
      float ring = fract(length(uv - n * 2.0) * 5.0);
      float mask = smoothstep(0.4, 0.6, ring);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Wood density`,type:`float`,min:1,max:10,default:4},{id:`u_primary_color`,name:`Grain Color`,type:`color`,default:[.3,.15,.05,1]},{id:`u_secondary_color`,name:`Base Timber`,type:`color`,default:[.45,.25,.1,1]}]},Gl=e({default:()=>Kl}),Kl={id:`wood_parquet_artisan`,name:`Wood Parquet`,category:`Industrial`,added:`2026-04-15`,description:`Complex interlocking geometric floor planks for premium interior design.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 gv = floor(uv);
      float mask = mod(gv.x + gv.y, 2.0);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,uniforms:[{id:`u_scale`,name:`Mosaic Size`,type:`float`,min:2,max:20,default:10},{id:`u_primary_color`,name:`Plank A`,type:`color`,default:[.5,.3,.1,1]},{id:`u_secondary_color`,name:`Plank B`,type:`color`,default:[.4,.25,.08,1]}]},ql=e({default:()=>Jl}),Jl={id:`woodland_classic_camo`,name:`Woodland Classic Camo`,category:`Organic`,added:`2026-05-12`,description:`Classic M81 style camouflage with large organic blobs overlapping each other.`,shader:`
    

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
  `,variants:[{name:`Classic Woodland`,uniforms:{u_color_base:[.63,.56,.45,1],u_color_1:[.28,.35,.22,1],u_color_2:[.35,.26,.18,1],u_color_3:[.08,.08,.08,1]}},{name:`Desert Recon`,uniforms:{u_color_base:[.82,.75,.61,1],u_color_1:[.73,.62,.47,1],u_color_2:[.55,.44,.31,1],u_color_3:[.35,.25,.15,1]}},{name:`Urban Stealth`,uniforms:{u_color_base:[.7,.7,.75,1],u_color_1:[.45,.45,.5,1],u_color_2:[.25,.25,.3,1],u_color_3:[.1,.1,.12,1]}},{name:`Blackout Stealth`,uniforms:{u_color_base:[.12,.12,.14,1],u_color_1:[.08,.08,.1,1],u_color_2:[.04,.04,.05,1],u_color_3:[.01,.01,.01,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Scale`,type:`float`,min:1,max:20,default:5},{id:`u_color_base`,name:`Base (Tan)`,type:`color`,default:[.63,.56,.45,1]},{id:`u_color_1`,name:`Layer 1 (Green)`,type:`color`,default:[.28,.35,.22,1]},{id:`u_color_2`,name:`Layer 2 (Brown)`,type:`color`,default:[.35,.26,.18,1]},{id:`u_color_3`,name:`Layer 3 (Black)`,type:`color`,default:[.08,.08,.08,1]}]},Yl=e({default:()=>Xl}),Xl={id:`worn_asphalt`,name:`Worn Asphalt`,category:`Racing`,added:`2026-05-01`,description:`Heavily worn racing asphalt with exposed aggregate, oil-stained patches, crack lines, and rubber marbling from racing tyres.`,shader:`
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
  `,uniforms:[{id:`u_wear`,name:`Wear Level`,type:`float`,min:0,max:1,default:.7},{id:`u_base_color`,name:`Asphalt Base`,type:`color`,default:[.28,.27,.26,1]},{id:`u_crack_density`,name:`Crack Density`,type:`float`,min:1,max:10,default:4}]},Zl=e({default:()=>Ql}),Ql={id:`woven_fiberglass`,name:`Woven Fiberglass`,category:`Industrial`,added:`2026-04-30`,description:`E-glass plain-weave fiberglass cloth with cream tow bundles, glass-sheen highlights, and amber resin pockets.`,shader:`
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
  `,uniforms:[{id:`u_weave_scale`,name:`Weave Scale`,type:`float`,min:2,max:30,default:12},{id:`u_fiber_color`,name:`Fiber Color`,type:`color`,default:[.88,.88,.84,1]},{id:`u_resin_color`,name:`Resin Color`,type:`color`,default:[.55,.52,.47,1]},{id:`u_sheen`,name:`Glass Specularity`,type:`float`,min:0,max:2,default:1}]},$l=e({default:()=>eu}),eu={id:`zebra_camo_v2_artisan`,name:`Zebra Camo v2`,category:`Abstract`,added:`2026-04-15`,description:`High-contrast geometric distortion variant of precision camouflages.`,shader:`
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float mask = step(0.5, fract(uv.x + sin(uv.y * 2.0)));
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,variants:[{name:`High Contrast (Default)`,uniforms:{u_primary_color:[0,0,0,1],u_secondary_color:[1,1,1,1]}},{name:`Blackout Stealth`,uniforms:{u_primary_color:[.02,.02,.02,1],u_secondary_color:[.15,.15,.15,1]}}],uniforms:[{id:`u_scale`,name:`Pattern Density`,type:`float`,min:1,max:10,default:5},{id:`u_primary_color`,name:`Stripe A`,type:`color`,default:[0,0,0,1]},{id:`u_secondary_color`,name:`Stripe B`,type:`color`,default:[1,1,1,1]}]};export{rc as $,te as $i,ni as $n,tn as $r,no as $t,Yc as A,qe as Ai,Ji as An,Jn as Ar,Yo as At,kc as B,De as Bi,Oi as Bn,On as Br,ko as Bt,ll as C,s as Ca,st as Ci,ca as Cn,cr as Cr,ls as Ct,tl as D,$e as Di,ea as Dn,er as Dr,ts as Dt,rl as E,t as Ea,tt as Ei,na as En,nr as Er,rs as Et,zc as F,Le as Fi,Ri as Fn,Rn as Fr,zo as Ft,yc as G,_e as Gi,vi as Gn,vn as Gr,yo as Gt,Tc as H,Ce as Hi,wi as Hn,wn as Hr,To as Ht,Lc as I,Fe as Ii,Ii as In,In as Ir,Lo as It,pc as J,de as Ji,fi as Jn,fn as Jr,po as Jt,_c as K,he as Ki,gi as Kn,gn as Kr,_o as Kt,Fc as L,Ne as Li,Pi as Ln,Pn as Lr,Fo as Lt,Gc as M,Ue as Mi,Wi as Mn,Wn as Mr,Go as Mt,Uc as N,Ve as Ni,Hi as Nn,Hn as Nr,Uo as Nt,$c as O,Ze as Oi,Qi as On,Qn as Or,$o as Ot,Vc as P,ze as Pi,Bi as Pn,Bn as Pr,Vo as Pt,ac as Q,re as Qi,ii as Qn,rn as Qr,io as Qt,Nc as R,je as Ri,Mi as Rn,Mn as Rr,No as Rt,dl as S,l as Sa,lt as Si,ua as Sn,ur as Sr,ds as St,al as T,r as Ta,rt as Ti,ia as Tn,ir as Tr,as as Tt,Cc as U,xe as Ui,Si as Un,Sn as Ur,Co as Ut,Dc as V,Te as Vi,Ei as Vn,En as Vr,Do as Vt,xc as W,ye as Wi,bi as Wn,bn as Wr,xo as Wt,lc as X,se as Xi,ci as Xn,cn as Xr,co as Xt,dc as Y,le as Yi,ui as Yn,un as Yr,uo as Yt,sc as Z,ae as Zi,oi as Zn,on as Zr,oo as Zt,xl as _,y as _a,yt as _i,ba as _n,br as _r,xs as _t,Gl as a,U as aa,Ut as ai,Wa as an,Wr as ar,Gs as at,hl as b,p as ba,pt as bi,ma as bn,mr as br,hs as bt,zl as c,L as ca,Lt as ci,Ra as cn,Rr as cr,zs as ct,Nl as d,j as da,jt as di,Ma as dn,Mr as dr,Ns as dt,$ as ea,$t as ei,eo as en,ei as er,tc as et,jl as f,k as fa,kt as fi,Aa as fn,Ar as fr,js as ft,Cl as g,x as ga,xt as gi,Sa as gn,Sr as gr,Cs as gt,Tl as h,C as ha,Ct as hi,wa as hn,wr as hr,Ts as ht,ql as i,G as ia,Gt as ii,Ka as in,Kr as ir,qs as it,qc as j,Ge as ji,Ki as jn,Kn as jr,qo as jt,Zc as k,Ye as ki,Xi as kn,Xn as kr,Zo as kt,Ll as l,F as la,Ft as li,Ia as ln,Ir as lr,Ls as lt,Dl as m,T as ma,Tt as mi,Ea as mn,Er as mr,Ds as mt,Zl as n,Y as na,Yt as ni,Xa as nn,Xr as nr,Zs as nt,Ul as o,V as oa,Vt as oi,Ha as on,Hr as or,Us as ot,kl as p,D as pa,Dt as pi,Oa as pn,Or as pr,ks as pt,hc as q,pe as qi,mi as qn,mn as qr,ho as qt,Yl as r,q as ra,qt as ri,Ja as rn,Jr as rr,Ys as rt,Vl as s,z as sa,zt as si,Ba as sn,Br as sr,Vs as st,$l as t,Z as ta,Zt as ti,Qa as tn,Qr as tr,$s as tt,Fl as u,N as ua,Nt as ui,Pa as un,Pr as ur,Fs as ut,yl as v,_ as va,_t as vi,va as vn,vr,ys as vt,sl as w,a as wa,at as wi,oa as wn,or as wr,ss as wt,pl as x,d as xa,dt as xi,fa as xn,fr as xr,ps as xt,_l as y,h as ya,ht as yi,ga as yn,gr as yr,_s as yt,jc as z,ke as zi,Ai as zn,An as zr,jo as zt};
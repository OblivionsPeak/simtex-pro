export default {
  id: 'armco_barrier',
  name: 'Armco Barrier',
  category: 'Racing',
  description: 'Corrugated W-beam steel Armco safety barrier as found lining every racing circuit — with bolt holes, panel seams, and galvanized steel surface.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_paint_color',   name: 'Steel Colour',   type: 'color', default: [0.75, 0.77, 0.74, 1.0] },
    { id: 'u_beam_scale',    name: 'Beam Scale',     type: 'float', default: 3.5,  min: 1.0,  max: 8.0   },
    { id: 'u_panel_repeat',  name: 'Panel Width',    type: 'float', default: 2.5,  min: 1.0,  max: 6.0   },
    { id: 'u_weathering',    name: 'Weathering',     type: 'float', default: 0.2,  min: 0.0,  max: 1.0   },
  ]
};

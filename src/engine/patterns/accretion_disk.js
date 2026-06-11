export default {
  id: 'accretion_disk',
  name: 'Accretion Disk',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Superheated matter spiralling into a black hole — Doppler-boosted orbital streaks, a white-hot inner edge, and a pitch-black event horizon.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_horizon', name: 'Horizon Size',   type: 'float', min: 0.05, max: 0.35, default: 0.16 },
    { id: 'u_shear',   name: 'Orbital Shear',  type: 'float', min: 0.2,  max: 3.0,  default: 1.1 },
    { id: 'u_beaming', name: 'Doppler Beaming', type: 'float', min: 0.0, max: 1.0,  default: 0.7 }
  ]
};

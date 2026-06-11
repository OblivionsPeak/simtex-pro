export default {
  id: 'eclipse_corona',
  name: 'Eclipse Corona',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Totality — a jet-black lunar disc ringed by a blazing chromosphere and wispy pearl-white coronal streamers raking into the dark.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_disc_size',    name: 'Disc Size',     type: 'float', min: 0.15, max: 0.55, default: 0.32 },
    { id: 'u_corona_reach', name: 'Corona Reach',  type: 'float', min: 0.3,  max: 2.5,  default: 1.0 },
    { id: 'u_streamers',    name: 'Streamer Bias', type: 'float', min: 0.0,  max: 1.0,  default: 0.7 },
    { id: 'u_diamond',      name: 'Diamond Ring',  type: 'float', min: 0.0,  max: 2.0,  default: 0.8 }
  ]
};

export default {
  id: 'tide_pool_rings',
  name: 'Tide Pool Rings',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Mineral water-level rings receding into rocky tide pools — salt-crust lines, algae stains and rust bands around each basin.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_ring_freq',  name: 'Ring Frequency', type: 'float', min: 3.0, max: 16.0, default: 8.0 },
    { id: 'u_warp',       name: 'Basin Irregularity', type: 'float', min: 0.0, max: 0.5, default: 0.22 },
    { id: 'u_rock_color', name: 'Rock Color', type: 'color', default: [0.42, 0.38, 0.33, 1.0] }
  ]
};

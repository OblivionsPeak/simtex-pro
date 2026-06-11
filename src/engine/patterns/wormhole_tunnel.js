export default {
  id: 'wormhole_tunnel',
  name: 'Wormhole Tunnel',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Staring down a spacetime throat — twisting concentric energy rings telescoping toward a blinding singularity, walls streaked with infalling starlight.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_ring_density', name: 'Ring Density', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_twist',        name: 'Throat Twist', type: 'float', min: 0.0, max: 4.0, default: 1.5 },
    { id: 'u_energy_color', name: 'Energy Hue',   type: 'color', default: [0.30, 0.65, 1.0, 1.0] }
  ]
};

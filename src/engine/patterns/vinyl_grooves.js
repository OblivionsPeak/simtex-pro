export default {
  id: 'vinyl_grooves',
  name: 'Vinyl Grooves',
  category: 'Retro',
  added: '2026-06-11',
  description: 'A 45 fresh out of the sleeve — micro-groove rings catching twin anisotropic light streaks, track-gap bands, dead wax and a paper label around the spindle hole.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_tiles', name: 'Records Across', type: 'float', min: 1.0, max: 5.0, default: 2.0 },
    { id: 'u_groove_density', name: 'Groove Density', type: 'float', min: 20.0, max: 140.0, default: 70.0 },
    { id: 'u_sheen', name: 'Light Sheen', type: 'float', min: 0.0, max: 1.5, default: 0.8 },
    { id: 'u_label_color', name: 'Label Paper', type: 'color', default: [0.85, 0.25, 0.15, 1.0] }
  ]
};

export default {
  id: 'serpentinite',
  name: 'Serpentinite',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Waxy serpentinite — mottled green-black scales threaded by pale chrysotile veins, with slickenside streaks and a greasy polish.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 green = u_green_color.rgb;
      vec3 black = green * vec3(0.12, 0.18, 0.15);
      vec3 pale  = green * vec3(1.5, 1.6, 1.3) + 0.1;

      // --- Scaled / serpentine-skin mottling ---
      // Domain-warped fbm produces the snakeskin patchwork
      vec2 warp = vec2(fbm(uv * u_vein_scale * 0.6), fbm(uv * u_vein_scale * 0.6 + 31.0));
      float patches = fbm(uv * u_vein_scale + warp * 0.8) * 0.5 + 0.5;

      vec3 col = mix(black, green, smoothstep(0.3, 0.7, patches));

      // Secondary smaller scales
      float scales = fbm(uv * u_vein_scale * 3.2 + warp * 1.5 + 7.0) * 0.5 + 0.5;
      col = mix(col, green * 1.2, smoothstep(0.62, 0.85, scales) * 0.4);
      col = mix(col, black, smoothstep(0.62, 0.85, 1.0 - scales) * 0.35);

      // --- Chrysotile veins: pale ridged threads at two scales ---
      float v1 = smoothstep(0.05, 0.0, abs(snoise(uv * u_vein_scale * 1.3 + warp)));
      float v2 = smoothstep(0.035, 0.0, abs(snoise(uv * u_vein_scale * 3.1 + 53.0))) * 0.6;
      float veins = clamp(v1 + v2, 0.0, 1.0);
      col = mix(col, pale, veins * u_vein_strength * 0.6);

      // Fibrous cross-hatching inside the veins (chrysotile fibers grow
      // perpendicular to the vein walls)
      float fibre = sin(dot(uv, vec2(180.0, 140.0))) * 0.5 + 0.5;
      col += pale * veins * fibre * u_vein_strength * 0.10;

      // --- Slickensides: polished directional shear streaks ---
      float slick = noise(vec2(dot(uv, vec2(0.9, 0.45)) * 160.0, dot(uv, vec2(-0.45, 0.9)) * 8.0));
      float shearZone = smoothstep(0.5, 0.8, fbm(uv * 2.5 + 91.0) * 0.5 + 0.5);
      col *= 1.0 + (slick - 0.5) * 0.18 * shearZone;
      // Shear zones gleam
      col += green * shearZone * 0.08 * u_waxiness;

      // --- Waxy lustre: soft greasy highlight ---
      float band = dot(uv - 0.5, normalize(vec2(0.6, 0.8)));
      float wax = exp(-band * band * 7.0);
      col += (green * 0.5 + 0.08) * wax * u_waxiness * 0.22;

      // Dark magnetite specks
      float speck = step(0.975, hash(floor(uv * 140.0)));
      col = mix(col, vec3(0.04, 0.05, 0.05), speck * 0.6);

      col += (hash(uv * 700.0) - 0.5) * 0.018;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_vein_scale',    name: 'Vein Scale',    type: 'float', min: 2.0, max: 14.0, default: 5.0 },
    { id: 'u_vein_strength', name: 'Vein Strength', type: 'float', min: 0.0, max: 1.5,  default: 0.9 },
    { id: 'u_waxiness',      name: 'Waxy Lustre',   type: 'float', min: 0.0, max: 2.0,  default: 1.0 },
    { id: 'u_green_color',   name: 'Serpentine Green', type: 'color', default: [0.22, 0.42, 0.28, 1.0] }
  ]
};

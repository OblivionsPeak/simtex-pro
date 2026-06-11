export default {
  id: 'gas_giant_bands',
  name: 'Gas Giant Bands',
  category: 'Cosmos',
  added: '2026-06-11',
  description: 'Jovian cloud belts and zones shearing past each other in turbulent cream and rust, with a swirling great storm oval.',
  shader: `
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
  `,
  uniforms: [
    { id: 'u_band_count', name: 'Belt Count',   type: 'float', min: 1.0, max: 8.0,  default: 3.0 },
    { id: 'u_turbulence', name: 'Turbulence',   type: 'float', min: 0.2, max: 3.0,  default: 1.2 },
    { id: 'u_storm_size', name: 'Storm Size',   type: 'float', min: 0.05, max: 0.30, default: 0.14 },
    { id: 'u_zone_color', name: 'Zone Cream',   type: 'color', default: [0.91, 0.84, 0.70, 1.0] }
  ]
};

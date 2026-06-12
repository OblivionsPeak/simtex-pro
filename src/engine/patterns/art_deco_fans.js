export default {
  id: 'art_deco_fans',
  name: 'Art Deco Fans',
  category: 'Architecture',
  added: '2026-06-12',
  description: 'Stacked tiers of gilded sunburst fans in the Chrysler-lobby manner — radiating gold rays over lacquered ground, arc banding, and a soft patina dulling the leaf in the recesses.',
  shader: `
    float hash_adf(vec2 p) {
      return fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453);
    }

    vec4 generate() {
      float cols = floor(u_fan_scale + 0.5);
      float rows = cols;

      vec2 uv = v_uv * vec2(cols, rows);
      float row = floor(uv.y);
      // alternate rows shift half a fan so tiers nest like scales
      uv.x += mod(row, 2.0) * 0.5;
      vec2 cell = vec2(floor(uv.x), row);
      vec2 f = fract(uv);

      // fan origin sits at bottom-centre of the cell
      vec2 p = f - vec2(0.5, 0.0);
      float r = length(p * vec2(1.0, 1.15));
      float ang = atan(p.x, p.y + 0.0001); // 0 straight up, +/- pi/2 sideways

      vec3 gold   = u_gold_color.rgb;
      vec3 ground = vec3(0.10, 0.08, 0.10); // deep lacquer ground

      // --- radiating rays ---
      float rayN = floor(u_ray_count + 0.5);
      float rayPhase = ang / 3.14159265 + 0.5;     // 0..1 across the half-fan
      float ray = fract(rayPhase * rayN);
      float rayMask = smoothstep(0.0, 0.10, ray) * smoothstep(1.0, 0.62, ray);

      // each ray catches light differently, like beaten metal leaf
      float leafTone = 0.78 + 0.34 * hash_adf(cell + floor(rayPhase * rayN) * 0.173);

      // --- concentric arc bands (the stacked tiers within one fan) ---
      float band = fract(r * 3.0);
      float bandLine = smoothstep(0.0, 0.07, band) * smoothstep(0.18, 0.10, band);
      float bandShade = mix(0.82, 1.05, smoothstep(0.0, 1.0, band)); // each tier shades toward its rim

      // fan silhouette: a half-disc clipped to the cell
      float inFan = smoothstep(1.02, 0.96, r);
      float rimDark = smoothstep(0.96, 1.0, r); // crisp dark outline at the fan edge

      // --- gilding with patina ---
      float patinaN = fbm(v_uv * 9.0 + cell * 0.37);
      float patina = smoothstep(0.15, 0.75, patinaN) * u_patina;
      // (lacquer ground colour is fixed; gold leaf is the styling handle)
      vec3 leaf = gold * leafTone * bandShade;
      leaf = mix(leaf, gold * vec3(0.45, 0.42, 0.34), patina * 0.6);     // tarnish in the hollows
      leaf = mix(leaf, gold * 1.45, rayMask * 0.35 * (1.0 - patina));    // bright ray spines

      // engraved arc grooves read as darker incisions
      leaf = mix(leaf, leaf * 0.55, bandLine);

      // sheen sweeping down the fan, as if lit from above
      float sheen = exp(-3.0 * pow(abs(ang) - 0.5, 2.0)) * (1.0 - r * 0.6);
      leaf += gold * sheen * 0.18;

      // --- lacquered ground between fans ---
      float lacGrain = noise(v_uv * vec2(140.0, 30.0)) * 0.05;
      vec3 backCol = ground * (0.92 + lacGrain) ;
      // ground glows faintly where the next tier's fan will rise
      backCol += gold * 0.06 * smoothstep(0.6, 0.0, abs(f.x - 0.5));

      vec3 col = mix(backCol, leaf, inFan * rayMask + inFan * 0.55 * (1.0 - rayMask));
      col = mix(col, ground * 0.35, rimDark * inFan); // outline

      // drop shadow each fan casts on the tier below
      float shadow = smoothstep(1.18, 0.98, r) * (1.0 - inFan);
      col *= 1.0 - shadow * 0.30;

      // overall micro-speckle of old metal leaf
      col *= 0.96 + hash_adf(floor(v_uv * 420.0)) * 0.07;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_fan_scale',    name: 'Fan Tiers',    type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_ray_count',    name: 'Rays Per Fan', type: 'float', min: 5.0, max: 24.0, default: 11.0 },
    { id: 'u_patina',       name: 'Patina',       type: 'float', min: 0.0, max: 1.0,  default: 0.45 },
    { id: 'u_gold_color',   name: 'Gold Leaf',    type: 'color', default: [0.85, 0.66, 0.28, 1.0] }
  ]
};

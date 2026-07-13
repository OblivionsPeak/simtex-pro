export default {
  id: 'drum_head',
  name: 'Drum Head',
  category: 'Retro',
  added: '2026-07-13',
  description: 'Close-up coated drum-skin surface — fine radial mylar coating sweeping from a corner, subtle pressure rings, off-center stick-wear scuffs and a faint rim shadow at one edge.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // strike center sits off-tile past the upper-left corner, so the
      // radial coating sweeps across the whole tile — camera is close in
      vec2 center = vec2(-0.42, 1.38);
      vec2 d = uv - center;
      float r = length(d);
      float ang = atan(d.y, d.x);

      // base coated skin
      vec3 skin = u_primary_color.rgb;

      // fine spray-coat grain, fineness driven by u_scale
      float grain = noise(uv * u_scale * 9.0) * 0.6 + noise(uv * u_scale * 23.0) * 0.4;
      skin *= 0.93 + 0.10 * grain;

      // radial coating streaks emanating from the strike center
      float radial = noise(vec2(ang * u_scale * 5.5, r * u_scale * 0.9));
      radial = radial * 0.65 + noise(vec2(ang * u_scale * 14.0, r * u_scale * 2.2)) * 0.35;
      skin *= 0.94 + 0.09 * radial;

      // subtle concentric pressure rings around the same center
      float ringPhase = r * u_scale * 6.0 + snoise(vec2(ang * 2.0, r * 3.0)) * 0.6;
      float rings = sin(ringPhase * 6.28318);
      // soften rings with distance so they fade, not band
      float ringFade = 0.5 + 0.5 * noise(vec2(r * 4.0, ang * 3.0) + 11.0);
      skin *= 1.0 - 0.05 * rings * ringFade;

      // broad tonal drift so the coating doesn't read flat
      skin *= 0.95 + 0.09 * fbm(uv * 2.3 + 5.7);

      // soft sheen band — mylar catching light diagonally
      float sheen = smoothstep(0.35, 0.0, abs(dot(uv - 0.5, normalize(vec2(0.6, 0.8))) - 0.08));
      skin *= 1.0 + 0.07 * sheen;

      // --- stick-wear scuff cluster, off-center toward lower right ---
      vec2 sweet = vec2(0.62, 0.38);
      float sd = length((uv - sweet) * vec2(1.0, 1.35));
      float cluster = smoothstep(0.34, 0.06, sd);
      // dense chatter of overlapping scuff strokes
      float scuffN = fbm(vec2(uv.x * u_scale * 4.0, uv.y * u_scale * 11.0) + 3.3);
      float scuff = cluster * smoothstep(0.42, 0.75, scuffN);
      vec3 wornCol = mix(skin, u_secondary_color.rgb, 0.55);
      skin = mix(skin, wornCol, clamp(scuff * u_wear * 1.6, 0.0, 0.85));
      // a few sharper chip marks where coating flaked off
      float chipN = noise(vec2(uv.x * u_scale * 9.0, uv.y * u_scale * 26.0) + 8.1);
      float chips = cluster * step(0.965 - 0.08 * u_wear, chipN);
      skin = mix(skin, u_secondary_color.rgb, chips * u_wear * 0.9);
      // faint halo of dulled coating around the cluster
      skin *= 1.0 - 0.05 * u_wear * smoothstep(0.5, 0.15, sd);

      // --- faint rim shadow arc along the right edge only ---
      // rim is a huge circle whose edge just clips into the tile
      vec2 rimC = vec2(2.05, 0.5);
      float rimR = length(uv - rimC);
      float rimShadow = smoothstep(1.12, 0.98, rimR) * u_rim;
      skin *= 1.0 - 0.30 * rimShadow;
      // thin brighter line where the head tensions over the bearing edge
      float rimLine = smoothstep(0.03, 0.0, abs(rimR - 1.005)) * u_rim;
      skin = mix(skin, u_accent_color.rgb, rimLine * 0.35);

      // gentle vignette-free lighting drift from the strike center
      skin *= 0.96 + 0.07 * smoothstep(2.0, 0.4, r);

      return vec4(skin, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Coating Fineness', type: 'float', min: 2.0, max: 24.0, default: 8.0 },
    { id: 'u_wear', name: 'Stick Wear', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_rim', name: 'Rim Shadow', type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_primary_color', name: 'Skin', type: 'color', default: [0.92, 0.91, 0.87, 1.0] },
    { id: 'u_secondary_color', name: 'Wear Marks', type: 'color', default: [0.62, 0.60, 0.55, 1.0] },
    { id: 'u_accent_color', name: 'Rim Highlight', type: 'color', default: [0.98, 0.97, 0.94, 1.0] }
  ],
  variants: [
    { name: 'Studio Coated', uniforms: { u_scale: 8.0, u_wear: 0.6, u_rim: 0.7, u_primary_color: [0.92, 0.91, 0.87, 1.0], u_secondary_color: [0.62, 0.60, 0.55, 1.0], u_accent_color: [0.98, 0.97, 0.94, 1.0] } },
    { name: 'Black Suede', uniforms: { u_scale: 12.0, u_wear: 0.35, u_rim: 0.55, u_primary_color: [0.13, 0.13, 0.14, 1.0], u_secondary_color: [0.28, 0.27, 0.26, 1.0], u_accent_color: [0.55, 0.5, 0.35, 1.0] } },
    { name: 'Vintage Calf', uniforms: { u_scale: 5.0, u_wear: 0.9, u_rim: 0.85, u_primary_color: [0.84, 0.73, 0.55, 1.0], u_secondary_color: [0.55, 0.42, 0.28, 1.0], u_accent_color: [0.93, 0.86, 0.7, 1.0] } }
  ]
};

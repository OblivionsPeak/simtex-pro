export default {
  id: 'rice_terraces',
  name: 'Rice Terraces',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Stepped paddy fields hugging the hillside — green tiers, mirror water, mud bund edges.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // hillside elevation
      float h = fbm(uv * 0.5) * 0.5 + 0.5;
      float tiers = h * u_tiers;
      float tier = floor(tiers);
      float f = fract(tiers);
      // each tier: mostly crop, some flooded
      float flooded = step(0.72, hash(vec2(tier, 3.3)));
      vec3 crop = mix(u_primary_color.rgb, u_accent_color.rgb, hash(vec2(tier, 7.7)));
      // planting rows following the contour
      crop *= 0.92 + 0.08 * sin(tiers * 40.0);
      // water tier reflects the sky with slight ripple
      vec3 water = u_secondary_color.rgb * (0.9 + 0.1 * snoise(uv * 6.0));
      vec3 c = mix(crop, water, flooded);
      // bund edge: dark mud lip at each step with a bright water line
      float edge = smoothstep(0.12, 0.0, f);
      c = mix(c, vec3(0.22, 0.16, 0.1), edge * 0.8);
      c += vec3(0.15) * smoothstep(0.05, 0.0, abs(f - 0.14)) * flooded;
      // haze toward high ground
      c = mix(c, u_secondary_color.rgb, smoothstep(0.7, 1.0, h) * 0.15);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Hill Scale', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_tiers', name: 'Terrace Count', type: 'float', min: 6.0, max: 40.0, default: 18.0 },
    { id: 'u_primary_color', name: 'Young Rice', type: 'color', default: [0.35, 0.6, 0.2, 1.0] },
    { id: 'u_accent_color', name: 'Mature Rice', type: 'color', default: [0.6, 0.68, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Sky Water', type: 'color', default: [0.65, 0.75, 0.8, 1.0] }
  ],
  variants: [
    { name: 'Growing Season', uniforms: { u_primary_color: [0.35, 0.6, 0.2, 1.0], u_accent_color: [0.6, 0.68, 0.25, 1.0], u_secondary_color: [0.65, 0.75, 0.8, 1.0], u_tiers: 18.0 } },
    { name: 'Harvest Gold', uniforms: { u_primary_color: [0.75, 0.6, 0.25, 1.0], u_accent_color: [0.85, 0.72, 0.35, 1.0], u_secondary_color: [0.7, 0.72, 0.7, 1.0], u_tiers: 22.0 } },
    { name: 'Flood Mirror', uniforms: { u_primary_color: [0.3, 0.4, 0.3, 1.0], u_accent_color: [0.4, 0.5, 0.35, 1.0], u_secondary_color: [0.85, 0.7, 0.5, 1.0], u_tiers: 14.0 } }
  ]
};

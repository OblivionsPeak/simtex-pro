export default {
  id: 'sunspot_granulation',
  name: 'Sunspot Granulation',
  category: 'Cosmos',
  added: '2026-07-07',
  description: 'The boiling solar surface — bright convection granules split by dark lanes, with sunspot pairs.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // granule cells: ridged noise makes bright cells with dark lanes
      float g1 = abs(snoise(uv * 3.0));
      float g2 = abs(snoise(uv * 6.0 + vec2(9.1, 3.3)));
      float lanes = 1.0 - max(g1, g2 * 0.6);
      vec3 c = mix(u_primary_color.rgb, u_accent_color.rgb, clamp(lanes * 1.4, 0.0, 1.0));
      // large-scale brightness variation
      c *= 0.9 + 0.2 * snoise(uv * 0.4);
      // sunspots: low-frequency dark cores with penumbra filaments
      float spotField = snoise(uv * 0.35 + vec2(21.0, 13.0));
      float core = smoothstep(0.55, 0.8, spotField);
      float penumbra = smoothstep(0.35, 0.55, spotField) - core;
      float filaments = 0.5 + 0.5 * sin(atan(snoise(uv * 2.0), snoise(uv * 2.0 + 5.0)) * 6.0 + length(uv) * 30.0);
      c = mix(c, u_secondary_color.rgb * (0.5 + 0.5 * filaments), penumbra * u_spots);
      c = mix(c, u_secondary_color.rgb * 0.25, core * u_spots);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Granule Scale', type: 'float', min: 1.0, max: 12.0, default: 4.0 },
    { id: 'u_spots', name: 'Sunspots', type: 'float', min: 0.0, max: 1.0, default: 0.8 },
    { id: 'u_primary_color', name: 'Granules', type: 'color', default: [1.0, 0.75, 0.25, 1.0] },
    { id: 'u_accent_color', name: 'Lanes', type: 'color', default: [0.85, 0.4, 0.05, 1.0] },
    { id: 'u_secondary_color', name: 'Spot Umbra', type: 'color', default: [0.25, 0.08, 0.02, 1.0] }
  ],
  variants: [
    { name: 'Photosphere', uniforms: { u_primary_color: [1.0, 0.75, 0.25, 1.0], u_accent_color: [0.85, 0.4, 0.05, 1.0], u_secondary_color: [0.25, 0.08, 0.02, 1.0], u_spots: 0.8 } },
    { name: 'Calcium K', uniforms: { u_primary_color: [0.7, 0.4, 0.9, 1.0], u_accent_color: [0.35, 0.12, 0.5, 1.0], u_secondary_color: [0.12, 0.03, 0.18, 1.0], u_spots: 0.6 } },
    { name: 'Red Dwarf', uniforms: { u_primary_color: [0.95, 0.35, 0.15, 1.0], u_accent_color: [0.55, 0.12, 0.05, 1.0], u_secondary_color: [0.15, 0.03, 0.02, 1.0], u_spots: 1.0 } }
  ]
};

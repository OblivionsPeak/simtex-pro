export default {
  id: 'gold_ore_vein',
  name: 'Gold Ore Vein',
  category: 'Geology',
  added: '2026-07-07',
  description: 'Branching gold veins glittering through dark host rock — high-grade ore face.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // host rock
      vec4 col = u_secondary_color;
      col.rgb *= 0.8 + 0.2 * fbm(uv * 2.5);
      // ridged noise: veins live where |noise| pinches to zero
      float n1 = abs(snoise(uv * 0.8));
      float n2 = abs(snoise(uv * 1.7 + vec2(11.0, 5.0)));
      float vein1 = 1.0 - smoothstep(0.0, u_width, n1);
      float vein2 = 1.0 - smoothstep(0.0, u_width * 0.6, n2);
      float vein = max(vein1, vein2 * 0.85);
      // quartz halo around the vein
      float halo = (1.0 - smoothstep(0.0, u_width * 2.6, n1)) - vein1;
      col.rgb = mix(col.rgb, u_accent_color.rgb * (0.8 + 0.2 * snoise(uv * 8.0)), clamp(halo, 0.0, 1.0) * 0.7);
      // gold: warm gradient along the vein with sparkle flecks
      vec3 gold = u_primary_color.rgb * (0.75 + 0.5 * snoise(uv * 5.0 + 3.0));
      float sparkle = step(0.985, hash(floor(uv * 30.0))) * vein;
      col.rgb = mix(col.rgb, gold, vein);
      col.rgb += vec3(1.0, 0.9, 0.6) * sparkle * u_glitter;
      // scattered pyrite flecks in the rock
      float fleck = step(0.995, hash(floor(uv * 22.0) + 9.0));
      col.rgb += u_primary_color.rgb * fleck * 0.5;
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Vein Scale', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_width', name: 'Vein Width', type: 'float', min: 0.02, max: 0.3, default: 0.1 },
    { id: 'u_glitter', name: 'Glitter', type: 'float', min: 0.0, max: 1.5, default: 0.8 },
    { id: 'u_primary_color', name: 'Gold', type: 'color', default: [0.85, 0.65, 0.2, 1.0] },
    { id: 'u_accent_color', name: 'Quartz Halo', type: 'color', default: [0.75, 0.72, 0.68, 1.0] },
    { id: 'u_secondary_color', name: 'Host Rock', type: 'color', default: [0.14, 0.13, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Mother Lode', uniforms: { u_primary_color: [0.85, 0.65, 0.2, 1.0], u_accent_color: [0.75, 0.72, 0.68, 1.0], u_secondary_color: [0.14, 0.13, 0.14, 1.0], u_glitter: 0.8 } },
    { name: 'Silver Lode', uniforms: { u_primary_color: [0.8, 0.82, 0.85, 1.0], u_accent_color: [0.55, 0.55, 0.58, 1.0], u_secondary_color: [0.1, 0.1, 0.12, 1.0], u_glitter: 1.0 } },
    { name: 'Copper Strike', uniforms: { u_primary_color: [0.8, 0.45, 0.25, 1.0], u_accent_color: [0.4, 0.55, 0.5, 1.0], u_secondary_color: [0.16, 0.14, 0.12, 1.0], u_glitter: 0.6 } }
  ]
};

export default {
  id: 'birch_bark',
  name: 'Birch Bark',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Papery white birch — horizontal lenticel dashes, peel bands, and dark knot scars.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_primary_color;
      // subtle vertical paper bands
      col.rgb *= 0.95 + 0.05 * snoise(vec2(uv.x * 4.0, uv.y * 0.3));
      // chalky texture
      col.rgb *= 0.96 + 0.04 * snoise(uv * 14.0);
      // horizontal lenticel dashes
      vec2 lg = vec2(uv.x * 1.6, uv.y * 6.0);
      vec2 cell = floor(lg);
      vec2 f = fract(lg);
      float present = step(0.55, hash(cell + 1.9));
      float lw = 0.25 + hash(cell + 3.2) * 0.45;   // dash length
      float dash = step(abs(f.x - 0.5), lw * 0.5) * smoothstep(0.16, 0.08, abs(f.y - 0.5)) * present;
      col.rgb = mix(col.rgb, u_secondary_color.rgb, dash * 0.85);
      // peel curls: darker horizontal strips with a bright top edge
      float peel = smoothstep(0.85, 0.95, snoise(vec2(uv.x * 0.7, uv.y * 2.2)));
      col.rgb = mix(col.rgb, u_primary_color.rgb * 0.75, peel * 0.6);
      col.rgb += smoothstep(0.94, 0.95, snoise(vec2(uv.x * 0.7, uv.y * 2.2))) * 0.1;
      // occasional knot scar
      float knot = smoothstep(0.78, 0.95, snoise(uv * 0.5 + vec2(31.0, 17.0)));
      float knotTex = 0.5 + 0.5 * sin(uv.y * 20.0 + snoise(uv * 3.0) * 5.0);
      col.rgb = mix(col.rgb, u_secondary_color.rgb * (0.6 + 0.4 * knotTex), knot);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Bark Scale', type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Bark', type: 'color', default: [0.93, 0.92, 0.88, 1.0] },
    { id: 'u_secondary_color', name: 'Lenticels', type: 'color', default: [0.16, 0.13, 0.11, 1.0] }
  ],
  variants: [
    { name: 'Paper Birch', uniforms: { u_primary_color: [0.93, 0.92, 0.88, 1.0], u_secondary_color: [0.16, 0.13, 0.11, 1.0] } },
    { name: 'River Birch', uniforms: { u_primary_color: [0.82, 0.68, 0.52, 1.0], u_secondary_color: [0.28, 0.18, 0.12, 1.0] } },
    { name: 'Winter Grey', uniforms: { u_primary_color: [0.8, 0.81, 0.83, 1.0], u_secondary_color: [0.12, 0.12, 0.14, 1.0] } }
  ]
};

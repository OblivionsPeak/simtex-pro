export default {
  id: 'dry_stone_wall',
  name: 'Dry Stone Wall',
  category: 'Architecture',
  added: '2026-07-07',
  description: 'Hand-stacked fieldstone courses — irregular stones, deep shadow joints, moss in the gaps.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // courses of varying height
      float rowRaw = uv.y * (0.8 + 0.4 * hash(vec2(floor(uv.y), 3.0)));
      float row = floor(uv.y);
      // stones of varying width, offset per course
      float xoff = hash(vec2(row, 7.7)) * 10.0;
      float xj = uv.x * (0.9 + 0.5 * hash(vec2(row, 2.2))) + xoff;
      float stone = floor(xj);
      vec2 id = vec2(stone, row);
      vec2 f = vec2(fract(xj), fract(uv.y));
      // rounded stone mask inside its cell
      vec2 p = (f - 0.5) * vec2(1.0, 1.25);
      // irregular edges via per-stone noise
      float wob = snoise(p * 3.0 + id * 5.0) * 0.08;
      float d = max(abs(p.x), abs(p.y)) + wob;
      float face = smoothstep(0.5, 0.42, d);
      // stone tone varies; surface has lichen speckle and grain
      vec3 rock = u_primary_color.rgb * (0.7 + 0.5 * hash(id + 4.4));
      rock = mix(rock, u_accent_color.rgb, step(0.8, hash(id + 8.8)) * 0.35); // odd different stone
      rock *= 0.92 + 0.08 * fbm((uv + id) * 4.0);
      // face shading: top-lit
      rock *= 0.85 + 0.3 * smoothstep(0.5, -0.3, p.y);
      // joints: dark gaps with moss
      vec3 joint = u_secondary_color.rgb;
      float moss = smoothstep(0.5, 0.85, fbm(uv * 3.0 + 11.0)) * u_moss;
      joint = mix(joint, vec3(0.2, 0.32, 0.12), moss);
      vec3 c = mix(joint, rock, face);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stone Density', type: 'float', min: 2.0, max: 16.0, default: 6.0 },
    { id: 'u_moss', name: 'Moss', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Stone', type: 'color', default: [0.6, 0.57, 0.52, 1.0] },
    { id: 'u_accent_color', name: 'Odd Stone', type: 'color', default: [0.5, 0.42, 0.36, 1.0] },
    { id: 'u_secondary_color', name: 'Joint Shadow', type: 'color', default: [0.1, 0.09, 0.08, 1.0] }
  ],
  variants: [
    { name: 'Yorkshire Dales', uniforms: { u_primary_color: [0.6, 0.57, 0.52, 1.0], u_accent_color: [0.5, 0.42, 0.36, 1.0], u_secondary_color: [0.1, 0.09, 0.08, 1.0], u_moss: 0.5 } },
    { name: 'Granite Coast', uniforms: { u_primary_color: [0.55, 0.56, 0.58, 1.0], u_accent_color: [0.65, 0.6, 0.55, 1.0], u_secondary_color: [0.12, 0.12, 0.13, 1.0], u_moss: 0.2 } },
    { name: 'Red Sandstone', uniforms: { u_primary_color: [0.62, 0.4, 0.28, 1.0], u_accent_color: [0.7, 0.52, 0.35, 1.0], u_secondary_color: [0.14, 0.08, 0.05, 1.0], u_moss: 0.35 } }
  ]
};

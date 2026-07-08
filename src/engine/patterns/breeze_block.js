export default {
  id: 'breeze_block',
  name: 'Breeze Block',
  category: 'Architecture',
  added: '2026-07-07',
  description: 'Mid-century decorative concrete screen — repeating cast blocks with circle-and-petal cutouts.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 f = fract(uv) - 0.5;
      float r = length(f);
      // the classic quatrefoil cutout: ring plus four petals
      float ring = abs(r - 0.27);
      float petals = length(vec2(abs(f.x) - 0.33, abs(f.y) - 0.33));
      float cutout = min(ring, petals - 0.12);
      float hole = smoothstep(u_open + 0.02, u_open, cutout);
      // concrete block face
      vec4 col = u_primary_color;
      col.rgb *= 0.92 + 0.08 * snoise(uv * 9.0);
      col.rgb *= 0.96 + 0.04 * hash(floor(uv));
      // mortar joints between blocks
      float joint = max(smoothstep(0.47, 0.5, abs(f.x)), smoothstep(0.47, 0.5, abs(f.y)));
      col.rgb = mix(col.rgb, col.rgb * 0.8, joint);
      // inner shadow ring around each cutout, light from above
      float bevel = smoothstep(u_open, u_open + 0.05, cutout) - smoothstep(u_open + 0.05, u_open + 0.1, cutout);
      col.rgb *= 1.0 - bevel * 0.3;
      col.rgb += bevel * 0.12 * clamp(-f.y * 4.0, 0.0, 1.0);
      // what shows through the holes
      vec3 behind = u_secondary_color.rgb * (0.85 + 0.15 * v_uv.y);
      col.rgb = mix(col.rgb, behind, hole);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Block Density', type: 'float', min: 2.0, max: 14.0, default: 6.0 },
    { id: 'u_open', name: 'Cutout Size', type: 'float', min: 0.01, max: 0.1, default: 0.05 },
    { id: 'u_primary_color', name: 'Concrete', type: 'color', default: [0.85, 0.82, 0.76, 1.0] },
    { id: 'u_secondary_color', name: 'Through Holes', type: 'color', default: [0.15, 0.3, 0.4, 1.0] }
  ],
  variants: [
    { name: 'Palm Springs', uniforms: { u_primary_color: [0.85, 0.82, 0.76, 1.0], u_secondary_color: [0.15, 0.3, 0.4, 1.0], u_open: 0.05 } },
    { name: 'Sunset Wall', uniforms: { u_primary_color: [0.9, 0.8, 0.7, 1.0], u_secondary_color: [0.9, 0.5, 0.25, 1.0], u_open: 0.06 } },
    { name: 'Painted Coral', uniforms: { u_primary_color: [0.92, 0.6, 0.55, 1.0], u_secondary_color: [0.1, 0.12, 0.15, 1.0], u_open: 0.04 } }
  ]
};

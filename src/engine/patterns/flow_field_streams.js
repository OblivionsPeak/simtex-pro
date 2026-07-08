export default {
  id: 'flow_field_streams',
  name: 'Flow Field Streams',
  category: 'Abstract',
  added: '2026-07-07',
  description: 'Generative streamlines — thousands of fine strands combed along an invisible flow field.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // domain-warp the coordinates twice for a flowing look
      vec2 q = vec2(fbm(uv * 0.5), fbm(uv * 0.5 + vec2(5.2, 1.3)));
      vec2 rr = vec2(fbm(uv * 0.5 + q * u_warp + vec2(1.7, 9.2)),
                     fbm(uv * 0.5 + q * u_warp + vec2(8.3, 2.8)));
      float field = fbm(uv * 0.5 + rr * u_warp);
      // fine strands: dense bands over the warped field
      float strands = sin(field * u_lines * 6.28318 + uv.x * 2.0);
      float m = smoothstep(0.0, 0.85, strands) ;
      // color by the secondary warp for depth variation
      vec3 c = mix(u_secondary_color.rgb, u_primary_color.rgb, m);
      c = mix(c, u_accent_color.rgb, clamp(rr.x * 1.4 - 0.2, 0.0, 1.0) * 0.6 * m);
      // luminous crests
      c += u_accent_color.rgb * smoothstep(0.92, 1.0, strands) * 0.35;
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Field Scale', type: 'float', min: 1.0, max: 10.0, default: 3.5 },
    { id: 'u_warp', name: 'Flow Strength', type: 'float', min: 0.5, max: 5.0, default: 2.2 },
    { id: 'u_lines', name: 'Strand Count', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_secondary_color', name: 'Deep', type: 'color', default: [0.05, 0.06, 0.12, 1.0] },
    { id: 'u_primary_color', name: 'Streams', type: 'color', default: [0.25, 0.55, 0.75, 1.0] },
    { id: 'u_accent_color', name: 'Crest', type: 'color', default: [0.85, 0.9, 0.95, 1.0] }
  ],
  variants: [
    { name: 'Ocean Current', uniforms: { u_secondary_color: [0.05, 0.06, 0.12, 1.0], u_primary_color: [0.25, 0.55, 0.75, 1.0], u_accent_color: [0.85, 0.9, 0.95, 1.0], u_warp: 2.2 } },
    { name: 'Magma Flow', uniforms: { u_secondary_color: [0.1, 0.03, 0.02, 1.0], u_primary_color: [0.8, 0.3, 0.08, 1.0], u_accent_color: [1.0, 0.85, 0.4, 1.0], u_warp: 3.0 } },
    { name: 'Ink Wash', uniforms: { u_secondary_color: [0.92, 0.91, 0.88, 1.0], u_primary_color: [0.35, 0.37, 0.42, 1.0], u_accent_color: [0.12, 0.12, 0.15, 1.0], u_warp: 1.6 } }
  ]
};

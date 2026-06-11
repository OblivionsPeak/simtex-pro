export default {
  id: 'cow_print',
  name: 'Cow Print',
  category: 'Organic',
  added: '2026-06-11',
  description: 'Classic Holstein cow hide: irregular organic black blotches scattered over white, with a second smaller blotch layer for natural variety.',
  shader: `

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Domain warp so blotch edges wander organically instead of
      // following the smooth noise contours too literally.
      vec2 warp = vec2(
        snoise(uv * 0.9 + vec2(31.4, 8.2)),
        snoise(uv * 0.9 + vec2(73.1, 52.6))
      ) * 0.35;
      vec2 wuv = uv + warp;

      float soft = max(u_soft, 0.002);

      // Coverage maps to an fbm threshold: higher coverage lowers the
      // cut so more of the field becomes blotch.
      float thr = mix(0.55, -0.55, u_coverage);

      // Primary large blotches — slightly hard smoothstep edge for the
      // printed-hide look.
      float b1 = fbm(wuv);
      float mask = smoothstep(thr - soft, thr + soft, b1);

      // Secondary smaller, sparser blotch layer for variety.
      float b2 = fbm(wuv * 2.3 + vec2(45.7, 19.3));
      float mask2 = smoothstep(thr + 0.28 - soft, thr + 0.28 + soft, b2);
      mask = max(mask, mask2);

      vec4 color = mix(u_color_base, u_color_blotch, mask);

      // Faint hide grain so flat areas are not sterile.
      color.rgb += snoise(uv * 55.0) * 0.012;

      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Holstein',
      uniforms: {
        u_color_blotch: [0.05, 0.05, 0.06, 1.0],
        u_color_base: [0.96, 0.95, 0.93, 1.0]
      }
    },
    {
      name: 'Brown Swiss',
      uniforms: {
        u_color_blotch: [0.33, 0.20, 0.11, 1.0],
        u_color_base: [0.92, 0.87, 0.78, 1.0]
      }
    },
    {
      name: 'Pink Moo',
      uniforms: {
        u_color_blotch: [0.95, 0.35, 0.62, 1.0],
        u_color_base: [1.00, 0.94, 0.97, 1.0]
      }
    },
    {
      name: 'Inverse',
      uniforms: {
        u_color_blotch: [0.96, 0.95, 0.93, 1.0],
        u_color_base: [0.05, 0.05, 0.06, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Blotch Scale', type: 'float', min: 1.0, max: 12.0, default: 3.5 },
    { id: 'u_coverage', name: 'Blotch Coverage', type: 'float', min: 0.0, max: 1.0, default: 0.45 },
    { id: 'u_soft', name: 'Edge Softness', type: 'float', min: 0.002, max: 0.4, default: 0.05 },
    { id: 'u_color_blotch', name: 'Blotch Color', type: 'color', default: [0.05, 0.05, 0.06, 1.0] },
    { id: 'u_color_base', name: 'Base Color', type: 'color', default: [0.96, 0.95, 0.93, 1.0] }
  ]
};

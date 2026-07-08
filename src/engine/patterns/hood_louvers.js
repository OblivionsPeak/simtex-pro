export default {
  id: 'hood_louvers',
  name: 'Hood Louvers',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Stamped sheet-metal louver rows — hot-rod hood venting with deep slot shadows.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      float row = floor(uv.y);
      float fy = fract(uv.y);
      // stagger alternate columns of louvers
      float col = floor(uv.x / u_span);
      float fx = fract(uv.x / u_span);
      float inSlot = step(0.08, fx) * step(fx, 0.92);
      vec4 base = u_primary_color;
      // panel brushing
      base.rgb *= 0.96 + 0.04 * sin(uv.x * 30.0 + hash(vec2(row, 1.0)) * 6.0);
      // louver profile: raised ramp, then the dark open slot
      float ramp = smoothstep(0.15, 0.55, fy) * step(fy, 0.62);
      float slot = step(0.62, fy) * step(fy, 0.8);
      float lip = smoothstep(0.6, 0.62, fy) * step(fy, 0.66);
      vec3 c = base.rgb;
      c *= 1.0 - ramp * inSlot * 0.18;                    // ramp shading
      c += lip * inSlot * 0.25;                           // bright stamped lip
      c = mix(c, u_secondary_color.rgb, slot * inSlot);   // dark opening
      // slot end caps rounded
      float cap = smoothstep(0.06, 0.1, fx) * smoothstep(0.94, 0.9, fx);
      c = mix(base.rgb, c, mix(1.0, cap, step(0.15, fy)));
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Louver Rows', type: 'float', min: 4.0, max: 40.0, default: 14.0 },
    { id: 'u_span', name: 'Louver Length', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Panel', type: 'color', default: [0.55, 0.56, 0.58, 1.0] },
    { id: 'u_secondary_color', name: 'Slot Shadow', type: 'color', default: [0.04, 0.04, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Bare Steel', uniforms: { u_primary_color: [0.55, 0.56, 0.58, 1.0], u_secondary_color: [0.04, 0.04, 0.05, 1.0], u_rotate: 0.0 } },
    { name: 'Hot Rod Black', uniforms: { u_primary_color: [0.12, 0.12, 0.13, 1.0], u_secondary_color: [0.01, 0.01, 0.01, 1.0], u_rotate: 0.0 } },
    { name: 'Race Red', uniforms: { u_primary_color: [0.68, 0.09, 0.1, 1.0], u_secondary_color: [0.05, 0.02, 0.02, 1.0], u_rotate: 90.0 } }
  ]
};

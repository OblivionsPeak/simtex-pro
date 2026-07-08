export default {
  id: 'bamboo_stalks',
  name: 'Bamboo Stalks',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Packed vertical bamboo culms with knuckled nodes and cylindrical sheen.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      float col_ = floor(uv.x);
      float fx = fract(uv.x);
      float seed = hash(vec2(col_, 3.7));
      // cylindrical shading across each culm
      float shade = sin(fx * 3.14159);
      vec3 culm = mix(u_primary_color.rgb, u_accent_color.rgb, seed * 0.6);
      culm *= 0.45 + 0.55 * shade;
      // vertical fiber striations
      culm *= 0.94 + 0.06 * sin(fx * 40.0 + seed * 9.0);
      // nodes: horizontal knuckle rings at per-culm offsets
      float ny = fract(uv.y * 0.45 + seed * 5.0);
      float node = smoothstep(0.06, 0.02, abs(ny - 0.5));
      culm = mix(culm, culm * 0.55, node);
      culm += vec3(0.12) * smoothstep(0.035, 0.015, abs(ny - 0.47)) * shade;
      // dark crevice between culms
      float gap = smoothstep(0.08, 0.0, fx) + smoothstep(0.92, 1.0, fx);
      culm = mix(culm, u_secondary_color.rgb, clamp(gap, 0.0, 1.0));
      // gloss stripe
      culm += u_shine * 0.18 * pow(max(sin((fx - 0.12) * 3.6), 0.0), 10.0);
      return vec4(culm, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Culm Density', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_shine', name: 'Sheen', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Culm', type: 'color', default: [0.45, 0.6, 0.25, 1.0] },
    { id: 'u_accent_color', name: 'Culm Variance', type: 'color', default: [0.7, 0.68, 0.35, 1.0] },
    { id: 'u_secondary_color', name: 'Crevice', type: 'color', default: [0.08, 0.1, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Green Grove', uniforms: { u_primary_color: [0.45, 0.6, 0.25, 1.0], u_accent_color: [0.7, 0.68, 0.35, 1.0], u_secondary_color: [0.08, 0.1, 0.05, 1.0], u_rotate: 0.0 } },
    { name: 'Dried Cane', uniforms: { u_primary_color: [0.78, 0.65, 0.4, 1.0], u_accent_color: [0.65, 0.5, 0.3, 1.0], u_secondary_color: [0.2, 0.14, 0.08, 1.0], u_rotate: 0.0 } },
    { name: 'Black Bamboo', uniforms: { u_primary_color: [0.16, 0.14, 0.12, 1.0], u_accent_color: [0.3, 0.26, 0.2, 1.0], u_secondary_color: [0.03, 0.03, 0.03, 1.0], u_rotate: 0.0 } }
  ]
};

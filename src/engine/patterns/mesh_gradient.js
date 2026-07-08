export default {
  id: 'mesh_gradient',
  name: 'Mesh Gradient',
  category: 'Abstract',
  added: '2026-07-07',
  description: 'Silky multi-point color mesh — four hues melting into each other with no hard edges.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      // five anchor points; positions gently perturbed by the scale control
      vec2 p1 = vec2(0.2, 0.25) + 0.08 * vec2(sin(u_drift), cos(u_drift * 1.3));
      vec2 p2 = vec2(0.85, 0.2) + 0.08 * vec2(cos(u_drift * 0.7), sin(u_drift));
      vec2 p3 = vec2(0.75, 0.8) + 0.08 * vec2(sin(u_drift * 1.7), cos(u_drift * 0.9));
      vec2 p4 = vec2(0.15, 0.85) + 0.08 * vec2(cos(u_drift * 1.1), sin(u_drift * 0.6));
      vec2 p5 = vec2(0.5, 0.5);
      float k = u_tightness;
      float w1 = exp(-dot(uv - p1, uv - p1) * k);
      float w2 = exp(-dot(uv - p2, uv - p2) * k);
      float w3 = exp(-dot(uv - p3, uv - p3) * k);
      float w4 = exp(-dot(uv - p4, uv - p4) * k);
      float w5 = exp(-dot(uv - p5, uv - p5) * k) * 0.6;
      float tot = w1 + w2 + w3 + w4 + w5 + 0.0001;
      vec3 c = (u_primary_color.rgb * w1 + u_accent_color.rgb * w2 +
                u_pop_color.rgb * w3 + u_secondary_color.rgb * w4 +
                mix(u_primary_color.rgb, u_pop_color.rgb, 0.5) * w5) / tot;
      // faint large-scale swirl so it never reads flat
      c *= 0.97 + 0.03 * snoise(uv * 3.0 * u_scale);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Texture Detail', type: 'float', min: 0.5, max: 6.0, default: 2.0 },
    { id: 'u_tightness', name: 'Blend Tightness', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_drift', name: 'Anchor Drift', type: 'float', min: 0.0, max: 6.28, default: 1.0 },
    { id: 'u_primary_color', name: 'Corner 1', type: 'color', default: [0.95, 0.5, 0.35, 1.0] },
    { id: 'u_accent_color', name: 'Corner 2', type: 'color', default: [0.55, 0.35, 0.85, 1.0] },
    { id: 'u_pop_color', name: 'Corner 3', type: 'color', default: [0.2, 0.55, 0.85, 1.0] },
    { id: 'u_secondary_color', name: 'Corner 4', type: 'color', default: [0.95, 0.75, 0.5, 1.0] }
  ],
  variants: [
    { name: 'App Launch', uniforms: { u_primary_color: [0.95, 0.5, 0.35, 1.0], u_accent_color: [0.55, 0.35, 0.85, 1.0], u_pop_color: [0.2, 0.55, 0.85, 1.0], u_secondary_color: [0.95, 0.75, 0.5, 1.0], u_tightness: 7.0 } },
    { name: 'Deep Sea Silk', uniforms: { u_primary_color: [0.05, 0.25, 0.4, 1.0], u_accent_color: [0.1, 0.5, 0.55, 1.0], u_pop_color: [0.04, 0.08, 0.2, 1.0], u_secondary_color: [0.3, 0.7, 0.65, 1.0], u_tightness: 5.0 } },
    { name: 'Peach Cream', uniforms: { u_primary_color: [0.98, 0.8, 0.7, 1.0], u_accent_color: [0.95, 0.65, 0.6, 1.0], u_pop_color: [0.9, 0.85, 0.75, 1.0], u_secondary_color: [0.85, 0.7, 0.8, 1.0], u_tightness: 9.0 } }
  ]
};

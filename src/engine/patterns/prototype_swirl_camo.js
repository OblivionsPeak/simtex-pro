export default {
  id: 'prototype_swirl_camo',
  name: 'Prototype Swirl Camo',
  category: 'Racing',
  added: '2026-07-07',
  description: 'Manufacturer test-mule disguise — dizzying warped black and white swirl camouflage.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 warp = vec2(snoise(uv * 0.35), snoise(uv * 0.35 + vec2(5.2, 1.3)));
      vec2 q = uv + warp * u_warp;
      float bands = sin(q.x * 2.0 + snoise(q * 0.5) * 6.0) + sin(q.y * 1.7 + snoise(q * 0.4 + vec2(9.0, 3.0)) * 6.0);
      float s = max(u_softness, 0.002);
      float m = smoothstep(-s * 20.0, s * 20.0, sin(bands * 3.14159));
      vec4 col = mix(u_secondary_color, u_primary_color, m);
      // occasional third-tone blotches to break the rhythm
      float blotch = smoothstep(0.45, 0.55, snoise(q * 0.25 + vec2(17.0, 8.0)));
      return mix(col, u_accent_color, blotch * u_blotch);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Swirl Scale', type: 'float', min: 2.0, max: 20.0, default: 7.0 },
    { id: 'u_warp', name: 'Warp Amount', type: 'float', min: 0.0, max: 4.0, default: 1.8 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.05, default: 0.004 },
    { id: 'u_blotch', name: 'Third Tone', type: 'float', min: 0.0, max: 1.0, default: 0.4 },
    { id: 'u_primary_color', name: 'Swirl A', type: 'color', default: [0.95, 0.95, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Swirl B', type: 'color', default: [0.06, 0.06, 0.07, 1.0] },
    { id: 'u_accent_color', name: 'Blotch', type: 'color', default: [0.45, 0.45, 0.48, 1.0] }
  ],
  variants: [
    { name: 'Spy Shots', uniforms: { u_primary_color: [0.95, 0.95, 0.95, 1.0], u_secondary_color: [0.06, 0.06, 0.07, 1.0], u_accent_color: [0.45, 0.45, 0.48, 1.0], u_blotch: 0.4, u_warp: 1.8 } },
    { name: 'Blue Mule', uniforms: { u_primary_color: [0.85, 0.9, 0.95, 1.0], u_secondary_color: [0.05, 0.12, 0.3, 1.0], u_accent_color: [0.2, 0.45, 0.75, 1.0], u_blotch: 0.55, u_warp: 2.4 } },
    { name: 'Heat Haze', uniforms: { u_primary_color: [0.98, 0.55, 0.15, 1.0], u_secondary_color: [0.12, 0.05, 0.04, 1.0], u_accent_color: [0.7, 0.2, 0.1, 1.0], u_blotch: 0.3, u_warp: 3.0 } }
  ]
};

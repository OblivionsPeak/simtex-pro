export default {
  id: 'plasma_flow',
  name: 'Plasma Flow',
  category: 'Abstract',
  added: '2026-07-09',
  description: 'Double domain-warped filaments of molten plasma — sharp white-orange threads snaking through a charcoal field, mostly dark with rationed heat.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      float w1x = fbm(uv * 3.0 + 11.0);
      float w1y = fbm(uv * 3.0 + 47.0);
      vec2 q = uv + vec2(w1x, w1y) * u_warp * 0.25;
      float f1 = fbm(q * 2.5);
      vec2 q2 = q + vec2(f1, -f1) * u_warp * 0.15;
      float f = fbm(q2 * 2.5) * 0.5 + 0.5;

      float band = abs(sin(f * 6.2831853 * u_bands + uv.x * 2.2));
      float fil = pow(1.0 - band, 5.0);
      float body = clamp(f * 0.9 + 0.05, 0.0, 1.0);
      float heat = clamp(fil * (0.35 + body) * u_heat, 0.0, 1.0);

      vec3 col = mix(vec3(0.055, 0.039, 0.047), vec3(0.157, 0.086, 0.071), body);
      vec3 hot = mix(vec3(0.55, 0.12, 0.03), vec3(1.0, 0.42, 0.05), smoothstep(0.3, 0.7, heat));
      hot = mix(hot, vec3(1.0, 0.84, 0.51), smoothstep(0.7, 1.0, heat));
      col += hot * pow(heat, 0.7);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_warp',  name: 'Warp Strength', type: 'float', min: 0.0, max: 3.0, default: 1.5 },
    { id: 'u_bands', name: 'Filament Bands', type: 'float', min: 1.0, max: 6.0, default: 3.0 },
    { id: 'u_heat',  name: 'Heat',          type: 'float', min: 0.3, max: 2.0, default: 1.0 }
  ]
};

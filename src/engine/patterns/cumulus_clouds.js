export default {
  id: 'cumulus_clouds',
  name: 'Cumulus Clouds',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Fair-weather cumulus — bright cauliflower tops, shaded flat bases, deep blue sky.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // sky gradient, paler at the horizon
      vec4 col = mix(u_accent_color, u_secondary_color, clamp(v_uv.y * 1.2, 0.0, 1.0));
      // cloud field: puffy fbm with flattened bases
      float base = fbm(uv * 0.8) * 0.5 + 0.5;
      float detail = fbm(uv * 2.4 + 7.0) * 0.5 + 0.5;
      float cloud = base * 0.7 + detail * 0.3;
      // flatten: suppress density below each cloud's midline
      float flat_ = fract(uv.y * 0.5);
      cloud -= smoothstep(0.5, 0.0, flat_) * 0.12;
      float body = smoothstep(u_cover, u_cover + 0.12, cloud);
      float wispy = smoothstep(u_cover - 0.1, u_cover + 0.12, cloud);
      // shading: light tops, grey undersides
      float shade = smoothstep(0.2, 0.8, detail) * 0.5 + smoothstep(0.6, 0.1, flat_) * 0.5;
      vec3 cloudC = mix(u_primary_color.rgb, u_primary_color.rgb * 0.62, shade * u_shading);
      // golden edge light
      cloudC += vec3(0.1, 0.07, 0.02) * (wispy - body) * 2.0;
      col.rgb = mix(col.rgb, cloudC, max(body, (wispy - body) * 0.5));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Cloud Scale', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_cover', name: 'Clear Sky', type: 'float', min: 0.2, max: 0.75, default: 0.5 },
    { id: 'u_shading', name: 'Base Shading', type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_primary_color', name: 'Cloud', type: 'color', default: [0.98, 0.98, 0.97, 1.0] },
    { id: 'u_secondary_color', name: 'Sky Zenith', type: 'color', default: [0.2, 0.45, 0.85, 1.0] },
    { id: 'u_accent_color', name: 'Horizon', type: 'color', default: [0.65, 0.8, 0.95, 1.0] }
  ],
  variants: [
    { name: 'Fair Weather', uniforms: { u_primary_color: [0.98, 0.98, 0.97, 1.0], u_secondary_color: [0.2, 0.45, 0.85, 1.0], u_accent_color: [0.65, 0.8, 0.95, 1.0], u_cover: 0.5 } },
    { name: 'Golden Hour', uniforms: { u_primary_color: [1.0, 0.85, 0.7, 1.0], u_secondary_color: [0.35, 0.3, 0.55, 1.0], u_accent_color: [0.95, 0.6, 0.4, 1.0], u_cover: 0.45 } },
    { name: 'Storm Building', uniforms: { u_primary_color: [0.8, 0.8, 0.82, 1.0], u_secondary_color: [0.25, 0.3, 0.38, 1.0], u_accent_color: [0.5, 0.52, 0.55, 1.0], u_cover: 0.32, u_shading: 1.0 } }
  ]
};

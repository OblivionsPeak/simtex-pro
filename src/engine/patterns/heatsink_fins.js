export default {
  id: 'heatsink_fins',
  name: 'Heatsink Fins',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Extruded aluminum cooling fins — parallel blades with bright machined tops and deep channels.',
  shader: `
    vec4 generate() {
      float a = u_rotate * 0.01745329;
      vec2 p = mat2(cos(a), -sin(a), sin(a), cos(a)) * (v_uv - 0.5);
      vec2 uv = p * u_scale;
      float fx = fract(uv.x);
      float finW = clamp(u_fin_width, 0.15, 0.85);
      float onFin = step(fx, finW);
      vec4 col = u_primary_color;
      // fin top: bright with extrusion streaks along its length
      float streak = 0.94 + 0.06 * snoise(vec2(uv.y * 6.0, floor(uv.x) * 3.7));
      // fin side walls shade toward the channel
      float wall = smoothstep(0.0, 0.12, fx) * smoothstep(finW, finW - 0.12, fx);
      float channel = 1.0 - onFin;
      vec3 c = col.rgb * streak * mix(0.55, 1.0, wall);
      // channel floor: dark with faint reflected light
      vec3 floorC = u_secondary_color.rgb * (0.8 + 0.2 * sin(uv.y * 2.0));
      c = mix(c, floorC, channel);
      // hard specular line on the leading fin edge
      c += smoothstep(0.02, 0.0, abs(fx - 0.01)) * 0.3 * u_shine;
      c += smoothstep(0.02, 0.0, abs(fx - finW + 0.01)) * 0.15 * u_shine;
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Fin Density', type: 'float', min: 6.0, max: 60.0, default: 22.0 },
    { id: 'u_fin_width', name: 'Fin Width', type: 'float', min: 0.2, max: 0.8, default: 0.55 },
    { id: 'u_shine', name: 'Edge Shine', type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_rotate', name: 'Rotation', type: 'float', min: 0.0, max: 90.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Aluminum', type: 'color', default: [0.7, 0.71, 0.73, 1.0] },
    { id: 'u_secondary_color', name: 'Channel', type: 'color', default: [0.12, 0.12, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Raw Extrusion', uniforms: { u_primary_color: [0.7, 0.71, 0.73, 1.0], u_secondary_color: [0.12, 0.12, 0.14, 1.0], u_rotate: 0.0, u_shine: 0.7 } },
    { name: 'Black Anodized', uniforms: { u_primary_color: [0.15, 0.15, 0.17, 1.0], u_secondary_color: [0.03, 0.03, 0.04, 1.0], u_rotate: 0.0, u_shine: 0.9 } },
    { name: 'Copper Core', uniforms: { u_primary_color: [0.72, 0.45, 0.28, 1.0], u_secondary_color: [0.2, 0.1, 0.06, 1.0], u_rotate: 90.0, u_shine: 0.8 } }
  ]
};

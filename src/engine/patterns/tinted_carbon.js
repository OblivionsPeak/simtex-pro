export default {
  id: 'tinted_carbon',
  name: 'Tinted Carbon Fibre',
  category: 'Racing',
  description: 'Colour-tinted resin carbon fibre — gold, blue, and red carbon as seen on real motorsport bodywork.',
  shader: `
    float hash_tc(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Standard 45-degree twill orientation
      float ca = 0.70711, sa = 0.70711;
      uv = mat2(ca, -sa, sa, ca) * uv;

      vec2 cell = fract(uv);
      vec2 cid  = floor(uv);

      // 2x2 twill: diagonal over/under alternation
      float warpTop = step(0.5, mod(cid.x - cid.y, 2.0));

      // Fiber cross-section profiles
      float fR = 0.42;
      float fS = 0.07;
      float warpP = smoothstep(fR, fR - fS, abs(cell.y - 0.5));
      float weftP = smoothstep(fR, fR - fS, abs(cell.x - 0.5));

      float topP = mix(weftP, warpP, warpTop);
      float btmP = mix(warpP, weftP, warpTop);

      // Specular streak along fiber axis
      float warpSpec = max(0.0, pow(1.0 - abs(cell.x - 0.5) * 3.0, 2.5)) * warpP;
      float weftSpec = max(0.0, pow(1.0 - abs(cell.y - 0.5) * 3.0, 2.5)) * weftP;
      float topSpec  = mix(weftSpec, warpSpec, warpTop);

      // Per-bundle luminance variation
      float towVar = hash_tc(warpTop > 0.5 ? vec2(cid.x, 0.0) : vec2(0.0, cid.y)) * 0.05;

      // Carbon fiber is almost black — small brightness with specular pop
      float lum = topP * (0.08 + towVar) + topSpec * 0.28 + btmP * 0.035;

      vec3 fiberCol = vec3(lum);

      // Resin occupies the gap zones — tinted by user colour
      float fiberPresence = clamp(topP + btmP * 0.35, 0.0, 1.0);
      float resinMask     = 1.0 - fiberPresence;

      vec3 col = fiberCol + u_tint.rgb * resinMask * u_tint_strength * 0.55;
      col += u_tint.rgb * btmP * (1.0 - topP) * u_tint_strength * 0.18;

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_scale',         name: 'Scale',         type: 'float', default: 24.0, min: 8.0,  max: 64.0 },
    { id: 'u_tint',          name: 'Resin Tint',    type: 'color', default: [0.85, 0.62, 0.08, 1.0] },
    { id: 'u_tint_strength', name: 'Tint Strength', type: 'float', default: 0.65, min: 0.0,  max: 1.0  },
  ]
};

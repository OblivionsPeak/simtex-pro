export default {
  id: 'nomex_weave',
  name: 'Nomex Fire Suit Weave',
  category: 'Racing',
  added: '2026-05-13',
  description: 'FIA-grade Nomex aramid weave as found on fire suits, helmet liners, and race car interiors. Tight 2/1 diagonal twill structure.',
  shader: `
    float hash_nw(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Slight diagonal — Nomex is woven at ~30° off horizontal
      float ang = u_angle * 0.5236 + 0.5236; // range ~30°-60°
      float ca = cos(ang), sa = sin(ang);
      uv = mat2(ca, -sa, sa, ca) * uv;

      vec2 cell = fract(uv);
      vec2 cid  = floor(uv);

      // 2/1 twill: each warp thread goes over 2 weft then under 1
      float row    = mod(cid.y, 3.0);
      float col_   = mod(cid.x, 3.0);
      float warpTop = step(0.01, mod(col_ + row, 3.0) - 0.99);

      // Narrow fiber profiles — Nomex has a tight, fine weave
      float fR = 0.38;
      float fE = 0.055;
      float warpP = smoothstep(fR, fR - fE, abs(cell.y - 0.5));
      float weftP = smoothstep(fR, fR - fE, abs(cell.x - 0.5));

      float topP = mix(weftP, warpP, warpTop);
      float btmP = mix(warpP, weftP, warpTop);

      // Sheen along fiber axis
      float warpSheen = max(0.0, 1.0 - abs(cell.x - 0.5) * 3.5) * warpP;
      float weftSheen = max(0.0, 1.0 - abs(cell.y - 0.5) * 3.5) * weftP;
      float topSheen  = mix(weftSheen, warpSheen, warpTop) * 0.18;

      // Fine strand variation
      float strand = hash_nw(cid) * 0.04 - 0.02;

      float fiber = topP * (0.85 + strand) + btmP * 0.45 + topSheen;

      // Nomex colour: cream/golden-tan base
      vec3 base  = u_fiber_color.rgb;
      vec3 shadow = base * 0.40;
      vec3 col   = mix(shadow, base, fiber);

      return vec4(clamp(col, 0.0, 1.0), u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_scale',       name: 'Scale',        type: 'float', default: 90.0, min: 30.0, max: 220.0 },
    { id: 'u_angle',       name: 'Weave Angle',  type: 'float', default: 0.5,  min: 0.0,  max: 1.0   },
    { id: 'u_fiber_color', name: 'Fibre Colour', type: 'color', default: [0.92, 0.84, 0.62, 1.0]     },
  ]
};

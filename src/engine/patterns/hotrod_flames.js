export default {
  id: 'hotrod_flames',
  name: 'Hot Rod Flames',
  category: 'Racing',
  description: 'Classic hot rod flame licks streaming left to right: fbm-warped tongues that taper and curl, layered outer, mid and hot-core colours for the traditional outlined look.',
  shader: `

    vec4 generate() {
      vec2 uv = v_uv;

      // Lick coordinate: horizontal bands of flame tongues
      float lick = uv.y * u_scale;

      // Domain warp — turbulence grows along x so the tips curl and break up
      float w1 = fbm(vec2(uv.x * 2.2 / max(u_stretch, 0.1) - 3.0, lick * 0.8)) * u_turbulence;
      float w2 = fbm(vec2(uv.x * 4.6 / max(u_stretch, 0.1) + 11.0, lick * 1.6)) * u_turbulence * 0.5;
      float y = lick + (w1 + w2) * (0.35 + uv.x * 1.6);

      float bands = abs(fract(y) - 0.5) * 2.0; // 0 at lick centreline
      float head = 1.0 - clamp(uv.x / max(u_length, 0.05), 0.0, 1.0);

      // Solid at the root, only the band centrelines survive toward the tail
      float field = head * 1.15 - bands * 0.6;

      // Offset thresholds give the classic outlined three-layer flame
      float outer = smoothstep(0.0, 0.015, field);
      float mid = smoothstep(0.16, 0.175, field + w2 * 0.2);
      float core = smoothstep(0.34, 0.355, field - w1 * 0.1);

      vec4 color = u_color_bg;
      color = mix(color, u_color_outer, outer);
      color = mix(color, u_color_mid, mid);
      color = mix(color, u_color_core, core);
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Classic Orange',
      uniforms: {
        u_color_outer: [0.75, 0.05, 0.02, 1.0],
        u_color_mid: [1.00, 0.45, 0.02, 1.0],
        u_color_core: [1.00, 0.90, 0.25, 1.0],
        u_color_bg: [0.03, 0.03, 0.04, 1.0]
      }
    },
    {
      name: 'Blue Flame',
      uniforms: {
        u_color_outer: [0.05, 0.10, 0.45, 1.0],
        u_color_mid: [0.10, 0.45, 0.95, 1.0],
        u_color_core: [0.80, 0.95, 1.00, 1.0],
        u_color_bg: [0.02, 0.02, 0.05, 1.0]
      }
    },
    {
      name: 'Green Envy',
      uniforms: {
        u_color_outer: [0.04, 0.30, 0.06, 1.0],
        u_color_mid: [0.20, 0.80, 0.10, 1.0],
        u_color_core: [0.85, 1.00, 0.40, 1.0],
        u_color_bg: [0.02, 0.04, 0.02, 1.0]
      }
    },
    {
      name: 'Purple Haze',
      uniforms: {
        u_color_outer: [0.28, 0.04, 0.45, 1.0],
        u_color_mid: [0.65, 0.20, 0.95, 1.0],
        u_color_core: [0.95, 0.75, 1.00, 1.0],
        u_color_bg: [0.04, 0.02, 0.06, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Flame Scale', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_length', name: 'Lick Length', type: 'float', min: 0.3, max: 1.5, default: 0.95 },
    { id: 'u_stretch', name: 'Lick Stretch', type: 'float', min: 0.4, max: 3.0, default: 1.2 },
    { id: 'u_turbulence', name: 'Turbulence', type: 'float', min: 0.0, max: 1.5, default: 0.6 },
    { id: 'u_color_outer', name: 'Outer Flame', type: 'color', default: [0.75, 0.05, 0.02, 1.0] },
    { id: 'u_color_mid', name: 'Mid Flame', type: 'color', default: [1.0, 0.45, 0.02, 1.0] },
    { id: 'u_color_core', name: 'Hot Core', type: 'color', default: [1.0, 0.9, 0.25, 1.0] },
    { id: 'u_color_bg', name: 'Background', type: 'color', default: [0.03, 0.03, 0.04, 1.0] }
  ]
};

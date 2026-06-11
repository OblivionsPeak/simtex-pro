export default {
  id: 'manta_wing_gradient',
  name: 'Manta Wing Gradient',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Manta-ray countershading — velvet black dorsal sweeping into white belly along a curved wing line, with shoulder chevrons and skin speckle.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 dark  = u_dark_color.rgb;
      vec3 light = u_light_color.rgb;

      // --- curved countershade boundary, repeating per wing tile ---
      float wing_x = fract(uv.x * 2.0);                   // two wings per tile
      float curve = sin(wing_x * 3.14159) * u_curve;      // boundary dips mid-wing
      float edge = 0.45 - curve;
      float d = uv.y - edge;                              // signed dist from boundary

      // wide velvety blend with a tighter core transition
      float t = smoothstep(-0.18, 0.18, d);
      t = mix(t, smoothstep(-0.05, 0.05, d), 0.45);
      vec3 col = mix(light, dark, t);

      // --- dorsal shading: wing surface curvature ---
      // subtle sheen band running along the wing above the boundary
      float sheen = exp(-pow((d - 0.16) * 7.0, 2.0));
      col += (light - dark) * 0.08 * sheen * t;
      // dorsal darkens toward the trailing (top) edge
      col *= 1.0 - smoothstep(0.65, 1.0, uv.y) * 0.18 * t;

      // --- white shoulder chevrons on the dark side ---
      // two swept patches per wing, mirrored about wing centre
      float cx = abs(wing_x - 0.5);
      vec2 sp = vec2(cx - 0.22, uv.y - (edge + 0.30));
      sp.x *= 1.6;
      float chev = exp(-dot(sp, sp) * 90.0);
      // chevron is swept: cut its lower edge along a diagonal
      chev *= smoothstep(-0.02, 0.10, sp.y + sp.x * 0.8);
      col = mix(col, light * 0.92, chev * 0.85 * t);

      // --- ventral grey mottling near the boundary (belly markings) ---
      float mott = fbm(uv * 7.0 + 21.0) * 0.5 + 0.5;
      float belly_band = (1.0 - t) * smoothstep(-0.3, -0.05, d);
      col = mix(col, dark * 0.6 + light * 0.3,
                smoothstep(0.62, 0.78, mott) * belly_band * 0.35);

      // --- skin speckle: pale flecks on the dorsal, dark on the belly ---
      float spk = noise(uv * 160.0);
      col += (light - dark) * 0.05 * (spk - 0.5) * u_speckle * t;
      float fleck = step(0.985, hash(floor(uv * 110.0)));
      col = mix(col, light * 0.8, fleck * t * 0.25 * u_speckle);
      float dfleck = step(0.988, hash(floor(uv * 90.0) + 7.0));
      col = mix(col, dark, dfleck * (1.0 - t) * 0.30 * u_speckle);

      // soft broad lighting from above-left
      col *= 0.94 + 0.10 * (1.0 - uv.y) * (1.0 - wing_x * 0.4);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_curve',       name: 'Wing Curve',   type: 'float', min: 0.0, max: 0.3, default: 0.14 },
    { id: 'u_speckle',     name: 'Skin Speckle', type: 'float', min: 0.0, max: 2.0, default: 1.0 },
    { id: 'u_dark_color',  name: 'Dorsal Color', type: 'color', default: [0.04, 0.05, 0.08, 1.0] },
    { id: 'u_light_color', name: 'Ventral Color', type: 'color', default: [0.92, 0.94, 0.95, 1.0] }
  ]
};

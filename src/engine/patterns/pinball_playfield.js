export default {
  id: 'pinball_playfield',
  name: 'Pinball Playfield',
  category: 'Retro',
  added: '2026-06-11',
  description: 'Silkscreened 70s pinball playfield art — pop-bumper ring targets, rollover stars and lane arrows keylined in black over ball-worn ivory lacquer.',
  shader: `
    mat2 rot2_pp(float a) {
      float c = cos(a); float s = sin(a);
      return mat2(c, -s, s, c);
    }

    // five-point star signed distance (approximate, via angular radius)
    float star_pp(vec2 p, float r) {
      float an = atan(p.y, p.x);
      float rr = r * (0.62 + 0.38 * cos(an * 5.0));
      return length(p) - rr;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;

      // ivory lacquer over faint plywood grain
      vec3 ivory = vec3(0.93, 0.89, 0.78);
      float grain = noise(vec2(v_uv.x * 26.0, v_uv.y * 240.0)) * 0.06;
      vec3 col = ivory - grain;

      // decades of ball tracks: grey swirled wear
      float swirl = smoothstep(0.55, 0.92, fbm(v_uv * 4.0) * 0.5 + 0.5);
      col = mix(col, vec3(0.78, 0.75, 0.66), swirl * u_wear);

      vec3 accent  = u_accent_color.rgb;
      vec3 teal    = vec3(0.0, 0.55, 0.55);
      vec3 keyline = vec3(0.12, 0.10, 0.10);
      vec3 cream   = vec3(0.98, 0.96, 0.90);

      float h = hash(cell);
      float r = length(f);

      if (h < 0.34) {
        // --- pop bumper: screened concentric rings + cap ---
        float disc = 1.0 - smoothstep(0.40, 0.42, r);
        float ring = step(0.5, fract(r * 5.5));
        vec3 bump = mix(accent, cream, ring);
        // bolt cap dead centre
        bump = mix(bump, accent * 1.25, 1.0 - smoothstep(0.07, 0.10, r));
        bump = mix(bump, keyline, 1.0 - smoothstep(0.025, 0.045, r));
        col = mix(col, bump, disc);
        // black keyline circle
        col = mix(col, keyline, (1.0 - smoothstep(0.012, 0.024, abs(r - 0.41))));
      } else if (h < 0.60) {
        // --- rollover star insert ---
        vec2 sp = rot2_pp(hash(cell + 5.5) * 6.2831) * f;
        float halo = 1.0 - smoothstep(0.36, 0.38, r);
        col = mix(col, teal, halo);
        col = mix(col, keyline, 1.0 - smoothstep(0.010, 0.022, abs(r - 0.37)));
        float sd = star_pp(sp, 0.27);
        col = mix(col, cream, 1.0 - smoothstep(0.0, 0.02, sd));
        col = mix(col, keyline, 1.0 - smoothstep(0.0, 0.015, abs(sd) - 0.012));
        // tiny accent dot at star heart
        col = mix(col, accent, 1.0 - smoothstep(0.045, 0.065, r));
      } else if (h < 0.82) {
        // --- lane arrow (random quarter-turn) ---
        float quarter = floor(hash(cell + 9.1) * 4.0) * 1.5707963;
        vec2 ap = rot2_pp(quarter) * f;
        float shaft = step(abs(ap.x), 0.07) * step(abs(ap.y + 0.13), 0.17);
        float headw = (0.30 - ap.y) * 0.78;
        float head = step(0.04, ap.y) * step(ap.y, 0.30) * step(abs(ap.x), headw);
        float arrow = max(shaft, head);
        // slightly larger silhouette for the keyline pass
        float shaft2 = step(abs(ap.x), 0.095) * step(abs(ap.y + 0.13), 0.195);
        float headw2 = (0.33 - ap.y) * 0.85;
        float head2 = step(0.02, ap.y) * step(ap.y, 0.33) * step(abs(ap.x), headw2);
        float outline = max(shaft2, head2);
        col = mix(col, keyline, outline);
        col = mix(col, accent, arrow);
      } else {
        // --- blank lane: rosette of four rivet dots ---
        vec2 q = abs(f) - 0.22;
        float dot1 = length(q);
        col = mix(col, keyline, (1.0 - smoothstep(0.025, 0.045, dot1)) * 0.7);
      }

      // screened lane guide grid between cells
      vec2 gf = abs(fract(uv) - 0.5);
      float guide = 1.0 - smoothstep(0.006, 0.014, 0.5 - max(gf.x, gf.y));
      col = mix(col, keyline, guide * 0.35);

      // lacquer sheen
      col += (noise(v_uv * 500.0) - 0.5) * 0.025;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Insert Density', type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_wear', name: 'Ball Wear', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_accent_color', name: 'Screen Ink', type: 'color', default: [0.85, 0.12, 0.12, 1.0] }
  ]
};

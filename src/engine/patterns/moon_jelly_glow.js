export default {
  id: 'moon_jelly_glow',
  name: 'Moon Jelly Glow',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Translucent moon jellies drifting in dark water — glassy bell rims, four-leaf gonad rings and trailing wisps of oral arms.',
  shader: `
    // One jelly bell at local coords p (cell-centred), returns added light
    vec3 jelly_mjg(vec2 p, float seed, vec3 glow, vec3 organ) {
      float r = length(p);
      vec3 c = vec3(0.0);

      // bell body: translucent dome, brightest at the thin rim
      float bell = smoothstep(0.42, 0.36, r);
      float rim = exp(-pow((r - 0.36) * 22.0, 2.0));
      float body = smoothstep(0.40, 0.0, r);
      c += glow * body * 0.18;                       // faint interior haze
      c += glow * rim * 0.85;                        // glowing bell margin
      // radial canals: fine spokes from the centre
      float ang = atan(p.y, p.x);
      float canal = pow(abs(sin(ang * 8.0 + seed)), 24.0);
      c += glow * canal * body * 0.20;

      // four-leaf gonad rings: horseshoes arranged in a clover
      for (int k = 0; k < 4; k++) {
        float a = (float(k) + 0.5) * 1.5708 + seed * 0.3;
        vec2 gc = vec2(cos(a), sin(a)) * 0.13;
        float gd = length(p - gc);
        float ring = exp(-pow((gd - 0.075) * 38.0, 2.0));
        // horseshoe: dim the ring on the side facing the centre
        float open_side = smoothstep(-0.02, 0.06, dot(normalize(p - gc + 0.0001), normalize(gc)));
        c += organ * ring * (0.35 + 0.65 * open_side) * bell;
      }

      // scalloped fringe just outside the rim (marginal tentacles)
      float fringe = exp(-pow((r - 0.42) * 30.0, 2.0));
      fringe *= 0.5 + 0.5 * sin(ang * 36.0 + seed * 7.0);
      c += glow * fringe * 0.30;

      // trailing oral-arm wisps below the bell, fading with depth
      if (p.y < -0.30) {
        float wisp = exp(-p.x * p.x * 120.0) * exp((p.y + 0.30) * 4.0);
        wisp *= 0.6 + 0.4 * sin(p.y * 30.0 + seed * 9.0 + p.x * 20.0);
        c += glow * clamp(wisp, 0.0, 1.0) * 0.35;
      }
      return c;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // --- midnight water with drifting haze ---
      vec3 water = u_water_color.rgb;
      float haze = fbm(uv * 4.0) * 0.5 + 0.5;
      vec3 col = water * (0.5 + haze * 0.5);
      // marine snow
      col += vec3(0.30, 0.34, 0.40) * step(0.991, hash(floor(uv * 180.0))) * 0.5;

      vec3 glow  = u_glow_color.rgb;
      vec3 organ = u_organ_color.rgb;

      // --- jellies on a jittered grid, 3x3 neighbourhood ---
      vec2 g = uv * u_scale;
      vec2 id = floor(g);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 cid = id + o;
          float h = hash(cid + 5.5);
          if (h < 0.30) continue;                 // some cells empty
          vec2 c = cid + 0.5 + (vec2(hash(cid + 1.7), hash(cid + 8.3)) - 0.5) * 0.4;
          vec2 p = (g - c) / (0.75 + 0.5 * h);    // size variation
          col += jelly_mjg(p, h * 43.0, glow, organ) * (0.55 + 0.45 * h);
        }
      }

      // faint distant layer: smaller, dimmer jellies behind
      vec2 g2 = uv * u_scale * 2.3 + 7.0;
      vec2 id2 = floor(g2);
      float h2 = hash(id2 + 2.2);
      if (h2 > 0.55) {
        vec2 c2 = id2 + 0.5;
        vec2 p2 = g2 - c2;
        col += jelly_mjg(p2, h2 * 17.0, glow * 0.5, organ * 0.4) * 0.4;
      }

      // gentle bloom where light accumulates
      col += glow * smoothstep(0.5, 1.2, dot(col, vec3(0.333))) * 0.08;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',       name: 'Jelly Density', type: 'float', min: 1.0, max: 6.0, default: 2.5 },
    { id: 'u_glow_color',  name: 'Bell Glow',     type: 'color', default: [0.55, 0.75, 0.95, 1.0] },
    { id: 'u_organ_color', name: 'Gonad Rings',   type: 'color', default: [0.85, 0.55, 0.70, 1.0] },
    { id: 'u_water_color', name: 'Water Color',   type: 'color', default: [0.02, 0.04, 0.10, 1.0] }
  ]
};

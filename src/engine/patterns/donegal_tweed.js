export default {
  id: 'donegal_tweed',
  name: 'Donegal Tweed',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Irish Donegal tweed: a 2/2 woollen twill in heathered earth tones, salted with the trademark bright neps — little knots of red, gold, blue and white spun into the yarn.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- Thread grid ---
      float freq = u_thread_freq;
      vec2 t = uv * freq;
      vec2 tid = floor(t);
      vec2 tf = fract(t);

      // --- 2/2 twill: warp passes over 2, under 2, advancing each pick ---
      float twill = mod(tid.x + tid.y, 4.0);
      float warp_up = step(twill, 1.5); // 2 up, 2 down

      // --- Heathered woollen yarns: fibres of many colours per thread ---
      vec3 base = u_wool_color.rgb;
      // warp and weft are slightly different yarn lots
      float warp_tone = hash(vec2(tid.x, 3.1));
      float weft_tone = hash(vec2(tid.y, 7.7));
      vec3 warp_col = base * (0.82 + 0.30 * warp_tone);
      vec3 weft_col = base * vec3(1.06, 1.0, 0.92) * (0.78 + 0.30 * weft_tone);
      // heather: fine multi-colour fibre noise within the yarn
      float fib = noise(uv * 420.0);
      vec3 heather = mix(vec3(0.8, 0.75, 0.65), vec3(0.35, 0.30, 0.28), fib);
      warp_col = mix(warp_col, warp_col * heather * 1.6, 0.30);
      weft_col = mix(weft_col, weft_col * heather * 1.6, 0.30);

      // pick the visible thread, shade by round yarn profile
      float prof_w = sin(tf.x * 3.14159);
      float prof_f = sin(tf.y * 3.14159);
      vec3 col = mix(weft_col * (0.70 + 0.30 * prof_f),
                     warp_col * (0.70 + 0.30 * prof_w),
                     warp_up);

      // twill diagonal shadow: the wale line reads as soft diagonal ridges
      float wale = sin((tid.x + tid.y) / 4.0 * 6.28318 + tf.x + tf.y);
      col *= 0.93 + 0.07 * wale;

      // interlacing shadow at thread crossings
      float crossing = prof_w * prof_f;
      col *= 0.88 + 0.12 * crossing;

      // --- Donegal neps: bright flecks spun into the yarn ---
      // sparse cells decide where a nep lands
      vec2 ng = uv * freq * 0.5;
      vec2 nid = floor(ng);
      vec2 nf = fract(ng) - 0.5;
      float nh = hash(nid + 13.7);
      float has_nep = step(1.0 - u_fleck_density * 0.18, nh);
      // jittered position inside the cell
      nf -= (vec2(hash(nid + 1.1), hash(nid + 2.2)) - 0.5) * 0.6;
      float nd = length(nf);
      // soft fibrous blob, slightly elongated along the yarn it rides
      float nep = (1.0 - smoothstep(0.06, 0.16, nd + (noise(ng * 30.0) - 0.5) * 0.08)) * has_nep;

      // nep colour: classic Donegal salt — red, gold, blue, white
      float pick = hash(nid + 5.5);
      vec3 nep_col = vec3(0.85, 0.82, 0.75);                  // white
      if (pick < 0.28)      nep_col = vec3(0.70, 0.18, 0.12); // red
      else if (pick < 0.55) nep_col = vec3(0.82, 0.62, 0.15); // gold
      else if (pick < 0.78) nep_col = vec3(0.20, 0.30, 0.55); // blue
      col = mix(col, nep_col * (0.85 + 0.3 * noise(ng * 50.0)), clamp(nep, 0.0, 1.0) * 0.9);
      // nep sits proud of the cloth: tiny under-shadow
      float nshadow = (1.0 - smoothstep(0.10, 0.22, nd)) * has_nep - nep;
      col *= 1.0 - clamp(nshadow, 0.0, 1.0) * 0.18;

      // --- Woollen halo: surface fuzz softens everything ---
      float fuzz = fbm(uv * 60.0);
      col = mix(col, base * 0.95, smoothstep(0.4, 0.9, fuzz) * 0.10);
      col *= 0.95 + 0.08 * fbm(uv * 3.0 + 17.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_thread_freq',   name: 'Thread Count',  type: 'float', min: 40.0, max: 160.0, default: 90.0 },
    { id: 'u_fleck_density', name: 'Nep Density',   type: 'float', min: 0.0,  max: 1.0,   default: 0.6 },
    { id: 'u_wool_color',    name: 'Wool Color',    type: 'color', default: [0.45, 0.40, 0.33, 1.0] }
  ]
};

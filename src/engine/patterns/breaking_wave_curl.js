export default {
  id: 'breaking_wave_curl',
  name: 'Breaking Wave Curl',
  category: 'Ocean',
  added: '2026-06-11',
  description: 'Inside the barrel — a curling wave lip wrapping over glassy aquamarine, with streaked spiral flow lines, foam crest and flying spray.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 deep = u_water_color.rgb;
      vec3 lip  = u_lip_color.rgb;
      vec3 foam = vec3(0.96, 0.98, 0.99);

      // one barrel per horizontal repeat, eye of the curl above centre
      vec2 c = vec2(fract(uv.x) - 0.5, uv.y - 0.58);
      c.x *= 1.25;                                   // slightly squashed barrel
      float r = max(length(c), 0.001);
      float th = atan(c.y, c.x);

      // --- spiral coordinate: how deep into the curl we are ---
      // sp counts turns inward; the lip wraps over from the top
      float sp = log(r * 3.2) / u_curl - th / 6.28318;
      float band = fract(sp);

      // --- base water: deep outside, jade inside the pocket ---
      float depth_mix = smoothstep(0.9, 0.15, r);
      vec3 col = mix(deep * 0.8, mix(deep, lip, 0.55), depth_mix);
      // sunlight burning through the thin upper lip
      float backlight = smoothstep(0.2, 0.75, c.y / max(r, 0.05)) * smoothstep(0.7, 0.25, r);
      col += lip * backlight * 0.8;
      col += vec3(0.45, 0.65, 0.55) * backlight * backlight * 0.5;

      // --- spiral flow streaks following the curl ---
      float streak = sin(sp * 40.0 + snoise(vec2(sp * 6.0, th * 2.0)) * 2.0);
      streak = streak * 0.5 + 0.5;
      col *= 0.90 + streak * 0.18 * smoothstep(0.85, 0.2, r);
      // glassy highlight band on the wave face
      float face_gl = exp(-pow((band - 0.55) * 5.0, 2.0));
      col += lip * face_gl * 0.20 * smoothstep(0.8, 0.3, r);

      // --- the lip itself: thick white edge wrapping the spiral seam ---
      float seam = min(band, 1.0 - band);
      float lip_edge = smoothstep(0.10, 0.02, seam) * smoothstep(0.75, 0.35, r);
      // foam texture chews into the lip edge
      float chew = fbm(vec2(sp * 14.0, th * 5.0)) * 0.5 + 0.5;
      lip_edge *= smoothstep(0.25, 0.6, chew + 0.25);
      col = mix(col, foam, lip_edge * 0.9);
      // shadow tucked under the falling lip
      float under = smoothstep(0.02, 0.12, seam) * smoothstep(0.20, 0.10, seam);
      col *= 1.0 - under * 0.25 * smoothstep(0.7, 0.3, r);

      // --- crest foam: churned whitewater along the top of the wave ---
      float crest_y = 0.78 + snoise(vec2(uv.x * 6.0, 3.0)) * 0.04;
      float crest = smoothstep(crest_y - 0.04, crest_y + 0.06, uv.y);
      float churn = fbm(uv * vec2(10.0, 18.0) + 41.0) * 0.5 + 0.5;
      crest *= smoothstep(0.3, 0.7, churn + u_foam_amt * 0.3);
      col = mix(col, foam * (0.75 + churn * 0.3), crest * 0.95);

      // --- flying spray: wind-torn droplets above and ahead of the lip ---
      vec2 sg = uv * 60.0;
      float spray = step(0.90, hash(floor(sg)))
                  * smoothstep(0.5, 0.85, uv.y)
                  * u_foam_amt;
      // droplets streak with the offshore wind
      float drift = step(0.94, hash(floor(uv * vec2(28.0, 70.0)) + 9.0))
                  * smoothstep(0.55, 0.9, uv.y) * u_foam_amt;
      col = mix(col, foam, clamp(spray + drift * 0.7, 0.0, 1.0) * 0.8);

      // --- trough: darker churning water along the bottom ---
      float trough = smoothstep(0.25, 0.0, uv.y);
      col = mix(col, deep * 0.55, trough * 0.7);
      // residual foam lines sliding down the face into the trough
      float wash = pow(1.0 - abs(snoise(uv * vec2(7.0, 3.0) + 19.0)), 8.0);
      col = mix(col, foam * 0.8, wash * trough * 0.35 * u_foam_amt);

      // caustic sparkle inside the barrel pocket
      float spark = pow(1.0 - abs(snoise(c * 14.0 + 7.0)), 10.0);
      col += lip * spark * depth_mix * 0.25;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_curl',        name: 'Curl Tightness', type: 'float', min: 0.3, max: 1.2, default: 0.6 },
    { id: 'u_foam_amt',    name: 'Foam & Spray',  type: 'float', min: 0.0, max: 1.5, default: 0.9 },
    { id: 'u_water_color', name: 'Deep Water',    type: 'color', default: [0.02, 0.18, 0.28, 1.0] },
    { id: 'u_lip_color',   name: 'Barrel Glow',   type: 'color', default: [0.25, 0.75, 0.70, 1.0] }
  ]
};

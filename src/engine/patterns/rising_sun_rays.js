export default {
  id: 'rising_sun_rays',
  name: 'Rising Sun Rays',
  category: 'Heritage',
  added: '2026-06-12',
  description: 'A radiating sunburst — bold rays fanning from a low sun disc, hand-cut vinyl edges, halo keyline round the disc, and sun-fade strongest at the ray tips.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- palette: cream field, vermilion rays and disc ---
      vec3 field = u_field_color.rgb;
      vec3 ray_c = u_ray_color.rgb;
      vec3 keyl  = mix(u_ray_color.rgb, vec3(1.0), 0.78);  // pale halo keyline

      // sun centre sits low on the panel so rays sweep upward
      vec2 c = vec2(0.5, 0.18);
      vec2 p = uv - c;
      float r = length(p);
      float ang = atan(p.y, p.x);                      // -pi..pi

      // field: aged cream with linen weave
      vec3 col = field;
      col *= 0.96 + noise(uv * 380.0) * 0.06;
      col *= 0.985 + 0.025 * noise(vec2(uv.x * 200.0, uv.y * 9.0));
      col *= 0.985 + 0.025 * noise(vec2(uv.x * 9.0, uv.y * 200.0));

      // --- rays: alternating wedges around the disc ---
      float n = u_ray_count;                            // ray pairs
      float a = ang / 6.28318 * n;                      // ray-space coordinate
      // faint cut-edge texture only — rays must fan out dead straight
      float wob = (noise(vec2(floor(a + 0.5) * 7.3, r * 4.0)) - 0.5) * 0.012 * r * 3.0;
      float saw = abs(fract(a + wob) - 0.5) * 2.0;      // 0 at ray centre, 1 between

      // ray fill with anti-aliased edge that widens with radius
      float edge_aa = 0.012 / max(r, 0.05);
      float in_ray = smoothstep(0.5 + edge_aa, 0.5 - edge_aa, saw);

      vec3 r_col = ray_c;
      // sun-fade: rays bleach toward their tips
      r_col = mix(r_col, mix(r_col, field, 0.45), smoothstep(0.25, 1.0, r) * u_fade);
      // vinyl panel seams: faint value step every few rays (cut from sheets)
      r_col *= 0.97 + 0.05 * step(0.5, fract(floor(a + 0.5) * 0.34));
      // surface grain inside the rays
      r_col *= 0.97 + noise(uv * 300.0) * 0.05;

      col = mix(col, r_col, in_ray * step(0.10, r));

      // lifted-edge shadow along every ray border
      float border = smoothstep(edge_aa * 2.0, 0.0, abs(saw - 0.5) - edge_aa);
      col *= 1.0 - border * step(0.10, r) * 0.07;

      // --- the sun disc ---
      float disc = smoothstep(0.008, -0.008, r - 0.105);
      vec3 d_col = ray_c * (1.04 - smoothstep(0.0, 0.105, r) * 0.10);
      d_col *= 0.97 + noise(uv * 260.0) * 0.05;
      col = mix(col, d_col, disc);

      // pale halo keyline ringing the disc
      float halo = smoothstep(0.006, 0.0, abs(r - 0.125) - 0.0045);
      col = mix(col, keyl, halo * 0.92);

      // chips at the disc rim and along inner ray roots
      float chip = step(0.972, hash(floor(uv * 200.0))) *
                   smoothstep(0.30, 0.10, r);
      col = mix(col, field, chip * 0.6);

      // warm glow kissing the field just above the disc
      col += smoothstep(0.4, 0.0, r) * (1.0 - disc) * vec3(0.05, 0.025, 0.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_ray_count', name: 'Ray Count', type: 'float', min: 6.0, max: 24.0, default: 12.0 },
    { id: 'u_fade', name: 'Tip Fade', type: 'float', min: 0.0, max: 1.0, default: 0.45 },
    { id: 'u_field_color', name: 'Field Colour', type: 'color', default: [0.93, 0.89, 0.79, 1.0] },
    { id: 'u_ray_color', name: 'Ray Colour', type: 'color', default: [0.80, 0.16, 0.10, 1.0] }
  ]
};

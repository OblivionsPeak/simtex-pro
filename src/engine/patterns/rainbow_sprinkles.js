export default {
  id: 'rainbow_sprinkles',
  name: 'Rainbow Sprinkles',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Scattered rotated candy sprinkles in six sugary colors tossed over smooth frosting with soft drop shadows.',
  shader: `
    float capsuleSDF(vec2 lp, float len, float rad) {
      vec2 q = vec2(max(abs(lp.x) - len, 0.0), lp.y);
      return length(q) - rad;
    }
    vec3 sprinkleTint(float k) {
      // six candy colors derived from the two palette anchors via channel rotation
      vec3 p = u_primary_color.rgb;
      vec3 a = u_accent_color.rgb;
      vec3 c = p;
      c = mix(c, vec3(p.g, p.b, p.r), step(0.5, k));
      c = mix(c, vec3(p.b, p.r, p.g), step(1.5, k));
      c = mix(c, a, step(2.5, k));
      c = mix(c, vec3(a.g, a.b, a.r), step(3.5, k));
      c = mix(c, vec3(a.b, a.r, a.g), step(4.5, k));
      return c;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // frosting ground: soft swirled undulation, never flat
      vec3 col = u_secondary_color.rgb * (0.93 + 0.1 * fbm(v_uv * 5.0));
      // two offset layers so the scatter reads dense and un-gridded
      for (int layer_ = 0; layer_ < 2; layer_++) {
        float fl = float(layer_);
        vec2 g = uv * (1.0 + fl * 0.37) + fl * 11.17;
        vec2 cell = floor(g);
        vec2 f = fract(g) - 0.5;
        if (hash(cell + fl * 5.0) < u_coverage) {
          vec2 jit = (vec2(hash(cell + 1.3), hash(cell + 2.6)) - 0.5) * 0.3;
          float ang = hash(cell + 3.9) * 6.2831853;
          mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
          float len = 0.22;
          float rad = 0.075;
          // soft drop shadow: same capsule sampled with a lower-right offset
          vec2 lps = rot * (f - jit - vec2(0.055, -0.065));
          float ds = capsuleSDF(lps, len, rad);
          float shad = smoothstep(0.07, -0.02, ds);
          col *= 1.0 - shad * 0.22;
          // the sprinkle itself
          vec2 lp = rot * (f - jit);
          float d = capsuleSDF(lp, len, rad);
          float k = floor(hash(cell + 17.7 + fl * 3.0) * 6.0);
          vec3 sc = sprinkleTint(k) * (0.88 + 0.24 * hash(cell + 6.1));
          // rounded shading: darker toward the rim, glossy line along the crown
          sc *= 0.82 + 0.18 * smoothstep(0.0, -0.06, d);
          float gloss = smoothstep(0.034, 0.0, abs(lp.y + rad * 0.35));
          sc += vec3(1.0) * gloss * 0.3 * smoothstep(0.0, -0.02, d);
          float m = smoothstep(0.015, -0.015, d);
          col = mix(col, sc, m);
        }
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Sprinkle Density', type: 'float', min: 6.0, max: 40.0, default: 14.0 },
    { id: 'u_coverage', name: 'Coverage', type: 'float', min: 0.3, max: 1.0, default: 0.8 },
    { id: 'u_primary_color', name: 'Candy Anchor A', type: 'color', default: [0.94, 0.3, 0.42, 1.0] },
    { id: 'u_accent_color', name: 'Candy Anchor B', type: 'color', default: [0.35, 0.62, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Frosting', type: 'color', default: [0.96, 0.93, 0.9, 1.0] }
  ],
  variants: [
    { name: 'Birthday Cake', uniforms: { u_primary_color: [0.94, 0.3, 0.42, 1.0], u_accent_color: [0.35, 0.62, 0.95, 1.0], u_secondary_color: [0.96, 0.93, 0.9, 1.0], u_scale: 14.0, u_coverage: 0.8 } },
    { name: 'Choco Dip', uniforms: { u_primary_color: [0.98, 0.72, 0.2, 1.0], u_accent_color: [0.9, 0.35, 0.7, 1.0], u_secondary_color: [0.24, 0.13, 0.08, 1.0], u_scale: 18.0, u_coverage: 0.9 } },
    { name: 'Pastel Party', uniforms: { u_primary_color: [0.85, 0.65, 0.85, 1.0], u_accent_color: [0.6, 0.85, 0.8, 1.0], u_secondary_color: [0.88, 0.92, 0.97, 1.0], u_scale: 11.0, u_coverage: 0.6 } }
  ]
};

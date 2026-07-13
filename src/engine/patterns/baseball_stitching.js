export default {
  id: 'baseball_stitching',
  name: 'Baseball Stitching',
  category: 'Sports',
  added: '2026-07-13',
  description: 'Cream game-ball leather with paired raised red stitches marching along the classic mirrored double-arc lacing.',
  shader: `
    float segDist(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }
    vec4 generate() {
      // leather base with fine grain and broad tonal drift
      vec3 col = u_primary_color.rgb;
      col *= 0.94 + 0.10 * fbm(v_uv * 90.0);
      col *= 0.96 + 0.07 * fbm(v_uv * 5.0 + 31.0);
      float n = floor(u_scale + 0.5); // stitch rows per tile
      // two mirrored seam arcs sweeping across the panel
      for (int s = 0; s < 2; s++) {
        float side = float(s) * 2.0 - 1.0;
        float xc = 0.5 + side * (0.22 + u_curve * sin(v_uv.y * 6.28318));
        float dx = v_uv.x - xc;
        // pressed seam groove, tinted toward the shadow color
        float groove = exp(-abs(dx) * 90.0);
        col = mix(col, u_accent_color.rgb, groove * 0.45);
        col *= 1.0 - 0.18 * groove;
        // per-row local frame straddling the seam
        float t = v_uv.y * n;
        float row = floor(t);
        vec2 lp = vec2(dx * n, fract(t) - 0.5);
        lp.y += hash(vec2(row, side + 9.0)) * 0.06 - 0.03; // hand-sewn jitter
        // paired stitches forming a chevron across the seam
        vec2 a1 = vec2(-0.40 * side, -0.34);
        vec2 b1 = vec2( 0.40 * side, -0.05);
        vec2 a2 = vec2(-0.40 * side,  0.34);
        vec2 b2 = vec2( 0.40 * side,  0.05);
        float d1 = segDist(lp, a1, b1);
        float d2 = segDist(lp, a2, b2);
        float ds = min(d1, d2);
        float sw = 0.085;
        float st = 1.0 - smoothstep(sw, sw + 0.05, ds);
        // soft shadow under the raised thread
        float sh = 1.0 - smoothstep(sw + 0.03, sw + 0.16, ds);
        col *= 1.0 - 0.22 * sh * (1.0 - st);
        // thread: bright rounded core, per-stitch brightness variation
        vec3 thread = u_secondary_color.rgb * (0.75 + 0.55 * (1.0 - smoothstep(0.0, sw, ds)));
        thread *= 0.85 + 0.30 * hash(vec2(row * 1.7, side + 5.0));
        col = mix(col, thread, st);
        // needle holes at the stitch ends
        float dh = min(min(length(lp - a1), length(lp - b1)),
                       min(length(lp - a2), length(lp - b2)));
        float hole = 1.0 - smoothstep(0.030, 0.065, dh);
        col = mix(col, col * 0.5, hole);
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Stitch Count', type: 'float', min: 8.0, max: 30.0, default: 14.0 },
    { id: 'u_curve', name: 'Seam Curve', type: 'float', min: 0.0, max: 0.15, default: 0.06 },
    { id: 'u_primary_color', name: 'Leather', type: 'color', default: [0.93, 0.89, 0.80, 1.0] },
    { id: 'u_secondary_color', name: 'Stitches', type: 'color', default: [0.72, 0.10, 0.10, 1.0] },
    { id: 'u_accent_color', name: 'Seam Shadow', type: 'color', default: [0.72, 0.63, 0.50, 1.0] }
  ],
  variants: [
    { name: 'Official Ball', uniforms: { u_scale: 14.0, u_curve: 0.06, u_primary_color: [0.93, 0.89, 0.80, 1.0], u_secondary_color: [0.72, 0.10, 0.10, 1.0], u_accent_color: [0.72, 0.63, 0.50, 1.0] } },
    { name: 'Midnight Series', uniforms: { u_scale: 16.0, u_curve: 0.08, u_primary_color: [0.10, 0.11, 0.15, 1.0], u_secondary_color: [0.95, 0.75, 0.20, 1.0], u_accent_color: [0.03, 0.04, 0.06, 1.0] } },
    { name: 'Sandlot Worn', uniforms: { u_scale: 12.0, u_curve: 0.05, u_primary_color: [0.72, 0.62, 0.46, 1.0], u_secondary_color: [0.52, 0.14, 0.12, 1.0], u_accent_color: [0.45, 0.36, 0.25, 1.0] } }
  ]
};

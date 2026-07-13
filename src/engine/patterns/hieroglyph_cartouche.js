export default {
  id: 'hieroglyph_cartouche',
  name: 'Hieroglyph Cartouche',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'Sandstone relief columns of carved glyphs — eyes, sun discs, water zigzags and birds — ringed by cartouche ovals and lit with raised-relief shading.',
  shader: `
    float segd(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }
    float bar(float d, float w) {
      return smoothstep(0.028, -0.028, d - w);
    }
    float glyph(vec2 p, float sel) {
      float m = 0.0;
      if (sel < 0.25) {
        // eye of horus (simplified)
        vec2 pe = p * vec2(1.0, 1.9);
        m = max(m, bar(abs(length(pe) - 0.30), 0.045));
        m = max(m, bar(length(p), 0.07));
        m = max(m, bar(segd(p, vec2(0.05, -0.17), vec2(0.05, -0.34)), 0.028));
        m = max(m, bar(segd(p, vec2(-0.14, -0.16), vec2(-0.28, -0.28)), 0.028));
      } else if (sel < 0.5) {
        // sun disc with ring
        m = max(m, bar(length(p), 0.16));
        m = max(m, bar(abs(length(p) - 0.30), 0.035));
      } else if (sel < 0.75) {
        // zigzag water lines
        for (int i = 0; i < 3; i++) {
          float yy = -0.24 + 0.24 * float(i);
          float tri = (abs(fract(p.x * 3.0 + 0.5) - 0.5) - 0.25) * 0.32;
          m = max(m, bar(abs(p.y - yy - tri), 0.035));
        }
        m *= smoothstep(0.44, 0.38, abs(p.x));
      } else {
        // seated bird
        m = max(m, bar(length(p - vec2(0.14, 0.20)), 0.075));
        m = max(m, bar(segd(p, vec2(0.20, 0.19), vec2(0.31, 0.15)), 0.02));
        m = max(m, bar(segd(p, vec2(-0.20, -0.06), vec2(0.10, 0.10)), 0.105));
        m = max(m, bar(segd(p, vec2(-0.20, -0.06), vec2(-0.34, -0.20)), 0.05));
        m = max(m, bar(segd(p, vec2(-0.02, -0.14), vec2(-0.03, -0.32)), 0.022));
        m = max(m, bar(segd(p, vec2(0.08, -0.10), vec2(0.09, -0.32)), 0.022));
      }
      return m;
    }
    float relief(vec2 uv) {
      vec2 cell = floor(uv);
      vec2 p = fract(uv) - 0.5;
      float h = 0.0;
      // raised column divider bars
      float ex = abs(fract(uv.x) - 0.5);
      h = max(h, smoothstep(0.455, 0.49, ex) * 0.8);
      // cartouche oval every three rows
      float by = floor(uv.y / 3.0);
      vec2 q = vec2(fract(uv.x) - 0.5, uv.y / 3.0 - by - 0.5);
      float od = abs(length(q * vec2(2.5, 1.05)) - 0.47);
      h = max(h, smoothstep(0.055, 0.02, od) * 0.9);
      // glyph per cell, slightly inset
      float sel = hash(cell + 7.7);
      h = max(h, glyph(p * 1.18, sel));
      return h;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      // sandstone: fbm grain with horizontal strata
      float gr = fbm(uv * 2.1);
      float strata = noise(vec2(uv.x * 0.4, uv.y * 5.0));
      vec3 stone = u_primary_color.rgb * (0.8 + 0.3 * gr);
      stone *= 0.92 + 0.14 * strata;
      stone *= 0.94 + 0.1 * noise(uv * 16.0);
      // relief lighting via height-field gradient, light from upper-left
      float e = 0.045;
      float h0 = relief(uv);
      float hx = relief(uv + vec2(e, 0.0));
      float hy = relief(uv + vec2(0.0, e));
      vec2 grad = vec2(hx - h0, hy - h0) / e;
      vec2 L = normalize(vec2(-0.6, 0.8));
      float lit = clamp(-dot(grad, L) * 0.55, -1.0, 1.0) * u_relief;
      vec3 col = stone * (1.0 + h0 * 0.1);
      col *= 1.0 + max(lit, 0.0) * 0.7;
      col = mix(col, u_secondary_color.rgb, max(-lit, 0.0) * 0.6);
      // residual painted pigment on some glyph cells, worn by grit
      float pigment = step(0.7, hash(cell + 3.3));
      float wear = smoothstep(0.25, 0.7, fbm(uv * 4.0 + 23.0));
      col = mix(col, u_accent_color.rgb * (0.7 + 0.4 * gr), h0 * pigment * wear * 0.55);
      // fine wind-blown grime in the hollows
      col *= 1.0 - 0.15 * (1.0 - h0) * smoothstep(0.55, 0.85, fbm(uv * 3.3 + 51.0));
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Column Count', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_relief', name: 'Relief Depth', type: 'float', min: 0.1, max: 1.0, default: 0.7 },
    { id: 'u_primary_color', name: 'Sandstone', type: 'color', default: [0.78, 0.62, 0.42, 1.0] },
    { id: 'u_secondary_color', name: 'Shadow', type: 'color', default: [0.35, 0.24, 0.14, 1.0] },
    { id: 'u_accent_color', name: 'Pigment', type: 'color', default: [0.25, 0.55, 0.50, 1.0] }
  ],
  variants: [
    { name: 'Nile Sandstone', uniforms: { u_scale: 5.0, u_relief: 0.7, u_primary_color: [0.78, 0.62, 0.42, 1.0], u_secondary_color: [0.35, 0.24, 0.14, 1.0], u_accent_color: [0.25, 0.55, 0.50, 1.0] } },
    { name: 'Limestone Tomb', uniforms: { u_scale: 6.0, u_relief: 0.5, u_primary_color: [0.82, 0.78, 0.68, 1.0], u_secondary_color: [0.40, 0.36, 0.28, 1.0], u_accent_color: [0.60, 0.25, 0.12, 1.0] } },
    { name: 'Basalt Stele', uniforms: { u_scale: 4.0, u_relief: 0.9, u_primary_color: [0.30, 0.30, 0.32, 1.0], u_secondary_color: [0.08, 0.08, 0.10, 1.0], u_accent_color: [0.80, 0.62, 0.25, 1.0] } }
  ]
};

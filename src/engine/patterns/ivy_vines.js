export default {
  id: 'ivy_vines',
  name: 'Ivy Vines',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Climbing ivy — sinuous stems winding upward with pointed leaves scattered along them.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      col.rgb *= 0.94 + 0.06 * fbm(uv * 2.0);
      // several vines, each a sinuous vertical curve
      for (int v = 0; v < 4; v++) {
        float fv = float(v);
        float baseX = fv * 0.27 + 0.1;
        float phase = hash(vec2(fv, 9.1)) * 6.28;
        float amp = 0.06 + hash(vec2(fv, 4.4)) * 0.08;
        float vineX = baseX + amp * sin(uv.y * (1.5 + fv * 0.4) + phase);
        float fx = fract(uv.x / u_scale_x);
        float d = abs(fract(uv.x * 0.25) - vineX);
        d = min(d, 1.0 - d);
        float stem = smoothstep(0.012, 0.005, d);
        col.rgb = mix(col.rgb, u_primary_color.rgb * 0.6, stem);
        // leaves at intervals along the vine
        float leafT = uv.y * (2.2 + fv * 0.3) + phase * 2.0;
        float leafI = floor(leafT);
        float side = mix(-1.0, 1.0, mod(leafI, 2.0));
        vec2 leafC = vec2(vineX + side * 0.045, (leafI + 0.5) / (2.2 + fv * 0.3));
        vec2 rel = vec2(fract(uv.x * 0.25), fract(uv.y / u_scale * u_scale)) ;
        rel = vec2(fract(uv.x * 0.25) - leafC.x, (uv.y - (leafI + 0.5) / (2.2 + fv * 0.3) * 1.0));
        float la = hash(vec2(leafI, fv)) * 1.2 - 0.6 + side * 0.7;
        vec2 lp = mat2(cos(la), -sin(la), sin(la), cos(la)) * rel * vec2(1.0, 1.0);
        // pointed leaf: rounded diamond
        float leaf = smoothstep(0.05, 0.042, abs(lp.x) * 1.6 + abs(lp.y) * 0.9 + length(lp) * 0.4);
        vec3 leafG = mix(u_primary_color.rgb, u_accent_color.rgb, hash(vec2(leafI, fv + 5.0)));
        leafG *= 0.85 + 0.3 * lp.y * 6.0 * 0.25;
        col.rgb = mix(col.rgb, leafG, leaf * step(0.2, hash(vec2(leafI, fv + 8.0))));
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Vine Scale', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_scale_x', name: 'Spread', type: 'float', min: 0.5, max: 2.0, default: 1.0 },
    { id: 'u_primary_color', name: 'Ivy Green', type: 'color', default: [0.16, 0.4, 0.18, 1.0] },
    { id: 'u_accent_color', name: 'New Leaves', type: 'color', default: [0.4, 0.62, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Wall', type: 'color', default: [0.75, 0.7, 0.62, 1.0] }
  ],
  variants: [
    { name: 'Garden Wall', uniforms: { u_primary_color: [0.16, 0.4, 0.18, 1.0], u_accent_color: [0.4, 0.62, 0.25, 1.0], u_secondary_color: [0.75, 0.7, 0.62, 1.0] } },
    { name: 'Autumn Creeper', uniforms: { u_primary_color: [0.55, 0.18, 0.1, 1.0], u_accent_color: [0.8, 0.4, 0.15, 1.0], u_secondary_color: [0.6, 0.58, 0.55, 1.0] } },
    { name: 'Midnight Ivy', uniforms: { u_primary_color: [0.08, 0.2, 0.14, 1.0], u_accent_color: [0.18, 0.38, 0.28, 1.0], u_secondary_color: [0.12, 0.12, 0.14, 1.0] } }
  ]
};

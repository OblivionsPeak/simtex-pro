export default {
  id: 'art_nouveau_whiplash',
  name: 'Art Nouveau Whiplash',
  category: 'Architecture',
  added: '2026-07-07',
  description: 'Sinuous whiplash curves in gold on deep green — Horta ironwork and Mucha borders.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      // soft damasky ground wash
      col.rgb *= 0.94 + 0.06 * snoise(uv * 1.2);
      float m = 0.0;
      // three families of flowing S-curves with tapered stroke weight
      for (int k = 0; k < 3; k++) {
        float fk = float(k);
        float freq = 0.8 + fk * 0.45;
        float phase = fk * 2.4;
        // curve: y follows layered sines of x
        float cy = sin(uv.x * freq + phase) * 0.9
                 + sin(uv.x * freq * 0.37 + phase * 1.7) * 1.4;
        float d = abs(fract((uv.y - cy) / 3.2) - 0.5) * 3.2;
        // stroke tapers along its length like a drawn flourish
        float wgt = u_stroke * (0.35 + 0.65 * pow(abs(sin(uv.x * freq * 0.5 + phase)), 1.5));
        float line = smoothstep(wgt, wgt * 0.55, d);
        m = max(m, line);
        // bud dot where the taper pinches
        float pinch = smoothstep(0.12, 0.02, abs(sin(uv.x * freq * 0.5 + phase)));
        vec2 budP = vec2(fract(uv.x * freq * 0.159 + phase * 0.1) - 0.5, d);
        m = max(m, smoothstep(0.16, 0.1, length(vec2(budP.x * 2.0, d))) * pinch);
      }
      col.rgb = mix(col.rgb, u_primary_color.rgb, m);
      // gilded shimmer on the strokes
      col.rgb += u_primary_color.rgb * m * 0.25 * sin(uv.x * 3.0 + uv.y * 2.0);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Curve Scale', type: 'float', min: 1.0, max: 10.0, default: 3.5 },
    { id: 'u_stroke', name: 'Stroke Weight', type: 'float', min: 0.03, max: 0.3, default: 0.12 },
    { id: 'u_primary_color', name: 'Ironwork', type: 'color', default: [0.8, 0.62, 0.25, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.08, 0.2, 0.15, 1.0] }
  ],
  variants: [
    { name: 'Horta Gold', uniforms: { u_primary_color: [0.8, 0.62, 0.25, 1.0], u_secondary_color: [0.08, 0.2, 0.15, 1.0], u_stroke: 0.12 } },
    { name: 'Absinthe Poster', uniforms: { u_primary_color: [0.25, 0.3, 0.2, 1.0], u_secondary_color: [0.9, 0.85, 0.65, 1.0], u_stroke: 0.16 } },
    { name: 'Metro Entrance', uniforms: { u_primary_color: [0.45, 0.55, 0.4, 1.0], u_secondary_color: [0.12, 0.12, 0.13, 1.0], u_stroke: 0.1 } }
  ]
};

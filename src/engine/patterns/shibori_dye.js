export default {
  id: 'shibori_dye',
  name: 'Shibori Indigo',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Japanese shibori: bound-resist kumo circles blooming white out of deep indigo, crossed by accordion pleat lines where the folded cloth resisted the vat.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      vec3 indigo_deep = vec3(0.05, 0.08, 0.20);
      vec3 indigo_mid  = vec3(0.13, 0.21, 0.42);
      vec3 cloth_white = vec3(0.92, 0.92, 0.88);

      // --- Base vat dye: uneven, cloudy take ---
      float vat = fbm(uv * 3.5) * 0.5 + 0.5;
      vec3 col = mix(indigo_deep, indigo_mid, vat * 0.6);

      // --- Pleat lines: accordion folds resist in soft vertical bars ---
      float pl = fract(uv.x * u_pleats);
      float pleat_core = exp(-90.0 * (pl - 0.5) * (pl - 0.5));
      // each pleat ridge wanders slightly down the cloth
      float wander = (noise(vec2(floor(uv.x * u_pleats) * 0.7, uv.y * 6.0)) - 0.5) * 0.4;
      pleat_core *= 0.65 + wander;
      // dye gradient across each fold: dark in the valley, pale on the ridge
      col = mix(col, cloth_white, clamp(pleat_core, 0.0, 1.0) * 0.75);
      col = mix(col, indigo_deep, smoothstep(0.42, 0.5, abs(pl - 0.5)) * 0.35);

      // --- Kumo (spider) bound circles, offset grid ---
      float reps = u_circles;
      vec2 g = uv * reps;
      g.x += mod(floor(g.y), 2.0) * 0.5;
      vec2 f = fract(g) - 0.5;
      float a = atan(f.y, f.x);
      // binding makes ragged, spidery radius
      float rag = noise(vec2(a * 1.43 + floor(g.x) * 3.1, floor(g.y) * 5.7)) - 0.5;
      float r = length(f) + rag * 0.10;

      // concentric resist rings from the wraps of thread
      float ring_t = fract(r * 9.0);
      float rings = smoothstep(0.25, 0.45, ring_t) * smoothstep(0.85, 0.65, ring_t);
      // overall circle envelope: strong white centre, fading out
      float env = 1.0 - smoothstep(0.05, 0.42, r);

      float resist = env * (0.45 + 0.55 * rings);
      // centre knot: hard white burst
      resist = max(resist, 1.0 - smoothstep(0.0, 0.07, r));

      // dye bleed: halo of mid indigo where dye crept under the binding
      float halo = (1.0 - smoothstep(0.30, 0.50, r)) * (1.0 - env);
      col = mix(col, indigo_mid * 1.25, clamp(halo, 0.0, 1.0) * 0.5);
      col = mix(col, cloth_white, clamp(resist, 0.0, 1.0) * 0.92);

      // radial pucker shading: bound cloth stays wrinkled
      float pucker = sin(r * 60.0 + a * 2.0) * 0.5 + 0.5;
      col *= 1.0 - env * 0.12 * pucker;

      // --- Cotton weave grain + wrinkle shadows ---
      float warp = sin(uv.x * 3.14159 * 240.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 240.0) * 0.5 + 0.5;
      col *= 0.94 + 0.035 * warp + 0.035 * weft;
      col *= 0.92 + 0.13 * fbm(uv * 7.0 + 19.0);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_circles', name: 'Circle Repeats', type: 'float', min: 1.0, max: 8.0,  default: 3.0 },
    { id: 'u_pleats',  name: 'Pleat Lines',    type: 'float', min: 4.0, max: 30.0, default: 12.0 }
  ]
};

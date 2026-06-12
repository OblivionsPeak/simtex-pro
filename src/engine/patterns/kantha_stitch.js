export default {
  id: 'kantha_stitch',
  name: 'Kantha Quilt',
  category: 'Textile',
  added: '2026-06-12',
  description: 'Bengali kantha: layered sari-cloth quilt covered edge to edge in dense parallel running stitches, the cloth rippling between rows, with mismatched patch colours showing through.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // --- Patchwork base: large cells of repurposed sari cloth ---
      float patches = 2.0;
      vec2 pg = uv * patches;
      vec2 pid = floor(pg);
      vec2 pf = fract(pg);
      float ph = hash(pid + 0.7);

      vec3 base = u_cloth_color.rgb;
      // each patch shifts hue/value like mismatched old saris
      vec3 patch = base * (0.78 + 0.45 * ph);
      patch = mix(patch, patch.gbr, (hash(pid + 3.3) - 0.5) * 0.35);
      // faded print ghosts on some patches
      float ghost = step(0.5, hash(pid + 9.1))
                  * (1.0 - smoothstep(0.06, 0.12, abs(length(fract(pg * 3.0) - 0.5) - 0.25)));
      patch = mix(patch, patch * 1.18, ghost * 0.5);

      // patch seam shadow
      float seam = smoothstep(0.0, 0.03, pf.x) * smoothstep(1.0, 0.97, pf.x)
                 * smoothstep(0.0, 0.03, pf.y) * smoothstep(1.0, 0.97, pf.y);
      vec3 col = patch * (0.80 + 0.20 * seam);

      // worn cotton texture
      float warp = sin(uv.x * 3.14159 * 280.0) * 0.5 + 0.5;
      float weft = sin(uv.y * 3.14159 * 280.0) * 0.5 + 0.5;
      col *= 0.94 + 0.03 * warp + 0.03 * weft;
      col *= 0.94 + 0.10 * fbm(uv * 4.0);

      // --- Quilt ripple: cloth puffs up between stitch rows ---
      float rows = u_rows;
      float ry = uv.y * rows;
      // each row of stitching wanders slightly
      float wander = (noise(vec2(uv.x * 5.0, floor(ry) * 3.1)) - 0.5) * 0.25;
      float rv = fract(ry + wander * 0.3);
      // height profile: valley at the stitch line, hill between
      float puff = sin(rv * 3.14159);
      col *= 0.82 + 0.22 * puff;
      // soft top-light on the upper side of each ridge
      col += vec3(0.05) * smoothstep(0.4, 0.85, rv) * smoothstep(1.0, 0.85, rv) * puff;

      // --- Running stitches along every row valley ---
      float stitch_t = fract(uv.x * rows * 3.2 + hash(vec2(floor(ry), 1.3)));
      float dash = smoothstep(0.12, 0.24, stitch_t) * smoothstep(0.78, 0.66, stitch_t);
      float near_line = 1.0 - smoothstep(0.0, 0.085, min(rv, 1.0 - rv));
      float stitch = dash * near_line;

      // thread: slightly off-white, with twist banding
      float twist = sin(uv.x * 800.0) * 0.5 + 0.5;
      vec3 thread = u_thread_color.rgb * (0.85 + 0.15 * twist);
      // entry/exit shadow at dash ends
      float dimple = (smoothstep(0.06, 0.12, stitch_t) - smoothstep(0.12, 0.24, stitch_t)
                    + smoothstep(0.84, 0.78, stitch_t) - smoothstep(0.78, 0.66, stitch_t));
      col *= 1.0 - clamp(dimple, 0.0, 1.0) * near_line * 0.22;
      col = mix(col, thread, clamp(stitch, 0.0, 1.0));
      col += vec3(0.06) * stitch * puff; // raised thread catches light

      // occasional contrast mending thread on random rows
      float mend = step(0.85, hash(vec2(floor(ry), 7.7)));
      col = mix(col, vec3(0.70, 0.25, 0.20) * (0.85 + 0.15 * twist), stitch * mend * 0.85);

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_rows',         name: 'Stitch Rows',  type: 'float', min: 10.0, max: 50.0, default: 24.0 },
    { id: 'u_cloth_color',  name: 'Cloth Color',  type: 'color', default: [0.78, 0.62, 0.45, 1.0] },
    { id: 'u_thread_color', name: 'Thread Color', type: 'color', default: [0.92, 0.90, 0.84, 1.0] }
  ]
};

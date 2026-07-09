export default {
  id: 'circuit_ghost',
  name: 'Circuit Ghost',
  category: 'Technology',
  added: '2026-07-09',
  description: 'A dense lattice of dormant PCB traces with pads and vias, tone-on-tone in deep teal — while a few powered nets glow live across the board.',
  shader: `
    float seg_cg(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }

    vec4 generate() {
      vec2 p = fract(v_uv) * u_scale;
      vec2 id = floor(p);
      vec2 f = fract(p) - 0.5;

      vec3 col = vec3(0.035, 0.059, 0.067);
      float h1 = hash(id + 1.7);

      // truchet routing: traces meet at edge midpoints so runs connect
      float d = 8.0;
      if (h1 < 0.28) {
        d = seg_cg(f, vec2(-0.5, 0.0), vec2(0.5, 0.0));
      } else if (h1 < 0.56) {
        d = seg_cg(f, vec2(0.0, -0.5), vec2(0.0, 0.5));
      } else if (h1 < 0.68) {
        d = min(seg_cg(f, vec2(-0.5, 0.0), vec2(0.0, 0.0)),
                seg_cg(f, vec2(0.0, 0.0), vec2(0.0, 0.5)));
      } else if (h1 < 0.80) {
        d = min(seg_cg(f, vec2(0.5, 0.0), vec2(0.0, 0.0)),
                seg_cg(f, vec2(0.0, 0.0), vec2(0.0, -0.5)));
      } else if (h1 < 0.90) {
        d = seg_cg(f, vec2(-0.5, -0.5), vec2(0.5, 0.5));  // 45-degree jog
      }

      // powered nets come in contiguous super-cells so they read as circuits
      float live = step(1.0 - u_live, hash(floor(id / 3.0) + 8.8));

      float trace = smoothstep(u_weight, u_weight - 0.02, d);
      vec3 gcol = mix(vec3(0.086, 0.157, 0.173), vec3(0.14, 0.245, 0.26), hash(id + 2.9));
      col = mix(col, gcol, trace);
      if (live > 0.5 && d < 4.0) {
        col += vec3(0.0, 1.0, 0.78) * (trace * 0.9 + exp(-d * 9.0) * 0.35);
      }

      // pads on a fraction of routed cells
      if (hash(id + 5.1) > 0.88 && h1 < 0.90) {
        float pd = length(f);
        float ring = smoothstep(0.16, 0.14, pd) - smoothstep(0.085, 0.065, pd);
        vec3 padCol = live > 0.5 ? vec3(0.0, 1.0, 0.78) : vec3(0.19, 0.31, 0.33);
        col = mix(col, padCol, clamp(ring, 0.0, 1.0));
      }

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',  name: 'Trace Density', type: 'float', min: 8.0,  max: 40.0, default: 22.0 },
    { id: 'u_live',   name: 'Live Nets',     type: 'float', min: 0.0,  max: 0.3,  default: 0.08 },
    { id: 'u_weight', name: 'Trace Weight',  type: 'float', min: 0.025, max: 0.10, default: 0.045 }
  ]
};

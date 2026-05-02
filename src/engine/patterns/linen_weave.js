export default {
  id: 'linen_weave',
  name: 'Linen Weave',
  category: 'Industrial',
  description: 'Natural linen plain weave with organic fibre slubs and warm ecru tones.',
  shader: `
    // Hash for pseudo-random noise
    float hash11(float p) {
      p = fract(p * 0.1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
    }

    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    // Smooth noise for slub irregularity
    float noise1(float x) {
      float i = floor(x);
      float f = fract(x);
      float u = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), u);
    }

    // Simulate a single thread with slubs
    float threadProfile(float pos, float threadId) {
      float base = 0.55;
      float slubFreq = 1.8 + hash11(threadId) * 2.5;
      float slubAmp  = 0.08 + hash11(threadId + 7.3) * 0.12;
      float slub = noise1(pos * slubFreq + hash11(threadId) * 10.0) * slubAmp;
      float twist = sin(pos * (4.0 + hash11(threadId + 3.1)) + hash11(threadId + 1.7) * 6.28) * 0.04;
      return base + slub + twist;
    }

    vec4 generate() {
      float scale = u_weave_scale;
      vec2 uv = v_uv * scale;

      vec2 cell = floor(uv);
      vec2 local = fract(uv);

      // Determine if this cell is warp (vertical) or weft (horizontal) thread on top
      float cellParity = mod(cell.x + cell.y, 2.0);

      // Warp thread runs vertically (u direction is across thread, v along thread)
      // Weft thread runs horizontally (v direction is across thread, u along thread)

      // Thread radii — vary slightly per thread for organic feel
      float warpId = cell.x;
      float weftId = cell.y;

      float warpRadius = threadProfile(cell.y + local.y, warpId);
      float weftRadius = threadProfile(cell.x + local.x, weftId + 100.0);

      // Cross-section distance for each thread
      float dWarp = abs(local.x - 0.5);
      float dWeft = abs(local.y - 0.5);

      // Over-under weave: alternate which thread is on top
      float warpOnTop = step(0.5, cellParity);

      float warpMask = smoothstep(warpRadius, warpRadius - 0.04, dWarp);
      float weftMask = smoothstep(weftRadius, weftRadius - 0.04, dWeft);

      // Shadow: thread going under gets slightly darkened
      float shadow = mix(1.0, 0.78, (1.0 - warpOnTop) * warpMask * (1.0 - weftMask));
      shadow      *= mix(1.0, 0.78, warpOnTop * weftMask * (1.0 - warpMask));

      // Micro-fibre fuzz along thread edges
      float fuzz = hash21(floor(uv * 3.0)) * 0.04;

      // Colour blend: warp vs weft tones
      vec3 warpCol = u_base_color.rgb;
      vec3 weftCol = u_warp_color.rgb;
      float blend = mix(warpOnTop * warpMask, (1.0 - warpOnTop) * weftMask, 0.5);
      vec3 col = mix(weftCol, warpCol, clamp(blend + fuzz, 0.0, 1.0));

      col *= shadow;

      // Slight global irregularity
      float globalNoise = noise1(v_uv.x * scale * 0.3) * 0.04;
      col = clamp(col + globalNoise - 0.02, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_weave_scale', type: 'float', default: 18, min: 4, max: 40, label: 'Weave Scale' },
    { name: 'u_base_color',  type: 'color', default: [0.82, 0.75, 0.58, 1.0], label: 'Warp Colour' },
    { name: 'u_warp_color',  type: 'color', default: [0.72, 0.64, 0.48, 1.0], label: 'Weft Colour' }
  ]
};

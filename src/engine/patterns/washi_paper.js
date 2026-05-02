export default {
  id: 'washi_paper',
  name: 'Washi Paper',
  category: 'Natural',
  description: 'Japanese handmade washi paper with long random fibres, mottled translucency, and cream base.',
  shader: `
    // Deterministic hash
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

    // Smooth noise 2D
    float noise2(vec2 uv) {
      vec2 i = floor(uv);
      vec2 f = fract(uv);
      vec2 u = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
    }

    // Elongated fibre: returns darkening contribution at uv from a fibre seed
    float fibre(vec2 uv, float seed) {
      // Fibre start point
      vec2 start = vec2(hash11(seed), hash11(seed + 1.3));
      // Fibre angle — slightly biased to horizontal (paper made on flat screen)
      float angle = (hash11(seed + 2.7) - 0.5) * 1.8;  // ±1.8 rad from horizontal
      vec2 dir = vec2(cos(angle), sin(angle));

      // Fibre length (0.05 – 0.35 of canvas)
      float len = 0.05 + hash11(seed + 4.1) * 0.30;

      // Vector from fibre start to current point
      vec2 dp = uv - start;

      // Project along fibre
      float t    = dot(dp, dir);
      float perp = abs(dot(dp, vec2(-dir.y, dir.x)));

      // Only along fibre extent
      float along = step(0.0, t) * step(t, len);

      // Fibre cross-section width (very thin — 0.002 – 0.006)
      float width = 0.0015 + hash11(seed + 5.5) * 0.004;

      // Soft-edged fibre with slight thickness taper at ends
      float taper = smoothstep(0.0, len * 0.12, t) * smoothstep(len, len * 0.88, t);
      float mask  = smoothstep(width, width * 0.2, perp) * along * taper;

      return mask;
    }

    vec4 generate() {
      float density   = u_fiber_density;
      vec3  paperCol  = u_paper_color.rgb;
      vec3  fiberCol  = u_fiber_color.rgb;

      // Base paper with mottled translucency (low-frequency noise)
      float mottling  = noise2(v_uv * 4.0) * 0.06 - 0.03;
      float mottling2 = noise2(v_uv * 12.0) * 0.025 - 0.012;

      // Fine paper grain (surface texture)
      float grain = noise2(v_uv * 90.0) * 0.03 - 0.015;

      vec3 base = paperCol + mottling + mottling2 + grain;

      // Accumulate fibre darkening
      int numFibres = int(density * 6.0);
      numFibres = min(numFibres, 120);

      float fibreAcc = 0.0;
      for (int i = 0; i < 120; i++) {
        if (i >= numFibres) break;
        float seed = float(i) * 17.31;
        fibreAcc += fibre(v_uv, seed);
      }
      fibreAcc = clamp(fibreAcc, 0.0, 1.0);

      // Fibre colour — slightly translucent, so base shows through at edges
      vec3 col = mix(base, fiberCol * 0.92, fibreAcc * 0.85);

      // Slight overall warmth variation (handmade paper is uneven)
      float warmth = noise2(v_uv * 2.5) * 0.03;
      col.r += warmth;
      col.g += warmth * 0.6;

      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_fiber_density', type: 'float', default: 8,    min: 2,   max: 20,  label: 'Fibre Density' },
    { name: 'u_paper_color',   type: 'color', default: [0.93, 0.91, 0.85, 1.0],  label: 'Paper Colour' },
    { name: 'u_fiber_color',   type: 'color', default: [0.60, 0.54, 0.44, 1.0],  label: 'Fibre Colour' }
  ]
};

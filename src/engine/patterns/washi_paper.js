export default {
  id: 'washi_paper',
  name: 'Washi Paper',
  category: 'Natural',
  description: 'Japanese handmade washi paper with long random fibres, mottled translucency, and cream base.',
  shader: `
    float hash21(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

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

    // Anisotropic fibre noise: stretched heavily in one direction to simulate long fibres
    float fibreNoise(vec2 uv, float angle, float stretch) {
      float c = cos(angle);
      float s = sin(angle);
      vec2 rotUV = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      // Stretch along the fibre direction, keep thin across
      vec2 stretchedUV = vec2(rotUV.x / stretch, rotUV.y * 80.0);
      float n = noise2(stretchedUV * u_fiber_density);
      // Threshold to get distinct fibre lines rather than a wash
      return smoothstep(0.55, 0.75, n);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Mottled base — low-frequency unevenness of handmade paper
      float mottling = noise2(uv * 3.5) * 0.06
                     + noise2(uv * 9.0)  * 0.03
                     + noise2(uv * 28.0) * 0.015;

      vec3 base = u_paper_color.rgb + (mottling - 0.055);

      // Three fibre layers at slightly different angles (paper screen is mostly horizontal)
      float f1 = fibreNoise(uv, 0.0,    12.0);          // horizontal fibres
      float f2 = fibreNoise(uv, 0.18,   10.0);          // slight right bias
      float f3 = fibreNoise(uv, -0.22,   9.0);          // slight left bias
      float f4 = fibreNoise(uv, 0.55,    6.0) * 0.4;   // occasional diagonal crossing fibre

      float fibreAcc = clamp(f1 * 0.5 + f2 * 0.4 + f3 * 0.35 + f4, 0.0, 1.0);

      // Fine surface grain
      float grain = noise2(uv * 120.0) * 0.02;
      base += grain - 0.01;

      vec3 col = mix(base, u_fiber_color.rgb, fibreAcc * 0.7);

      // Subtle warm variation across the sheet
      float warmth = noise2(uv * 2.0) * 0.025;
      col.r += warmth;
      col.g += warmth * 0.5;

      col = clamp(col, 0.0, 1.0);
      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { id: 'u_fiber_density', name: 'Fibre Density', type: 'float', min: 1.0, max: 12.0, default: 4.0 },
    { id: 'u_paper_color',   name: 'Paper Colour',  type: 'color', default: [0.93, 0.91, 0.85, 1.0] },
    { id: 'u_fiber_color',   name: 'Fibre Colour',  type: 'color', default: [0.60, 0.54, 0.44, 1.0] }
  ]
};

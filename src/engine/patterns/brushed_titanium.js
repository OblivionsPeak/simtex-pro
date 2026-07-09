export default {
  id: 'brushed_titanium',
  name: 'Brushed Titanium',
  category: 'Industrial',
  added: '2026-07-09',
  description: 'Anisotropic brushed titanium — long horizontal grain, two soft highlight bands following the panel curvature, and sparse hand-length scratches. Cool blue-white cast.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;
      float streak = fbm(vec2(uv.x * 2.0, uv.y * u_grain)) * 0.5 + 0.5;
      float fine = noise(vec2(uv.x * 40.0, uv.y * u_grain * 6.0));
      float lum = 0.46 + (streak - 0.5) * 0.36 + (fine - 0.5) * 0.10;

      // two broad highlight bands, as if lit across the curvature
      float t1 = (uv.y - 0.30 - 0.06 * sin(uv.x * 3.0)) / 0.09;
      float t2 = (uv.y - 0.74 + 0.04 * sin(uv.x * 2.2)) / 0.13;
      float band1 = exp(-t1 * t1);
      float band2 = exp(-t2 * t2);
      lum += (band1 * 0.18 + band2 * 0.09) * u_sheen;

      // sparse long scratches on random rows
      float row = floor(uv.y * 900.0);
      float sc = step(0.992, hash(vec2(row, 3.7)));
      float sx = hash(vec2(row, 9.1));
      float sl = 0.12 + hash(vec2(row, 12.7)) * 0.4;
      sc *= step(sx, uv.x) * step(uv.x, sx + sl);
      lum += sc * (hash(vec2(row, 5.5)) - 0.5) * 0.22;

      vec3 col = lum * vec3(0.955, 0.985, 1.045);
      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grain', name: 'Grain Density', type: 'float', min: 100.0, max: 600.0, default: 300.0 },
    { id: 'u_sheen', name: 'Sheen',         type: 'float', min: 0.0,   max: 2.0,   default: 1.0 }
  ]
};

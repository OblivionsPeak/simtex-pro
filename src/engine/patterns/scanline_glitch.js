export default {
  id: 'scanline_glitch',
  name: 'Scanline Glitch',
  category: 'Technology',
  added: '2026-07-09',
  description: 'A paused transmission tearing apart — displaced row bands, chromatic channel splits, hot cyan and magenta slivers, and bit-noise that intensifies toward one edge.',
  shader: `
    vec3 base_sg(vec2 uv) {
      float tone = fbm(vec2(uv.x * 5.0, 2.7)) * 0.5 + 0.5;
      float lum = 0.12 + tone * 0.22 + uv.y * 0.03;
      return lum * vec3(0.92, 1.0, 1.22);
    }

    vec4 generate() {
      vec2 uv = v_uv;
      // glitch power grows toward the right edge — the fade direction
      float inten = pow(clamp((uv.x - 0.05) / 0.95, 0.0, 1.0), 1.2) * u_power;

      // two scales of row bands, each with its own displacement
      float b1 = floor(uv.y * 23.0);
      float b2 = floor(uv.y * 89.0);
      float shift = (hash(vec2(b1, 1.7)) - 0.5) * 0.15 * step(0.25, hash(vec2(b1, 3.3)));
      shift += (hash(vec2(b2, 5.1)) - 0.5) * 0.05 * step(0.6, hash(vec2(b2, 7.7)));
      shift *= (0.25 + inten);

      // chromatic tear: R and B channels pull apart
      float k = (hash(vec2(b1, 9.9)) - 0.5) * 0.04 * step(0.45, hash(vec2(b1, 11.3))) * (0.3 + inten);
      vec3 col;
      col.r = base_sg(vec2(fract(uv.x + shift + k), uv.y)).r;
      col.g = base_sg(vec2(fract(uv.x + shift), uv.y)).g;
      col.b = base_sg(vec2(fract(uv.x + shift - k), uv.y)).b;

      // luminance jump per band
      col *= mix(1.0, 0.55 + hash(vec2(b1, 13.1)) * 1.05, step(0.72, hash(vec2(b1, 15.7))));

      // hot slivers
      float sb = floor(uv.y * 150.0);
      if (hash(vec2(sb, 21.0)) > 0.965) {
        float x0 = hash(vec2(sb, 23.0)) * 0.7;
        float x1 = x0 + 0.13 + hash(vec2(sb, 25.0)) * 0.55;
        if (uv.x > x0 && uv.x < x1) {
          vec3 hcol = hash(vec2(sb, 27.0)) < 0.6 ? vec3(0.0, 1.0, 0.9) : vec3(1.0, 0.157, 0.63);
          col = hcol * (0.5 + 0.5 * inten);
        }
      }

      // bit-noise blocks, denser toward the hot edge
      vec2 cell = floor(uv * 256.0);
      vec2 blk = floor(uv * 32.0);
      if (hash(cell) < inten * 0.16) {
        col = hash(blk + 31.0) < 0.45 ? vec3(0.67, 0.92, 1.0) : col * 0.25;
      }

      // scanlines
      col *= 1.0 - step(0.75, fract(uv.y * 300.0)) * 0.22;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_power', name: 'Glitch Power', type: 'float', min: 0.0, max: 2.0, default: 1.0 }
  ]
};

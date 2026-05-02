export default {
  id: 'morpho_iridescence_natural',
  name: 'Morpho Iridescence',
  category: 'Natural',
  description: 'Deep structural blue iridescence of the Morpho butterfly wing — pure nanostructure diffraction blue with fine scale-row banding and angle-dependent shimmer.',
  shader: `
    float hash11(float p) { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)  { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    // 2D smooth noise for micro-distortion
    float smoothNoise2D(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      // Wing scale rows: horizontal bands at u_scale_freq frequency
      float scaleFreq  = u_scale_freq;
      float rowY       = v_uv.y * scaleFreq;

      // Slight horizontal undulation of rows (mimics natural scale misalignment)
      float rowWaver   = smoothNoise1D(v_uv.x * 8.0) * 0.6;
      float rowLocal   = fract(rowY + rowWaver);
      float rowIndex   = floor(rowY + rowWaver);

      // Within-row brightness — each scale row is a ridge-valley structure
      // Bright at scale top, darker at row gap
      float rowBright  = smoothstep(0.0, 0.28, rowLocal) * (1.0 - smoothstep(0.72, 1.0, rowLocal));

      // Per-row tiny random brightness offset (natural variation in scale height)
      float rowVar     = 0.88 + hash11(rowIndex) * 0.24;

      // Angle-dependent shimmer: simulate view-angle dependence with UV position
      // (since we have no real normals, use distance from a "normal incidence" center)
      float dx         = v_uv.x - 0.5;
      float dy         = v_uv.y - 0.5;
      float angleFactor = 1.0 - (dx * dx + dy * dy) * 2.0 * u_shimmer;
      angleFactor      = clamp(angleFactor, 0.0, 1.0);

      // Micro-distortion noise on the diffraction (gives "depth" to the shimmer)
      float microNoise = smoothNoise2D(v_uv * 18.0) * 0.08 - 0.04;

      // Base blue from uniform, modulated by angle and row structure
      vec3 baseBlue    = u_base_blue.rgb;

      // At high angle (edges), the structural color shifts slightly toward UV (darker, more violet)
      float edgeShift  = 1.0 - angleFactor;
      vec3  violetShift = vec3(-0.03, -0.06, 0.05);  // subtle violet push at edges
      vec3  col         = baseBlue + violetShift * edgeShift;

      // Combine row modulation and angle brightness
      float brightness = rowBright * rowVar * angleFactor;
      brightness       = clamp(brightness + microNoise, 0.0, 1.0);

      col *= (0.25 + 0.75 * brightness);  // dark minimum for scale gaps

      // Specular-like shimmer band — narrow bright stripe that follows normal incidence
      float shimmerBand = exp(-40.0 * (dx * dx + dy * dy)) * u_shimmer * 0.35;
      col += baseBlue * shimmerBand;

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_base_blue',   name: 'Morpho Blue',       type: 'color', default: [0.05, 0.15, 0.92, 1.0] },
    { id: 'u_scale_freq',  name: 'Scale Row Frequency',type: 'float', min: 10.0, max: 80.0, default: 40.0 },
    { id: 'u_shimmer',     name: 'Shimmer Intensity',  type: 'float', min: 0.0,  max: 1.0,  default: 0.7  }
  ]
};

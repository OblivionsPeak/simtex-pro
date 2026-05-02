export default {
  id: 'travertine_natural',
  name: 'Travertine',
  category: 'Natural',
  description: 'Layered travertine limestone with wavy cream-to-tan sedimentary bands and occasional trapped gas-bubble void pockets.',
  shader: `
    float hash11(float p)  { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)   { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x); float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    float smoothNoise2D(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash21(i);
      float b = hash21(i + vec2(1.0, 0.0));
      float c = hash21(i + vec2(0.0, 1.0));
      float d = hash21(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    // Fractal Brownian Motion — 3 octaves for wavy bands
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 3; i++) {
        v += a * smoothNoise2D(p);
        p  = p * 2.1 + vec2(3.7, 1.3);
        a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      // Wavy band: distort the Y coordinate with fbm noise
      float warp  = fbm(v_uv * 2.5) * 0.18 - 0.09;
      float bandY = (v_uv.y + warp) * u_band_freq;

      float layerI = floor(bandY);
      float layerF = fract(bandY);

      // Per-layer color — cycle through cream → beige → tan → light brown
      float colCycle = fract(layerI * 0.137 + hash11(layerI) * 0.4);
      // Map 0→1 through the warm tone range
      vec3 warmA = u_base_color.rgb;                              // cream
      vec3 warmB = u_base_color.rgb * vec3(0.88, 0.82, 0.70);   // tan
      vec3 warmC = u_base_color.rgb * vec3(0.76, 0.67, 0.52);   // light brown
      vec3 warmD = u_base_color.rgb * vec3(0.94, 0.91, 0.84);   // warm off-white

      vec3 layerCol;
      if (colCycle < 0.25) {
        layerCol = mix(warmA, warmB, colCycle * 4.0);
      } else if (colCycle < 0.5) {
        layerCol = mix(warmB, warmC, (colCycle - 0.25) * 4.0);
      } else if (colCycle < 0.75) {
        layerCol = mix(warmC, warmD, (colCycle - 0.5) * 4.0);
      } else {
        layerCol = mix(warmD, warmA, (colCycle - 0.75) * 4.0);
      }

      // Micro surface texture within layer
      float surf = smoothNoise2D(v_uv * 40.0) * 0.04 - 0.02;
      layerCol  += surf;

      // Layer boundary — slight darkening at the stratum transition
      float boundary = (1.0 - smoothstep(0.0, 0.08, layerF)) + (1.0 - smoothstep(1.0, 0.92, layerF));
      layerCol *= (1.0 - boundary * 0.18);

      // Void pockets (gas bubble holes) — scattered dark ellipses
      float voidCount = u_void_density;
      float voidMask  = 0.0;

      // Sample a grid of potential void cells
      vec2 voidUV = v_uv * vec2(voidCount * 1.5, voidCount);
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 cell  = floor(voidUV) + vec2(float(dx), float(dy));
          float rnd  = hash21(cell);
          // Only ~40% of cells have a void
          if (rnd > 0.60) {
            vec2 jitter  = vec2(hash21(cell + 7.3), hash21(cell + 13.7));
            vec2 center  = cell + jitter;
            vec2 diff    = voidUV - center;
            // Elliptical void (wider than tall)
            float voidR  = 0.08 + hash21(cell + 3.1) * 0.14;
            float aspect = 1.4 + hash21(cell + 5.0) * 0.8;
            float vd     = length(diff * vec2(1.0 / aspect, 1.0)) / voidR;
            float vm     = 1.0 - smoothstep(0.7, 1.0, vd);
            voidMask     = max(voidMask, vm);
          }
        }
      }

      // Void interior is dark brownish-grey
      vec3 voidCol = u_base_color.rgb * vec3(0.18, 0.14, 0.10);
      vec3 col     = mix(layerCol, voidCol, voidMask);

      return vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_band_freq',    name: 'Band Frequency',   type: 'float', min: 2.0,  max: 20.0, default: 8.0 },
    { id: 'u_base_color',   name: 'Travertine Color', type: 'color',                        default: [0.88, 0.80, 0.67, 1.0] },
    { id: 'u_void_density', name: 'Void Density',     type: 'float', min: 0.0,  max: 10.0, default: 3.0 }
  ]
};

export default {
  id: 'rose_gold_brushed',
  name: 'Rose Gold Brushed',
  category: 'Industrial',
  description: 'Directional brushed rose gold metal with warm pink-gold grain streaks and a subtle specular sheen band.',
  shader: `
    float hash11(float p) { return fract(sin(p * 127.1) * 43758.5453); }

    float brushNoise(float y, float grain) {
      float band = floor(y * grain);
      float f    = fract(y * grain);
      float a = hash11(band);
      float b = hash11(band + 1.0);
      return mix(a, b, f * f * (3.0 - 2.0 * f));
    }

    float gaussianSheen(float x, float center, float sigma) {
      float d = x - center;
      return exp(-(d * d) / (2.0 * sigma * sigma));
    }

    vec4 generate() {
      // Horizontal brush grain along Y axis
      float grain = brushNoise(v_uv.y, u_grain);

      // Fine high-frequency streak noise
      float streak = hash11(floor(v_uv.y * u_grain * 8.0)) * 0.5 + 0.5;
      float noise  = mix(grain, streak, 0.35);

      // Base rose gold color modulated by grain
      vec3 baseCol = u_base_color.rgb * (0.82 + 0.18 * noise);

      // Gaussian specular sheen band across center-ish of UV.x
      float sheen = gaussianSheen(v_uv.x, 0.5, 0.18) * u_sheen;
      // Warm specular highlight — slightly whiter/lighter than base
      vec3 sheenCol = mix(baseCol, vec3(1.0, 0.90, 0.85), sheen * 0.6);

      return vec4(sheenCol, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_grain',      name: 'Grain Density',    type: 'float', min: 5.0,  max: 100.0, default: 40.0 },
    { id: 'u_sheen',      name: 'Sheen Intensity',  type: 'float', min: 0.0,  max: 1.0,   default: 0.6  },
    { id: 'u_base_color', name: 'Base Color',        type: 'color',                        default: [0.88, 0.65, 0.55, 1.0] }
  ]
};

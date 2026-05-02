export default {
  id: 'slate_rock_natural',
  name: 'Slate Rock',
  category: 'Natural',
  description: 'Dark layered slate with parallel cleavage planes, fine horizontal grain, and occasional crossing fracture lines.',
  shader: `
    float hash11(float p)  { return fract(sin(p * 127.1) * 43758.5453); }
    float hash21(vec2 p)   { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    float smoothNoise1D(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash11(i), hash11(i + 1.0), f);
    }

    // Wavy layer boundary — each layer is slightly undulated
    float layerWave(float y, float layerIdx) {
      float wave = smoothNoise1D(v_uv.x * 4.0 + layerIdx * 7.3) * 0.012;
      return y + wave;
    }

    vec4 generate() {
      float freq = u_layer_freq;

      // Layer index and local position within layer
      float rawY    = v_uv.y * freq;
      float layerI  = floor(rawY);
      float layerF  = fract(rawY);

      // Slight undulation per layer
      float wavY = layerWave(rawY, layerI);
      layerF = fract(wavY);
      layerI = floor(wavY);

      // Per-layer color variation
      float layerVar = hash11(layerI) * 0.12 - 0.06;

      // Fine horizontal grain noise within layer
      float grain = smoothNoise1D(v_uv.x * freq * 12.0 + layerI * 31.7) * 0.05;

      vec3 baseCol = u_base_color.rgb + layerVar + grain;

      // Thin dark line at layer boundary (cleavage plane)
      float boundary = 1.0 - smoothstep(0.0, 0.04, layerF) * smoothstep(1.0, 0.96, layerF);
      baseCol *= (1.0 - boundary * 0.45);

      // Fracture lines — near-vertical with slight diagonal
      float fracNum   = u_fracture * 12.0;
      float fracX     = v_uv.x * fracNum;
      float fracI     = floor(fracX);
      float fracF     = fract(fracX);

      // Only some cells have a fracture
      float hasFrac   = step(0.75, hash21(vec2(fracI, 0.0)));
      // Fracture meanders slightly in Y
      float fracBias  = hash21(vec2(fracI, 1.0)) * 0.4 - 0.2;  // x offset slope
      float fracLine  = fracF - 0.5 + fracBias * (v_uv.y - 0.5);
      float fracMask  = hasFrac * (1.0 - smoothstep(0.0, 0.012, abs(fracLine)));

      baseCol *= (1.0 - fracMask * 0.55);

      return vec4(clamp(baseCol, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_layer_freq', name: 'Layer Frequency', type: 'float', min: 4.0,  max: 40.0, default: 16.0 },
    { id: 'u_base_color', name: 'Slate Color',     type: 'color',                       default: [0.22, 0.24, 0.27, 1.0] },
    { id: 'u_fracture',   name: 'Fracture Density',type: 'float', min: 0.0,  max: 1.0,  default: 0.4  }
  ]
};

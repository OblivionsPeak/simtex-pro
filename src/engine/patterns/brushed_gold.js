export default {
  id: 'brushed_gold',
  name: 'Brushed Gold',
  category: 'Industrial',
  description: 'Directional brushed gold metal with fine horizontal linear grain and a subtle specular sheen, as found on machined jewelry and trim.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // High-frequency grain running horizontally — sample noise at fixed X, vary Y
    float grainLine(vec2 uv, float freq) {
      float n1 = noise(vec2(0.5, uv.y * freq));
      float n2 = noise(vec2(0.5, uv.y * freq * 2.3 + 17.3));
      return n1 * 0.65 + n2 * 0.35;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Fine horizontal brushing scratches — vary frequency with u_grain
      float coarse = grainLine(uv, u_grain * 0.8);
      float fine   = grainLine(uv, u_grain * 3.5);
      float grain  = coarse * 0.6 + fine * 0.4;

      // Slight cross-grain variation so it doesn't look perfectly flat
      float crossVar = noise(vec2(uv.x * 6.0, uv.y * 1.5)) * 0.08;

      // Base colour from uniform, modulate brightness by grain
      float grainMod = mix(0.80, 1.18, grain) + crossVar;
      vec3 col = u_base_color.rgb * grainMod;

      // Specular band — a soft highlight stripe along U (v_uv.x centre)
      float specBand = exp(-pow((uv.x - 0.5) * 5.0, 2.0));
      specBand *= u_sheen * 0.35;
      // Gold specular is warm — add more red/green than blue
      col += vec3(specBand * 1.0, specBand * 0.88, specBand * 0.35);

      // Micro-glint — rare bright scratches catching light
      float glint = pow(noise(vec2(uv.x * 2.0, uv.y * u_grain * 5.0)), 8.0) * u_sheen * 0.5;
      col += vec3(glint, glint * 0.85, glint * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_grain',      name: 'Grain Frequency', type: 'float', min: 10.0, max: 150.0, default: 60.0 },
    { id: 'u_base_color', name: 'Base Gold',        type: 'color', default: [0.85, 0.68, 0.18, 1.0] },
    { id: 'u_sheen',      name: 'Sheen',            type: 'float', min: 0.0,  max: 1.0,   default: 0.5 }
  ]
};

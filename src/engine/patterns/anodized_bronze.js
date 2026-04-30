export default {
  id: 'anodized_bronze',
  name: 'Anodized Bronze',
  category: 'Industrial',
  description: 'Anodized aluminum in a warm bronze/gold tone with micro-grain texture and subtle colour banding from bath imperfections.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p *= 2.1; a *= 0.5;
      }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Micro-grain along the extrusion direction (vertical streaks)
      float grain = noise(vec2(uv.x * u_grain * 120.0, uv.y * u_grain * 4.0));
      grain = grain * 0.5 + 0.5 * noise(vec2(uv.x * u_grain * 240.0, uv.y * u_grain * 2.0));

      // Anodizing bath colour bands — slow horizontal variation
      float band = fbm(vec2(uv.x * 2.0, uv.y * 0.3));
      band = smoothstep(0.3, 0.7, band) * 0.12;

      // Base bronze colour — warm amber/gold, shifted by u_tone
      // u_tone 0 = cooler (greenish bronze), 1 = warmer (gold)
      vec3 coolBronze = vec3(0.45, 0.35, 0.18);
      vec3 warmGold   = vec3(0.65, 0.50, 0.22);
      vec3 baseColor  = mix(coolBronze, warmGold, u_tone);

      // Slight surface lightness variation from grain
      float grainLight = mix(0.78, 1.08, grain);
      vec3 col = baseColor * grainLight;

      // Band overlay — slight orange-gold tinge
      col += vec3(0.12, 0.07, 0.0) * band;

      // Subtle gloss sheen — brightest at uv.y centre
      float sheen = pow(1.0 - abs(uv.y - 0.5) * 2.0, 3.0) * 0.18;
      col += vec3(sheen * 0.9, sheen * 0.7, sheen * 0.3);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_tone',  name: 'Tone',      type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_grain', name: 'Micro Grain', type: 'float', min: 0.5, max: 8.0, default: 3.0 }
  ]
};

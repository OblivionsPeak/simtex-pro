export default {
  id: 'anodized_blue',
  name: 'Anodized Blue',
  category: 'Industrial',
  description: 'Anodized aluminum in deep cobalt/sapphire blue with subtle directional streaking from the anodizing bath.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Anodizing streaks run along the Y axis (dip direction)
      // Low-frequency X variation + high-frequency micro lines
      float streakLow  = noise(vec2(uv.x * u_streak, uv.y * 0.5));
      float streakHigh = noise(vec2(uv.x * u_streak * 8.0, uv.y * 1.5));
      float streak = streakLow * 0.7 + streakHigh * 0.3;

      // Dark vs light shade from u_shade
      // u_shade 0 = very dark navy, 1 = lighter sapphire
      vec3 darkBlue   = vec3(0.04, 0.07, 0.22);
      vec3 lightBlue  = vec3(0.14, 0.28, 0.62);
      vec3 baseColor  = mix(darkBlue, lightBlue, u_shade);

      // Streak modulates luminance slightly
      float streakMod = mix(0.85, 1.1, streak);
      vec3 col = baseColor * streakMod;

      // Interference / thin-film edge shimmer — slight violet/cyan highlight
      float shimmer = noise(vec2(uv.x * 30.0, uv.y * 5.0 + u_time * 0.02));
      shimmer = pow(shimmer, 3.0) * 0.12;
      col += vec3(shimmer * 0.3, shimmer * 0.5, shimmer * 1.0);

      // Gloss band across the middle
      float gloss = exp(-pow((uv.y - 0.5) * 4.0, 2.0)) * 0.12;
      col += vec3(gloss * 0.4, gloss * 0.6, gloss);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_shade',  name: 'Shade',            type: 'float', min: 0.0,  max: 1.0,  default: 0.5 },
    { id: 'u_streak', name: 'Streak Frequency', type: 'float', min: 1.0,  max: 10.0, default: 4.0 }
  ]
};

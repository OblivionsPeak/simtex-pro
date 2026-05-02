export default {
  id: 'anodized_red',
  name: 'Anodized Red',
  category: 'Industrial',
  description: 'Red anodized aluminum in cherry/crimson with a smooth satin finish and subtle micro-streaks from the anodizing bath process.',
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

      // Anodizing streaks along Y (dip direction)
      // Low-frequency large variation + high-frequency fine streaks
      float streakLow  = noise(vec2(uv.x * u_streak,        uv.y * 0.4));
      float streakHigh = noise(vec2(uv.x * u_streak * 7.5,  uv.y * 2.0));
      float streak = streakLow * 0.65 + streakHigh * 0.35;

      // u_shade 0 = very dark maroon, 1 = bright cherry
      vec3 darkRed   = vec3(0.22, 0.02, 0.02);
      vec3 brightRed = u_red_tone.rgb;
      vec3 baseColor = mix(darkRed, brightRed, u_shade);

      // Streak modulates lightness
      float streakMod = mix(0.82, 1.12, streak);
      vec3 col = baseColor * streakMod;

      // Thin-film interference shimmer — red anodize shows orange/pink shimmer at edges
      float shimmer = noise(vec2(uv.x * 28.0, uv.y * 4.5 + 0.9));
      shimmer = pow(shimmer, 3.5) * 0.10;
      // Orange-pink tint
      col += vec3(shimmer * 1.0, shimmer * 0.35, shimmer * 0.25);

      // Translucency depth — slightly darker band toward centre as dye pools
      float depth = fbm(vec2(uv.x * 1.5, uv.y * 0.8));
      float depthMod = mix(0.92, 1.0, depth);
      col *= depthMod;

      // Gloss band — soft specular across U
      float gloss = exp(-pow((uv.x - 0.5) * 4.5, 2.0)) * 0.10;
      col += vec3(gloss * 1.0, gloss * 0.5, gloss * 0.5);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_shade',    name: 'Shade',       type: 'float', min: 0.0, max: 1.0,  default: 0.5 },
    { id: 'u_streak',   name: 'Streak',      type: 'float', min: 1.0, max: 10.0, default: 4.0 },
    { id: 'u_red_tone', name: 'Red Tone',    type: 'color', default: [0.78, 0.06, 0.06, 1.0] }
  ]
};

export default {
  id: 'corroded_aluminum',
  name: 'Corroded Aluminum',
  category: 'Industrial',
  description: 'Pitted and oxidized aluminum with dull grey-white aluminum oxide patches over a matte base, with small darker corrosion pits.',
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

    // Worley-style pit distance — returns distance to nearest pit centre
    float pitDist(vec2 uv, float scale) {
      vec2 cell = floor(uv * scale);
      float minD = 1.0;
      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 jitter = vec2(hash(nc + vec2(7.3, 2.9)), hash(nc + vec2(1.7, 9.1)));
          vec2 pt = (nc + 0.3 + 0.4 * jitter) / scale;
          float d = length(uv - pt);
          if (d < minD) minD = d;
        }
      }
      return minD;
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Large oxide patches — slow blob noise
      float oxidePatch = fbm(uv * u_scale * 0.5);
      oxidePatch = smoothstep(1.0 - u_corrosion, 1.0, oxidePatch);

      // Aluminum oxide is chalky white-grey
      vec3 oxideColor = vec3(0.82, 0.82, 0.80);

      // Base aluminum — dull, slightly specular
      vec3 base = u_base_color.rgb;
      // Low-amplitude surface variation
      float surfVar = noise(uv * u_scale * 4.0) * 0.06 - 0.03;
      base += vec3(surfVar);

      // Blend oxide patches over base
      vec3 col = mix(base, oxideColor, oxidePatch * 0.85);

      // Corrosion pits — small dark spots (Worley)
      float pit = pitDist(uv, u_scale * 1.5);
      float pitMask = smoothstep(0.04, 0.015, pit);
      // Pits are dark grey, slightly blue-grey (pit shadow)
      vec3 pitColor = vec3(0.22, 0.22, 0.20);
      col = mix(col, pitColor, pitMask * u_corrosion);

      // Fine surface grit noise — matte, not shiny
      float grit = noise(uv * u_scale * 12.0) * 0.04 - 0.02;
      col += vec3(grit);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_corrosion',  name: 'Corrosion Coverage', type: 'float', min: 0.0,  max: 1.0,  default: 0.6 },
    { id: 'u_scale',      name: 'Scale',               type: 'float', min: 2.0,  max: 20.0, default: 8.0 },
    { id: 'u_base_color', name: 'Aluminum Base',        type: 'color', default: [0.65, 0.65, 0.63, 1.0] }
  ]
};

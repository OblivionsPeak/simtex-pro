export default {
  id: 'oil_stain',
  name: 'Oil Stain',
  category: 'Industrial',
  description: 'Dark oil and grease stains on a concrete substrate with irregular pooling and thin-film iridescence at dried edges.',
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
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }

    // Thin-film iridescence: maps a value [0-1] to an RGB rainbow
    vec3 thinFilm(float t) {
      float r = 0.5 + 0.5 * sin(6.28318 * (t + 0.00));
      float g = 0.5 + 0.5 * sin(6.28318 * (t + 0.33));
      float b = 0.5 + 0.5 * sin(6.28318 * (t + 0.67));
      return vec3(r, g, b);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      float totalStain = 0.0;
      float totalEdge  = 0.0;

      // Accumulate multiple stain blobs placed pseudo-randomly
      for (int i = 0; i < 8; i++) {
        if (float(i) >= u_stain_count) break;
        float fi = float(i);
        // Each stain has a random centre
        vec2 centre = vec2(hash(vec2(fi, 0.3)), hash(vec2(fi, 0.7)));
        vec2 diff   = uv - centre;
        // Stretch stain slightly (oil pools are flatter)
        diff.x *= 1.4;
        float dist = length(diff);
        // Organic boundary via fbm
        float boundary = fbm(uv * 4.0 + centre * 7.0) * 0.18;
        float radius   = 0.12 + hash(vec2(fi, 1.1)) * 0.15 + boundary;
        float stain    = smoothstep(radius, radius * 0.5, dist);
        // Opacity darkens toward centre (oil thicker there)
        float depth    = stain * stain;
        totalStain = max(totalStain, depth);
        // Edge ring for iridescence — thin shell just outside stain
        float edgeW  = 0.035;
        float edgeMask = smoothstep(radius - edgeW, radius, dist) *
                         smoothstep(radius + edgeW, radius, dist);
        totalEdge = max(totalEdge, edgeMask);
      }

      // Substrate concrete
      float concGrain = fbm(uv * 18.0) * 0.06;
      vec3 subCol = u_substrate.rgb + vec3(concGrain);

      // Oil colour — very dark, near black, slight brown-green tint
      vec3 oilDark  = vec3(0.04, 0.035, 0.03);
      vec3 oilLight = vec3(0.10, 0.09,  0.07);
      vec3 oilColor = mix(oilDark, oilLight, 1.0 - totalStain);

      vec3 col = mix(subCol, oilColor, totalStain * 0.92);

      // Thin-film iridescent edge
      float filmT = noise(uv * 12.0 + u_time * 0.01) * 0.5;
      vec3 film = thinFilm(filmT);
      col = mix(col, col * 0.5 + film * 0.55, totalEdge * 0.7);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_stain_count', name: 'Stain Count', type: 'float', min: 1.0, max: 8.0,  default: 3.0 },
    { id: 'u_substrate',   name: 'Substrate',   type: 'color', default: [0.25, 0.23, 0.22, 1.0] }
  ]
};

export default {
  id: 'candy_paint',
  name: 'Candy Paint',
  category: 'Racing',
  description: 'Deep glossy candy-coat automotive paint with a saturated translucent hue over a dark metallic base.',
  shader: `

    // Convert hue [0-1] to RGB
    vec3 hue2rgb(float h) {
      h = fract(h);
      float r = abs(h * 6.0 - 3.0) - 1.0;
      float g = 2.0 - abs(h * 6.0 - 2.0);
      float b = 2.0 - abs(h * 6.0 - 4.0);
      return clamp(vec3(r, g, b), 0.0, 1.0);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Dark metallic flake base — micro noise sparkle
      float flake = noise(uv * 400.0);
      float flake2 = noise(uv * 600.0 + 1.3);
      float baseMetallic = 0.06 + 0.09 * flake * flake2;

      vec3 baseColor = vec3(baseMetallic);

      // Candy coat colour — saturated HSL from u_hue
      vec3 candyRGB = hue2rgb(u_hue);
      // Saturate: push to vivid by mixing toward pure hue
      vec3 candy = mix(vec3(0.0), candyRGB, u_depth * 0.6);

      // Simulate viewing-angle gloss gradient — centre vs edges of UV
      float cx = v_uv.x - 0.5;
      float cy = v_uv.y - 0.5;
      float radial = 1.0 - clamp(sqrt(cx * cx + cy * cy) * 1.8, 0.0, 1.0);
      float gloss = pow(radial, 1.5) * 0.55 + 0.2;

      // Slow-moving sheen ripple to simulate environment reflection
      float sheen = noise(uv * 3.0 + 1.5708);
      sheen = smoothstep(0.35, 0.75, sheen) * 0.18;

      // Layer: base + candy over-coat + gloss highlight
      vec3 col = baseColor + candy * u_depth * gloss;
      col += vec3(sheen) * candyRGB * 0.5 + vec3(sheen * 0.3);

      // White specular peak at centre
      float specPeak = pow(gloss, 6.0) * 0.5;
      col += vec3(specPeak);

      col = clamp(col, 0.0, 1.0);
      if (u_is_spec > 0.5) {
        // Candy coat: non-metallic clear coat, metallic only rises where flake sparkles
        float sparkle = flake * flake2;
        float metallic = mix(0.05, 0.3, sparkle);
        float roughness = clamp(0.15 - gloss * 0.1, 0.05, 0.15);
        return vec4(metallic, roughness, 0.0, u_opacity);
      }
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_hue',   name: 'Hue',   type: 'float', min: 0.0, max: 1.0,  default: 0.02 },
    { id: 'u_depth', name: 'Depth', type: 'float', min: 0.5, max: 3.0,  default: 1.5  }
  ]
};

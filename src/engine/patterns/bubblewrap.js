export default {
  id: 'bubblewrap',
  name: 'Bubble Wrap',
  category: 'Abstract',
  description: 'Air-filled plastic bubble wrap with hemispherical highlights, rim Fresnel, and clear film between bubbles.',
  shader: `
    // Offset hexagonal grid — bubbles in a brick layout for efficiency
    vec2 bubbleCell(vec2 uv, out vec2 cellId) {
      // Brick offset: every other row shifts by 0.5
      float row = floor(uv.y);
      float xOffset = mod(row, 2.0) * 0.5;
      vec2 shifted = vec2(uv.x + xOffset, uv.y);
      cellId = floor(shifted);
      return fract(shifted) - 0.5;
    }

    // Sphere highlight from a single light source
    float sphereHighlight(vec2 p, float r, vec2 lightDir) {
      float dist = length(p);
      if (dist > r) return 0.0;
      // Reconstruct Z on sphere surface
      float z = sqrt(max(0.0, r * r - dist * dist));
      vec3 normal = normalize(vec3(p, z));
      vec3 light  = normalize(vec3(lightDir, 1.5));
      float diff = max(0.0, dot(normal, light));
      return diff;
    }

    // Fresnel-like rim (brightest at grazing angle — edge of bubble)
    float rimFresnel(vec2 p, float r) {
      float dist = length(p);
      float rim = dist / r;
      return pow(clamp(rim, 0.0, 1.0), 3.0);
    }

    vec4 generate() {
      float scale = u_bubble_size;
      vec2 uv = v_uv * scale;

      vec2 cellId;
      vec2 local = bubbleCell(uv, cellId);

      // Bubble radius (leave ~15% for film between bubbles)
      float bubbleR = 0.40;
      float dist    = length(local);

      // Inside or outside bubble
      float inside   = 1.0 - smoothstep(bubbleR - 0.01, bubbleR + 0.01, dist);

      // Film colour (clear plastic, faint yellowish)
      vec3 film = u_film_color.rgb;

      // Bubble tint from sky/environment
      vec3 tint = u_tint.rgb;

      // Diffuse shading of the hemisphere — light from top-left
      float diff = sphereHighlight(local, bubbleR, vec2(-0.3, 0.5));
      diff = pow(diff, 0.7);

      // Sharp specular glint at top of bubble
      vec2  specCenter = vec2(-0.10, 0.12) * bubbleR;
      float specDist   = length(local - specCenter);
      float specGlint  = smoothstep(0.08, 0.0, specDist) * 0.95;

      // Secondary smaller glint
      vec2  spec2 = vec2(0.12, -0.08) * bubbleR;
      float spec2d = length(local - spec2);
      float specGlint2 = smoothstep(0.04, 0.0, spec2d) * 0.4;

      // Fresnel rim brightening at bubble edge
      float rim = rimFresnel(local, bubbleR) * inside;
      vec3 rimCol = mix(tint, vec3(1.0), 0.5);

      // Shadow at base of bubble (contact shadow on film)
      float shadow = 1.0 - smoothstep(0.36, bubbleR + 0.04, dist) * 0.4;

      // Compose bubble colour
      vec3 bubbleCol = mix(tint * 0.55, tint, diff);
      bubbleCol += specGlint + specGlint2;
      bubbleCol  = mix(bubbleCol, rimCol, rim * 0.6);
      bubbleCol  = clamp(bubbleCol, 0.0, 1.0);

      // Film between bubbles — slight shadow where bubbles press down
      vec3 filmCol = film * shadow;

      vec3 col = mix(filmCol, bubbleCol, inside);

      return vec4(clamp(col, 0.0, 1.0), 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_bubble_size', type: 'float', default: 14,  min: 4,  max: 30, label: 'Bubble Scale' },
    { name: 'u_film_color',  type: 'color', default: [0.88, 0.90, 0.82, 1.0], label: 'Plastic Film' },
    { name: 'u_tint',        type: 'color', default: [0.75, 0.85, 0.92, 1.0], label: 'Bubble Tint' }
  ]
};

export default {
  id: 'runestone_carving',
  name: 'Runestone Carving',
  category: 'Heritage',
  added: '2026-07-13',
  description: 'Weathered granite cut with bands of angular futhark runes — incised grooves with inner shadow and moss creeping into the recesses.',
  shader: `
    float segd(vec2 p, vec2 a, vec2 b) {
      vec2 pa = p - a;
      vec2 ba = b - a;
      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
      return length(pa - ba * h);
    }
    float runeDist(vec2 p, vec2 cell) {
      // vertical stem plus randomized angular branches — futhark style
      float d = segd(p, vec2(0.0, -0.42), vec2(0.0, 0.42));
      if (hash(cell + 1.3) < 0.55) d = min(d, segd(p, vec2(0.0, 0.42), vec2(0.26, 0.14)));
      if (hash(cell + 2.6) < 0.5)  d = min(d, segd(p, vec2(0.0, 0.42), vec2(-0.26, 0.14)));
      if (hash(cell + 3.9) < 0.5)  d = min(d, segd(p, vec2(0.0, 0.04), vec2(0.26, 0.30)));
      if (hash(cell + 5.2) < 0.5)  d = min(d, segd(p, vec2(0.0, 0.0), vec2(0.26, -0.30)));
      if (hash(cell + 6.5) < 0.35) d = min(d, segd(p, vec2(-0.24, 0.30), vec2(0.24, -0.30)));
      if (hash(cell + 7.8) < 0.35) d = min(d, segd(p, vec2(0.0, -0.42), vec2(-0.26, -0.14)));
      return d;
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float row = floor(uv.y);
      float fy = fract(uv.y) - 0.5;
      float gx = uv.x * 1.6 + hash(vec2(row, 3.3)) * 0.5;
      vec2 cell = vec2(floor(gx), row);
      vec2 p = vec2(fract(gx) - 0.5, fy * 1.9);
      // weathering wobbles the carved lines
      p += (vec2(noise(uv * 7.0), noise(uv * 7.0 + 31.0)) - 0.5) * 0.07 * u_weather;
      // granite base: fbm tone + mineral speckle + broad stains
      float gr = fbm(uv * 2.3);
      float speck = noise(uv * 18.0);
      vec3 stone = u_primary_color.rgb * (0.78 + 0.36 * gr);
      stone *= 0.9 + 0.18 * speck;
      stone *= 0.9 + 0.2 * fbm(uv * 0.7 + 5.0);
      // rune groove distances (skip some cells as spacing)
      float d = 10.0;
      if (hash(cell + 0.7) > 0.14) d = runeDist(p, cell);
      float d2 = 10.0;
      if (hash(cell + 0.7) > 0.14) d2 = runeDist(p + vec2(0.06, -0.06), cell);
      float w = 0.055;
      float carve = smoothstep(w + 0.03, w - 0.03, d);
      float carve2 = smoothstep(w + 0.03, w - 0.03, d2);
      float innerShadow = clamp(carve - carve2, 0.0, 1.0);
      float chipLight = clamp(carve2 - carve, 0.0, 1.0);
      // horizontal band guide grooves
      float dg = abs(abs(fy) - 0.31);
      float gcarve = smoothstep(0.035, 0.012, dg + (noise(uv * 6.0 + 13.0) - 0.5) * 0.02 * u_weather);
      vec3 col = stone;
      col = mix(col, u_secondary_color.rgb * (0.8 + 0.3 * gr), carve * 0.85);
      col = mix(col, u_secondary_color.rgb * 0.45, innerShadow * 0.6);
      col += vec3(0.9, 0.9, 0.85) * chipLight * 0.12;
      col = mix(col, u_secondary_color.rgb * (0.85 + 0.25 * gr), gcarve * 0.6);
      // moss tint pooling in recesses, faint bloom on the surface
      float mossField = smoothstep(0.52, 0.8, fbm(uv * 3.1 + 9.0)) * u_moss;
      col = mix(col, u_accent_color.rgb * (0.55 + 0.45 * gr), clamp(carve + gcarve * 0.5, 0.0, 1.0) * mossField * 0.9);
      col = mix(col, u_accent_color.rgb * (0.6 + 0.4 * speck), mossField * 0.08);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Rune Rows', type: 'float', min: 2.0, max: 12.0, default: 5.0 },
    { id: 'u_moss', name: 'Moss Growth', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_weather', name: 'Weathering', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Granite', type: 'color', default: [0.55, 0.55, 0.57, 1.0] },
    { id: 'u_secondary_color', name: 'Recess', type: 'color', default: [0.18, 0.18, 0.20, 1.0] },
    { id: 'u_accent_color', name: 'Moss', type: 'color', default: [0.36, 0.48, 0.24, 1.0] }
  ],
  variants: [
    { name: 'Mossy Granite', uniforms: { u_scale: 5.0, u_moss: 0.6, u_weather: 0.5, u_primary_color: [0.55, 0.55, 0.57, 1.0], u_secondary_color: [0.18, 0.18, 0.20, 1.0], u_accent_color: [0.36, 0.48, 0.24, 1.0] } },
    { name: 'Red Sandstone', uniforms: { u_scale: 4.0, u_moss: 0.35, u_weather: 0.75, u_primary_color: [0.60, 0.38, 0.30, 1.0], u_secondary_color: [0.25, 0.13, 0.10, 1.0], u_accent_color: [0.65, 0.66, 0.50, 1.0] } },
    { name: 'Black Monolith', uniforms: { u_scale: 6.0, u_moss: 0.45, u_weather: 0.3, u_primary_color: [0.16, 0.17, 0.19, 1.0], u_secondary_color: [0.05, 0.05, 0.06, 1.0], u_accent_color: [0.50, 0.60, 0.68, 1.0] } }
  ]
};

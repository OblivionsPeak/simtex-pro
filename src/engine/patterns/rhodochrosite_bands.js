export default {
  id: 'rhodochrosite_bands',
  name: 'Rhodochrosite Bands',
  category: 'Geology',
  added: '2026-06-12',
  description: 'Rose-pink rhodochrosite with scalloped white lace banding — stalactitic arcs of raspberry and cream stacked in wavy layers.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv;

      // Scalloped band coordinate: each layer drapes in repeating arcs,
      // like a polished stalactite cross-section
      float bandsY = uv.y * u_band_count;
      float row = floor(bandsY);
      float rh = hash(vec2(row, 11.3));

      // Arc scallops: abs(sin) cusps with per-row phase and width
      float scallop = abs(sin(uv.x * u_scallop_freq * 3.14159 + rh * 6.28318));
      scallop = pow(scallop, 0.6) * u_scallop_depth * 0.6;

      // Slow geological waviness on top
      float drift = fbm(vec2(uv.x * 2.0, row * 0.7)) * 0.35;

      float t = fract(bandsY + scallop + drift);
      float layerId = floor(bandsY + scallop + drift);
      float lh = hash(vec2(layerId, 3.9));

      // --- Palette: deep raspberry -> rose pink -> cream lace ---
      vec3 deep  = u_pink_color.rgb * vec3(0.55, 0.28, 0.38);
      vec3 rose  = u_pink_color.rgb;
      vec3 cream = vec3(0.97, 0.93, 0.88);

      // Band profile: broad pink body with a crisp cream lace line on top
      float body = smoothstep(0.0, 0.35, t) * smoothstep(1.0, 0.6, t);
      vec3 col = mix(deep, rose, body);

      // Cream lace band — thin, bright, slightly varying thickness per layer
      float laceW = 0.05 + lh * 0.06;
      float lace = smoothstep(laceW, laceW * 0.3, abs(t - 0.5)) * step(0.35, lh);
      col = mix(col, cream, lace * 0.9);

      // Secondary hairline lace
      float hair = smoothstep(0.015, 0.005, abs(t - 0.82)) * step(0.6, fract(lh * 3.7));
      col = mix(col, cream * 0.95, hair * 0.7);

      // Per-layer tonal shift (some layers darker, more manganese-rich)
      col *= 0.86 + lh * 0.24;

      // Translucent depth: cloudiness inside the pink bands
      float cloud = fbm(uv * vec2(7.0, 18.0)) * 0.5 + 0.5;
      col = mix(col, col * vec3(1.05, 0.92, 0.95), cloud * 0.3 * body);

      // Fine crystalline grain following the banding
      float grain = noise(vec2(uv.x * 240.0, t * 30.0 + layerId * 9.0));
      col *= 0.95 + grain * 0.08;

      // Soft polish sheen
      float gloss = pow(clamp(1.0 - abs(uv.x + uv.y * 0.4 - 0.65) * 1.9, 0.0, 1.0), 4.0);
      col += gloss * 0.07;

      col += (hash(uv * 700.0) - 0.5) * 0.015;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_band_count',    name: 'Band Count',     type: 'float', min: 3.0, max: 25.0, default: 9.0 },
    { id: 'u_scallop_freq',  name: 'Scallop Count',  type: 'float', min: 1.0, max: 12.0, default: 4.0 },
    { id: 'u_scallop_depth', name: 'Scallop Depth',  type: 'float', min: 0.0, max: 1.0,  default: 0.5 },
    { id: 'u_pink_color',    name: 'Rose Pink',      type: 'color', default: [0.92, 0.45, 0.55, 1.0] }
  ]
};

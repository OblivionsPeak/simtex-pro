export default {
  id: 'city_streets_map',
  name: 'City Streets Map',
  category: 'Technology',
  added: '2026-07-07',
  description: 'Aerial street map — irregular blocks, minor lanes, and bold arterial roads.',
  shader: `
    float roadLine(float x, float jitterSeed, float w) {
      float cell = floor(x);
      float off = hash(vec2(cell, jitterSeed)) * 0.5 - 0.25;
      return smoothstep(w, w * 0.5, abs(fract(x) - 0.5 - off));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // block fill with per-block tone
      vec2 blockCell = floor(uv);
      vec4 col = u_secondary_color;
      col.rgb *= 0.94 + 0.06 * hash(blockCell + 0.4);
      // minor street grid, jittered per row/column
      float minor = max(roadLine(uv.x, 3.1, u_road), roadLine(uv.y, 8.7, u_road));
      // arterial roads: sparser, wider
      float major = max(roadLine(uv.x * 0.25, 12.3, u_road * 0.7), roadLine(uv.y * 0.25, 17.9, u_road * 0.7));
      // one diagonal avenue
      float diag = smoothstep(u_road * 0.9, u_road * 0.4, abs(fract((uv.x + uv.y) * 0.12) - 0.5));
      col.rgb = mix(col.rgb, u_primary_color.rgb, minor);
      col.rgb = mix(col.rgb, u_primary_color.rgb, major);
      col.rgb = mix(col.rgb, u_accent_color.rgb, max(major * u_highlight, diag * u_highlight));
      // park blocks
      float park = step(0.92, hash(blockCell + 6.6));
      col.rgb = mix(col.rgb, u_park_color.rgb, park * (1.0 - minor) * (1.0 - major) * (1.0 - diag));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Block Density', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_road', name: 'Street Width', type: 'float', min: 0.02, max: 0.2, default: 0.07 },
    { id: 'u_highlight', name: 'Arterial Tint', type: 'float', min: 0.0, max: 1.0, default: 0.6 },
    { id: 'u_secondary_color', name: 'Blocks', type: 'color', default: [0.9, 0.88, 0.84, 1.0] },
    { id: 'u_primary_color', name: 'Streets', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_accent_color', name: 'Arterials', type: 'color', default: [0.98, 0.8, 0.35, 1.0] },
    { id: 'u_park_color', name: 'Parks', type: 'color', default: [0.7, 0.85, 0.65, 1.0] }
  ],
  variants: [
    { name: 'Paper Atlas', uniforms: { u_secondary_color: [0.9, 0.88, 0.84, 1.0], u_primary_color: [1.0, 1.0, 1.0, 1.0], u_accent_color: [0.98, 0.8, 0.35, 1.0], u_park_color: [0.7, 0.85, 0.65, 1.0], u_highlight: 0.6 } },
    { name: 'Night Nav', uniforms: { u_secondary_color: [0.07, 0.08, 0.11, 1.0], u_primary_color: [0.25, 0.28, 0.35, 1.0], u_accent_color: [0.2, 0.7, 0.95, 1.0], u_park_color: [0.08, 0.14, 0.1, 1.0], u_highlight: 0.9 } },
    { name: 'Blueprint City', uniforms: { u_secondary_color: [0.08, 0.2, 0.42, 1.0], u_primary_color: [0.75, 0.85, 0.95, 1.0], u_accent_color: [1.0, 1.0, 1.0, 1.0], u_park_color: [0.1, 0.28, 0.4, 1.0], u_highlight: 0.8 } }
  ]
};

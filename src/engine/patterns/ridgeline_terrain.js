export default {
  id: 'ridgeline_terrain',
  name: 'Ridgeline Terrain',
  category: 'Technology',
  added: '2026-07-07',
  description: 'Stacked mountain ridgelines — the Unknown Pleasures wireframe landscape, row after row.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float rows = u_scale;
      vec4 col = u_secondary_color;
      // walk a few rows from front (below) to back so front lines occlude
      float y = uv.y;
      float bestGlow = 0.0;
      float occluded = 0.0;
      for (int k = 0; k < 6; k++) {
        float row = floor(y) - float(k);
        // ridge height for this row at this x
        float h = fbm(vec2(uv.x * 0.6, row * 13.7)) * 0.5 + 0.5;
        h *= u_peak * smoothstep(0.0, 0.2, abs(sin(uv.x * 0.23 + row)));
        float lineY = row + 0.15 + h;
        float d = y - lineY;
        float line = smoothstep(u_width, u_width * 0.3, abs(d)) * step(occluded, 0.5);
        bestGlow = max(bestGlow, line);
        if (d < -0.02) occluded = 1.0; // we are inside this row's silhouette
      }
      col.rgb = mix(col.rgb, u_primary_color.rgb, bestGlow);
      // soft glow around lines
      col.rgb += u_primary_color.rgb * bestGlow * bestGlow * 0.4;
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Row Density', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_peak', name: 'Peak Height', type: 'float', min: 0.2, max: 2.5, default: 1.1 },
    { id: 'u_width', name: 'Line Weight', type: 'float', min: 0.01, max: 0.12, default: 0.035 },
    { id: 'u_primary_color', name: 'Ridge Line', type: 'color', default: [0.95, 0.95, 0.97, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.04, 0.04, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Pulsar', uniforms: { u_primary_color: [0.95, 0.95, 0.97, 1.0], u_secondary_color: [0.04, 0.04, 0.05, 1.0], u_peak: 1.1 } },
    { name: 'Synth Sunset', uniforms: { u_primary_color: [1.0, 0.35, 0.55, 1.0], u_secondary_color: [0.08, 0.02, 0.12, 1.0], u_peak: 1.6 } },
    { name: 'Radar Green', uniforms: { u_primary_color: [0.2, 0.95, 0.4, 1.0], u_secondary_color: [0.01, 0.06, 0.02, 1.0], u_peak: 0.8 } }
  ]
};

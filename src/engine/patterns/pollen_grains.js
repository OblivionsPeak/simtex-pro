export default {
  id: 'pollen_grains',
  name: 'Pollen Grains',
  category: 'Organic',
  added: '2026-07-07',
  description: 'Electron-microscope pollen — spiked spheres with dimpled surfaces in false color.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec4 col = u_secondary_color;
      col.rgb *= 0.9 + 0.1 * fbm(uv * 2.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.5) < 0.3) continue;
          vec2 ctr = cell + 0.5 + (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.4;
          vec2 rel = uv - ctr;
          float r = length(rel);
          float ang = atan(rel.y, rel.x);
          float size = 0.24 + hash(cell + 3.3) * 0.14;
          // spike ring: triangular teeth around the rim
          float spikes = 10.0 + floor(hash(cell + 4.4) * 8.0);
          float tooth = abs(fract(ang * spikes / 6.28318) - 0.5) * 2.0;
          float rim = size * (1.0 + u_spikes * 0.28 * (1.0 - tooth));
          float body = smoothstep(rim, rim - 0.03, r);
          if (body > 0.001) {
            // sphere shading
            float nz = sqrt(max(1.0 - (r / size) * (r / size), 0.0));
            vec3 c = mix(u_primary_color.rgb * 0.5, u_primary_color.rgb, nz);
            // dimpled exine surface: hex-ish dot lattice
            vec2 dp = rel * (16.0 / size) * 0.2;
            dp.x += step(1.0, mod(floor(dp.y), 2.0)) * 0.5;
            float dimple = smoothstep(0.32, 0.18, length(fract(dp) - 0.5));
            c *= 1.0 - dimple * 0.3 * nz;
            // aperture furrow
            float furrow = smoothstep(0.14, 0.0, abs(ang - hash(cell + 6.0) * 6.28 + 3.14)) * smoothstep(size, size * 0.3, r);
            c *= 1.0 - furrow * 0.4;
            // SEM edge glow
            c += u_accent_color.rgb * pow(1.0 - nz, 2.5) * u_glow;
            col.rgb = mix(col.rgb, c, body);
          }
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Density', type: 'float', min: 2.0, max: 10.0, default: 4.0 },
    { id: 'u_spikes', name: 'Spikiness', type: 'float', min: 0.0, max: 1.0, default: 0.7 },
    { id: 'u_glow', name: 'Edge Glow', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_primary_color', name: 'Grain', type: 'color', default: [0.85, 0.7, 0.25, 1.0] },
    { id: 'u_accent_color', name: 'Rim Light', type: 'color', default: [0.95, 0.9, 0.6, 1.0] },
    { id: 'u_secondary_color', name: 'Backdrop', type: 'color', default: [0.1, 0.09, 0.07, 1.0] }
  ],
  variants: [
    { name: 'Golden SEM', uniforms: { u_primary_color: [0.85, 0.7, 0.25, 1.0], u_accent_color: [0.95, 0.9, 0.6, 1.0], u_secondary_color: [0.1, 0.09, 0.07, 1.0], u_spikes: 0.7 } },
    { name: 'False Teal', uniforms: { u_primary_color: [0.2, 0.65, 0.65, 1.0], u_accent_color: [0.6, 0.95, 0.9, 1.0], u_secondary_color: [0.04, 0.08, 0.1, 1.0], u_spikes: 0.9 } },
    { name: 'Rose Micro', uniforms: { u_primary_color: [0.85, 0.45, 0.55, 1.0], u_accent_color: [1.0, 0.8, 0.85, 1.0], u_secondary_color: [0.12, 0.06, 0.09, 1.0], u_spikes: 0.4 } }
  ]
};

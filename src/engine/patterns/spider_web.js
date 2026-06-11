export default {
  id: 'spider_web_artisan',
  name: 'Silk Web',
  category: 'Natural',
  description: 'Radial-concentric silk networks found in professional predatory arachnid structures.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float angle = atan(uv.y, uv.x);
      float spoke_t = fract(angle * u_spokes / 6.28318530718);

      // 1.0 mid-span between spokes, 0.0 on a spoke — drives the ring sag
      float midspan = 1.0 - abs(spoke_t - 0.5) * 2.0;
      float sagged = d * (1.0 + u_sag * midspan * 0.12);

      float aa = 0.008;
      float rw = 0.02 * u_thickness;
      float cw = 0.05 * u_thickness;
      float radial = smoothstep(1.0 - rw - aa, 1.0 - rw + aa, spoke_t);
      float concentric = smoothstep(1.0 - cw - aa, 1.0 - cw + aa, fract(sagged * u_rings));

      vec4 color = mix(u_secondary_color, u_primary_color, clamp(radial, 0.0, 1.0));
      color = mix(color, u_accent_color, clamp(concentric * (1.0 - radial), 0.0, 1.0));
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.9, 0.9, 1.0, 1.0],
        u_accent_color: [0.9, 0.9, 1.0, 1.0],
        u_secondary_color: [0.0, 0.0, 0.0, 1.0],
        u_spokes: 8.0,
        u_rings: 10.0,
        u_thickness: 1.0,
        u_sag: 0.0
      }
    },
    {
      name: 'Widow\'s Lair',
      uniforms: {
        u_primary_color: [0.85, 0.85, 0.85, 1.0],
        u_accent_color: [0.8, 0.1, 0.1, 1.0],
        u_secondary_color: [0.03, 0.02, 0.02, 1.0],
        u_spokes: 12.0,
        u_rings: 12.0,
        u_thickness: 1.0,
        u_sag: 0.6
      }
    },
    {
      name: 'Frost Web',
      uniforms: {
        u_primary_color: [0.8, 0.92, 1.0, 1.0],
        u_accent_color: [0.55, 0.75, 0.95, 1.0],
        u_secondary_color: [0.02, 0.05, 0.12, 1.0],
        u_spokes: 8.0,
        u_rings: 14.0,
        u_thickness: 0.8,
        u_sag: 0.2
      }
    },
    {
      name: 'Halloween',
      uniforms: {
        u_primary_color: [1.0, 0.55, 0.1, 1.0],
        u_accent_color: [1.0, 0.8, 0.2, 1.0],
        u_secondary_color: [0.05, 0.0, 0.08, 1.0],
        u_spokes: 10.0,
        u_rings: 9.0,
        u_thickness: 1.4,
        u_sag: 0.45
      }
    }
  ],
  uniforms: [
    { id: 'u_spokes', name: 'Spoke Count', type: 'float', min: 3.0, max: 24.0, default: 8.0 },
    { id: 'u_rings', name: 'Ring Count', type: 'float', min: 2.0, max: 30.0, default: 10.0 },
    { id: 'u_thickness', name: 'Strand Thickness', type: 'float', min: 0.3, max: 3.0, default: 1.0 },
    { id: 'u_sag', name: 'Silk Sag', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_primary_color', name: 'Silk Strand', type: 'color', default: [0.9, 0.9, 1.0, 1.0] },
    { id: 'u_accent_color', name: 'Ring Silk', type: 'color', default: [0.9, 0.9, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Void Backdrop', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

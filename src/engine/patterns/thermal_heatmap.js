export default {
  id: 'thermal_heatmap',
  name: 'Thermal Heatmap',
  category: 'Technology',
  added: '2026-07-07',
  description: 'Infrared camera view — iron-bow palette blobs from cold shadow to white-hot core.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      float t = fbm(uv * 0.6) * 0.5 + 0.5;
      t = clamp((t - 0.5) * u_contrast + 0.5 + u_heat - 0.5, 0.0, 1.0);
      // optional posterized isotherm bands
      float bands = mix(t, floor(t * 8.0) / 8.0, u_bands);
      // iron-bow ramp: cold -> mid -> hot -> white
      vec3 c;
      float x = bands;
      if (x < 0.35) c = mix(u_secondary_color.rgb, u_primary_color.rgb, x / 0.35);
      else if (x < 0.7) c = mix(u_primary_color.rgb, u_accent_color.rgb, (x - 0.35) / 0.35);
      else c = mix(u_accent_color.rgb, vec3(1.0), (x - 0.7) / 0.3);
      // isotherm contour lines when banded
      float line = smoothstep(0.06, 0.0, abs(fract(t * 8.0) - 0.5) - 0.42) * u_bands;
      c *= 1.0 - line * 0.35;
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Blob Scale', type: 'float', min: 1.0, max: 12.0, default: 4.0 },
    { id: 'u_heat', name: 'Overall Heat', type: 'float', min: 0.0, max: 1.0, default: 0.5 },
    { id: 'u_contrast', name: 'Contrast', type: 'float', min: 0.4, max: 3.0, default: 1.4 },
    { id: 'u_bands', name: 'Isotherm Bands', type: 'float', min: 0.0, max: 1.0, default: 0.0 },
    { id: 'u_secondary_color', name: 'Cold', type: 'color', default: [0.02, 0.0, 0.1, 1.0] },
    { id: 'u_primary_color', name: 'Warm', type: 'color', default: [0.6, 0.05, 0.45, 1.0] },
    { id: 'u_accent_color', name: 'Hot', type: 'color', default: [1.0, 0.55, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Iron Bow', uniforms: { u_secondary_color: [0.02, 0.0, 0.1, 1.0], u_primary_color: [0.6, 0.05, 0.45, 1.0], u_accent_color: [1.0, 0.55, 0.05, 1.0], u_bands: 0.0, u_heat: 0.5 } },
    { name: 'Rainbow IR', uniforms: { u_secondary_color: [0.05, 0.05, 0.4, 1.0], u_primary_color: [0.05, 0.6, 0.3, 1.0], u_accent_color: [0.95, 0.85, 0.1, 1.0], u_bands: 0.6, u_heat: 0.5 } },
    { name: 'Tire Temps', uniforms: { u_secondary_color: [0.03, 0.1, 0.25, 1.0], u_primary_color: [0.15, 0.55, 0.25, 1.0], u_accent_color: [0.9, 0.2, 0.08, 1.0], u_bands: 1.0, u_heat: 0.6 } }
  ]
};

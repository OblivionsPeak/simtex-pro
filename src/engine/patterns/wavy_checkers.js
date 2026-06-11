export default {
  id: 'wavy_checkers_artisan',
  name: 'Wavy Checkers',
  category: 'Racing',
  description: 'Flowing, distorted racing flags mimicking a waving checkered banner.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      uv.x += sin(uv.y * u_wave_freq) * u_wave_amp;
      uv.y += cos(uv.x * u_wave_freq * 0.6667) * u_wave_amp * 0.5;

      // Anti-aliased checker via soft-XOR of triangle waves
      float s = max(u_softness, 0.0005);
      float tx = abs(fract((uv.x + 0.5) * 0.5) * 2.0 - 1.0);
      float ty = abs(fract((uv.y + 0.5) * 0.5) * 2.0 - 1.0);
      float mx = smoothstep(0.5 - s, 0.5 + s, tx);
      float my = smoothstep(0.5 - s, 0.5 + s, ty);
      float mask = mx + my - 2.0 * mx * my;
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [1.0, 1.0, 1.0, 1.0],
        u_secondary_color: [0.0, 0.0, 0.0, 1.0],
        u_wave_freq: 3.0,
        u_wave_amp: 0.2
      }
    },
    {
      name: 'Victory Gold',
      uniforms: {
        u_primary_color: [0.95, 0.78, 0.2, 1.0],
        u_secondary_color: [0.07, 0.06, 0.05, 1.0],
        u_wave_freq: 3.0,
        u_wave_amp: 0.35
      }
    },
    {
      name: 'Ocean Flag',
      uniforms: {
        u_primary_color: [0.92, 0.95, 0.97, 1.0],
        u_secondary_color: [0.05, 0.12, 0.3, 1.0],
        u_wave_freq: 4.5,
        u_wave_amp: 0.15
      }
    },
    {
      name: 'Heat Shimmer',
      uniforms: {
        u_primary_color: [0.9, 0.2, 0.08, 1.0],
        u_secondary_color: [0.1, 0.02, 0.02, 1.0],
        u_wave_freq: 6.0,
        u_wave_amp: 0.3,
        u_softness: 0.05
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Check Size', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_wave_freq', name: 'Wave Frequency', type: 'float', min: 0.0, max: 10.0, default: 3.0 },
    { id: 'u_wave_amp', name: 'Wave Amplitude', type: 'float', min: 0.0, max: 0.8, default: 0.2 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.2, default: 0.015 },
    { id: 'u_primary_color', name: 'Checker A', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Checker B', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

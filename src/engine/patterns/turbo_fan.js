export default {
  id: 'turbo_fan_artisan',
  name: 'Turbo Turbine',
  category: 'Technology',
  description: 'Radial blades of a high-boost turbocharger compressor wheel.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float angle = atan(uv.y, uv.x);
      float blades = sin(angle * u_blades);
      float mask = smoothstep(-0.5, 0.5, blades);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_blades', name: 'Blade Count', type: 'float', min: 6.0, max: 24.0, default: 12.0 },
    { id: 'u_primary_color', name: 'Blade Top', type: 'color', default: [0.9, 0.92, 0.95, 1.0] },
    { id: 'u_secondary_color', name: 'Blade Void', type: 'color', default: [0.1, 0.1, 0.15, 1.0] }
  ]
};

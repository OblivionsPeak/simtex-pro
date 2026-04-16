export default {
  id: 'snake_skin_v2_artisan',
  name: 'Viper Scales',
  category: 'Nature',
  description: 'Interlocking diamond scales found in aggressive predatory reptilian hide.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = abs(gv.x) + abs(gv.y);
      float mask = smoothstep(0.48, 0.46, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Zoom', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Dorsal Scale', type: 'color', default: [0.1, 0.2, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Inter-scale', type: 'color', default: [0.0, 0.0, 0.0, 1.0] }
  ]
};

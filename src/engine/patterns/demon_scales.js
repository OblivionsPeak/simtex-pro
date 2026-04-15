export default {
  id: 'demon_scales_artisan',
  name: 'Demon Scales',
  category: 'Natural',
  description: 'Overlapping pointed organic scales with depth found in mythical beast armor.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.3));
      float mask = smoothstep(0.4, 0.38, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Size', type: 'float', min: 5.0, max: 30.0, default: 15.0 },
    { id: 'u_primary_color', name: 'Scale Top', type: 'color', default: [0.3, 0.0, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Under Scale', type: 'color', default: [0.1, 0.0, 0.0, 1.0] }
  ]
};

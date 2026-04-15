export default {
  id: 'fish_scales_artisan',
  name: 'Fish Scales',
  category: 'Natural',
  description: 'Round, thin overlapping semi-circles found in aquatic life and reflective armor.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 1.0));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scale Density', type: 'float', min: 5.0, max: 30.0, default: 15.0 },
    { id: 'u_primary_color', name: 'Scale Body', type: 'color', default: [0.4, 0.6, 0.7, 0.8] },
    { id: 'u_secondary_color', name: 'Joint Shadow', type: 'color', default: [0.1, 0.2, 0.3, 1.0] }
  ]
};

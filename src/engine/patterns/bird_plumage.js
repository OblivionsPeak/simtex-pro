export default {
  id: 'bird_plumage_artisan',
  name: 'Bird Plumage',
  category: 'Natural',
  description: 'Soft, overlapping organic feather vane shapes found in avian wings.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv);
      float d = length(gv - vec2(0.5, 0.8));
      float mask = smoothstep(0.5, 0.45, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Feather Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Feather Vane', type: 'color', default: [0.1, 0.1, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Shaft', type: 'color', default: [0.05, 0.05, 0.05, 1.0] }
  ]
};

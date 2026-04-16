export default {
  id: 'energy_shield_artisan',
  name: 'Phase Shield',
  category: 'Abstract',
  description: 'Hexagonal-linked energy barrier pattern with high-frequency interference patterns.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(gv);
      float mask = smoothstep(0.48, 0.5, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Shield Zoom', type: 'float', min: 10.0, max: 100.0, default: 40.0 },
    { id: 'u_primary_color', name: 'Ion Glow', type: 'color', default: [0.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Hardlight Base', type: 'color', default: [0.0, 0.1, 0.2, 1.0] }
  ]
};

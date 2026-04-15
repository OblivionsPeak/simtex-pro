export default {
  id: 'dragon_plate_artisan',
  name: 'Dragon Plate',
  category: 'Natural',
  description: 'Thick, overlapping pointed armor-like scales with depth found in mythical creature hide.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      if (mod(floor(uv.y), 2.0) == 0.0) uv.x += 0.5;
      vec2 gv = fract(uv) - 0.5;
      float d = length(vec2(gv.x, gv.y + 0.4));
      float mask = smoothstep(0.5, 0.48, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Plate Size', type: 'float', min: 5.0, max: 25.0, default: 12.0 },
    { id: 'u_primary_color', name: 'Plate Top', type: 'color', default: [0.3, 0.0, 0.1, 1.0] },
    { id: 'u_secondary_color', name: 'Under Rim', type: 'color', default: [0.1, 0.0, 0.0, 1.0] }
  ]
};

export default {
  id: 'truchet_tiles_artisan',
  name: 'Truchet Arc',
  category: 'Abstract',
  description: 'Interlocking arc-based tiles mimicking complex organic circuitry and decorative pavement.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 i_uv = floor(uv);
      vec2 f_uv = fract(uv);
      if (hash(i_uv) > 0.5) f_uv.x = 1.0 - f_uv.x;
      float d = abs(length(f_uv) - 0.5);
      float mask = smoothstep(0.02, 0.0, d);
      return mix(u_secondary_color, u_primary_color, mask);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Tile Zoom', type: 'float', min: 2.0, max: 20.0, default: 10.0 },
    { id: 'u_primary_color', name: 'Arc Ribbon', type: 'color', default: [1.0, 0.4, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Tile Depth', type: 'color', default: [0.1, 0.1, 0.15, 1.0] }
  ]
};

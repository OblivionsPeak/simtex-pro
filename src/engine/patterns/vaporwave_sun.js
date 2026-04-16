export default {
  id: 'vaporwave_sun_artisan',
  name: 'Retro Sun',
  category: 'Abstract',
  description: 'Segmented radial retro sun patterns found in 80s synthwave and vaporwave aesthetics.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv - 0.5;
      float d = length(uv);
      float mask = step(d, 0.4);
      float stripes = step(0.1, fract(v_uv.y * 10.0));
      return mix(u_secondary_color, u_primary_color, mask * stripes);
    }
  `,
  uniforms: [
    { id: 'u_primary_color', name: 'Sun Core', type: 'color', default: [1.0, 0.6, 0.0, 1.0] },
    { id: 'u_secondary_color', name: 'Atmosphere', type: 'color', default: [1.0, 0.0, 0.5, 1.0] }
  ]
};

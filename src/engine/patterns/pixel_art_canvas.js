export default {
  id: 'pixel_art_canvas_artisan',
  name: 'Pixel Grid',
  category: 'Abstract',
  description: 'Large-block quantized color grid mimicking retro 8-bit digital canvases.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    vec4 generate() {
      vec2 uv = floor(v_uv * u_scale);
      float n = hash(uv);
      return mix(u_secondary_color, u_primary_color, n);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pixel Size', type: 'float', min: 8.0, max: 128.0, default: 32.0 },
    { id: 'u_primary_color', name: 'Pixel High', type: 'color', default: [1.0, 1.0, 1.0, 1.0] },
    { id: 'u_secondary_color', name: 'Pixel Dark', type: 'color', default: [0.5, 0.5, 0.5, 1.0] }
  ]
};

export default {
  id: 'louis_check_artisan',
  name: 'Louis Check',
  category: 'Abstract',
  description: 'Luxury designer-style checkered leather pattern with premium soft shading.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;

      // Anti-aliased checker via soft-XOR of triangle waves
      float s = max(u_softness, 0.0005);
      float tx = abs(fract((uv.x + 0.5) * 0.5) * 2.0 - 1.0);
      float ty = abs(fract((uv.y + 0.5) * 0.5) * 2.0 - 1.0);
      float mx = smoothstep(0.5 - s, 0.5 + s, tx);
      float my = smoothstep(0.5 - s, 0.5 + s, ty);
      float mask = mx + my - 2.0 * mx * my;

      float edge = smoothstep(0.45, 0.5, abs(fract(uv.x) - 0.5)) + smoothstep(0.45, 0.5, abs(fract(uv.y) - 0.5));
      vec4 color = mix(u_secondary_color, u_primary_color, mask + edge * u_edge_shade);

      // Optional fine leather grain
      color.rgb += (noise(uv * 18.0) - 0.5) * u_grain;
      return color;
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_primary_color: [0.3, 0.2, 0.15, 1.0],
        u_secondary_color: [0.6, 0.45, 0.35, 1.0],
        u_edge_shade: 0.2,
        u_grain: 0.0
      }
    },
    {
      name: 'Noir Damier',
      uniforms: {
        u_primary_color: [0.05, 0.05, 0.06, 1.0],
        u_secondary_color: [0.22, 0.22, 0.24, 1.0],
        u_edge_shade: 0.25,
        u_grain: 0.1
      }
    },
    {
      name: 'Burgundy Lux',
      uniforms: {
        u_primary_color: [0.3, 0.06, 0.1, 1.0],
        u_secondary_color: [0.55, 0.2, 0.22, 1.0],
        u_edge_shade: 0.2,
        u_grain: 0.12
      }
    },
    {
      name: 'Cream Canvas',
      uniforms: {
        u_primary_color: [0.78, 0.7, 0.58, 1.0],
        u_secondary_color: [0.92, 0.87, 0.76, 1.0],
        u_edge_shade: 0.3,
        u_grain: 0.06
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Check Zoom', type: 'float', min: 2.0, max: 20.0, default: 8.0 },
    { id: 'u_softness', name: 'Edge Softness', type: 'float', min: 0.0, max: 0.1, default: 0.01 },
    { id: 'u_edge_shade', name: 'Edge Shading', type: 'float', min: 0.0, max: 0.6, default: 0.2 },
    { id: 'u_grain', name: 'Leather Grain', type: 'float', min: 0.0, max: 0.4, default: 0.0 },
    { id: 'u_primary_color', name: 'Leather Dark', type: 'color', default: [0.3, 0.2, 0.15, 1.0] },
    { id: 'u_secondary_color', name: 'Leather Tan', type: 'color', default: [0.6, 0.45, 0.35, 1.0] }
  ]
};

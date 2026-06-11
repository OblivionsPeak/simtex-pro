export default {
  id: 'low_poly_facets',
  name: 'Low-Poly Facets',
  category: 'Geometric',
  description: 'Triangulated low-poly mosaic with flat per-face shading: hash-jittered facet brightness over a large-scale lighting gradient so the surface reads like a faceted 3D render.',
  shader: `

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 g = floor(uv);
      vec2 f = fract(uv);

      // Each square cell splits along a hash-chosen diagonal into two triangles
      float flip = step(0.5, hash(g + 5.31));
      float dCoord = mix(f.x + f.y - 1.0, f.x - f.y, flip);
      float side = step(0.0, dCoord);

      float faceHash = hash(g * 1.37 + side * 19.7 + flip * 7.3);

      // Large-scale "lighting" gradient so the mosaic reads as a lit surface
      float light = dot(v_uv - 0.5, vec2(0.55, 0.85)) + 0.5;
      light += snoise(v_uv * 2.2 + 8.8) * 0.12;
      float shade = clamp(light + (faceHash - 0.5) * u_contrast, 0.0, 1.0);

      vec4 color = mix(u_color_a, u_color_b, shade);

      // Thin facet borders: cell edges plus the splitting diagonal
      float diag = abs(dCoord) * 0.70710678;
      float edge = min(min(f.x, 1.0 - f.x), min(f.y, 1.0 - f.y));
      edge = min(edge, diag);
      float line = 1.0 - smoothstep(0.012, 0.032, edge);
      color.rgb *= 1.0 - line * u_border * 0.6;

      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Ice',
      uniforms: {
        u_color_a: [0.25, 0.38, 0.55, 1.0],
        u_color_b: [0.92, 0.97, 1.00, 1.0]
      }
    },
    {
      name: 'Gunmetal',
      uniforms: {
        u_color_a: [0.09, 0.10, 0.12, 1.0],
        u_color_b: [0.48, 0.51, 0.56, 1.0]
      }
    },
    {
      name: 'Sunset',
      uniforms: {
        u_color_a: [0.45, 0.08, 0.25, 1.0],
        u_color_b: [1.00, 0.62, 0.20, 1.0]
      }
    },
    {
      name: 'Emerald',
      uniforms: {
        u_color_a: [0.02, 0.18, 0.10, 1.0],
        u_color_b: [0.25, 0.85, 0.50, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Facet Scale', type: 'float', min: 3.0, max: 30.0, default: 9.0 },
    { id: 'u_contrast', name: 'Shading Contrast', type: 'float', min: 0.0, max: 1.0, default: 0.55 },
    { id: 'u_border', name: 'Border Strength', type: 'float', min: 0.0, max: 1.0, default: 0.35 },
    { id: 'u_color_a', name: 'Shadow Color', type: 'color', default: [0.25, 0.38, 0.55, 1.0] },
    { id: 'u_color_b', name: 'Highlight Color', type: 'color', default: [0.92, 0.97, 1.0, 1.0] }
  ]
};

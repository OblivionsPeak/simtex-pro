export default {
  id: 'tooled_leather',
  name: 'Tooled Leather',
  category: 'Textile',
  added: '2026-07-07',
  description: 'Western saddle leather — carved scroll lines embossed into a stained hide with stamp shading.',
  shader: `
    float scroll(vec2 p, float seed) {
      // spiral arcs: distance to an archimedean spiral around the cell center
      float r = length(p);
      float ang = atan(p.y, p.x) + seed * 6.28;
      float spiral = abs(fract((r * 3.0 - ang / 6.28318)) - 0.5);
      return smoothstep(0.09, 0.03, spiral) * smoothstep(0.52, 0.42, r);
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // leather base with grain
      vec4 col = u_primary_color;
      col.rgb *= 0.9 + 0.1 * fbm(uv * 5.0);
      col.rgb *= 0.94 + 0.06 * snoise(uv * 20.0);
      // carved scroll motif per cell, alternating orientation
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      float flip = mix(1.0, -1.0, mod(cell.x + cell.y, 2.0));
      float carve = scroll(vec2(f.x * flip, f.y), hash(cell));
      // emboss: dark carve line + light catch above it
      float carveUp = scroll(vec2(f.x * flip, f.y - 0.02), hash(cell));
      col.rgb = mix(col.rgb, u_secondary_color.rgb, carve * u_depth);
      col.rgb += vec3(0.1, 0.07, 0.04) * clamp(carveUp - carve, 0.0, 1.0) * u_depth;
      // background stamp: dotted texture between scrolls
      float stampD = length(fract(uv * 7.0) - 0.5);
      float stamp = smoothstep(0.2, 0.12, stampD) * (1.0 - carve) * smoothstep(0.42, 0.52, length(f));
      col.rgb *= 1.0 - stamp * 0.25 * u_depth;
      // aged patina toward the borders of each cell
      col.rgb = mix(col.rgb, col.rgb * 0.8, smoothstep(0.3, 0.5, max(abs(f.x), abs(f.y))) * 0.5);
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Motif Density', type: 'float', min: 2.0, max: 12.0, default: 4.0 },
    { id: 'u_depth', name: 'Carve Depth', type: 'float', min: 0.2, max: 1.0, default: 0.75 },
    { id: 'u_primary_color', name: 'Leather', type: 'color', default: [0.55, 0.35, 0.18, 1.0] },
    { id: 'u_secondary_color', name: 'Carve Stain', type: 'color', default: [0.2, 0.11, 0.05, 1.0] }
  ],
  variants: [
    { name: 'Saddle Tan', uniforms: { u_primary_color: [0.55, 0.35, 0.18, 1.0], u_secondary_color: [0.2, 0.11, 0.05, 1.0], u_depth: 0.75 } },
    { name: 'Oxblood', uniforms: { u_primary_color: [0.4, 0.15, 0.12, 1.0], u_secondary_color: [0.14, 0.05, 0.04, 1.0], u_depth: 0.85 } },
    { name: 'Bleached Ranch', uniforms: { u_primary_color: [0.78, 0.68, 0.52, 1.0], u_secondary_color: [0.45, 0.35, 0.22, 1.0], u_depth: 0.6 } }
  ]
};

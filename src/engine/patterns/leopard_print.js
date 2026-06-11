export default {
  id: 'leopard_print',
  name: 'Leopard Print',
  category: 'Organic',
  description: 'Classic leopard rosettes: irregular broken dark rings around tan centres scattered with hash jitter over a cream-gold base, with noise-driven ring break-up and size variance.',
  shader: `

    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 g = floor(uv);

      float ringAcc = 0.0;
      float centerAcc = 0.0;

      for (int yy = -1; yy <= 1; yy++) {
        for (int xx = -1; xx <= 1; xx++) {
          vec2 id = g + vec2(float(xx), float(yy));

          // Drop ~18% of cells so the spacing stays irregular
          float keep = step(0.18, hash(id + 4.2));

          // Jittered rosette centre inside its cell
          vec2 pt = id + vec2(0.2, 0.2) + 0.6 * vec2(hash(id + 1.7), hash(id + 9.3));
          vec2 rel = uv - pt;

          // Wobble the radius so spots are organic blobs, not circles
          float d = length(rel) + snoise(rel * 3.0 + id * 5.0) * 0.07;
          float rs = u_rosette * (0.75 + 0.5 * hash(id + 6.6));

          // Ring band between ~62% and 100% of the rosette radius
          float ring = smoothstep(rs, rs - 0.06, d) - smoothstep(rs * 0.62, rs * 0.62 - 0.06, d);

          // Break the ring into the classic incomplete brushy segments
          vec2 cdir = normalize(rel + vec2(0.0001, 0.0001));
          float breakField = snoise(cdir * 1.9 + id * 7.0 + rel * 2.5);
          float thr = u_break * 2.0 - 1.0;
          ring *= smoothstep(thr - 0.1, thr + 0.1, breakField);

          // Tan centre fills up to just under the ring's inner edge
          float center = smoothstep(rs * 0.66, rs * 0.54, d);

          ringAcc = max(ringAcc, ring * keep);
          centerAcc = max(centerAcc, center * keep);
        }
      }

      vec4 color = u_color_base;
      color = mix(color, u_color_center, clamp(centerAcc, 0.0, 1.0));
      color = mix(color, u_color_ring, clamp(ringAcc, 0.0, 1.0));
      return vec4(color.rgb, color.a);
    }
  `,
  variants: [
    {
      name: 'Classic',
      uniforms: {
        u_color_base: [0.87, 0.76, 0.55, 1.0],
        u_color_ring: [0.10, 0.07, 0.05, 1.0],
        u_color_center: [0.72, 0.51, 0.28, 1.0]
      }
    },
    {
      name: 'Snow Leopard',
      uniforms: {
        u_color_base: [0.93, 0.93, 0.95, 1.0],
        u_color_ring: [0.15, 0.15, 0.18, 1.0],
        u_color_center: [0.65, 0.65, 0.70, 1.0]
      }
    },
    {
      name: 'Pink Pop',
      uniforms: {
        u_color_base: [0.98, 0.80, 0.88, 1.0],
        u_color_ring: [0.22, 0.02, 0.12, 1.0],
        u_color_center: [0.95, 0.35, 0.60, 1.0]
      }
    },
    {
      name: 'Midnight',
      uniforms: {
        u_color_base: [0.10, 0.11, 0.15, 1.0],
        u_color_ring: [0.01, 0.01, 0.02, 1.0],
        u_color_center: [0.22, 0.24, 0.33, 1.0]
      }
    }
  ],
  uniforms: [
    { id: 'u_scale', name: 'Spot Scale', type: 'float', min: 2.0, max: 15.0, default: 6.0 },
    { id: 'u_rosette', name: 'Rosette Size', type: 'float', min: 0.15, max: 0.6, default: 0.38 },
    { id: 'u_break', name: 'Ring Break-Up', type: 'float', min: 0.0, max: 1.0, default: 0.45 },
    { id: 'u_color_base', name: 'Base Coat', type: 'color', default: [0.87, 0.76, 0.55, 1.0] },
    { id: 'u_color_ring', name: 'Rosette Ring', type: 'color', default: [0.10, 0.07, 0.05, 1.0] },
    { id: 'u_color_center', name: 'Spot Center', type: 'color', default: [0.72, 0.51, 0.28, 1.0] }
  ]
};

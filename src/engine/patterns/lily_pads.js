export default {
  id: 'lily_pads',
  name: 'Lily Pads',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Round pads with radial veins and a cut notch, floating on rippling dark water.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // water with soft concentric ripples
      vec4 col = u_secondary_color;
      float rip = sin(length(fract(uv * 0.5) - 0.5) * 18.0 - fbm(uv) * 3.0);
      col.rgb *= 0.92 + 0.08 * rip;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 cell = floor(uv) + vec2(float(i), float(j));
          if (hash(cell + 0.3) < 0.25) continue;
          vec2 ctr = cell + 0.5 + (vec2(hash(cell + 1.1), hash(cell + 2.2)) - 0.5) * 0.5;
          vec2 rel = uv - ctr;
          float r = length(rel);
          float ang = atan(rel.y, rel.x);
          float size = 0.28 + hash(cell + 3.3) * 0.2;
          // the notch: a wedge cut toward a random direction
          float notchDir = hash(cell + 4.4) * 6.28318;
          float dAng = abs(mod(ang - notchDir + 3.14159, 6.28318) - 3.14159);
          float notch = step(0.28, dAng);
          float pad = smoothstep(size, size * 0.96, r) * notch;
          if (pad > 0.01) {
            vec3 g = mix(u_primary_color.rgb, u_accent_color.rgb, hash(cell + 5.5) * 0.7);
            // radial veins
            g *= 0.9 + 0.1 * sin(ang * 24.0);
            // rim darkening and center highlight
            g *= 0.75 + 0.25 * smoothstep(size, 0.0, r);
            g += vec3(0.07) * exp(-r * r / (size * size * 0.08));
            // waterline shadow just outside the pad
            col.rgb = mix(col.rgb, g, pad);
          }
          col.rgb *= 1.0 - 0.25 * (smoothstep(size * 1.15, size, r) - smoothstep(size, size * 0.9, r)) * notch;
        }
      }
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Pad Density', type: 'float', min: 2.0, max: 12.0, default: 4.0 },
    { id: 'u_primary_color', name: 'Pad Green', type: 'color', default: [0.2, 0.5, 0.24, 1.0] },
    { id: 'u_accent_color', name: 'Pad Light', type: 'color', default: [0.5, 0.7, 0.3, 1.0] },
    { id: 'u_secondary_color', name: 'Pond Water', type: 'color', default: [0.05, 0.12, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Monet Pond', uniforms: { u_primary_color: [0.2, 0.5, 0.24, 1.0], u_accent_color: [0.5, 0.7, 0.3, 1.0], u_secondary_color: [0.05, 0.12, 0.14, 1.0] } },
    { name: 'Twilight Pond', uniforms: { u_primary_color: [0.12, 0.3, 0.28, 1.0], u_accent_color: [0.3, 0.5, 0.45, 1.0], u_secondary_color: [0.04, 0.05, 0.12, 1.0] } },
    { name: 'Koi Garden', uniforms: { u_primary_color: [0.35, 0.55, 0.2, 1.0], u_accent_color: [0.7, 0.75, 0.35, 1.0], u_secondary_color: [0.1, 0.2, 0.25, 1.0] } }
  ]
};

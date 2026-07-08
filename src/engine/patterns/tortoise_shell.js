export default {
  id: 'tortoise_shell',
  name: 'Tortoise Shell',
  category: 'Natural',
  added: '2026-07-07',
  description: 'Polygonal scutes with growth rings, ringed by pale seams — a tortoise carapace.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      float d1 = 8.0; float d2 = 8.0;
      vec2 id1 = vec2(0.0); vec2 pt1 = vec2(0.0);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 c = cell + vec2(float(i), float(j));
          vec2 pt = c + vec2(hash(c + 1.1), hash(c + 2.2));
          float d = length(uv - pt);
          if (d < d1) { d2 = d1; d1 = d; id1 = c; pt1 = pt; }
          else if (d < d2) { d2 = d; }
        }
      }
      float border = d2 - d1;
      float seam = 1.0 - smoothstep(0.0, u_seam, border);
      // growth rings inside each scute, following distance from its center
      float rings = 0.5 + 0.5 * sin(d1 * u_rings * 6.28318 + hash(id1) * 6.28);
      vec3 scute = mix(u_primary_color.rgb, u_primary_color.rgb * 0.72, rings * 0.5);
      // per-scute tone + amber mottling
      scute *= 0.85 + 0.3 * hash(id1 + 5.5);
      float mottle = smoothstep(0.2, 0.8, fbm(uv * 2.0 + id1));
      scute = mix(scute, u_accent_color.rgb, mottle * 0.45);
      // raised center highlight
      scute += vec3(0.08) * exp(-d1 * d1 * 6.0);
      vec3 c = mix(scute, u_secondary_color.rgb, seam);
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scute Density', type: 'float', min: 2.0, max: 12.0, default: 4.0 },
    { id: 'u_seam', name: 'Seam Width', type: 'float', min: 0.02, max: 0.3, default: 0.1 },
    { id: 'u_rings', name: 'Growth Rings', type: 'float', min: 2.0, max: 16.0, default: 7.0 },
    { id: 'u_primary_color', name: 'Scute', type: 'color', default: [0.42, 0.28, 0.12, 1.0] },
    { id: 'u_accent_color', name: 'Amber Mottle', type: 'color', default: [0.72, 0.5, 0.2, 1.0] },
    { id: 'u_secondary_color', name: 'Seam', type: 'color', default: [0.82, 0.74, 0.55, 1.0] }
  ],
  variants: [
    { name: 'Carapace', uniforms: { u_primary_color: [0.42, 0.28, 0.12, 1.0], u_accent_color: [0.72, 0.5, 0.2, 1.0], u_secondary_color: [0.82, 0.74, 0.55, 1.0], u_rings: 7.0 } },
    { name: 'Eyewear Acetate', uniforms: { u_primary_color: [0.3, 0.16, 0.08, 1.0], u_accent_color: [0.85, 0.55, 0.22, 1.0], u_secondary_color: [0.5, 0.32, 0.15, 1.0], u_rings: 3.0 } },
    { name: 'Jade Turtle', uniforms: { u_primary_color: [0.15, 0.35, 0.25, 1.0], u_accent_color: [0.4, 0.6, 0.4, 1.0], u_secondary_color: [0.75, 0.82, 0.7, 1.0], u_rings: 9.0 } }
  ]
};

export default {
  id: 'honey_drizzle',
  name: 'Honey Drizzle',
  category: 'Novelty',
  added: '2026-07-13',
  description: 'Sinuous squeeze-bottle honey strands looping over a cream biscuit ground — amber cores, translucent thin edges, gleaming highlight lines and soft cast shadows.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // cream biscuit ground with faint baked mottling
      vec3 col = u_secondary_color.rgb * (0.94 + 0.09 * fbm(uv * 1.3));
      float th = u_thickness;
      // five drizzle passes: three sweeping strands + two steeply rotated loop-backs
      for (int i = 0; i < 5; i++) {
        float fi = float(i);
        float ang = fi * 0.63 + step(2.5, fi) * 1.15;
        float ca = cos(ang);
        float sa = sin(ang);
        vec2 p = mat2(ca, -sa, sa, ca) * uv + vec2(fi * 17.31, fi * 9.77);
        // wandering pour path: broad sinuous sweep plus a tighter wiggle
        float fx = p.x * (0.55 + 0.14 * fi);
        float path = u_wobble * (snoise(vec2(fx, fi * 4.7))
                   + 0.45 * snoise(vec2(fx * 2.3, fi * 4.7 + 8.0)));
        // strands repeat like back-and-forth passes of the bottle
        float spacing = 1.45 + 0.4 * fi;
        float y = mod(p.y - path, spacing) - 0.5 * spacing;
        // ribbon swells and necks along its length
        float w = th * (0.55 + 0.45 * (0.5 + 0.5 * snoise(vec2(fx * 1.8 + 3.0, fi * 2.3))));
        float d = abs(y);
        float m = smoothstep(w, w - 0.02, d);
        // soft drop shadow cast just off the strand onto whatever lies beneath
        float dsh = abs(y - w * 1.2);
        float shad = smoothstep(w * 2.6, w * 0.5, dsh) * (1.0 - m);
        col *= 1.0 - shad * 0.22;
        // depth: 1 at the thick amber core, 0 at the thin edge
        float depth = clamp(1.0 - d / max(w, 0.001), 0.0, 1.0);
        vec3 honey = mix(u_primary_color.rgb, u_accent_color.rgb, pow(depth, 1.6));
        // translucency: thin edges let the ground glow through, thick centers go deep
        vec3 lit = mix(col, honey, 0.35 + 0.65 * smoothstep(0.0, 0.55, depth));
        // bright specular gleam line riding just above the crown
        float hl = smoothstep(w * 0.38, 0.0, abs(y + w * 0.32));
        hl *= 0.55 + 0.45 * noise(vec2(fx * 3.0, fi * 6.1));
        lit += vec3(1.0, 0.96, 0.82) * hl * 0.8;
        // faint broad sheen along the crown
        lit += vec3(1.0, 0.9, 0.6) * pow(depth, 7.0) * 0.15;
        col = mix(col, lit, m);
      }
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Drizzle Scale', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_thickness', name: 'Strand Thickness', type: 'float', min: 0.04, max: 0.2, default: 0.09 },
    { id: 'u_wobble', name: 'Wander', type: 'float', min: 0.2, max: 1.2, default: 0.6 },
    { id: 'u_primary_color', name: 'Honey', type: 'color', default: [0.86, 0.55, 0.12, 1.0] },
    { id: 'u_accent_color', name: 'Deep Amber', type: 'color', default: [0.55, 0.27, 0.03, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.95, 0.88, 0.72, 1.0] }
  ],
  variants: [
    { name: 'Golden Hour', uniforms: { u_primary_color: [0.86, 0.55, 0.12, 1.0], u_accent_color: [0.55, 0.27, 0.03, 1.0], u_secondary_color: [0.95, 0.88, 0.72, 1.0], u_scale: 3.0, u_thickness: 0.09, u_wobble: 0.6 } },
    { name: 'Dark Maple', uniforms: { u_primary_color: [0.52, 0.24, 0.06, 1.0], u_accent_color: [0.26, 0.1, 0.02, 1.0], u_secondary_color: [0.82, 0.7, 0.52, 1.0], u_scale: 2.2, u_thickness: 0.13, u_wobble: 0.5 } },
    { name: 'Berry Syrup', uniforms: { u_primary_color: [0.68, 0.14, 0.32, 1.0], u_accent_color: [0.34, 0.04, 0.16, 1.0], u_secondary_color: [0.94, 0.9, 0.94, 1.0], u_scale: 4.0, u_thickness: 0.07, u_wobble: 0.8 } }
  ]
};

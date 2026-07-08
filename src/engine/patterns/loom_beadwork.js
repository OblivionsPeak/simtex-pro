export default {
  id: 'loom_beadwork',
  name: 'Loom Beadwork',
  category: 'Heritage',
  added: '2026-07-07',
  description: 'Rows of glass seed beads woven on a loom, building stepped diamond motifs.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      vec2 cell = floor(uv);
      vec2 f = fract(uv) - 0.5;
      // stepped diamond motif: triangle-wave bands over the bead grid
      float period = 12.0;
      float tx = abs(mod(cell.x, period) - period * 0.5);
      float ty = abs(mod(cell.y, period) - period * 0.5);
      float dia = tx + ty;
      vec3 beadC = u_secondary_color.rgb;
      if (dia < 3.0) beadC = u_primary_color.rgb;
      else if (dia < 5.0) beadC = u_accent_color.rgb;
      else if (dia < 6.0) beadC = u_pop_color.rgb;
      else if (mod(dia, 6.0) < 1.0) beadC = u_accent_color.rgb; // echo bands
      // bead body: rounded rect with glassy highlight and thread hole shadow
      float bead = smoothstep(0.47, 0.4, max(abs(f.x), abs(f.y) * 1.25));
      beadC *= 0.8 + 0.4 * hash(cell + 3.7);                  // glass lot variation
      beadC += vec3(0.25) * exp(-dot(f - vec2(-0.12, 0.15), f - vec2(-0.12, 0.15)) * 40.0); // highlight
      beadC *= 1.0 - 0.35 * smoothstep(0.12, 0.0, abs(f.y));  // thread channel
      vec3 c = mix(vec3(0.16, 0.13, 0.1), beadC, bead);       // thread gaps between beads
      return vec4(c, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Bead Density', type: 'float', min: 10.0, max: 60.0, default: 26.0 },
    { id: 'u_primary_color', name: 'Diamond Core', type: 'color', default: [0.85, 0.15, 0.15, 1.0] },
    { id: 'u_accent_color', name: 'Diamond Ring', type: 'color', default: [0.95, 0.8, 0.2, 1.0] },
    { id: 'u_pop_color', name: 'Outline Row', type: 'color', default: [0.12, 0.3, 0.55, 1.0] },
    { id: 'u_secondary_color', name: 'Field Beads', type: 'color', default: [0.92, 0.9, 0.85, 1.0] }
  ],
  variants: [
    { name: 'Plains Diamond', uniforms: { u_primary_color: [0.85, 0.15, 0.15, 1.0], u_accent_color: [0.95, 0.8, 0.2, 1.0], u_pop_color: [0.12, 0.3, 0.55, 1.0], u_secondary_color: [0.92, 0.9, 0.85, 1.0] } },
    { name: 'Turquoise Trail', uniforms: { u_primary_color: [0.15, 0.6, 0.6, 1.0], u_accent_color: [0.9, 0.55, 0.2, 1.0], u_pop_color: [0.2, 0.2, 0.22, 1.0], u_secondary_color: [0.9, 0.86, 0.78, 1.0] } },
    { name: 'Night Dance', uniforms: { u_primary_color: [0.9, 0.85, 0.75, 1.0], u_accent_color: [0.6, 0.2, 0.3, 1.0], u_pop_color: [0.3, 0.5, 0.75, 1.0], u_secondary_color: [0.1, 0.1, 0.14, 1.0] } }
  ]
};

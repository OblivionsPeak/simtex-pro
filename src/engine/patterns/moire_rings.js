export default {
  id: 'moire_rings',
  name: 'Moire Rings',
  category: 'Geometric',
  added: '2026-07-13',
  description: 'Two concentric ring systems slightly out of register, blooming into hypnotic moiré interference lobes where their frequencies collide.',
  shader: `
    vec4 generate() {
      vec2 p = v_uv - 0.5;
      vec2 o = vec2(u_offset * 0.5, 0.0);
      float r1 = length(p - o) * u_scale;
      float r2 = length(p + o) * u_scale;
      // smooth square-wave rings via triangle wave + fixed AA width
      float aa = 0.12;
      float v1 = smoothstep(0.5 - aa, 0.5 + aa, abs(fract(r1) * 2.0 - 1.0));
      float v2 = smoothstep(0.5 - aa, 0.5 + aa, abs(fract(r2) * 2.0 - 1.0));
      // average carries the ring fields; product marks interference blooms
      float field = 0.5 * (v1 + v2);
      float bloom = v1 * v2;
      vec3 col = mix(u_secondary_color.rgb, u_primary_color.rgb, field);
      col = mix(col, u_accent_color.rgb, bloom * bloom);
      // gentle radial falloff keeps the twin centres reading as the focus
      col *= 0.9 + 0.1 * (1.0 - smoothstep(0.0, 0.75, length(p)));
      // fine print grain so large flats never read as vinyl-flat
      col *= 0.96 + 0.04 * noise(v_uv * 220.0);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Ring Frequency', type: 'float', min: 20.0, max: 120.0, default: 55.0 },
    { id: 'u_offset', name: 'Center Separation', type: 'float', min: 0.0, max: 0.25, default: 0.07 },
    { id: 'u_primary_color', name: 'Rings', type: 'color', default: [0.9, 0.9, 0.92, 1.0] },
    { id: 'u_secondary_color', name: 'Ground', type: 'color', default: [0.05, 0.05, 0.08, 1.0] },
    { id: 'u_accent_color', name: 'Bloom', type: 'color', default: [1.0, 0.35, 0.1, 1.0] }
  ],
  variants: [
    { name: 'Ember Interference', uniforms: { u_primary_color: [0.9, 0.9, 0.92, 1.0], u_secondary_color: [0.05, 0.05, 0.08, 1.0], u_accent_color: [1.0, 0.35, 0.1, 1.0], u_scale: 55.0, u_offset: 0.07 } },
    { name: 'Deep Sonar', uniforms: { u_primary_color: [0.15, 0.75, 0.85, 1.0], u_secondary_color: [0.01, 0.05, 0.1, 1.0], u_accent_color: [0.85, 1.0, 0.95, 1.0], u_scale: 80.0, u_offset: 0.12 } },
    { name: 'Violet Bloom', uniforms: { u_primary_color: [0.32, 0.12, 0.5, 1.0], u_secondary_color: [0.93, 0.9, 0.95, 1.0], u_accent_color: [1.0, 0.85, 0.2, 1.0], u_scale: 38.0, u_offset: 0.05 } }
  ]
};

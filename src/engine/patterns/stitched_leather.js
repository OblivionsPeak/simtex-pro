export default {
  id: 'stitched_leather_pro',
  name: 'Stitched Leather',
  category: 'Organic',
  added: '2026-04-15',
  description: 'Pebbled upholstery leather with diamond seam channels and dashed thread stitching.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // pebble grain: two scales of cellular-ish noise shading
      float g1 = snoise(uv * 1.6);
      float g2 = snoise(uv * 4.2 + 7.0);
      float grain = 0.5 + 0.28 * g1 + 0.18 * g2;
      vec3 leather = u_leather_color.rgb * (0.72 + 0.4 * grain);
      // soft sheen where the pebbles crest
      leather += vec3(0.06) * smoothstep(0.55, 0.9, grain);

      // diamond quilt seams: channels along both diagonals
      vec2 dg = vec2(uv.x + uv.y, uv.x - uv.y) * 0.18;
      float s1 = abs(fract(dg.x) - 0.5);
      float s2 = abs(fract(dg.y) - 0.5);
      float seam = min(s1, s2);
      // pressed channel: darker trough with a soft shoulder
      float channel = smoothstep(0.06, 0.015, seam);
      leather *= 1.0 - channel * 0.35;

      // dashed thread down the channel centre
      float along = (s1 < s2) ? dg.y : dg.x;
      float dash = step(0.5, fract(along * 14.0));
      float thread = smoothstep(0.012, 0.004, seam) * dash * u_show_stitch;
      vec3 col = mix(leather, u_thread_color.rgb * (0.8 + 0.2 * fract(along * 14.0)), thread);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Grain Density', type: 'float', min: 10.0, max: 100.0, default: 30.0 },
    { id: 'u_show_stitch', name: 'Show Stitch', type: 'float', min: 0.0, max: 1.0, default: 1.0 },
    { id: 'u_leather_color', name: 'Leather', type: 'color', default: [0.32, 0.18, 0.1, 1.0] },
    { id: 'u_thread_color', name: 'Thread', type: 'color', default: [0.85, 0.72, 0.4, 1.0] }
  ],
  variants: [
    { name: 'Saddle Interior', uniforms: { u_leather_color: [0.32, 0.18, 0.1, 1.0], u_thread_color: [0.85, 0.72, 0.4, 1.0], u_show_stitch: 1.0 } },
    { name: 'Black Nappa Red Stitch', uniforms: { u_leather_color: [0.09, 0.09, 0.1, 1.0], u_thread_color: [0.85, 0.15, 0.15, 1.0], u_show_stitch: 1.0 } },
    { name: 'Oxblood Plain', uniforms: { u_leather_color: [0.28, 0.1, 0.1, 1.0], u_thread_color: [0.7, 0.6, 0.5, 1.0], u_show_stitch: 0.0 } }
  ]
};

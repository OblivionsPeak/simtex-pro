export default {
  id: 'catch_fence',
  name: 'Catch Fence',
  category: 'Racing',
  added: '2026-07-13',
  description: 'Debris catch fencing — crisp diamond wire mesh over a blurred far layer, pinned by heavy posts with soft shadows.',
  shader: `
    float meshWire(vec2 q, float w, float aa) {
      vec2 m = mat2(0.7071, -0.7071, 0.7071, 0.7071) * q;
      vec2 g = abs(fract(m) - 0.5);
      return 1.0 - smoothstep(w, w + aa, min(g.x, g.y));
    }
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // dark out-of-focus background beyond the fence
      vec3 col = u_secondary_color.rgb * (0.75 + 0.25 * (0.5 + 0.5 * fbm(v_uv * 5.0)));
      col *= 0.92 + 0.08 * noise(uv * 0.7);
      // far mesh layer: dimmer, wide smoothstep for camera-depth blur
      float farMesh = meshWire(uv * 0.82 + vec2(3.71, 1.13), u_wire * 1.2, 0.16);
      col = mix(col, u_primary_color.rgb * 0.35, farMesh * 0.45);
      // soft shadow the post throws across the mesh behind it
      float px = fract(v_uv.x * u_posts);
      col *= 1.0 - 0.35 * smoothstep(0.500, 0.545, px) * (1.0 - smoothstep(0.545, 0.74, px));
      // near mesh: crisp wire with per-strand glints
      float nearMesh = meshWire(uv, u_wire, 0.035);
      vec3 wireCol = u_primary_color.rgb * (0.75 + 0.5 * noise(uv * 2.3));
      wireCol += vec3(1.0) * step(0.93, hash(floor(uv * 2.0))) * 0.35;
      col = mix(col, wireCol, nearMesh * 0.9);
      // the post itself, in front of the mesh, shaded as a cylinder
      float post = smoothstep(0.462, 0.472, px) * (1.0 - smoothstep(0.528, 0.538, px));
      float sheen = smoothstep(0.462, 0.49, px) * (1.0 - smoothstep(0.49, 0.538, px));
      vec3 pcol = u_accent_color.rgb * (0.65 + 0.70 * sheen);
      pcol *= 0.88 + 0.12 * noise(vec2(v_uv.y * 30.0, floor(v_uv.x * u_posts) * 7.0));
      col = mix(col, pcol, post);
      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Mesh Density', type: 'float', min: 8.0, max: 60.0, default: 24.0 },
    { id: 'u_wire', name: 'Wire Gauge', type: 'float', min: 0.02, max: 0.09, default: 0.045 },
    { id: 'u_posts', name: 'Post Count', type: 'float', min: 1.0, max: 8.0, default: 3.0 },
    { id: 'u_primary_color', name: 'Wire', type: 'color', default: [0.72, 0.74, 0.78, 1.0] },
    { id: 'u_secondary_color', name: 'Background', type: 'color', default: [0.05, 0.06, 0.08, 1.0] },
    { id: 'u_accent_color', name: 'Posts', type: 'color', default: [0.35, 0.38, 0.42, 1.0] }
  ],
  variants: [
    { name: 'Speedway Silver', uniforms: { u_scale: 24.0, u_wire: 0.045, u_posts: 3.0, u_primary_color: [0.72, 0.74, 0.78, 1.0], u_secondary_color: [0.05, 0.06, 0.08, 1.0], u_accent_color: [0.35, 0.38, 0.42, 1.0] } },
    { name: 'Sunset Silhouette', uniforms: { u_scale: 18.0, u_wire: 0.055, u_posts: 2.0, u_primary_color: [0.16, 0.10, 0.09, 1.0], u_secondary_color: [0.55, 0.22, 0.10, 1.0], u_accent_color: [0.12, 0.08, 0.07, 1.0] } },
    { name: 'Night Race', uniforms: { u_scale: 32.0, u_wire: 0.038, u_posts: 4.0, u_primary_color: [0.85, 0.88, 0.95, 1.0], u_secondary_color: [0.02, 0.02, 0.04, 1.0], u_accent_color: [0.20, 0.22, 0.30, 1.0] } }
  ]
};

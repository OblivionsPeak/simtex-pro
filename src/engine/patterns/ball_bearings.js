export default {
  id: 'ball_bearings',
  name: 'Ball Bearings',
  category: 'Industrial',
  added: '2026-07-07',
  description: 'Polished steel spheres packed in staggered rows, each with a hard specular hotspot.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // hex-ish stagger: offset every other row
      uv.x += step(1.0, mod(floor(uv.y), 2.0)) * 0.5;
      vec2 f = fract(uv) - 0.5;
      float r = length(f) * 2.0;
      float ball = smoothstep(0.98, 0.92, r);
      // sphere normal z for shading
      float nz = sqrt(max(1.0 - r * r, 0.0));
      vec3 n = normalize(vec3(f * 2.0, nz));
      vec3 l = normalize(vec3(-0.4, 0.55, 0.72));
      float diff = max(dot(n, l), 0.0);
      float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 40.0);
      // environment-style vertical gradient reflection
      float env = 0.5 + 0.5 * n.y;
      vec3 steel = mix(u_primary_color.rgb * 0.35, u_primary_color.rgb, env * 0.6 + diff * 0.4);
      steel += spec * u_shine;
      // contact shadow between balls
      float shadow = smoothstep(1.15, 0.98, r) * 0.5;
      vec3 bg = u_secondary_color.rgb * (1.0 - shadow);
      return vec4(mix(bg, steel, ball), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Bearing Size', type: 'float', min: 3.0, max: 30.0, default: 10.0 },
    { id: 'u_shine', name: 'Polish', type: 'float', min: 0.0, max: 1.5, default: 0.9 },
    { id: 'u_primary_color', name: 'Steel', type: 'color', default: [0.72, 0.74, 0.78, 1.0] },
    { id: 'u_secondary_color', name: 'Race Groove', type: 'color', default: [0.12, 0.12, 0.14, 1.0] }
  ],
  variants: [
    { name: 'Chrome Steel', uniforms: { u_primary_color: [0.72, 0.74, 0.78, 1.0], u_secondary_color: [0.12, 0.12, 0.14, 1.0], u_shine: 0.9 } },
    { name: 'Brass Shot', uniforms: { u_primary_color: [0.8, 0.62, 0.3, 1.0], u_secondary_color: [0.16, 0.11, 0.06, 1.0], u_shine: 0.7 } },
    { name: 'Ceramic', uniforms: { u_primary_color: [0.92, 0.9, 0.86, 1.0], u_secondary_color: [0.3, 0.3, 0.32, 1.0], u_shine: 0.5 } }
  ]
};

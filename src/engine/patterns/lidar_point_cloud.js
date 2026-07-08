export default {
  id: 'lidar_point_cloud',
  name: 'LiDAR Point Cloud',
  category: 'Technology',
  added: '2026-07-07',
  description: 'Laser-scanned terrain — dot rows sweeping in scan rings, colored by elevation.',
  shader: `
    vec4 generate() {
      vec2 uv = v_uv * u_scale;
      // underlying elevation field drives color and dot density
      float elev = fbm(uv * 0.35) * 0.5 + 0.5;
      vec4 col = u_secondary_color;
      // scan rows: dots along horizontal sweep lines
      vec2 grid = vec2(uv.x * 3.0, uv.y * 8.0);
      vec2 cell = floor(grid);
      vec2 f = fract(grid) - 0.5;
      // jitter each return point
      vec2 jit = vec2(hash(cell + 1.3), hash(cell + 2.6)) - 0.5;
      float d = length((f - jit * 0.6) * vec2(1.0, 2.5));
      float visible = step(hash(cell + 4.1), 0.35 + elev * 0.55);
      float dot_ = smoothstep(u_dot, u_dot * 0.4, d) * visible;
      // elevation color ramp: low -> high
      vec3 ramp = mix(u_primary_color.rgb, u_accent_color.rgb, elev);
      // intensity flicker per return
      ramp *= 0.6 + 0.4 * hash(cell + 7.7);
      col.rgb = mix(col.rgb, ramp, dot_);
      // faint scanline glow rows
      col.rgb += u_accent_color.rgb * 0.05 * smoothstep(0.45, 0.5, abs(fract(uv.y * 0.5) - 0.5));
      return col;
    }
  `,
  uniforms: [
    { id: 'u_scale', name: 'Scan Density', type: 'float', min: 4.0, max: 30.0, default: 12.0 },
    { id: 'u_dot', name: 'Point Size', type: 'float', min: 0.05, max: 0.4, default: 0.16 },
    { id: 'u_secondary_color', name: 'Void', type: 'color', default: [0.02, 0.03, 0.05, 1.0] },
    { id: 'u_primary_color', name: 'Low Elevation', type: 'color', default: [0.1, 0.3, 0.9, 1.0] },
    { id: 'u_accent_color', name: 'High Elevation', type: 'color', default: [0.2, 1.0, 0.6, 1.0] }
  ],
  variants: [
    { name: 'Survey', uniforms: { u_secondary_color: [0.02, 0.03, 0.05, 1.0], u_primary_color: [0.1, 0.3, 0.9, 1.0], u_accent_color: [0.2, 1.0, 0.6, 1.0], u_dot: 0.16 } },
    { name: 'Thermal Scan', uniforms: { u_secondary_color: [0.04, 0.02, 0.02, 1.0], u_primary_color: [0.5, 0.08, 0.4, 1.0], u_accent_color: [1.0, 0.7, 0.1, 1.0], u_dot: 0.2 } },
    { name: 'Ghost White', uniforms: { u_secondary_color: [0.03, 0.03, 0.04, 1.0], u_primary_color: [0.35, 0.38, 0.45, 1.0], u_accent_color: [0.95, 0.97, 1.0, 1.0], u_dot: 0.12 } }
  ]
};

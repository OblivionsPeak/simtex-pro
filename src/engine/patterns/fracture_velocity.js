export default {
  id: 'fracture_velocity',
  name: 'Fracture Velocity',
  category: 'Abstract',
  added: '2026-07-09',
  description: 'Shattered panel shards stretched along the direction of travel, with crack-glow radiating from a single point of impact — hot orange nearby, cold hairlines far away.',
  shader: `
    vec2 fvpt(vec2 id) { return vec2(hash(id), hash(id + 7.3)); }

    vec4 generate() {
      vec2 uv = fract(v_uv);
      // anisotropic metric: fewer cells across x stretches shards along travel
      vec2 p = vec2(uv.x * u_cells * u_stretch, uv.y * u_cells);
      vec2 ip = floor(p);
      vec2 fp = fract(p);

      float d1 = 8.0;
      float d2 = 8.0;
      vec2 cid = vec2(0.0);
      for (int j = -2; j <= 2; j++) {
        for (int i = -2; i <= 2; i++) {
          vec2 o = vec2(float(i), float(j));
          vec2 pt = o + fvpt(ip + o) - fp;
          float d = length(pt);
          if (d < d1) { d2 = d1; d1 = d; cid = ip + o; }
          else if (d < d2) { d2 = d; }
        }
      }

      float edge = pow(clamp(1.0 - (d2 - d1) / 0.09, 0.0, 1.0), 1.5);

      // flat shard shading lit from the upper-left
      vec2 cuv = (cid + 0.5) / vec2(u_cells * u_stretch, u_cells);
      float light = cuv.x * 0.55 + (1.0 - cuv.y) * 0.45;
      float t = 0.28 + 0.22 * hash(cid + 3.3) + 0.30 * light;
      vec3 col = mix(vec3(0.063, 0.067, 0.082), vec3(0.275, 0.294, 0.33), t);

      // impact point: crack glow decays with distance
      float dist = distance(uv, vec2(0.72, 0.26));
      float heat = exp(-dist / 0.30);
      float glow = edge * (0.12 + 0.88 * heat) * u_glow;
      col += glow * vec3(0.92, 0.36, 0.08);
      // cold hairline keeps far cracks legible
      col += edge * (1.0 - heat) * 0.10;

      return vec4(col, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_cells',   name: 'Shard Count',   type: 'float', min: 4.0, max: 16.0, default: 8.0 },
    { id: 'u_stretch', name: 'Shard Stretch', type: 'float', min: 0.4, max: 1.0,  default: 0.62 },
    { id: 'u_glow',    name: 'Impact Glow',   type: 'float', min: 0.0, max: 2.0,  default: 1.0 }
  ]
};

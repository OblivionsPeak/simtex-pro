export default {
  id: 'paint_chips',
  name: 'Paint Chips',
  category: 'Industrial',
  description: 'Chipped and scratched paint surface revealing bare metal substrate through irregular chips and long directional scratches.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float hash1(float n) { return fract(sin(n) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    float fbm(vec2 p) {
      float v = 0.0; float a = 0.5;
      for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.3; a *= 0.48; }
      return v;
    }

    vec4 generate() {
      vec2 uv = v_uv * u_chip_density;

      // ---- Voronoi-ish chip mask ----
      vec2 cell = floor(uv);
      vec2 local = fract(uv);
      float chipMask = 1.0; // 1 = paint intact

      for (int dy = -1; dy <= 1; dy++) {
        for (int dx = -1; dx <= 1; dx++) {
          vec2 nc = cell + vec2(float(dx), float(dy));
          vec2 rnd = vec2(hash(nc + vec2(0.3, 0.7)), hash(nc + vec2(0.8, 0.2)));
          // Random chip centre within this cell
          vec2 chipPos = vec2(float(dx), float(dy)) + rnd;
          vec2 diff = local - chipPos;
          // Elliptical chip shape with fbm edge distortion
          float distort = fbm(nc * 3.1 + diff * 2.0) * 0.35;
          float d = length(diff * vec2(1.0 + distort, 0.7 + distort * 0.5));
          // Chip radius random per cell
          float chipR = 0.15 + hash(nc + 5.0) * 0.28;
          chipMask = min(chipMask, smoothstep(chipR - 0.04, chipR, d));
        }
      }

      // ---- Long directional scratches ----
      float scratchUV = v_uv.y * u_chip_density * 8.0;
      float scrLine   = noise(vec2(v_uv.x * u_chip_density * 60.0, scratchUV));
      float scrLine2  = noise(vec2(v_uv.x * u_chip_density * 80.0 + 7.3, scratchUV * 0.7));
      float scratch   = smoothstep(0.82, 0.86, scrLine) + smoothstep(0.85, 0.88, scrLine2);
      scratch = clamp(scratch, 0.0, 1.0);
      // Scratches cut through paint partially (shallow — show primer grey)
      vec4 scratchColor = vec4(mix(u_paint_color.rgb, vec3(0.35, 0.33, 0.32), 0.7), 1.0);

      // ---- Compose layers ----
      // Deep chip — bare metal
      vec4 col = mix(u_base_color, u_paint_color, chipMask);
      // Scratch over top
      col = mix(col, scratchColor, scratch * chipMask);

      // Slight paint edge highlight at chip boundary
      float chipEdge = smoothstep(0.0, 0.04, 1.0 - chipMask) * smoothstep(0.0, 0.04, chipMask);
      col.rgb += vec3(chipEdge * 0.12);

      // Paint surface micro variation
      float paintGrain = noise(v_uv * 300.0) * 0.04;
      col.rgb = mix(col.rgb, col.rgb + paintGrain, chipMask);

      col.a = u_opacity;
      return clamp(col, 0.0, 1.0);
    }
  `,
  uniforms: [
    { id: 'u_chip_density', name: 'Chip Density',    type: 'float', min: 1.0, max: 20.0, default: 8.0 },
    { id: 'u_base_color',   name: 'Metal Substrate', type: 'color', default: [0.15, 0.15, 0.18, 1.0] },
    { id: 'u_paint_color',  name: 'Paint Color',     type: 'color', default: [0.3,  0.05, 0.05, 1.0] }
  ]
};

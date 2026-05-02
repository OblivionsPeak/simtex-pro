export default {
  id: 'hex_basalt_natural',
  name: 'Hex Basalt',
  category: 'Natural',
  description: 'Hexagonal columnar basalt cross-sections like the Giants Causeway, with dark joints and per-column tonal variation.',
  shader: `
    float hash21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

    // Classic 3-check hex grid.
    // Returns (nearest hex center, distance to nearest edge)
    vec3 hexGrid(vec2 uv) {
      // Skewed axial coordinates
      vec2 q = vec2(uv.x - uv.y * 0.57735, uv.y * 1.1547);
      vec2 pi = floor(q);
      vec2 pf = fract(q);

      float v = mod(pi.x + pi.y, 3.0);

      float ca = step(1.0, v);
      float cb = step(2.0, v);

      vec2 ma = step(pf, pf.yx);  // for edge detection

      // Three candidate hex centres
      vec2 p0 = pi + vec2(0.0, 0.0);
      vec2 p1 = pi + vec2(1.0, 0.0);
      vec2 p2 = pi + vec2(0.0, 1.0);

      // Distance in original space
      float d0 = length(uv - (p0 * vec2(1.0, 0.8660) + p0.y * vec2(0.5, 0.0)));
      float d1 = length(uv - (p1 * vec2(1.0, 0.8660) + p1.y * vec2(0.5, 0.0)));
      float d2 = length(uv - (p2 * vec2(1.0, 0.8660) + p2.y * vec2(0.5, 0.0)));

      // Use a simpler, robust hex distance approach instead
      // Convert to axial hex, round to nearest hex, compute distance
      vec2 ax = vec2(uv.x * 1.1547, uv.y + uv.x * 0.57735);
      vec2 r  = floor(ax + 0.5);
      vec2 f2 = ax - r;
      // Correct rounding for hex
      float s = sign(f2.x + f2.y);
      float mx = s * max(abs(f2.x), abs(f2.y)) > 0.5 ? 1.0 : 0.0;
      if (abs(f2.x) > abs(f2.y)) {
        r.x += s * mx;
      } else {
        r.y += s * mx;
      }

      float cellID = hash21(r);

      // Distance from hex center (in axial space, then back to world)
      vec2 hexCenter = vec2(r.x - r.y * 0.5, r.y * 0.8660);
      float dist = length(uv - hexCenter);

      return vec3(dist, cellID, length(f2));
    }

    vec4 generate() {
      vec2 uv  = v_uv * u_scale;
      vec3 hex = hexGrid(uv);

      float dist   = hex.x;
      float cellID = hex.y;

      // Hex "radius" in world units
      float hexR = 0.5 / u_scale;  // approx half-width of one column

      // Per-column grey tone variation
      float colTone = 0.85 + (hash21(vec2(cellID, 0.3)) - 0.5) * 0.22;
      vec3  rockCol = u_rock_color.rgb * colTone;

      // Raised edge: a subtle lighter rim just inside the joint
      float normDist = dist / (0.57 / u_scale);  // normalise to ~0..1
      float rimMask  = smoothstep(0.70, 0.84, normDist) * (1.0 - smoothstep(0.84, 0.92, normDist));
      rockCol = mix(rockCol, rockCol * 1.18, rimMask);

      // Dark joint between columns
      float jointWidth = u_joint_width;
      float jointMask  = smoothstep(0.88 - jointWidth, 0.92, normDist);
      rockCol = mix(rockCol, vec3(0.04, 0.04, 0.04), jointMask);

      return vec4(clamp(rockCol, 0.0, 1.0), 1.0);
    }
  `,
  uniforms: [
    { id: 'u_scale',       name: 'Column Density', type: 'float', min: 2.0,  max: 16.0, default: 7.0  },
    { id: 'u_rock_color',  name: 'Basalt Color',   type: 'color',                       default: [0.38, 0.38, 0.36, 1.0] },
    { id: 'u_joint_width', name: 'Joint Width',    type: 'float', min: 0.01, max: 0.1,  default: 0.04 }
  ]
};

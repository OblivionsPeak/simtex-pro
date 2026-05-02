export default {
  id: 'perforated_leather',
  name: 'Perforated Leather',
  category: 'Industrial',
  description: 'Smooth leather with a regular diamond punched-hole pattern over a contrasting backing, as used in racing seats and steering wheel grips.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    // Fine leather grain — long micro scratches aligned roughly horizontally
    float leatherGrain(vec2 uv) {
      float g1 = noise(vec2(uv.x * 80.0, uv.y * 12.0));
      float g2 = noise(vec2(uv.x * 160.0, uv.y * 8.0 + 3.1));
      return g1 * 0.6 + g2 * 0.4;
    }

    // Diamond grid: offset every other row to form a diamond lattice
    vec2 diamondCell(vec2 uv, float density) {
      vec2 scaled = uv * density;
      // Offset alternating rows by 0.5 in X
      float row = floor(scaled.y);
      float xOffset = mod(row, 2.0) * 0.5;
      vec2 cell = fract(vec2(scaled.x + xOffset, scaled.y));
      // Distance to cell centre
      return abs(cell - 0.5);
    }

    vec4 generate() {
      vec2 uv = v_uv;

      // Get diamond cell local coords
      vec2 dc = diamondCell(uv, u_hole_density);

      // Diamond hole shape: use Chebyshev / rotated L-inf to get a diamond
      // Rotate local coords 45 degrees
      vec2 rot45 = vec2(dc.x + dc.y, dc.y - dc.x) * 0.7071;
      float holeDist = max(abs(rot45.x), abs(rot45.y));

      // Hole threshold from u_hole_size (0.2–0.7 of half-cell)
      float holeRadius = u_hole_size * 0.5;

      // 1 = inside hole, 0 = leather surface
      float inHole = step(holeDist, holeRadius * 0.5);

      // Soft inner edge bevel — gives a punched-through look
      float bevel = smoothstep(holeRadius * 0.5, holeRadius * 0.5 - 0.015, holeDist);

      // Leather grain texture
      float grain = leatherGrain(uv);
      float grainMod = mix(0.88, 1.08, grain);

      // Leather colour
      vec3 leatherCol = u_leather_color.rgb * grainMod;

      // Subtle sheen on leather — soft specular blob
      float sheen = exp(-pow(length(uv - vec2(0.3, 0.35)) * 3.5, 2.0)) * 0.12;
      leatherCol += vec3(sheen * 0.6, sheen * 0.5, sheen * 0.4);

      // Bevel darkens the edge of the hole (punch shadow)
      vec3 bevelColor = leatherCol * 0.55;

      // Combine: backing where hole, bevel at edge, leather elsewhere
      vec3 col = mix(leatherCol, bevelColor, (1.0 - bevel) * (1.0 - inHole) * step(holeDist, holeRadius * 0.5 + 0.03));
      col = mix(col, u_backing_color.rgb, inHole);

      col = clamp(col, 0.0, 1.0);
      return vec4(col, u_opacity);
    }
  `,
  uniforms: [
    { id: 'u_hole_density',  name: 'Hole Density',    type: 'float', min: 4.0,  max: 30.0, default: 14.0 },
    { id: 'u_hole_size',     name: 'Hole Size',        type: 'float', min: 0.2,  max: 0.7,  default: 0.45 },
    { id: 'u_leather_color', name: 'Leather Color',    type: 'color', default: [0.12, 0.10, 0.08, 1.0] },
    { id: 'u_backing_color', name: 'Backing Color',    type: 'color', default: [0.85, 0.05, 0.05, 1.0] }
  ]
};

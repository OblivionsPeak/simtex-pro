export default {
  id: 'honeycomb_metal',
  name: 'Honeycomb Metal',
  category: 'Industrial',
  description: 'Aerospace aluminium honeycomb panel — machine-perfect hexagonal cells with bright thin walls and deep dark interiors.',
  shader: `
    // Perfect hexagonal grid SDF
    // Returns: x = dist to hex centre, y = dist to nearest wall
    vec2 hexGrid(vec2 uv) {
      // Axial hex coordinates
      const vec2 s = vec2(1.0, 1.7320508); // 1, sqrt(3)

      vec2 p  = uv;
      vec4 hC = floor(vec4(p, p - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
      vec4 h  = vec4(p - hC.xy * s, p - (hC.zw + 0.5) * s);

      // Pick closer centre
      return dot(h.xy, h.xy) < dot(h.zw, h.zw) ? h.xy : h.zw;
    }

    // Hexagon SDF (regular, circumradius 1)
    float hexSDF(vec2 p) {
      p = abs(p);
      return max(dot(p, normalize(vec2(1.0, 1.7320508))), p.x) - 1.0;
    }

    vec4 generate() {
      float scale     = u_scale;
      vec3  wallCol   = u_wall_color.rgb;
      float cellDepth = u_cell_depth;

      vec2 uv = v_uv * scale;

      // Hex cell local coordinates
      vec2 local = hexGrid(uv);

      // Inner hexagon radius (cell interior)
      float wallThickness = 0.06;
      float hexR = 1.0 - wallThickness * 2.2; // circumradius of inner hex

      // SDF inside the hex cell (positive = inside cell, negative = in wall)
      // local is relative to hex centre, hex circumradius ~ 0.577 in this grid
      float cellRadius  = 0.555;
      float innerRadius = cellRadius - wallThickness;

      float distToEdge  = cellRadius - length(local) * (1.0 / 0.577); // approx
      // More accurate: use hex SDF
      vec2 pl = local / cellRadius;
      float hexd = hexSDF(pl * vec2(1.0, 0.5773503));  // normalised hex
      // hexd < 0 = inside hex cell, > 0 = outside

      float insideCell = step(hexd, -wallThickness / cellRadius);
      float inWall     = 1.0 - insideCell;

      // Wall lighting — simulate thin aluminium wall under oblique light
      // Brightest on the wall face closest to light (upper-right)
      vec2  lightDir2D = normalize(vec2(0.7, 0.9));
      float wallFacing = clamp(dot(normalize(local), lightDir2D), 0.0, 1.0);

      // Wall colour — bright aluminium with directional specular
      float wallBright  = 0.55 + wallFacing * 0.45;
      float wallSpec    = pow(wallFacing, 12.0) * 0.4;
      vec3  wallShaded  = wallCol * wallBright + wallSpec;

      // Cell interior — dark (depth), with slight concentric shading toward centre
      float cellInterior = 1.0 - smoothstep(0.0, 0.8, -hexd / (cellRadius * 0.6));
      vec3  cellCol      = wallCol * (1.0 - cellDepth * 0.92) * (0.04 + cellInterior * 0.06);

      // Chamfer highlight — very thin bright line right at the hex wall edge
      float edgeDist   = abs(hexd + wallThickness / cellRadius);
      float edgeHighlight = smoothstep(0.04, 0.0, edgeDist) * 0.6;

      vec3 col = mix(cellCol, wallShaded, inWall);
      col += edgeHighlight * wallCol;
      col = clamp(col, 0.0, 1.0);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_scale',      type: 'float', default: 14,   min: 4,   max: 30,  label: 'Cell Scale' },
    { name: 'u_wall_color', type: 'color', default: [0.78, 0.80, 0.82, 1.0],  label: 'Wall Colour' },
    { name: 'u_cell_depth', type: 'float', default: 0.85, min: 0.2, max: 1.0, label: 'Cell Depth' }
  ]
};

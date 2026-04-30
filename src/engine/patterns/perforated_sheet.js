export default {
  id: 'perforated_sheet',
  name: 'Perforated Sheet',
  category: 'Industrial',
  description: 'CNC-perforated aluminium sheet with round punched-through holes and chamfer highlights on hole rims.',
  shader: `
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    vec4 generate() {
      // Tile into cells according to density
      vec2 tiled = v_uv * u_density;
      vec2 cellUV = fract(tiled) - 0.5; // [-0.5, 0.5] per cell, center at 0
      vec2 cellID = floor(tiled);

      float d = length(cellUV);         // distance from cell center
      float r = u_hole_size * 0.5;      // hole radius in cell-space [0, 0.5]

      // ---- Hole: fully transparent inside ----
      // Soft edge: 1 px of blur mapped to cell space
      float edgeWidth = 0.008;
      float inHole = smoothstep(r - edgeWidth, r + edgeWidth, d);
      // inHole == 0 inside hole, 1 outside

      // ---- Brushed metal plate ----
      // Subtle horizontal brushing: low-amplitude noise along Y axis
      float brushNoise = noise(vec2(cellID.x + tiled.x * 0.3, tiled.y * 18.0)) * 0.035;
      vec3 metalCol = u_metal_color.rgb + vec3(brushNoise * 0.6, brushNoise * 0.6, brushNoise * 0.65);

      // ---- Chamfer highlight ring on hole rim ----
      // Bright annular band just outside the hole edge (tooling chamfer)
      float chamferInner = r + edgeWidth;
      float chamferOuter = chamferInner + 0.04;
      float chamfer = smoothstep(chamferInner - 0.002, chamferInner + 0.002, d)
                    - smoothstep(chamferOuter - 0.008, chamferOuter,        d);
      chamfer = clamp(chamfer, 0.0, 1.0);

      // Directional highlight: brightest at top-left of rim (simulated light at ~135 deg)
      vec2 dir = normalize(cellUV + vec2(0.001)); // avoid div-by-zero
      float lightAngle = dot(dir, normalize(vec2(-0.7, 0.7)));
      float rimLight = chamfer * clamp(lightAngle, 0.0, 1.0) * 0.55;

      // Combine: metal plate + rim highlight, then punch out the hole via alpha
      vec3 col = clamp(metalCol + vec3(rimLight), 0.0, 1.0);
      float alpha = inHole * u_metal_color.a * u_opacity;

      return vec4(col, alpha);
    }
  `,
  uniforms: [
    { id: 'u_density',    name: 'Hole Density', type: 'float', min: 2.0,  max: 40.0, default: 16.0 },
    { id: 'u_hole_size',  name: 'Hole Size',    type: 'float', min: 0.2,  max: 0.85, default: 0.55 },
    { id: 'u_metal_color',name: 'Metal Color',  type: 'color', default: [0.78, 0.80, 0.82, 1.0] }
  ]
};

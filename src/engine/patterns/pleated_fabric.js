export default {
  id: 'pleated_fabric',
  name: 'Pleated Fabric',
  category: 'Industrial',
  description: 'Accordion-pleated fabric with lit faces, shadowed valleys, and specular fold edges.',
  shader: `
    // Map a value into a sawtooth that folds into a triangle wave (accordion pleat shape)
    float pleatProfile(float x) {
      // x in [0,1] per pleat — returns height in [0,1]
      // Each pleat: rise sharply (lit face), fold back (shadow face)
      float t = fract(x);
      // Triangle wave: 0→1→0 over one period
      return 1.0 - abs(2.0 * t - 1.0);
    }

    // Derivative approximation for surface normal shading
    float pleatDeriv(float x) {
      float t = fract(x);
      return t < 0.5 ? 1.0 : -1.0;
    }

    vec4 generate() {
      float count  = u_pleat_count;
      float depth  = u_depth;
      vec3  fabric = u_fabric_color.rgb;

      // Pleats run vertically — fold along Y axis, wave in X
      float px = v_uv.x * count;
      float height = pleatProfile(px);
      float slope  = pleatDeriv(px);  // +1 = lit face, -1 = shadow face

      // Simulate directional lighting: light comes from upper-left
      // Lit face (slope > 0): bright. Shadow face (slope < 0): dark.
      float litFactor   = smoothstep(-1.0, 1.0, slope);
      float shadeAmount = mix(1.0 - 0.55 * depth, 1.0, litFactor);

      // Fold edge highlight: near the peak of each pleat
      float peak = 1.0 - abs(height - 1.0) / 1.0; // 1 at peak, 0 at valley
      float foldEdge = pow(smoothstep(0.80, 1.0, height), 3.0);
      float specular = foldEdge * 0.45 * clamp(depth * 0.7, 0.0, 1.0);

      // Valley shadow: dark crease at the base
      float valley = pow(smoothstep(0.12, 0.0, height), 2.0);
      float valShadow = valley * 0.5 * depth;

      // Ambient occlusion in the tight valley fold
      float ao = 1.0 - valley * 0.4 * depth;

      // Subtle vertical fabric grain (tiny horizontal texture variation along the pleat face)
      float grain = sin(v_uv.y * count * 80.0) * 0.015;

      vec3 col = fabric * shadeAmount * ao;
      col += specular;          // fold edge brightening
      col -= valShadow;         // valley darkening
      col += grain * litFactor; // surface micro-texture

      col = clamp(col, 0.0, 1.0);

      // If specular pass, return the highlight channel
      float specPass = foldEdge * step(0.5, u_is_spec);
      col = mix(col, vec3(specular + 0.1), specPass);

      return vec4(col, 1.0) * u_opacity;
    }
  `,
  uniforms: [
    { name: 'u_pleat_count',  type: 'float', default: 12,   min: 4,   max: 30,  label: 'Pleat Count' },
    { name: 'u_fabric_color', type: 'color', default: [0.15, 0.15, 0.18, 1.0],  label: 'Fabric Colour' },
    { name: 'u_depth',        type: 'float', default: 1.0,  min: 0.2, max: 2.0, label: 'Fold Depth' }
  ]
};
